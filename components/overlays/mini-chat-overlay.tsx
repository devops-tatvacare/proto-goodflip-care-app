"use client"

import { useState, useEffect, useRef } from "react"
import { KairaPrompt } from "@/lib/constants/kaira-prompts"
import { useRouter } from "next/navigation"

interface MiniChatOverlayProps {
  isOpen: boolean
  onClose: () => void
  initialPrompt?: KairaPrompt
  otherPrompts?: KairaPrompt[]
  metricContext?: string
  onNavigateToAssistant?: () => void
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function MiniChatOverlay({ 
  isOpen, 
  onClose, 
  initialPrompt,
  otherPrompts = [],
  metricContext,
  onNavigateToAssistant
}: MiniChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ y: 0 })
  const [dragDistance, setDragDistance] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle initial prompt when overlay opens
  useEffect(() => {
    if (isOpen && initialPrompt && messages.length === 0) {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: initialPrompt.text,
        timestamp: new Date()
      }
      
      setMessages([userMessage])
      setIsTyping(true)
      
      // Simulate AI response after a delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: generateContextualResponse(initialPrompt.text, metricContext),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
      }, 1500)
    }
  }, [isOpen, initialPrompt, metricContext])

  // Generate contextual response based on prompt and metric
  const generateContextualResponse = (prompt: string, metric?: string): string => {
    // This would be replaced with actual AI integration
    const responses: { [key: string]: string } = {
      "How is my diet progressing?": `Based on your recent diet logs, you're maintaining a balanced intake with an average of 1,850 calories daily. Your protein intake has improved by 15% this week, and you're meeting 80% of your nutritional goals. Consider adding more fiber-rich foods to optimize digestion.`,
      "Suggest healthy meal recipes": `Here are personalized meal suggestions based on your preferences:\n\n• Breakfast: Greek yogurt parfait with berries and granola (320 cal)\n• Lunch: Grilled chicken quinoa bowl with roasted vegetables (450 cal)\n• Dinner: Baked salmon with sweet potato and asparagus (480 cal)\n• Snack: Apple slices with almond butter (180 cal)`,
      "Am I drinking enough water?": `Your current water intake averages 6 glasses (48 oz) daily, which is below the recommended 8 glasses (64 oz). You're most consistent with morning hydration but tend to forget in the afternoon. Try setting hourly reminders between 2-6 PM.`,
      "How is my sleep quality?": `Your sleep quality has improved this week with an average of 7.2 hours per night. Your deep sleep phases have increased by 12%. However, you're experiencing frequent wake-ups around 3 AM. Consider reducing screen time before bed.`
    }
    
    return responses[prompt] || `I'm analyzing your ${metric || 'health'} data to provide personalized insights. Your recent trends show steady progress with room for optimization in specific areas. Would you like detailed recommendations?`
  }


  const handleQuickAction = (prompt: KairaPrompt) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: prompt.text,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: generateContextualResponse(prompt.text, metricContext),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleAskDeeper = () => {
    if (onNavigateToAssistant) {
      onNavigateToAssistant()
    } else {
      router.push('/health-assistant')
    }
    onClose()
  }

  // Drag to dismiss handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    setDragStart({ y: clientY })
    setDragDistance(0)
    
    // Add global event listeners for mouse events
    if ('clientX' in e) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }
  }

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const distance = e.clientY - dragStart.y
    // Only allow downward dragging
    if (distance > 0) {
      setDragDistance(distance)
    }
  }

  const handleGlobalMouseUp = () => {
    handleDragEnd()
    document.removeEventListener('mousemove', handleGlobalMouseMove)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const clientY = e.touches[0].clientY
    const distance = clientY - dragStart.y
    
    // Only allow downward dragging
    if (distance > 0) {
      setDragDistance(distance)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    // If dragged down more than 100px, close the overlay
    if (dragDistance > 100) {
      onClose()
    }
    
    setIsDragging(false)
    setDragDistance(0)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Chat Overlay */}
      <div
        ref={overlayRef}
        className="absolute left-0 right-0 bottom-0 bg-[var(--ds-surface-primary)] rounded-t-2xl shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out"
        style={{ 
          height: '65%',
          transform: isDragging ? `translateY(${dragDistance}px)` : 'translateY(0px)'
        }}
      >
        {/* Drag Handle - Interactive drag area */}
        <div 
          className="flex-shrink-0 flex items-center justify-center py-3 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></div>
        </div>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center p-4 border-b border-[var(--ds-border-default)]">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 100%)' }}
            >
              <span className="material-symbols-outlined text-base text-[var(--ds-text-inverse)]">
                stethoscope
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Ask Kaira</h3>
              <p className="text-xs text-[var(--ds-text-secondary)]">
                {metricContext ? `${metricContext} Insights` : 'Your health assistant'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg max-w-[80%] text-sm">
                  Hi! I'm Kaira, focusing on your {metricContext || 'health'} insights. How can I help you today?
                </div>
              </div>
            ) : (
              messages.map((message, messageIndex) => (
                <div key={message.id}>
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                        message.type === 'user'
                          ? 'text-[var(--ds-text-inverse)]'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      style={message.type === 'user' ? {
                        background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 100%)'
                      } : {}}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Action Prompts - Show after first AI response */}
                  {message.type === 'assistant' && messageIndex === 1 && otherPrompts.length > 0 && (
                    <div className="flex justify-start mt-2">
                      <div className="max-w-[80%] space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {otherPrompts.map((prompt) => (
                            <button
                              key={prompt.id}
                              onClick={() => handleQuickAction(prompt)}
                              className="px-3 py-1.5 bg-[var(--ds-surface-primary)] border border-[var(--app-primary)] text-xs hover:bg-[var(--app-primary)] hover:text-white transition-all duration-200 shadow-sm rounded-full"
                              style={{ 
                                color: 'var(--app-primary)',
                                borderColor: 'var(--app-primary)'
                              }}
                            >
                              {prompt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Go Deeper Call-to-Action */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100">
          <button
            onClick={handleAskDeeper}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[var(--ds-text-inverse)] rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 100%)'
            }}
          >
            <span>Have more questions? Go deeper</span>
            <span className="material-symbols-outlined text-sm">
              arrow_outward
            </span>
          </button>
        </div>
      </div>
    </>
  )
}