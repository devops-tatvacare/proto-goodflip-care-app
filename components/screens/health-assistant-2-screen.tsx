"use client"

import React, { useState, useRef, useEffect, useReducer } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { UnifiedMessageContainer } from "@/components/ui/unified-message-container"
import { Icon } from '@/components/ui/icon'
import { VoiceRecordingScreen } from "./voice-recording-screen"
import { useVoiceRecordingUnified } from "@/hooks/use-voice-recording-unified"
import { PlanReadyScreen } from "./plan-ready-screen"
import { ActionCard } from "@/components/ui/action-card"
import { ActionSection } from "@/components/ui/action-section"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SYMPTOM_TYPES, isSemaglutideSymptom } from "@/lib/constants/symptom-types"
import { 
  SAVED_MEDICATIONS, 
  WATER_INTAKE_OPTIONS, 
  DRUG_ACTIONS, 
  MORE_ACTIONS, 
  HEALTH_SUMMARIES,
  DIET_CONFIRMATION_OPTIONS,
  MEAL_TIME_OPTIONS,
  PERIOD_FLOW_OPTIONS,
  MOOD_OPTIONS,
  EMERGENCY_ACTION_OPTIONS
} from "@/lib/constants/health-assistant-data"
import { RECENT_LAB_RESULTS } from "@/lib/constants/lab-results"
import { 
  PHARMACY_LINKS, 
  PRESCRIPTION_INFO, 
  VIDEO_TUTORIALS, 
  INJECTION_GUIDES, 
  INJECTION_TOOLS, 
  DRUG_EDUCATION 
} from "@/lib/constants/pharmacy-data"
import { QuickActionsBar } from "./health-assistant-2/quick-actions-components"
import { QUICK_ACTION_FLOWS, ActionFlow } from "./health-assistant-2/quick-actions-flows-data"
import { QUICK_ACTIONS, getQuickActionByLabel, generateActivityOptions } from "./health-assistant-2/quick-actions-data"
import { generateSymptomFlow, generateSymptomSelectionStep, symptomRequiresLocation } from "./health-assistant-2/symptom-flow-handler"
import { FlowStepComponent, SuccessCard } from "./health-assistant-2/quick-actions-flows-components"
import { UserMessageBubble, AIMessageBubble, SuggestionChips } from "./health-assistant-2/message-bubble-components"
import { HEALTH_ASSISTANT_MESSAGES } from "./health-assistant-2/messages"
import { VideoPlayer } from "@/components/ui/video-player"
import { generateSuggestionsForMessage, generateContextualSuggestions } from "./health-assistant-2/suggestion-handler"
import { ChatHistoryOverlay } from "@/components/overlays/chat-history-overlay"
import ChatComposer from "@/components/ui/chat-composer"
import DietPlanCard from "@/components/ui/diet-plan-card"
import { useChatState } from '@/hooks/use-chat-state' // Import useChatState
import type { Workflow } from '@/lib/workflow-registry' // Import Workflow type
import { smartIntentService } from '@/lib/smart-intent-service'
import { workflowRegistry } from '@/lib/workflow-registry' // Import workflowRegistry

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  type?:
    | "normal"
    | "options"
    | "slider"
    | "file-upload"
    | "lab-results"
    | "date-picker"
    | "options-with-inline-datepicker"
    | "diet-input-wait"
    | "success-card"
    | "collapsible-sections"
    | "unified-message"
    | "quick-action-flow"
    | "quick-action-success"
    | "diet-plan-card"
    | "video"
  data?: any
  isActive?: boolean
  showSuggestions?: boolean
  suggestions?: Array<{
    id: string
    label: string
    icon?: string
    action: string
  }>
}

interface HealthAssistant2ScreenProps {
  initialAction?: string
  showWelcome?: boolean
  navigationSource?: string
  onWelcomeComplete?: () => void
}

// Assessment Choice Component
const AssessmentChoiceComponent = ({ 
  content, 
  data, 
  onAnswer, 
  isActive 
}: { 
  content: string
  data: any
  onAnswer: (questionId: string, answer: any) => void
  isActive?: boolean 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleOptionClick = (option: string) => {
    if (!isActive || hasAnswered) return
    
    if (data.questionType === "single-choice") {
      setHasAnswered(true)
      onAnswer(data.questionId, option)
    } else {
      // Multiple choice - toggle selection
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter(opt => opt !== option)
        : [...selectedOptions, option]
      setSelectedOptions(newSelection)
    }
  }

  const handleSubmitMultiple = () => {
    if (!isActive || hasAnswered || selectedOptions.length === 0) return
    setHasAnswered(true)
    onAnswer(data.questionId, selectedOptions)
  }

  return (
    <AIMessageBubble>
      <div className="text-sm mb-2">{content}</div>
      <div className="space-y-2 mb-2">
        {data.options?.map((option: string, index: number) => (
          <button
            key={index}
            className={`w-full text-left px-3 py-2 rounded border text-sm transition-all duration-200 ${
              selectedOptions.includes(option)
                ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)] border-[var(--app-primary)] shadow-md'
                : 'bg-[var(--ds-surface-primary)] text-gray-700 border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50'
            } ${!isActive || hasAnswered ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleOptionClick(option)}
            disabled={!isActive || hasAnswered}
            type="button"
          >
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 flex items-center justify-center ${
                data.questionType === "single-choice" 
                  ? `rounded-full border-2 ${selectedOptions.includes(option) ? 'border-white bg-[var(--ds-surface-primary)]' : 'border-gray-400'}`
                  : `rounded border-2 ${selectedOptions.includes(option) ? 'border-white bg-[var(--ds-surface-primary)]' : 'border-gray-400'}`
              }`}>
                {selectedOptions.includes(option) && (
                  <div className={`${
                    data.questionType === "single-choice" 
                      ? 'w-2 h-2 bg-[var(--app-primary)] rounded-full' 
                      : 'w-2 h-2 bg-[var(--app-primary)]'
                  }`}></div>
                )}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          </button>
        ))}
      </div>
      {data.questionType === "multiple-choice" && isActive && !hasAnswered && (
        <button
          onClick={handleSubmitMultiple}
          className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded text-sm disabled:opacity-50 mt-2"
          disabled={selectedOptions.length === 0}
          type="button"
        >
          Continue ({selectedOptions.length} selected)
        </button>
      )}
    </AIMessageBubble>
  )
}

// Assessment Input Component
const AssessmentInputComponent = ({ 
  content, 
  data, 
  onAnswer, 
  isActive 
}: { 
  content: string
  data: any
  onAnswer: (questionId: string, answer: any) => void
  isActive?: boolean 
}) => {
  const [inputValue, setInputValue] = useState("")
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleSubmit = () => {
    if (!isActive || hasAnswered || !inputValue.trim()) return
    setHasAnswered(true)
    onAnswer(data.questionId, inputValue.trim())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <AIMessageBubble>
      <div className="text-sm mb-2">{content}</div>
      <div className="space-y-2">
        {data.questionType === "text" ? (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={data.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[var(--app-primary)] resize-none"
            rows={3}
            disabled={!isActive || hasAnswered}
          />
        ) : (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={data.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[var(--app-primary)]"
            disabled={!isActive || hasAnswered}
          />
        )}
        {isActive && !hasAnswered && (
          <button
            onClick={handleSubmit}
            className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded text-sm disabled:opacity-50"
            disabled={!inputValue.trim()}
            type="button"
          >
            Continue
          </button>
        )}
      </div>
    </AIMessageBubble>
  )
}

// AI Generation Component
const AIGenerationComponent = () => {
  return (
    <AIMessageBubble>
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-primary)]"></div>
        <div>
          <div className="text-sm font-semibold mb-1 text-gray-800">AI is analyzing your responses...</div>
          <div className="text-xs text-[var(--ds-text-secondary)]">Creating your personalized health plan</div>
        </div>
      </div>
    </AIMessageBubble>
  )
}

// Plan Ready Card Component
const PlanReadyCardComponent = ({ 
  content, 
  data, 
  isActive,
  onNavigateToPlan
}: { 
  content: string
  data: any
  isActive?: boolean
  onNavigateToPlan?: (planData: any) => void
}) => {
  const handleViewPlan = () => {
    onNavigateToPlan?.(data)
  }

  return (
    <AIMessageBubble>
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full bg-[var(--ds-status-success)] flex items-center justify-center flex-shrink-0">
          <span className="text-[var(--ds-text-inverse)] text-xs">✓</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800 mb-1">{content}</div>
          <div className="text-sm text-gray-700 mb-2">{data.planSummary}</div>
          <div className="text-xs text-[var(--ds-text-secondary)] mb-2">
            🍽️ Nutrition: Custom meal plan • 💪 Exercise: Tailored workouts
          </div>
          <button
            onClick={handleViewPlan}
            className="bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-1 rounded text-xs"
          >
            View My Complete Plan →
          </button>
        </div>
      </div>
    </AIMessageBubble>
  )
}

const OptionsList = ({ options, onOptionClick }: { options: any[]; onOptionClick: (action: string) => void }) => (
  <div className="mt-3 space-y-2">
    {options.map((option: any) => (
      <button
        key={option.id}
        onClick={() => onOptionClick(option.id)}
        className="w-full text-left p-3 border border-[var(--ds-border-default)] rounded-lg hover:bg-[var(--ds-surface-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          {option.icon && <span className="text-lg">{option.icon}</span>}
          <div>
            <p className="font-medium text-sm">{option.text}</p>
            {option.subtitle && <p className="text-xs text-[var(--ds-text-secondary)]">{option.subtitle}</p>}
          </div>
        </div>
      </button>
    ))}
  </div>
)

const SliderWidget = ({ data }: { data: any }) => (
  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Current Reading ({data.unit})
    </label>
    <Slider
      defaultValue={[data.defaultValue]}
      max={data.max}
      min={data.min}
      step={1}
      className="w-full"
    />
    <div className="flex justify-between text-xs text-[var(--ds-text-secondary)] mt-2">
      <span>{data.min}</span>
      <span>{data.max}</span>
    </div>
  </div>
)

// Tab-based journey phases with smart widgets
const getUserJourneyDay = () => {
  return Math.floor(Math.random() * 30) + 1
}

const getJourneyPhase = (day: number) => {
  if (day <= 10) return 'basics'
  if (day <= 20) return 'progress'
  return 'community'
}

const getTabContent = (phase: string, day: number) => {
  switch (phase) {
    case 'basics':
      return {
        activeTab: 'basics',
        tabs: [
          { id: 'basics', label: '💊 Basics', icon: (props: any) => <Icon name="medication" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'profile', label: 'Profile', icon: (props: any) => <Icon name="person" {...props} /> }
        ],
        content: {
          title: 'ESSENTIAL ACTIONS',
          actions: [
            { id: 'buy-drug', icon: (props: any) => <Icon name="shoppingCart" {...props} />, label: 'BUY', sublabel: 'DRUG', description: 'Get Started', color: 'from-blue-500 to-blue-600' },
            { id: 'give-drug', icon: (props: any) => <Icon name="vaccines" {...props} />, label: 'GIVE', sublabel: 'DRUG', description: 'Schedule', color: 'from-green-500 to-green-600' },
            { id: 'learn-drug', icon: (props: any) => <Icon name="school" {...props} />, label: 'LEARN', sublabel: 'DRUG', description: 'FAQ', color: 'from-purple-500 to-purple-600' }
          ],
          conversation: "I'm here to guide you through your medication journey"
        }
      }
    case 'progress':
      return {
        activeTab: 'progress',
        tabs: [
          { id: 'progress', label: '📊 Progress', icon: (props: any) => <Icon name="barChart" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'community', label: 'Community', icon: (props: any) => <Icon name="group" {...props} /> }
        ],
        content: {
          title: 'YOUR JOURNEY',
          journey: {
            weeks: [
              { id: 'week-1-2', label: 'WEEK', sublabel: '1-2', status: 'complete', icon: '✓' },
              { id: 'this-week', label: 'THIS', sublabel: 'WEEK', status: 'current', icon: '📊' },
              { id: 'next-week', label: 'NEXT', sublabel: 'WEEK', status: 'upcoming', icon: '🎯' }
            ]
          },
          actions: ['View Details', 'Set Goals'],
          conversation: "Based on your progress, you might want to focus on..."
        }
      }
    case 'community':
      return {
        activeTab: 'community',
        tabs: [
          { id: 'metrics', label: '📈 Metrics', icon: (props: any) => <Icon name="heartMonitor" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'community', label: 'Community', icon: (props: any) => <Icon name="group" {...props} /> }
        ],
        content: {
          title: 'HEALTH INSIGHTS',
          insights: {
            biomarkers: [
              { label: 'Weight', value: '-3.2kg', trend: '↓', color: 'text-green-600' },
              { label: 'Energy', value: '+40%', trend: '↑', color: 'text-blue-600' },
              { label: 'Sleep', value: '7.5hrs', trend: '→', color: 'text-purple-600' }
            ]
          },
          actions: ['Advanced Analytics', 'Community Compare'],
          conversation: "Your health data shows remarkable improvement patterns..."
        }
      }
    default:
      return getTabContent('basics', day)
  }
}

// Welcome Screen Component
function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div 
      className="flex flex-col h-full overflow-y-auto relative bg-[var(--bg-primary)]"
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--app-login-gradient)' }}
      />

      <div 
        className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
        style={{
          backgroundImage: 'url(/humansai.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />

      <div className="relative flex flex-col h-full p-6">
        <div className="flex-1 flex flex-col justify-center py-4">
          {/* Icon */}
          <div className="mb-6 text-center">
            <div 
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{ backgroundColor: 'var(--app-primary)' }}
            >
              <Icon name="sparkles" className="w-8 h-8 text-[var(--ds-text-inverse)]" />
            </div>
          </div>
          
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 
              className="text-xl font-bold mb-3 text-[var(--text-primary)]" 
            >
              Meet Kaira
            </h1>
            <p 
              className="text-sm mb-4 px-4 text-[var(--text-secondary)]" 
            >
              Your AI health assistant for personalized care
            </p>
          </div>
          
          {/* Key Features - Condensed */}
          <div className="space-y-2 mb-8">
            {[
              { icon: (props: any) => <Icon name="medication" {...props} />, text: "Medication tracking & reminders" },
              { icon: (props: any) => <Icon name="heartMonitor" {...props} />, text: "Symptom monitoring & insights" },
              { icon: (props: any) => <Icon name="brain" {...props} />, text: "24/7 health guidance" }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-xl bg-[var(--ds-surface-primary)]/60 border border-white/50"
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--status-success)' }}
                >
                  <feature.icon className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Get Started Button */}
        <div className="pb-4">
          <Button
            onClick={onGetStarted}
            className="w-full h-12 text-base font-semibold rounded-xl"
            style={{
              backgroundColor: 'var(--app-primary)',
              color: 'var(--ds-text-inverse)',
              border: 'none'
            }}
          >
            Get Started with Kaira
          </Button>
        </div>
      </div>
    </div>
  )
}

