import { useState, useCallback, useRef } from 'react'
import { Workflow, workflowRegistry } from '@/lib/workflow-registry'

export type ComposerMode = 'idle' | 'recording' | 'transcribing-send' | 'transcribing-stop'

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  suggestions?: Array<{
    id: string
    text: string
    action?: string
  }>
  showSuggestions?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  inputValue: string
  composerMode: ComposerMode
  isTransitioning: boolean
  activeWorkflow: Workflow | null // NEW: State to manage active workflow
}

export interface ChatActions {
  setInputValue: (value: string) => void
  addMessage: (content: string, isUser: boolean) => void
  clearMessages: () => void
  setComposerMode: (mode: ComposerMode) => void
  updateMessageSuggestions: (messageId: string, suggestions: any[], show: boolean) => void
  clearAllSuggestions: () => void
  startWorkflow: (intent: string) => void; // NEW: Action to start a workflow
  completeWorkflow: (data?: any) => void; // NEW: Action to complete a workflow
}

export function useChatState(): [ChatState, ChatActions] {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [composerMode, setComposerMode] = useState<ComposerMode>('idle')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null) // NEW: Workflow state
  const messageIdCounter = useRef(0)

  const addMessage = useCallback((content: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: `msg-${++messageIdCounter.current}`,
      content: content.trim(),
      isUser,
      timestamp: new Date(),
      suggestions: [],
      showSuggestions: false
    }
    
    setMessages(prev => [...prev, newMessage])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    messageIdCounter.current = 0
  }, [])

  const updateMessageSuggestions = useCallback((
    messageId: string, 
    suggestions: any[], 
    show: boolean
  ) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, suggestions, showSuggestions: show }
        : msg
    ))
  }, [])

  const clearAllSuggestions = useCallback(() => {
    setMessages(prev => prev.map(msg => ({ 
      ...msg, 
      showSuggestions: false, 
      suggestions: undefined 
    })))
  }, [])

  const handleSetComposerMode = useCallback((mode: ComposerMode) => {
    setIsTransitioning(true)
    setComposerMode(mode)
    // Clear transition state after animation
    setTimeout(() => setIsTransitioning(false), 150)
  }, [])

  // NEW: Function to start a workflow
  const startWorkflow = useCallback((intent: string) => {
    const workflow = workflowRegistry[intent];
    if (workflow) {
      setActiveWorkflow(workflow);
      addMessage(workflow.initialMessage, false); // Bot's initial message
      setComposerMode('idle'); // Ensure composer is idle when workflow starts
    }
  }, [addMessage, setComposerMode]);

  // NEW: Function to complete a workflow
  const completeWorkflow = useCallback((data?: any) => {
    setActiveWorkflow(null);
    // Optionally add a message about workflow completion
    if (data && data.message) {
      addMessage(data.message, false);
    }
    setComposerMode('idle'); // Reset composer mode after workflow
  }, [addMessage, setComposerMode]);

  const state: ChatState = {
    messages,
    inputValue,
    composerMode,
    isTransitioning,
    activeWorkflow // NEW: Include activeWorkflow in state
  }

  const actions: ChatActions = {
    setInputValue,
    addMessage,
    clearMessages,
    setComposerMode: handleSetComposerMode,
    updateMessageSuggestions,
    clearAllSuggestions,
    startWorkflow, // NEW: Include startWorkflow in actions
    completeWorkflow // NEW: Include completeWorkflow in actions
  }

  return [state, actions]
}