export function HealthAssistant2Screen({ initialAction, showWelcome = false, navigationSource, onWelcomeComplete }: HealthAssistant2ScreenProps = {}): JSX.Element {
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(showWelcome)
  // Use sessionStorage to persist welcome state during the session
  const [hasShownWelcome, setHasShownWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('meetKaira_shown') === 'true'
    }
    return false
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [showVoiceRecording, setShowVoiceRecording] = useState(false)
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null)
  const [showQuickActions, setShowQuickActions] = useState(false)

  // New state and reducer for the chat composer
  type ComposerMode = "idle" | "recording" | "transcribing";

  interface ComposerState {
    inputValue: string;
    mode: ComposerMode;
  }

  type ComposerAction =
    | { type: "SET_INPUT_VALUE"; payload: string }
    | { type: "START_RECORDING" }
    | { type: "STOP_RECORDING" }
    | { type: "TRANSCRIPT_READY"; payload: string }
    | { type: "SEND_MESSAGE" };

  const composerReducer = (state: ComposerState, action: ComposerAction): ComposerState => {
    switch (action.type) {
      case "SET_INPUT_VALUE":
        return { ...state, inputValue: action.payload };
      case "START_RECORDING":
        return { ...state, mode: "recording" };
      case "STOP_RECORDING":
        return { ...state, mode: "transcribing" };
      case "TRANSCRIPT_READY":
        return { ...state, mode: "idle", inputValue: action.payload };
      case "SEND_MESSAGE":
        return { ...state, inputValue: "" };
      default:
        return state;
    }
  };

  const [composerState, dispatchComposer] = useReducer(composerReducer, {
    inputValue: "",
    mode: "idle",
  });

  // Real voice recording hook with transcription callback
  const [voiceState, voiceActions] = useVoiceRecordingUnified({
    onTranscriptionComplete: (transcript, shouldAutoSend = false) => {
      // When transcription is complete, update the composer input
      dispatchComposer({ type: "TRANSCRIPT_READY", payload: transcript })
      
      // If shouldAutoSend is true, automatically send the message
      if (shouldAutoSend && transcript.trim()) {
        // Small delay to ensure the input is updated
        setTimeout(() => {
          handleSendMessage()
        }, 50)
      }
    }
  })
  const [dietInputContext, setDietInputContext] = useState<any>(null)
  const [showHealthSummaries, setShowHealthSummaries] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasProcessedInitialAction = useRef(false)
  const quickActionsRef = useRef<HTMLDivElement>(null)

  // Two-way toggle state (Program/Chat)
  const [currentMode, setCurrentMode] = useState<'program' | 'chat'>('program')
  const [isTransitioningMode, setIsTransitioningMode] = useState(false)
  
  // Program card highlighting for navigation from home screen
  const [highlightProgramCard, setHighlightProgramCard] = useState(false)
  
  // Chat history overlay state
  const [showChatHistory, setShowChatHistory] = useState(false)
  // Attachments state
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [attachments, setAttachments] = useState<Array<{ url: string; name: string; type: string; size: number }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const attachRef = useRef<HTMLDivElement>(null)

  const triggerFilePicker = () => fileInputRef.current?.click()
  const triggerPhotoPicker = () => photoInputRef.current?.click()

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setShowAttachMenu(false)
    setIsUploading(true)
    try {
      const form = new FormData()
      Array.from(files).forEach((f) => form.append('file', f))
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'Upload failed')
      const saved = (data.files || []) as Array<{ url: string; name: string; type: string; size: number }>
      if (saved.length === 0) return
      setAttachments(prev => [...prev, ...saved])
    } catch (e: any) {
      addMessage('Failed to upload file. Please try again.', false)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  // Close attach menu on outside click
  useEffect(() => {
    if (!showAttachMenu) return
    const onDown = (e: MouseEvent) => {
      if (!attachRef.current) return
      if (!attachRef.current.contains(e.target as Node)) setShowAttachMenu(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [showAttachMenu])

  // Heuristic detector: treat message as a question for insights routing
  const isLikelyQuestion = (text: string) => {
    const t = text.trim().toLowerCase()
    if (!t) return false
    if (t.endsWith('?')) return true
    // Common interrogatives and phrasings
    const starters = ['what', 'why', 'how', 'is', 'are', 'do', 'does', 'can', 'should', 'where', 'which', 'when', 'would', 'could']
    if (starters.some(s => t.startsWith(s + ' '))) return true
    if (/^is my\b|^are my\b|^am i\b|^do i\b|^should i\b/.test(t)) return true
    return false
  }

  // Ask Insights: route questions to RAG pipeline
  const handleAskInsights = async (question: string) => {
    // Brief analyzing message
    addMessage('Analyzing your data to answer your question…', false)
    try {
      const sessId = (typeof window !== 'undefined') ? ensureAssistantSessionId() : ''
      const res = await fetch('/api/insights/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId: sessId, k: 8, attachments })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.message || data?.error || 'Unable to generate insights right now.'
        addMessage(`Sorry — ${msg}`, false)
        return
      }
      const answer: string = data.answer || 'No answer produced.'
      addMessage(answer, false)
    } catch (e) {
      addMessage('Insights are temporarily unavailable. Please try again later.', false)
    }
  }

  // Handle initial action from navigation (e.g., from home screen)
  useEffect(() => {
    if (initialAction && !hasProcessedInitialAction.current) {
      hasProcessedInitialAction.current = true
      
      if (initialAction === 'explore-benefits') {
        setCurrentMode('program')
        setHighlightProgramCard(true)
        // Remove highlight after a few seconds
        setTimeout(() => {
          setHighlightProgramCard(false)
        }, 3000)
      } else if (['log-water', 'log-sleep', 'log-diet', 'log-steps'].includes(initialAction)) {
        // Handle daily logs navigation from home screen reminders
        setCurrentMode('chat')
        
        // Map log-steps to log-exercise flow since steps is part of exercise tracking
        const actionId = initialAction === 'log-steps' ? 'log-exercise' : initialAction
        
        // Directly trigger the flow without additional messages
        setTimeout(() => {
          handleQuickAction(actionId)
        }, 100)
      }
    }
  }, [initialAction])
  
  // Removed automatic welcome message - now showing Ask Kaira avatar instead
  

  // Quick Action Flow states
  const [activeFlow, setActiveFlow] = useState<ActionFlow | null>(null)
  const [currentFlowStep, setCurrentFlowStep] = useState(0)
  const [flowAnswers, setFlowAnswers] = useState<Record<string, any>>({})
  
  // Assessment flow state
  const [assessmentMode, setAssessmentMode] = useState(false)
  const [currentAssessmentQuestion, setCurrentAssessmentQuestion] = useState(0)
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, any>>({})
  const [showPlanReadyScreen, setShowPlanReadyScreen] = useState(false)
  const [generatedPlanData, setGeneratedPlanData] = useState<any>(null)
  const [showGalleryOverlay, setShowGalleryOverlay] = useState(false)
  const [gallerySearchQuery, setGallerySearchQuery] = useState("")
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("All")

  // Gallery data - connected to existing flows  
  const galleryItems = [
    // Symptoms - using existing log-symptoms flow with smart pre-selection
    { id: 'fever', name: 'Fever', icon: 'thermostat', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'severe-dizziness', name: 'Dizziness', icon: 'alertTriangle', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'chest-pain', name: 'Chest Pain', icon: 'heart', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'difficulty-breathing', name: 'Breathing Issues', icon: 'wind', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'nausea', name: 'Nausea', icon: 'alertTriangle', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'pain', name: 'Pain', icon: 'zap', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'weakness', name: 'Weakness', icon: 'fitnessCenter', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'headache', name: 'Headache', icon: 'brain', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'cough', name: 'Cough', icon: 'stethoscope', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'eye-irritation', name: 'Eye Issues', icon: 'eye', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'hypoglycemia', name: 'Hypoglycemia', icon: 'trendingDown', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'vomiting', name: 'Vomiting', icon: 'alertTriangle', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'diarrhea', name: 'Diarrhea', icon: 'alertTriangle', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    { id: 'dizziness', name: 'Dizziness', icon: 'alertTriangle', category: 'Symptoms', action: 'log-symptoms', useFlow: true },
    
    // Activities - using existing quick action flows
    { id: 'water', name: 'Log Water', icon: 'waterDrop', category: 'Activities', action: 'log-water', useFlow: true },
    { id: 'medication', name: 'Medication', icon: 'medication', category: 'Activities', action: 'log-medications', useFlow: true },
    { id: 'sleep', name: 'Sleep', icon: 'bedtime', category: 'Activities', action: 'log-sleep', useFlow: true },
    { id: 'diet', name: 'Diet', icon: 'restaurant', category: 'Activities', action: 'log-diet', useFlow: true },
    { id: 'exercise', name: 'Exercise', icon: 'fitnessCenter', category: 'Activities', action: 'log-exercise', useFlow: true },
    
    // Insights - placeholder for future
    { id: 'weight-trend', name: 'Weight Trends', icon: 'trendingDown', category: 'Insights', action: 'weight-insights', useFlow: false },
    { id: 'mood-analysis', name: 'Mood Analysis', icon: 'heart', category: 'Insights', action: 'mood-insights', useFlow: false },
    { id: 'energy-patterns', name: 'Energy Patterns', icon: 'zap', category: 'Insights', action: 'energy-insights', useFlow: false },
    
    // Learn - using existing actions
    { id: 'side-effects', name: 'Side Effects', icon: 'alertTriangle', category: 'Learn', action: 'side-effects', useFlow: false },
    { id: 'injection-guide', name: 'Injection Guide', icon: 'vaccines', category: 'Learn', action: 'take-injection', useFlow: false },
    { id: 'faq', name: 'FAQ', icon: 'help', category: 'Learn', action: 'faq', useFlow: false },
    
    // Orders - using existing actions
    { id: 'pharmacy', name: 'Pharmacy', icon: 'shoppingCart', category: 'Orders', action: 'order-drug', useFlow: false },
    { id: 'lab-tests', name: 'Lab Tests', icon: 'science', category: 'Orders', action: 'book-lab-tests', useFlow: false },
    { id: 'consultation', name: 'Consultation', icon: 'stethoscope', category: 'Orders', action: 'schedule-consultation', useFlow: false },
  ]

  const galleryFilters = ['All', 'Symptoms', 'Activities', 'Insights', 'Learn', 'Orders']

  const filteredGalleryItems = galleryItems.filter(item => {
    const matchesFilter = activeGalleryFilter === 'All' || item.category === activeGalleryFilter
    const matchesSearch = item.name.toLowerCase().includes(gallerySearchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleGalleryItemClick = (item: any) => {
    setShowGalleryOverlay(false)
    
    if (item.useFlow) {
      // Smart flow handling - skip selection steps when item is pre-selected
      handleSmartFlow(item)
    } else {
      // Use regular action handler for simple actions
      handleActionClick(item.action)
    }
  }

  const handleSmartFlow = (item: any) => {
    // Use the comprehensive flow from QUICK_ACTION_FLOWS for consistency
    let flow = QUICK_ACTION_FLOWS.find(f => f.actionId === item.action)
    
    if (item.action === 'log-symptoms') {
      // Pre-populate answers for symptom selection
      const preSelectedAnswers: Record<string, any> = {
        'symptom-selection': item.name
      }
      
      // Use the comprehensive LOG_SYMPTOMS_FLOW and skip symptom selection step
      if (flow) {
        const modifiedFlow = { ...flow }
        modifiedFlow.steps = flow.steps.filter(step => step.id !== 'symptom-selection')
        
        // Set the flow with pre-selected answers
        setActiveFlow(modifiedFlow)
        setFlowAnswers(preSelectedAnswers)
        setCurrentFlowStep(0)
        
        // Add user message showing what they selected
        addMessage(item.name, true)
        
        // Start the flow from the appropriate step  
        setTimeout(() => {
          if (modifiedFlow.steps.length > 0) {
            addMessage(modifiedFlow.steps[0].question, false, "quick-action-flow", { 
              flow: modifiedFlow, 
              stepIndex: 0,
              isActive: true 
            })
            scrollToBottom(messagesEndRef)
          }
        }, 500)
      }
    } else {
      // For other flows, use the normal handleQuickAction
      handleQuickAction(item.action)
    }
  }
  
  // Health assessment questions from QuestionnaireScreen
  const assessmentQuestions = [
    {
      id: "exerciseFrequency",
      question: "How often do you currently exercise?",
      type: "single-choice",
      options: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week", "Daily"]
    },
    {
      id: "dietPreference",
      question: "What are your dietary preferences?",
      type: "single-choice",
      options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Pescatarian", "No specific preference"]
    },
    {
      id: "goals",
      question: "What are your primary goals? (You can select multiple)",
      type: "multiple-choice",
      options: ["Weight Loss", "Improved Energy", "Better Sleep", "Reduced Cravings", "Healthier Habits", "Medical Compliance"]
    },
    {
      id: "currentWeight",
      question: "What is your current weight in kg?",
      type: "number",
      placeholder: "Enter your current weight"
    },
    {
      id: "targetWeight",
      question: "What is your target weight in kg?",
      type: "number",
      placeholder: "Enter your target weight"
    },
    {
      id: "alcoholPreference",
      question: "How often do you consume alcohol?",
      type: "single-choice",
      options: ["Never", "Rarely (few times a year)", "Occasionally (1-2 times a month)", "Regularly (1-2 times a week)", "Frequently (3+ times a week)"]
    },
    {
      id: "medicalConditions",
      question: "Do you have any of these medical conditions? (You can select multiple)",
      type: "multiple-choice",
      options: ["Diabetes", "High Blood Pressure", "Heart Disease", "Thyroid Issues", "PCOS", "Sleep Apnea", "None"]
    },
    {
      id: "foodAllergies",
      question: "List any food allergies, intolerances, or foods you prefer to avoid",
      type: "text",
      placeholder: "e.g., Nuts, dairy, gluten, shellfish..."
    },
    {
      id: "mealTimes",
      question: "When do you prefer to have your meals? (You can select multiple)",
      type: "multiple-choice",
      options: ["Early Breakfast (6-7 AM)", "Regular Breakfast (7-9 AM)", "Mid-Morning Snack", "Lunch (12-2 PM)", "Afternoon Snack", "Early Dinner (5-7 PM)", "Late Dinner (7-9 PM)"]
    }
  ]

  // Assessment flow functions
  const showNextAssessmentQuestion = () => {
    if (currentAssessmentQuestion >= assessmentQuestions.length) {
      // Assessment complete - show AI generation and plan ready
      completeAssessment()
      return
    }

    const question = assessmentQuestions[currentAssessmentQuestion]
    const questionNumber = currentAssessmentQuestion + 1
    const totalQuestions = assessmentQuestions.length

    // Show progress
    addMessage(`📋 Question ${questionNumber} of ${totalQuestions}`, false)
    
    setTimeout(() => {
      // Show the question based on type
      if (question.type === "single-choice" || question.type === "multiple-choice") {
        addMessage(
          question.question,
          false,
          "assessment-choice",
          {
            questionId: question.id,
            questionType: question.type,
            options: question.options,
            questionNumber,
            totalQuestions
          },
          true
        )
      } else if (question.type === "text" || question.type === "number") {
        addMessage(
          question.question,
          false,
          "assessment-input",
          {
            questionId: question.id,
            questionType: question.type,
            placeholder: question.placeholder,
            questionNumber,
            totalQuestions
          },
          true
        )
      }
    }, 800)
  }

  const handleAssessmentAnswer = (questionId: string, answer: any) => {
    // Store the answer
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))

    // Show user's response
    const displayAnswer = Array.isArray(answer) ? answer.join(", ") : answer
    addMessage(`Selected: ${displayAnswer}`, true)

    // Move to next question
    setTimeout(() => {
      setCurrentAssessmentQuestion(prev => prev + 1)
      showNextAssessmentQuestion()
    }, 1500)
  }

  const completeAssessment = () => {
    addMessage("✅ Assessment Complete!", true)
    
    setTimeout(() => {
      // Show AI generation loading
      const loadingMessageId = Date.now().toString()
      const loadingMessage: Message = {
        id: loadingMessageId,
        content: "🤖 Generating your personalized plan...",
        isUser: false,
        timestamp: new Date(),
        type: "ai-generation",
        data: {},
        isActive: false,
      }
      setMessages((prev) => [...prev, loadingMessage])
      
      setTimeout(() => {
        // Remove the loading message and show plan ready card
        setMessages((prev) => prev.filter(msg => msg.id !== loadingMessageId))
        
        // Show plan ready card
        addMessage(
          "🎉 Your Personalized Health Plan is Ready!",
          false,
          "plan-ready-card",
          {
            assessmentData: assessmentAnswers,
            planSummary: "30-day personalized plan based on your preferences"
          },
          true
        )
        
        // Reset assessment mode
        setAssessmentMode(false)
        
        // Store plan data for later navigation
        setGeneratedPlanData({
          assessmentData: assessmentAnswers,
          planSummary: "30-day personalized plan based on your preferences"
        })
      }, 3000)
    }, 1000)
  }

  const handleNavigateToPlanReady = (planData: any) => {
    setGeneratedPlanData(planData)
    setShowPlanReadyScreen(true)
  }

  const handleBackFromPlanReady = () => {
    setShowPlanReadyScreen(false)
  }


  // HA2 Program Mode Actions
  const programActions = {
    essential: [
      { id: 'order-drug', label: 'Order Drug', icon: (props: any) => <Icon name="shoppingCart" {...props} />, color: 'from-blue-500 to-blue-600' },
      { id: 'know-drug', label: 'Know Your Drug', icon: (props: any) => <Icon name="school" {...props} />, color: 'from-green-500 to-green-600' },
      { id: 'take-injection', label: 'Take Injection', icon: (props: any) => <Icon name="vaccines" {...props} />, color: 'from-purple-500 to-purple-600' }
    ],
    learning: [
      'Journey',
      'Side Effects', 
      'Known Symptoms',
      'FAQs'
    ],
    tracking: [
      { id: 'log-symptoms', label: 'Log Symptoms', icon: (props: any) => <Icon name="thermostat" {...props} /> },
      { id: 'log-activities', label: 'Log Activities', icon: (props: any) => <Icon name="heartMonitor" {...props} /> },
      { id: 'view-history', label: 'View History', icon: (props: any) => <Icon name="scrollText" {...props} /> }
    ]
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialAction && !isWelcomeScreen) {
      handleInitialAction(initialAction)
    }
  }, [initialAction, isWelcomeScreen])

  // Handle navigation source changes for conditional Meet Kaira welcome
  useEffect(() => {
    // SIMPLE LOGIC: Show welcome screen ONLY when navigationSource is app-login-skip
    if (navigationSource === 'app-login-skip') {
      setIsWelcomeScreen(true)
    } else if (navigationSource === 'app-navigation') {
      setIsWelcomeScreen(false)
    }
  }, [navigationSource, hasShownWelcome, showWelcome])
  
  // Handle showWelcome prop changes
  useEffect(() => {
    // Force show welcome if showWelcome prop is true
    if (showWelcome) {
      setIsWelcomeScreen(true)
    } else if (showWelcome === false) {
      setIsWelcomeScreen(false)
    }
  }, [showWelcome, navigationSource])

  const handleInitialAction = (action: string) => {
    switch (action) {
      case "blood-sugar":
        handleActionClick("blood-sugar")
        break
      case "water-intake":
        handleActionClick("water")
        break
      case "medication":
        handleActionClick("medication")
        break
      case "symptom":
        handleActionClick("symptom")
        break
      default:
        break
    }
  }

  const handleWelcomeNext = () => {
    setIsTransitioning(true)
    setHasShownWelcome(true)
    // Persist welcome shown state in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('meetKaira_shown', 'true')
    }
    setTimeout(() => {
      setIsWelcomeScreen(false)
      setIsTransitioning(false)
      onWelcomeComplete?.() // Notify parent that welcome is complete
    }, 500)
  }

  const handleModeChange = (mode: 'program' | 'chat') => {
    if (currentMode === mode) return // Don't do anything if already in that mode
    
    setIsTransitioningMode(true)
    setTimeout(() => {
      setCurrentMode(mode)
      setIsTransitioningMode(false)
    }, 250)
  }

  // Quick Action Flow Handlers
  const handleQuickAction = (actionId: string) => {
    // Use the comprehensive flows from QUICK_ACTION_FLOWS for all actions
    let flow = QUICK_ACTION_FLOWS.find(f => f.actionId === actionId)
    
    if (!flow) return

    // Start the flow
    setActiveFlow(flow)
    setCurrentFlowStep(0)
    setFlowAnswers({})

    // Add initial message
    addMessage(`Starting ${flow.actionId.replace('log-', '').replace('-', ' ')} logging...`, true)
    
    // Add first step message
    setTimeout(() => {
      addMessage(flow.steps[0].question, false, "quick-action-flow", { 
        flow, 
        stepIndex: 0,
        isActive: true 
      })
      scrollToBottom(messagesEndRef)
    }, 500)
  }

  const handleFlowStepAnswer = (stepId: string, answer: any) => {
    if (!activeFlow) return

    // Add user message showing their selection
    addMessage(answer, true)

    // Store the answer
    const updatedAnswers = { ...flowAnswers, [stepId]: answer }
    setFlowAnswers(updatedAnswers)

    // Handle special case for diet plan adherence
    if (activeFlow.actionId === 'log-diet' && stepId === 'diet-plan-adherence') {
      if (answer === 'yes') {
        // Show diet plan card for confirmation
        setTimeout(() => {
          addMessage("Great! Let's confirm which items from your diet plan you included:", false, "diet-plan-card", {
            mealType: updatedAnswers['meal-type'] || 'lunch',
            answers: updatedAnswers
          })
          scrollToBottom(messagesEndRef)
        }, 500)
        return // Don't proceed to next step yet
      } else {
        // Continue with normal flow for 'no' answer
        addMessage("No worries! Let's continue logging your meal details.", false)
      }
    }

    // Move to next step or complete flow
    const nextStepIndex = currentFlowStep + 1
    
    // Check if this step should be skipped (for conditional symptom flow)
    let actualNextStep = nextStepIndex
    if (activeFlow.actionId === 'log-symptoms' && actualNextStep < activeFlow.steps.length) {
      const nextStep = activeFlow.steps[actualNextStep]
      
      // Skip body location step if symptom doesn't require it
      if (nextStep.id === 'body-location' && !symptomRequiresLocation(updatedAnswers['symptom-selection'] || '')) {
        actualNextStep++
      }
    }
    
    if (actualNextStep < activeFlow.steps.length) {
      // Move to next step
      setCurrentFlowStep(actualNextStep)
      
      setTimeout(() => {
        addMessage(activeFlow.steps[actualNextStep].question, false, "quick-action-flow", {
          flow: activeFlow,
          stepIndex: actualNextStep,
          isActive: true
        })
        scrollToBottom(messagesEndRef)
      }, 500)
    } else {
      // Complete the flow
      completeQuickActionFlow(updatedAnswers)
    }
  }

  const handleDietPlanCompletion = (completedItems: any[]) => {
    if (!activeFlow) return

    // Store diet plan completion data
    const updatedAnswers = { ...flowAnswers, 'diet-plan-items': completedItems }
    setFlowAnswers(updatedAnswers)

    // Complete the flow with diet plan data - this will show the comprehensive success message
    completeQuickActionFlow(updatedAnswers)
  }

  const completeQuickActionFlow = (answers: Record<string, any>) => {
    if (!activeFlow) return

    // Persist logs for key flows (dev-only storage). Fire-and-forget; non-blocking.
    try {
      const sessId = (typeof window !== 'undefined') ? (localStorage.getItem('assistant_session_id') || '') : ''
      const traceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      if (activeFlow.actionId === 'log-symptoms') {
        const payload = {
          sessionId: sessId,
          symptom: answers['symptom-selection'],
          severity: answers['intensity'],
          location: answers['body-location'],
          answers,
          traceId
        }
        fetch('/api/logs/symptom', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        }).catch(() => {})
      } else if (activeFlow.actionId === 'log-exercise') {
        const duration = Number(answers['duration'])
        const payload = {
          sessionId: sessId,
          activity: answers['exercise-type'],
          duration_min: isFinite(duration) ? duration : null,
          intensity: answers['intensity'],
          answers,
          traceId
        }
        fetch('/api/logs/activity', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        }).catch(() => {})
      }
    } catch {}

    // Add success message
    setTimeout(() => {
      const successMsg = activeFlow.successMessage(answers)
      const detailsMsg = activeFlow.detailsMessage(answers)
      
      addMessage(successMsg, false, "quick-action-success", {
        title: successMsg,
        details: detailsMsg,
        showInsights: true
      })
      scrollToBottom(messagesEndRef)
    }, 500)

    // Reset flow state
    setActiveFlow(null)
    setCurrentFlowStep(0)
    setFlowAnswers({})
  }

  const addMessage = (content: string, isUser: boolean, type?: Message["type"], data?: any, isActive?: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      type: type || "normal",
      data,
      isActive: isActive !== undefined ? isActive : (type === "unified-message" || type === "assessment-choice" || type === "assessment-input" || type === "plan-ready-card") ? true : undefined,
    }

    // Generate suggestions for assistant messages (not user messages)
    if (!isUser && type !== "quick-action-flow" && type !== "assessment-choice" && type !== "assessment-input") {
      // Clear existing suggestions from all messages first
      setMessages((prev) => prev.map(msg => ({ ...msg, showSuggestions: false, suggestions: undefined })))
      
      // Generate contextual suggestions
      const suggestions = generateSuggestionsForMessage(content, type)
      newMessage.showSuggestions = true
      newMessage.suggestions = suggestions
    }

    setMessages((prev) => [...prev, newMessage])

    // Persist message (dev-only). Fire-and-forget.
    try {
      const sessId = (typeof window !== 'undefined') ? ensureAssistantSessionId() : ''
      const traceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessId, role: isUser ? 'user' : 'assistant', content, traceId })
      }).catch(() => {})
    } catch {}
  }

  // Ensure we have a persistent session ID for chat/logging (dev-only)
  function ensureAssistantSessionId(): string {
    if (typeof window === 'undefined') return ''
    let id = localStorage.getItem('assistant_session_id')
    if (!id) {
      id = crypto?.randomUUID?.() || `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
      try { localStorage.setItem('assistant_session_id', id) } catch {}
      // Also create session in DB
      try {
        fetch('/api/chat/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => {})
      } catch {}
    }
    return id
  }

  // Initialize session once in chat mode
  React.useEffect(() => {
    if (currentMode === 'chat') {
      const id = ensureAssistantSessionId()
      // Optionally load history for existing session on entering chat
      // fetch('/api/chat/message?session_id=' + id).then(r=>r.json()).then(...)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMode])

  // Load a specific chat session and its messages
  function loadChatSession(sessionId: string) {
    try { localStorage.setItem('assistant_session_id', sessionId) } catch {}
    // Fetch messages and replace current view
    fetch(`/api/chat/message?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const rows = (data?.messages || []) as Array<{ role: string, content: string, created_at: string }>
        const loaded: Message[] = rows.map((row, idx) => ({
          id: `${sessionId}-${idx}`,
          content: row.content,
          isUser: row.role === 'user',
          timestamp: new Date(row.created_at),
          type: 'normal'
        }))
        setMessages(loaded)
        dispatchComposer({ type: "SET_INPUT_VALUE", payload: "" })
        setCurrentMode('chat')
      })
      .catch(() => {
        setMessages([])
        dispatchComposer({ type: "SET_INPUT_VALUE", payload: "" })
        setCurrentMode('chat')
      })
  }

  // Start a brand new chat session
  function startNewChatSession() {
    fetch('/api/chat/session', { method: 'POST' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ id }) => {
        try { localStorage.setItem('assistant_session_id', id) } catch {}
        setMessages([])
        dispatchComposer({ type: "SET_INPUT_VALUE", payload: "" })
        setCurrentMode('chat')
      })
      .catch(() => {
        // Fallback to local-only new session id
        const id = crypto?.randomUUID?.() || `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
        try { localStorage.setItem('assistant_session_id', id) } catch {}
        setMessages([])
        dispatchComposer({ type: "SET_INPUT_VALUE", payload: "" })
        setCurrentMode('chat')
      })
  }

  // Suggestion chip click handler
  const handleSuggestionClick = (action: string) => {
    // Clear suggestions from all messages when user clicks a chip
    setMessages((prev) => prev.map(msg => ({ ...msg, showSuggestions: false, suggestions: undefined })))
    
    // Handle the action based on the suggestion type
    handleActionClick(action)
  }

  // Program mode action handling
  const handleActionClick = (action: string, item?: any) => {
    setCurrentMode('chat') // Switch to chat when action is taken
    
    // Don't add redundant "Selected:" message since user selection is already shown
    
    switch (action) {
      case "order-drug":
        // Remove redundant BUY_DRUG user message, go straight to response
        setTimeout(() => {
          addMessage(
            HEALTH_ASSISTANT_MESSAGES.BUY_DRUG_INTRO,
            false,
            "unified-message",
            {
              content:
                HEALTH_ASSISTANT_MESSAGES.PHARMACY_SECTION_TITLE,
              showRecommendations: true,
              recommendationSections: [
                {
                  title: "🏥 Verified Online Pharmacies",
                  type: "pharmacy-links",
                  items: [
                    {
                      id: "apollo-pharmacy",
                      title: "Apollo Pharmacy",
                      subtitle: "Free delivery • Prescription required",
                      icon: "🏥",
                      action: "pharmacy-link",
                    },
                    {
                      id: "netmeds",
                      title: "Netmeds",
                      subtitle: "24/7 service • Express delivery",
                      icon: "💊",
                      action: "pharmacy-link",
                    },
                  ]
                }
              ]
            }
          )
        }, 1500)
        break
      case "take-injection":
        // Remove redundant TAKE_INJECTION user message, go straight to response
        setTimeout(() => {
          addMessage(
            "💉 How to Administer Semaglutide\n\n📍 Injection Sites:\n• Thigh (front and outer area)\n• Abdomen (avoid 2 inches around navel)\n• Upper arm (back area)\n\n⏰ Timing:\n• Once weekly, same day each week\n• Can be taken with or without food\n• Any time of day\n\n🔄 Rotation:\n• Rotate injection sites weekly\n• Don't inject into same spot twice in a row\n\n⚠️ Important:\n• Let pen reach room temperature (15-30 min)\n• Check for particles or discoloration\n• Don't shake the pen",
            false,
            "unified-message",
            {
              showRecommendations: true,
              recommendationSections: [
                {
                  title: "🎥 Step-by-Step Video Guides",
                  type: "videos",
                  items: [
                    {
                      id: "injection-technique",
                      title: "Proper Injection Technique",
                      subtitle: "8 min tutorial • Beginner friendly",
                      icon: "🎬",
                      action: "video-content",
                    },
                    {
                      id: "pen-preparation",
                      title: "Preparing Your Semaglutide Pen",
                      subtitle: "5 min guide • Pre-injection steps",
                      icon: "📹",
                      action: "video-content",
                    },
                    {
                      id: "site-rotation",
                      title: "Injection Site Rotation",
                      subtitle: "6 min explanation • Best practices",
                      icon: "🔄",
                      action: "video-content",
                    },
                    {
                      id: "troubleshooting",
                      title: "Common Issues & Solutions",
                      subtitle: "10 min comprehensive guide",
                      icon: "🛠️",
                      action: "video-content",
                    },
                  ],
                },
                {
                  title: "📚 Written Guides",
                  type: "guides",
                  items: [
                    {
                      id: "injection-checklist",
                      title: "Pre-Injection Checklist",
                      subtitle: "Step-by-step preparation guide",
                      icon: "✅",
                      action: "educational-content",
                    },
                    {
                      id: "safety-tips",
                      title: "Safety Tips & Best Practices",
                      subtitle: "Ensure safe administration",
                      icon: "🛡️",
                      action: "educational-content",
                    },
                    {
                      id: "disposal-guide",
                      title: "Proper Disposal of Pens",
                      subtitle: "Safe disposal methods",
                      icon: "♻️",
                      action: "educational-content",
                    },
                  ],
                },
                {
                  title: "💡 Quick Actions",
                  type: "actions",
                  items: [
                    {
                      id: "set-injection-reminder",
                      title: "Set Weekly Injection Reminder",
                      subtitle: "Never miss your dose",
                      icon: "⏰",
                      action: "set-reminder",
                    },
                    {
                      id: "track-injection-sites",
                      title: "Track Injection Sites",
                      subtitle: "Log rotation pattern",
                      icon: "📍",
                      action: "track-sites",
                    },
                    {
                      id: "contact-nurse",
                      title: "Contact Nurse for Demo",
                      subtitle: "Schedule in-person training",
                      icon: "👩‍⚕️",
                      action: "contact-nurse",
                    },
                  ],
                },
              ],
            },
            true,
          )
        }, 1000)
        break
      case "give-drug":
        addMessage(HEALTH_ASSISTANT_MESSAGES.INJECTION_GUIDE_INTRO, false)
        setTimeout(() => {
          addMessage(HEALTH_ASSISTANT_MESSAGES.INJECTION_EATING_CHECK, false, "options", {
            options: [
              { id: 'eaten-yes', text: '✅ Yes, I have eaten' },
              { id: 'eaten-no', text: '❌ No, I haven\'t eaten' },
              { id: 'eaten-unsure', text: '🤔 I\'m not sure' }
            ]
          })
        }, 1000)
        break
      case "learn-drug":
        addMessage(HEALTH_ASSISTANT_MESSAGES.LEARN_DRUG_INTRO, false, "options", {
          options: [
            { id: 'mechanism', text: '⚙️ How it works in your body' },
            { id: 'side-effects', text: '⚠️ What side effects to watch for' },
            { id: 'interactions', text: '🔄 Drug and food interactions' },
            { id: 'best-practices', text: '⭐ Best practices and tips' }
          ]
        })
        break
      case "video-content":
        // For "Proper Injection Technique", show the YouTube video
        if (item?.id === "injection-technique" || item?.title === "Proper Injection Technique") {
          addMessage(
            "🎥 Proper Injection Technique Video Guide",
            false,
            "video",
            {
              videoId: "YwOQinOq9pg",
              title: "Subcutaneous Injection (SC injection) - OSCE Guide"
            }
          )
        } else {
          addMessage(
            `🎥 ${item?.title || action}\n\nStarting video guide...\n\n▶️ This would typically start the video player with the selected content.`,
            false,
          )
        }
        break
      case "educational-content":
        addMessage(
          `📖 Educational Content\n\nOpening educational guide...\n\n💡 This would typically open the full article or guide in your library.`,
          false,
        )
        break
      case "set-reminder":
        addMessage(
          `⏰ Injection Reminder Set\n\n💉 Weekly Semaglutide injection\n📅 Every Sunday at 10:00 AM\n📱 Push notification enabled\n\n✅ You'll receive weekly reminders for your injection.`,
          false,
        )
        break
      case "track-sites":
        addMessage(
          `📍 Injection Site Tracking\n\n✅ Site tracking enabled\n📅 Weekly rotation reminders set\n📊 Visual site map available\n\n💡 This helps ensure proper rotation and reduces injection site reactions.`,
          false,
        )
        break
      case "contact-nurse":
        // Use quick action flow for nurse consultation appointment scheduling
        handleQuickAction('contact-nurse')
        break
      case "know-drug":
        // Remove redundant KNOW_DRUG user message, go straight to response
        setTimeout(() => {
          addMessage(
            "📚 Semaglutide (Ozempic/Wegovy) Information\n\n🎯 What it does:\n• GLP-1 receptor agonist\n• Helps control blood sugar\n• Promotes weight loss\n• Slows gastric emptying\n\n💊 How it works:\n• Increases insulin production when blood sugar is high\n• Decreases glucagon release\n• Reduces appetite and food intake\n• Improves satiety (feeling full)\n\n⚕️ Medical Benefits:\n• Better blood sugar control\n• Significant weight reduction\n• Cardiovascular protection\n• Reduced risk of diabetes complications",
            false,
            "unified-message",
            {
                showRecommendations: true,
                recommendationSections: [
                  {
                    title: "📋 Detailed Drug Information",
                    type: "drug-info",
                    items: [
                      {
                        id: "mechanism-action",
                        title: "Mechanism of Action",
                        subtitle: "How Semaglutide works in your body",
                        icon: "⚙️",
                        action: "educational-content",
                      },
                      {
                        id: "clinical-studies",
                        title: "Clinical Trial Results",
                        subtitle: "Evidence-based effectiveness data",
                        icon: "📊",
                        action: "educational-content",
                      },
                      {
                        id: "side-effects-guide",
                        title: "Complete Side Effects Guide",
                        subtitle: "Common, rare, and serious effects",
                        icon: "⚠️",
                        action: "educational-content",
                      },
                      {
                        id: "drug-interactions",
                        title: "Drug Interactions",
                        subtitle: "Medications to avoid or monitor",
                        icon: "🔄",
                        action: "educational-content",
                      },
                    ],
                  },
                  {
                    title: "🎥 Educational Videos",
                    type: "educational-videos",
                    items: [
                      {
                        id: "semaglutide-explained",
                        title: "Semaglutide Explained Simply",
                        subtitle: "12 min overview • Patient-friendly",
                        icon: "🎬",
                        action: "video-content",
                      },
                      {
                        id: "weight-loss-science",
                        title: "The Science of Weight Loss",
                        subtitle: "15 min deep dive • How it works",
                        icon: "🔬",
                        action: "video-content",
                      },
                      {
                        id: "diabetes-management",
                        title: "Diabetes Management with GLP-1",
                        subtitle: "18 min comprehensive guide",
                        icon: "📈",
                        action: "video-content",
                      },
                    ],
                  },
                  {
                    title: "📚 Patient Resources",
                    type: "resources",
                    items: [
                      {
                        id: "patient-handbook",
                        title: "Semaglutide Patient Handbook",
                        subtitle: "Complete treatment guide",
                        icon: "📖",
                        action: "educational-content",
                      },
                      {
                        id: "faq-guide",
                        title: "Frequently Asked Questions",
                        subtitle: "Common patient concerns answered",
                        icon: "❓",
                        action: "educational-content",
                      },
                      {
                        id: "lifestyle-tips",
                        title: "Lifestyle Optimization Tips",
                        subtitle: "Maximize treatment effectiveness",
                        icon: "🌟",
                        action: "educational-content",
                      },
                    ],
                  },
                  {
                    title: "💡 Recommended Actions",
                    type: "actions",
                    items: [
                      {
                        id: "discuss-doctor",
                        title: "Discuss with Your Doctor",
                        subtitle: "Schedule consultation",
                        icon: "👨‍⚕️",
                        action: "schedule-consultation",
                      },
                      {
                        id: "join-support-group",
                        title: "Join Patient Support Group",
                        subtitle: "Connect with other patients",
                        icon: "👥",
                        action: "join-support",
                      },
                      {
                        id: "download-app",
                        title: "Download Companion App",
                        subtitle: "Track progress and side effects",
                        icon: "📱",
                        action: "download-app",
                      },
                    ],
                  },
                ],
              },
              true,
            )
        }, 1000)
        break
      case "schedule-consultation":
        addMessage(
          `👨‍⚕️ Doctor Consultation\n\n📅 Next available: Tomorrow 2:00 PM\n🏥 Dr. Sarah Johnson\n📋 Discussion topics: Treatment progress, side effects, dosage\n\n💡 This would typically open your appointment booking system.`,
          false,
        )
        break
      case "join-support":
        addMessage(
          `👥 Patient Support Group\n\n🌟 Semaglutide Success Stories\n📅 Weekly virtual meetings\n💬 24/7 online community\n📚 Shared resources and tips\n\n💡 Connect with others on the same journey.`,
          false,
        )
        break
      case "download-app":
        addMessage(
          `📱 Companion App\n\n✅ MySemaglutide Tracker\n📊 Progress monitoring\n⚠️ Side effect logging\n💊 Dose reminders\n\n💡 Available on App Store and Google Play.`,
          false,
        )
        break
      case "ai-health-plans":
        addMessage(HEALTH_ASSISTANT_MESSAGES.AI_HEALTH_PLANS, true)
        setTimeout(() => {
          addMessage(
            "✨ AI-Powered Personalized Health Plans\n\nGet a customized health plan tailored specifically to your needs, preferences, and health goals using advanced AI technology.",
            false,
            "unified-message",
            {
              showRecommendations: true,
              recommendationSections: [
                {
                  title: "🎯 What You'll Get",
                  type: "benefits",
                  items: [
                    {
                      id: "personalized-nutrition",
                      title: "Personalized Nutrition Plan",
                      subtitle: "Based on your dietary preferences and health goals",
                      icon: "🍽️",
                      action: "info-item",
                    },
                    {
                      id: "exercise-routine",
                      title: "Customized Exercise Routine",
                      subtitle: "Tailored to your fitness level and preferences",
                      icon: "💪",
                      action: "info-item",
                    },
                    {
                      id: "lifestyle-recommendations",
                      title: "Lifestyle Recommendations",
                      subtitle: "Sleep, stress management, and daily habits",
                      icon: "🌱",
                      action: "info-item",
                    },
                    {
                      id: "progress-tracking",
                      title: "Progress Tracking",
                      subtitle: "Monitor your journey with smart insights",
                      icon: "📊",
                      action: "info-item",
                    },
                  ],
                },
                {
                  title: "🚀 Get Started",
                  type: "actions",
                  items: [
                    {
                      id: "take-assessment",
                      title: "Take Health Assessment",
                      subtitle: "5-minute personalized questionnaire",
                      icon: "📋",
                      action: "start-assessment",
                    },
                    {
                      id: "view-sample",
                      title: "View Sample Plan",
                      subtitle: "See what a personalized plan looks like",
                      icon: "👀",
                      action: "view-sample-plan",
                    },
                  ],
                },
              ],
            },
            true,
          )
        }, 1000)
        break
      case "start-assessment":
        // Switch to chat mode and start the health assessment chat flow
        setCurrentMode('chat')
        setAssessmentMode(true)
        setCurrentAssessmentQuestion(0)
        setAssessmentAnswers({})
        addMessage("🎯 Health Assessment Started", true)
        setTimeout(() => {
          showNextAssessmentQuestion()
        }, 1000)
        break
      case "view-sample-plan":
        addMessage("👀 View Sample Plan", true)
        setTimeout(() => {
          addMessage(
            "📋 Sample Personalized Health Plan\n\nHere's what a typical AI-generated plan includes:\n\n🍽️ **Nutrition Plan**\n• 3 balanced meals + 2 snacks\n• Customized for weight loss goals\n• Vegetarian-friendly options\n\n💪 **Exercise Routine**\n• 30-min workouts, 4x/week\n• Mix of cardio and strength training\n• Beginner to intermediate level\n\n🌱 **Lifestyle Recommendations**\n• 7-8 hours sleep schedule\n• Stress management techniques\n• Hydration reminders\n\n📊 **Progress Tracking**\n• Weekly weight check-ins\n• Energy level monitoring\n• Habit compliance tracking",
            false,
          )
        }, 1000)
        break
      case "info-item":
        // Handle info item clicks - just acknowledge
        addMessage(HEALTH_ASSISTANT_MESSAGES.INFO_NOTED, true)
        break
      case "log-symptoms":
        // Trigger the symptoms logging flow directly without redundant message
        handleQuickAction('log-symptoms')
        break
      case "log-activities":
        // Show activity selection directly without redundant user message
        const activityOptions = generateActivityOptions()
        addMessage(
          HEALTH_ASSISTANT_MESSAGES.ACTIVITY_SELECTION,
          false,
          activityOptions.type,
          activityOptions.data
        )
        break
      case "ai-health-plan":
        // Keep existing AI health plan functionality
        addMessage("AI Health Plan", true)
        setTimeout(() => {
          addMessage(
            "🧠 AI Health Plan\n\nLet me create a personalized plan based on your health data and goals.\n\n📊 I'll analyze your:\n• Current health metrics\n• Medication adherence\n• Lifestyle patterns\n• Treatment response\n\n💡 This will generate actionable recommendations for your journey.",
            false,
          )
        }, 1000)
        break
      case "book-lab-tests":
        addMessage("Book Lab Tests", true)
        setTimeout(() => {
          addMessage(
            "🧪 Available Diagnostic Tests\n\nChoose the tests you'd like to book:",
            false,
            "options",
            {
              type: "lab-tests",
              options: [
                "Lipid Profile - $45",
                "HbA1c - $35", 
                "Thyroid Function - $65",
                "Complete Blood Count - $25",
                "Comprehensive Metabolic Panel - $55"
              ]
            }
          )
        }, 1000)
        break
      case "journey-guide":
        addMessage(
          "🚀 Journey Guide - Coming Soon!\n\nI'll help you navigate your Semaglutide journey with personalized guidance and milestones.",
          false,
        )
        break
      case "side-effects":
        addMessage(
          "⚠️ Possible Side Effects - Coming Soon!\n\nI'll provide detailed information about potential side effects and how to manage them.",
          false,
        )
        break
      case "faq":
        addMessage(
          "❓ Frequently Asked Questions - Coming Soon!\n\nI'll answer the most common questions about Semaglutide treatment.",
          false,
        )
        break
      case "smart-devices":
        addMessage(
          "📱 Smart Devices Integration - Coming Soon!\n\nI'll show you how wearables and health apps can enhance your treatment journey.",
          false,
        )
        break
      case "log-symptoms":
        // Use existing log symptoms flow
        handleQuickAction('log-symptoms')
        break
      case "log-activities":
        addMessage(
          "📊 What activity would you like to log?",
          false,
          "options",
          {
            type: "activity-selection",
            options: [
              "Log Diet",
              "Log Exercise", 
              "Log Medication",
              "Log Sleep",
              "Log Water"
            ]
          }
        )
        break
      case "vitals-insights":
        addMessage(
          "📈 Vitals Insights - Coming Soon!\n\nI'll provide intelligent analysis of your health data and trends.",
          false,
        )
        break
      case "purchase-bca":
        addMessage(
          "🏋️‍♀️ Body Composition Analyser (BCA)\n\nGet detailed insights into your body composition to track your Semaglutide progress effectively.\n\nWhat would you like to do?",
          false,
          "enhanced-options",
          {
            type: "bca-options",
            options: [
              { 
                label: "Check Specifications", 
                icon: "FileText", 
                description: "View detailed technical specs" 
              },
              { 
                label: "Place Order", 
                icon: "ShoppingCart", 
                description: "Purchase with patient discount" 
              }
            ]
          }
        )
        break
      case "purchase-cgm":
        addMessage(
          "📊 Glucose Monitor (CGM) - Coming Soon!\n\nContinuous glucose monitoring to track your blood sugar levels throughout your Semaglutide journey.",
          false,
        )
        break
      default:
        if (action.startsWith('progress-')) {
          const actionIndex = parseInt(action.split('-')[1])
          addMessage(HEALTH_ASSISTANT_MESSAGES.PROGRESS_DETAILS(actionIndex), false)
          setTimeout(() => {
            addMessage(HEALTH_ASSISTANT_MESSAGES.PROGRESS_SUMMARY, false)
          }, 1000)
        } else if (action.startsWith('metrics-')) {
          const actionIndex = parseInt(action.split('-')[1])
          addMessage(HEALTH_ASSISTANT_MESSAGES.METRICS_LOADING(actionIndex), false)
          setTimeout(() => {
            addMessage(HEALTH_ASSISTANT_MESSAGES.METRICS_ANALYSIS, false)
          }, 1500)
        } else {
          addMessage(HEALTH_ASSISTANT_MESSAGES.FEATURE_ACTIVATED, false)
        }
        break
    }
  }

  // AI Card Navigation Handler
  const handleAICardClick = (category: string) => {
    // Switch to chat mode
    setCurrentMode('chat')
    
    // Add user message showing which card was clicked
    let cardName = ''
    let categoryTitle = ''
    let actions = []
    
    switch (category) {
      case 'explore':
        cardName = 'Explore Your Program'
        categoryTitle = 'the program'
        actions = [
          { id: 'purchase-semaglutide', label: 'Purchase Semaglutide', actionType: 'order-drug', icon: 'ShoppingCart', description: 'Order your medication online' },
          { id: 'injection-guidance', label: 'Injection Guidance', actionType: 'take-injection', icon: 'Syringe', description: 'Learn proper injection techniques' },
          { id: 'learn-semaglutide', label: 'Learn about Semaglutide', actionType: 'know-drug', icon: 'GraduationCap', description: 'Understand your medication' },
          { id: 'ai-health-plan', label: 'AI Health Plan', actionType: 'ai-health-plan', icon: 'Brain', description: 'Get personalized recommendations' },
          { id: 'book-lab-tests', label: 'Book Lab Tests', actionType: 'book-lab-tests', icon: 'FlaskConical', description: 'Schedule diagnostic tests' },
        ]
        break
      case 'learn':
        cardName = 'Learn & Understand'
        categoryTitle = 'Semaglutide'
        actions = [
          { id: 'journey-guide', label: 'Journey Guide', actionType: 'journey-guide', icon: 'MapPin', description: 'Step-by-step treatment roadmap' },
          { id: 'side-effects', label: 'Know about possible side effects', actionType: 'side-effects', icon: 'AlertTriangle', description: 'Understanding potential reactions' },
          { id: 'faq', label: 'Know frequently asked questions', actionType: 'faq', icon: 'HelpCircle', description: 'Common questions answered' },
          { id: 'smart-devices', label: 'How can smart devices help you?', actionType: 'smart-devices', icon: 'Smartphone', description: 'Technology for better care' },
        ]
        break
      case 'monitor':
        cardName = 'Monitor & Track'
        categoryTitle = ''
        actions = [
          { id: 'log-symptoms', label: 'Log Symptoms', actionType: 'log-symptoms', icon: 'Stethoscope', description: 'Track how you feel daily' },
          { id: 'log-activities', label: 'Log Activities', actionType: 'log-activities', icon: 'Activity', description: 'Record diet, sleep & exercise' },
          { id: 'vitals-insights', label: 'See insights about your Vitals', actionType: 'vitals-insights', icon: 'TrendingUp', description: 'Analyze your health trends' },
        ]
        break
      case 'recommended':
        cardName = 'Recommended For You'
        categoryTitle = 'health monitoring'
        actions = [
          { id: 'purchase-bca', label: 'Purchase Body Composition Analyser (BCA)', actionType: 'purchase-bca', icon: 'BarChart3', description: 'Track body composition metrics' },
          { id: 'purchase-cgm', label: 'Purchase Glucose Monitor (CGM)', actionType: 'purchase-cgm', icon: 'Activity', description: 'Monitor glucose levels continuously' },
        ]
        break
    }
    
    // Show user selected the card
    addMessage(cardName, true)
    
    // Add AI response with options after a brief delay
    setTimeout(() => {
      let messageText = ''
      switch (category) {
        case 'learn':
          messageText = 'What can I help you understand about Semaglutide?'
          break
        case 'monitor':
          messageText = 'What can I help you track?'
          break
        case 'recommended':
          messageText = 'Here are some recommended health monitoring devices that can enhance your Semaglutide journey:'
          break
        default:
          messageText = `Hi! I can help you explore ${categoryTitle}. Here are your options:`
      }
      
      addMessage(
        messageText,
        false,
        "enhanced-options",
        {
          type: "ai-card-actions",
          category: category,
          options: actions.map(action => ({
            label: action.label,
            icon: action.icon,
            description: action.description
          }))
        },
        true
      )
    }, 800)
  }

  // Handle activity selection from Log Activities menu
  const handleActivitySelection = (selectedActivity: string) => {
    // Find the corresponding quick action using utility function
    const quickAction = getQuickActionByLabel(selectedActivity)
    if (quickAction) {
      // Trigger the quick action flow (this will add appropriate messages)
      handleQuickAction(quickAction.id)
    }
  }

  // Handle option clicks (including AI card actions)
  const handleOptionClick = (selectedOption: string, messageType?: string, category?: string) => {
    if (messageType === "ai-card-actions" && category) {
      // Handle AI card action selections - show user selection
      addMessage(selectedOption, true)
      
      setTimeout(() => {
        // Map the selected option label to the corresponding action
        let actionType = ''
        
        switch (selectedOption) {
          case 'Purchase Semaglutide':
          case 'Order Drug':
          case 'Buy Drug':
            actionType = 'order-drug'
            break
          case 'Injection Guidance':
          case 'Take Injection':
          case 'Administer Drug':
            actionType = 'take-injection'
            break
          case 'Learn about Semaglutide':
          case 'Know Your Drug':
            actionType = 'know-drug'
            break
          case 'AI Health Plan':
            actionType = 'ai-health-plan'
            break
          case 'Book Lab Tests':
            actionType = 'book-lab-tests'
            break
          case 'Journey Guide':
            actionType = 'journey-guide'
            break
          case 'Know about possible side effects':
            actionType = 'side-effects'
            break
          case 'Know frequently asked questions':
            actionType = 'faq'
            break
          case 'How can smart devices help you?':
            actionType = 'smart-devices'
            break
          case 'Log Symptoms':
            actionType = 'log-symptoms'
            break
          case 'Log Activities':
            actionType = 'log-activities'
            break
          case 'See insights about your Vitals':
            actionType = 'vitals-insights'
            break
          case 'Log Medication':
            actionType = 'medication'
            break
          case 'Log Water':
            actionType = 'water'
            break
          case 'Log Sleep':
            actionType = 'sleep'
            break
          case 'Log Steps':
            actionType = 'steps'
            break
          case 'Log Fatigue':
            actionType = 'fatigue'
            break
          case 'Log Symptoms':
            actionType = 'symptom'
            break
          case 'Lab Results':
            actionType = 'lab-results'
            break
          case 'Log Periods':
            actionType = 'periods'
            break
          case 'Log Diet':
            actionType = 'diet'
            break
          case 'Purchase Body Composition Analyser (BCA)':
            actionType = 'purchase-bca'
            break
          case 'Purchase Glucose Monitor (CGM)':
            actionType = 'purchase-cgm'
            break
          default:
            actionType = selectedOption.toLowerCase().replace(/\s+/g, '-')
        }
        
        // Execute the corresponding action
        handleActionClick(actionType)
      }, 500)
    } else if (messageType === "lab-tests") {
      // Handle lab test selection
      const selectedTest = selectedOption.split(' - ')[0] // Remove price
      addMessage(selectedOption, true)
      
      setTimeout(() => {
        addMessage(
          `📍 ${selectedTest} - Where would you like to take this test?`,
          false,
          "options",
          {
            type: "test-location",
            selectedTest: selectedTest,
            options: ["At home", "At clinic"]
          }
        )
      }, 500)
    } else if (messageType === "test-location") {
      // Handle location selection
      addMessage(selectedOption, true)
      
      if (selectedOption === "At home") {
        setTimeout(() => {
          addMessage(
            "🏠 Home Collection Service\n\nPlease provide your address for sample collection:",
            false,
            "text-input",
            {
              type: "address-input",
              selectedTest: category,
              placeholder: "Enter your complete address..."
            }
          )
        }, 500)
      } else if (selectedOption === "At clinic") {
        setTimeout(() => {
          addMessage(
            "🏥 Select a clinic near you:",
            false,
            "options",
            {
              type: "clinic-selection",
              selectedTest: category,
              options: [
                "MedLab Diagnostics - Downtown",
                "HealthFirst Lab - Central Plaza", 
                "CityLab - Medical District",
                "QuickTest Center - Mall Road",
                "Wellness Labs - Health Complex"
              ]
            }
          )
        }, 500)
      }
    } else if (messageType === "clinic-selection") {
      // Handle clinic selection
      addMessage(selectedOption, true)
      
      setTimeout(() => {
        addMessage(
          "📅 Select your preferred date:",
          false,
          "options",
          {
            type: "date-selection",
            selectedTest: category,
            selectedClinic: selectedOption,
            options: [
              "Today",
              "Tomorrow", 
              "Day after tomorrow",
              "This weekend"
            ]
          }
        )
      }, 500)
    } else if (messageType === "date-selection") {
      // Handle date selection
      addMessage(selectedOption, true)
      
      setTimeout(() => {
        addMessage(
          "⏰ Choose your preferred time slot:",
          false,
          "options",
          {
            type: "time-selection",
            selectedTest: category,
            selectedDate: selectedOption,
            options: [
              "6:00 - 7:00 AM",
              "7:00 - 8:00 AM",
              "8:00 - 9:00 AM", 
              "9:00 - 10:00 AM",
              "10:00 - 11:00 AM",
              "11:00 - 12:00 PM"
            ]
          }
        )
      }, 500)
    } else if (messageType === "time-selection") {
      // Handle time selection and show success
      addMessage(selectedOption, true)
      
      // Find previous messages to get booking details
      const testMessage = messages.find(m => m.data?.type === "lab-tests" || m.data?.selectedTest)
      const locationMessage = messages.find(m => m.data?.type === "test-location")
      const clinicMessage = messages.find(m => m.data?.type === "clinic-selection")
      const dateMessage = messages.find(m => m.data?.type === "date-selection")
      const addressMessage = messages.find(m => m.data?.selectedAddress)
      
      setTimeout(() => {
        const bookingDetails = `✅ Lab Test Booking Confirmed!

📋 Booking Summary:
• Test: ${testMessage?.data?.selectedTest || category || "Lab Test"}
• Date: ${dateMessage?.data?.selectedDate || "Selected Date"}
• Time: ${selectedOption}
• Location: ${addressMessage?.data?.selectedAddress ? "Home Collection" : (clinicMessage?.data?.selectedClinic || "Selected Clinic")}
${addressMessage?.data?.selectedAddress ? `• Address: ${addressMessage.data.selectedAddress}` : ""}

📱 Next Steps:
• SMS confirmation sent to your phone
• Reminder 24 hours before appointment
• Preparation instructions will be shared

💡 Important: Fast for 8-12 hours before lipid profile tests.`
        
        addMessage(
          bookingDetails,
          false,
          "success"
        )
      }, 500)
    } else if (messageType === "activity-selection") {
      // Handle activity selection from Log Activities
      addMessage(selectedOption, true)
      
      setTimeout(() => {
        let actionType = ''
        switch (selectedOption) {
          case 'Log Diet':
            actionType = 'diet'
            break
          case 'Log Exercise':
            actionType = 'exercise'
            break
          case 'Log Medication':
            actionType = 'medication'
            break
          case 'Log Sleep':
            actionType = 'sleep'
            break
          case 'Log Water':
            actionType = 'water'
            break
        }
        
        if (actionType) {
          handleActionClick(actionType)
        }
      }, 500)
    } else if (messageType === "bca-options") {
      // Handle BCA option selection
      addMessage(selectedOption, true)
      
      setTimeout(() => {
        if (selectedOption === "Check Specifications") {
          addMessage(
            "📋 Body Composition Analyser - Specifications\n\n🔍 **Technical Details:**\n• High-precision bioelectrical impedance analysis\n• Measures body fat, muscle mass, water content\n• Bluetooth connectivity for app integration\n• FDA-approved medical grade accuracy\n• Professional clinic-grade technology\n\n📊 **What it tracks:**\n• Body fat percentage\n• Muscle mass distribution\n• Visceral fat levels\n• Bone density\n• Metabolic age\n\n💡 Perfect for monitoring Semaglutide effectiveness on body composition changes.",
            false,
          )
        } else if (selectedOption === "Place Order") {
          addMessage(
            "🛒 Place Order - Body Composition Analyser\n\n💰 **Pricing:** $299.99 (Special patient discount applied)\n📦 **Includes:**\n• BCA device with app\n• Setup guide & training\n• 1-year warranty\n• Free shipping\n\n📱 **Next Steps:**\nYour order will be processed through our secure patient portal. A specialist will contact you within 24 hours to complete the purchase and arrange delivery.\n\n✅ **Order initiated - You'll receive a confirmation shortly!**",
            false,
          )
        }
      }, 500)
    } else {
      // Handle regular activity selections
      handleActivitySelection(selectedOption)
    }
  }

  // Enhanced Intent Recognition Handler
  const handleIntentRecognition = async (userMessage: string) => {
    try {
      const response = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMessage })
      })
      
      if (response.ok) {
        const data = await response.json() as any
        const { intent, score, intentId, meta, simScore, accepted } = data
        const simOk = typeof simScore === 'number' ? simScore >= 0.40 : false

        // If vector mapping yielded a specific action or targeted symptom, use it directly
        if (intentId && (simOk || accepted)) {
          // If message is a question, prefer Insights over action flows
          if (isLikelyQuestion(userMessage)) {
            await handleAskInsights(userMessage)
            return
          }
          // Targeted symptom intent: start symptom flow with preselected symptom
          if (intentId === 'log-symptoms' && meta?.symptomId && meta?.symptomName) {
            // Leverage existing smart flow handler path with preselection
            handleSmartFlow({ action: 'log-symptoms', name: meta.symptomName })
            return
          }
          // Broad intent: if it's a known flow, start it; otherwise delegate to content/action handler
          const isFlow = QUICK_ACTION_FLOWS.some(f => f.actionId === intentId)
          if (isFlow) {
            // Guard: avoid triggering log-* flows from pure questions
            if (intentId.startsWith('log-') && isLikelyQuestion(userMessage)) {
              await handleAskInsights(userMessage)
              return
            }
            handleQuickAction(intentId)
          } else {
            handleActionClick(intentId)
          }
          return
        }

        // Use smart intent service for configuration-driven processing
        const intentResult = await smartIntentService.processIntent(userMessage, { intent, score })
        const actionHandlers = {
          handleQuickAction,
          handleActionClick,
          addMessage: (msg: string, isUser: boolean = false) => addMessage(msg, isUser)
        }
        // If the message is a question, route to insights regardless of weak/unknown intent
        if (isLikelyQuestion(userMessage)) {
          await handleAskInsights(userMessage)
          return
        }
        const actionExecuted = await smartIntentService.dispatchAction(intentResult, actionHandlers)
        if (actionExecuted) return
        console.log('Intent result:', intentResult)
      }
    } catch (error) {
      console.error('Intent recognition failed:', error)
      // Continue with existing behavior
    }
    
    // Fallback to existing chat behavior
    setTimeout(() => {
      addMessage(HEALTH_ASSISTANT_MESSAGES.PROCESSING, false)
    }, 1200)
  }

  const handleSendMessage = () => {
    if (!composerState.inputValue.trim()) return

    // Check if we're in an active text flow step
    if (activeFlow && activeFlow.steps[currentFlowStep]?.type === 'text') {
      // Handle text input for active flow
      addMessage(composerState.inputValue.trim(), true)
      dispatchComposer({ type: "SEND_MESSAGE" })
      
      // Process the text input as flow answer
      handleFlowStepAnswer(activeFlow.steps[currentFlowStep].id, composerState.inputValue.trim())
      return
    }

    // Check if we're handling address input for lab tests
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.data?.type === "address-input") {
      addMessage(composerState.inputValue.trim(), true)
      dispatchComposer({ type: "SEND_MESSAGE" })
      
      setTimeout(() => {
        addMessage(
          "📅 Select your preferred date for home collection:",
          false,
          "options",
          {
            type: "date-selection",
            selectedTest: lastMessage.data.selectedTest,
            selectedAddress: composerState.inputValue.trim(),
            options: [
              "Today",
              "Tomorrow", 
              "Day after tomorrow",
              "This weekend"
            ]
          }
        )
      }, 500)
      return
    }

    // Clear suggestions from all previous messages when user sends a message
    setMessages((prev) => prev.map(msg => ({ ...msg, showSuggestions: false, suggestions: undefined })))
    
    // Add user message immediately (show attachment count if any)
    const userMessage = composerState.inputValue.trim()
    const attNote = attachments.length > 0 ? `\n(📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''})` : ''
    addMessage(userMessage + attNote, true)
    dispatchComposer({ type: "SEND_MESSAGE" })
    
    // If there are attachments, always route to insights (analyze PDFs/images) with the message as question/context
    if (attachments.length > 0) {
      handleAskInsights(userMessage || 'Please analyze the attached documents and provide a summary.')
      setAttachments([])
      return
    }
    // If question → go straight to insights; else → intent recognition
    if (isLikelyQuestion(userMessage)) {
      handleAskInsights(userMessage)
    } else {
      handleIntentRecognition(userMessage)
    }
  }

  // Close quick actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false)
      }
    }

    if (showQuickActions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showQuickActions])

  // Handle recording errors (silence benign 'aborted'/'no-speech')
  useEffect(() => {
    if (voiceState.error && !/aborted|no-speech/i.test(voiceState.error)) {
      console.error('Recording error:', voiceState.error)
      // You could show a toast notification here
    }
  }, [voiceState.error])

  const handleVoiceComplete = (transcript: string) => {
    setShowVoiceRecording(false)
    if (transcript.trim()) {
      // Clear suggestions from all previous messages when user sends a voice message
      setMessages((prev) => prev.map(msg => ({ ...msg, showSuggestions: false, suggestions: undefined })))
      
      addMessage(transcript.trim(), true)
      // Enhanced voice response
      setTimeout(() => {
        addMessage(HEALTH_ASSISTANT_MESSAGES.VOICE_PROCESSED, false)
      }, 1500)
    }
  }

  // Early returns for different screen states
  if (showVoiceRecording) {
    return <VoiceRecordingScreen 
      onTranscriptReady={handleVoiceComplete} 
      onCancel={() => setShowVoiceRecording(false)} 
    />
  }

  if (isWelcomeScreen) {
    return (
      <div className={`h-full transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <WelcomeScreen onGetStarted={handleWelcomeNext} />
      </div>
    )
  }

  if (showPlanReadyScreen) {
    return (
      <PlanReadyScreen 
        plan={generatedPlanData}
        verificationStatus="verified"
        onBack={handleBackFromPlanReady}
        onViewDetails={() => {}}
        onRetakeQuestionnaire={() => {}}
        onRequestHCPReview={() => {}}
      />
    )
  }

  return (
    <div 
      className="flex flex-col h-full transition-opacity duration-500 relative" 
      style={{ background: "var(--app-login-gradient)" }}>
      
      {/* Clean gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--app-primary)]/3 via-[var(--app-primary-light)]/2 to-[var(--app-primary)]/5 pointer-events-none"></div>

      {/* Mode Toggle Header with Chat History */}
      <div className="flex items-center justify-between px-4 py-2 relative z-20">
        {/* Left spacer for balance */}
        <div className="w-10" />
        
        {/* Center toggle */}
        <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 rounded-full shadow-lg shadow-black/10 p-1.5">
          <div className="flex items-center gap-1">
            {/* Program Mode */}
            <button
              onClick={() => handleModeChange('program')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                currentMode === 'program' 
                  ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                  : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
              }`}
              style={currentMode === 'program' ? {
                background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
              } : {}}
            >
              <Icon name="target" className="w-4 h-4" />
              Guides
            </button>
            
            {/* Chat Mode */}
            <button
              onClick={() => handleModeChange('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                currentMode === 'chat' 
                  ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                  : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
              }`}
              style={currentMode === 'chat' ? {
                background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
              } : {}}
            >
              <Icon name="brain" className="w-4 h-4" />
              Chat
            </button>
            
          </div>
        </div>
        
        {/* Chat History Icon */}
        <button
          onClick={() => setShowChatHistory(true)}
          className="w-10 h-10 bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 rounded-full shadow-lg shadow-black/10 flex items-center justify-center hover:bg-[var(--ds-surface-primary)] transition-colors"
        >
          <Icon name="history" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto py-3 relative z-10 transition-all duration-500 ${
        isTransitioningMode ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
      } ${currentMode !== 'program' ? 'px-4' : ''}`}>
        {currentMode === 'program' ? (
          /* Program Mode */
          <div className="space-y-4">
            {/* Health Assistant Avatar - Centered */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/30 backdrop-blur-sm relative overflow-hidden mb-4" 
                   style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 50%, var(--app-secondary) 100%)' }}>
                
                {/* Subtle inner glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                
                {/* Health Professional Icon */}
                <div className="relative z-10 flex flex-col items-center text-[var(--ds-text-inverse)]">
                  <Icon name="stethoscope" className="w-8 h-8 text-[var(--ds-text-inverse)] drop-shadow-sm" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* Text Description Below Avatar */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Ask Kaira</h2>
              <p className="text-sm text-gray-700 leading-relaxed max-w-sm">
                Personalized support and expert guidance for your health journey.
              </p>
            </div>

            {/* Separator */}
            <div className="text-center mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-secondary)] mx-auto rounded-full"></div>
            </div>

            <div className="px-4 space-y-4">
              
              {/* AI-Powered Cards Section */}
              <div className="space-y-3 mb-6">
                {/* Explore Your Program 1 - AI Card */}
                <button
                  onClick={() => handleAICardClick('explore')}
                  className="w-full relative overflow-hidden rounded-xl hover:shadow-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <div className="p-3">
                    <div className="flex">
                      {/* Explore Your Program image */}
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img 
                          src="/images/patienteducationmaterial.png" 
                          alt="Explore Your Program"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Right side content - text and button */}
                      <div className="flex-1 h-24 relative">
                        {/* Title and subtext - positioned at top left */}
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm">Explore Your Program</div>
                          <div className="text-xs text-[var(--ds-text-secondary)] mt-1">Discover your health program benefits</div>
                        </div>

                        {/* Ask Kaira button - positioned at bottom right */}
                        <div className="absolute bottom-0 right-0">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                            <Icon name="sparkles" size={12} />
                            <span className="whitespace-nowrap">Ask Kaira</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Learn & Understand 1 - AI Card */}
                <button
                  onClick={() => handleAICardClick('learn')}
                  className="w-full relative overflow-hidden rounded-xl hover:shadow-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <div className="p-3">
                    <div className="flex">
                      {/* Learn & Understand image */}
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img src="/images/patientlearn.png" alt="Learn & Understand" className="w-full h-full object-contain rounded" />
                      </div>
                      
                      {/* Right side content - text and button */}
                      <div className="flex-1 h-24 relative">
                        {/* Title and subtext - positioned at top left */}
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm">Learn & Understand</div>
                          <div className="text-xs text-[var(--ds-text-secondary)] mt-1">Educational resources with AI guidance</div>
                        </div>

                        {/* Ask Kaira button - positioned at bottom right */}
                        <div className="absolute bottom-0 right-0">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                            <Icon name="sparkles" size={12} />
                            <span className="whitespace-nowrap">Ask Kaira</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Monitor & Track 1 - AI Card */}
                <button
                  onClick={() => handleAICardClick('monitor')}
                  className="w-full relative overflow-hidden rounded-xl hover:shadow-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <div className="p-3">
                    <div className="flex">
                      {/* Monitor & Track image */}
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img src="/images/patienttracking.png" alt="Monitor & Track" className="w-full h-full object-contain rounded" />
                      </div>
                      
                      {/* Right side content - text and button */}
                      <div className="flex-1 h-24 relative">
                        {/* Title and subtext - positioned at top left */}
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm">Monitor & Track</div>
                          <div className="text-xs text-[var(--ds-text-secondary)] mt-1">Track your progress with AI insights</div>
                        </div>

                        {/* Ask Kaira button - positioned at bottom right */}
                        <div className="absolute bottom-0 right-0">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                            <Icon name="sparkles" size={12} />
                            <span className="whitespace-nowrap">Ask Kaira</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Recommended For You - BCA Card */}
                <button
                  onClick={() => handleAICardClick('recommended')}
                  className="w-full relative overflow-hidden rounded-xl hover:shadow-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <div className="p-3">
                    <div className="flex">
                      {/* BCA image */}
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img src="/images/bca.png" alt="Recommended For You" className="w-full h-full object-contain rounded" />
                      </div>
                      
                      {/* Right side content - text and button */}
                      <div className="flex-1 h-24 relative">
                        {/* Title and subtext - positioned at top left */}
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm">Recommended For You</div>
                          <div className="text-xs text-[var(--ds-text-secondary)] mt-1">Enhance your health monitoring</div>
                        </div>

                        {/* Ask Kaira button - positioned at bottom right */}
                        <div className="absolute bottom-0 right-0">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                            <Icon name="sparkles" size={12} />
                            <span className="whitespace-nowrap">Ask Kaira</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              
            </div>
          </div>
        ) : currentMode === 'chat' ? (
          /* Chat Mode */
          <div className="space-y-4">
            {/* Show Ask Kaira avatar when no messages */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center mt-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/30 backdrop-blur-sm relative overflow-hidden mb-4" 
                     style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 50%, var(--app-secondary) 100%)' }}>
                  
                  {/* Subtle inner glow */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  
                  {/* Health Professional Icon - Same as Guides tab */}
                  <div className="relative z-10 flex flex-col items-center text-[var(--ds-text-inverse)]">
                    <Icon name="stethoscope" className="w-8 h-8 text-[var(--ds-text-inverse)] drop-shadow-sm" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Text Description Below Avatar */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Ask Kaira</h2>
                <p className="text-sm text-gray-700 leading-relaxed max-w-sm">
                  Your AI health assistant for personalized care and support
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
                {message.isUser ? (
                  <UserMessageBubble content={message.content} />
                ) : (
                  message.type === "unified-message" ? (
                    <UnifiedMessageContainer
                      content={message.content}
                      showRecommendations={message.data?.showRecommendations}
                      recommendationSections={message.data?.recommendationSections}
                      onItemClick={(item) => handleActionClick(item.action, item)}
                      isActive={message.isActive}
                    />
                  ) : message.type === "assessment-choice" ? (
                    <AssessmentChoiceComponent
                      content={message.content}
                      data={message.data}
                      onAnswer={handleAssessmentAnswer}
                      isActive={message.isActive}
                    />
                  ) : message.type === "assessment-input" ? (
                    <AssessmentInputComponent
                      content={message.content}
                      data={message.data}
                      onAnswer={handleAssessmentAnswer}
                      isActive={message.isActive}
                    />
                  ) : message.type === "ai-generation" ? (
                    <AIGenerationComponent />
                  ) : message.type === "plan-ready-card" ? (
                    <PlanReadyCardComponent
                      content={message.content}
                      data={message.data}
                      isActive={message.isActive}
                      onNavigateToPlan={handleNavigateToPlanReady}
                    />
                  ) : message.type === "quick-action-flow" ? (
                    <FlowStepComponent
                      step={message.data?.flow?.steps[message.data?.stepIndex]}
                      onAnswer={handleFlowStepAnswer}
                      isActive={message.data?.isActive}
                    />
                  ) : message.type === "diet-plan-card" ? (
                    <AIMessageBubble>
                      <p className="text-sm mb-4">{message.content}</p>
                      <DietPlanCard
                        mealType={message.data?.mealType}
                        onComplete={handleDietPlanCompletion}
                      />
                    </AIMessageBubble>
                  ) : message.type === "quick-action-success" ? (
                    <SuccessCard
                      title={message.data?.title}
                      details={message.data?.details}
                      onViewInsights={message.data?.showInsights ? () => {
                        // TODO: Navigate to insights screen
                      } : undefined}
                    />
                  ) : message.type === "video" ? (
                    <div className="max-w-[95%]">
                      <AIMessageBubble>
                        <p className="text-sm mb-3">{message.content}</p>
                        <VideoPlayer
                          videoId={message.data?.videoId}
                          title={message.data?.title}
                          embedded={true}
                        />
                      </AIMessageBubble>
                      {message.showSuggestions && message.suggestions && (
                        <SuggestionChips 
                          suggestions={message.suggestions} 
                          onChipClick={handleSuggestionClick}
                          className="ml-1"
                        />
                      )}
                    </div>
                  ) : message.type === "enhanced-options" ? (
                    <AIMessageBubble>
                      <p className="text-sm mb-3">{message.content}</p>
                      <div className="space-y-2">
                        {message.data?.options?.map((option: any, index: number) => {
                          return (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option.label, message.data?.type, message.data?.category)}
                              className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-100 hover:border-[var(--app-primary)] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group shadow-sm hover:shadow-md"
                            >
                              <div className="flex items-center gap-3">
                                {option.icon && (
                                  <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <Icon name={option.icon as any} className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-[var(--app-primary)] transition-colors">
                                    {option.label}
                                  </h3>
                                  {option.description && (
                                    <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 group-hover:text-[var(--ds-text-secondary)]">
                                      {option.description}
                                    </p>
                                  )}
                                </div>
                                <Icon name="chevronRight" className="w-4 h-4 text-gray-400 group-hover:text-[var(--app-primary)] group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </AIMessageBubble>
                  ) : message.type === "options" ? (
                    <AIMessageBubble>
                      <p className="text-sm mb-2">{message.content}</p>
                      <div className="space-y-2">
                        {message.data?.options?.map((option: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option, message.data?.type, message.data?.category)}
                            className="w-full text-left px-3 py-2 rounded border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50 text-sm text-gray-700 transition-all duration-200"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </AIMessageBubble>
                  ) : (
                    <div className="max-w-[85%]">
                      <AIMessageBubble>
                        <p className="text-sm">{message.content}</p>
                      </AIMessageBubble>
                      {message.showSuggestions && message.suggestions && (
                        <SuggestionChips 
                          suggestions={message.suggestions} 
                          onChipClick={handleSuggestionClick}
                          className="ml-1"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : null}
      </div>


      {
      /* Fixed Chat Input - Bottom of screen when in chat mode */
      currentMode === 'chat' && (
        <div className="flex-shrink-0 relative z-10 px-3 py-3">
          {/* Suggestions banner during recording */}
          {(voiceState.mode === 'recording' || voiceState.mode === 'recording-active') && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-[var(--surface-2,#f7f7f9)] border border-[var(--border,#ececf0)]">
              <div className="text-[0.8rem] text-gray-600">Try saying:</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {['I want to log my water', 'I want to log my food', 'Log today\'s steps', 'What should I eat?'].map((text) => (
                  <span
                    key={text}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 text-[0.8rem]"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(() => {
            // Derive a stable UI mode by combining voice + local composer state
            const vMode = voiceState.mode;
            const cMode = composerState.mode;
            const isRecording = vMode === 'recording' || vMode === 'recording-active' || cMode === 'recording';
            // Don't show transcribing for webspeech mode since it's instant
            const isTranscribing = voiceState.shouldShowWaveform && 
              ((typeof vMode === 'string' && vMode.includes('transcribing')) || cMode === 'transcribing');
            const uiMode: any = isRecording ? 'recording-active' : isTranscribing ? 'transcribing-send' : 'idle';
            return (
              <div className="flex items-center gap-2">
                {/* Attach (+) button on the left */}
                <div className="relative" ref={attachRef}>
                  <button
                    onClick={() => setShowAttachMenu((v) => !v)}
                    disabled={isUploading}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border border-[var(--ds-border-default)] bg-white shadow-sm ${isUploading ? 'opacity-60' : 'hover:bg-gray-50'}`}
                    aria-label="Attach"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--app-primary)] rounded-full animate-spin" />
                    ) : (
                      <Icon name="plus" className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  {showAttachMenu && !isUploading && (
                    <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-44 overflow-hidden z-20">
                      <button
                        onClick={triggerFilePicker}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Icon name="fileUpload" className="w-4 h-4 text-gray-500" />
                        Attach files
                      </button>
                      <button
                        onClick={triggerPhotoPicker}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Icon name="camera" className="w-4 h-4 text-gray-500" />
                        Photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Hidden inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />

                <div className="flex-1 min-w-0">
                  <ChatComposer
                mode={uiMode}
                value={composerState.inputValue}
                onChange={(value) => dispatchComposer({ type: "SET_INPUT_VALUE", payload: value })}
                onEnterSend={() => {
                  if (voiceState.mode !== 'recording' && voiceState.mode !== 'recording-active') {
                    handleSendMessage()
                  }
                }}
                onStartRecording={async () => {
                  voiceActions.setMode('recording-active')
                  await voiceActions.startRecording()
                  dispatchComposer({ type: "START_RECORDING" })
                }}
                onStopRecording={() => {
                  voiceActions.stopRecording(false) // Don't auto-send for stop button
                  dispatchComposer({ type: "STOP_RECORDING" })
                }}
                onSendRecording={() => {
                  voiceActions.stopRecording(true) // Auto-send for send button
                  dispatchComposer({ type: "STOP_RECORDING" })
                }}
                onSend={async () => {
                  if (voiceState.mode === 'recording' || voiceState.mode === 'recording-active') {
                    voiceActions.stopRecording(true) // Auto-send when using onSend during recording
                    dispatchComposer({ type: "STOP_RECORDING" })
                  } else {
                    handleSendMessage()
                  }
                }}
                onPickGallery={() => setShowGalleryOverlay(true)}
                audioData={voiceState.audioData}
                recordingTime={voiceState.recordingTime}
                analyser={voiceState.analyser}
                isSpeaking={false}
                shouldShowWaveform={voiceState.shouldShowWaveform}
                shouldShowLiveText={voiceState.shouldShowLiveText}
                interimTranscript={voiceState.interimTranscript}
                isLiveTranscribing={voiceState.isLiveTranscribing}
              />
                </div>
              </div>
            )
          })()}
          {/* Attached files bar */}
          {attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div key={`${att.url}-${idx}`} className="flex items-center gap-2 px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                  <Icon name={/image\//.test(att.type) ? 'image' : /pdf/i.test(att.name) ? 'fileText' : 'attachFile'} className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-700 max-w-[140px] truncate" title={att.name}>{att.name}</span>
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    aria-label="Remove attachment"
                  >
                    <Icon name="close" className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Gallery Overlay */}
      {showGalleryOverlay && (
        <div 
          className="absolute inset-0 z-50 flex items-end"
          onClick={() => setShowGalleryOverlay(false)}
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Gallery content */}
          <div 
            className="w-full bg-[var(--ds-surface-primary)] rounded-t-2xl shadow-2xl max-h-[60%] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <button
                  onClick={() => setShowGalleryOverlay(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Icon name="close" className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Search box */}
              <div className="relative mb-3">
                                <Icon name="browse" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={gallerySearchQuery}
                  onChange={(e) => setGallerySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-[var(--ds-border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
                />
              </div>

              {/* Filter chips */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {galleryFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveGalleryFilter(filter)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeGalleryFilter === filter
                        ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)]'
                        : 'bg-gray-100 text-[var(--ds-text-secondary)] hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-3">
                {filteredGalleryItems.map((item) => {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleGalleryItemClick(item)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-[var(--ds-surface-secondary)] transition-colors duration-200 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Icon name={item.icon as any} className="w-5 h-5 text-[var(--ds-text-inverse)]" />
                      </div>
                      <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                        {item.name}
                      </span>
                    </button>
                  )
                })}
              </div>

              {filteredGalleryItems.length === 0 && (
                <div className="text-center py-8 text-[var(--ds-text-secondary)]">
                  <Icon name="browse" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No actions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Chat History Overlay */}
  <ChatHistoryOverlay
        isOpen={showChatHistory}
        onClose={() => setShowChatHistory(false)}
        onSelectChat={(chatId) => {
          // Switch to selected chat session and load its messages
          loadChatSession(chatId)
        }}
        onNewChat={() => {
          // Start a brand new chat session
          startNewChatSession()
        }}
      />
    </div>
  )
}
