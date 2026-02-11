// Quick Action Flow UI Components - smart, reusable
// Clean separation of UI logic from business logic

import React, { useState } from "react"
import { FlowStep } from "./quick-actions-flows-data"
import { AIMessageBubble, MessageQuestion, MessageOptions, MessageSlider, MessageDatePicker, MessageTextInput } from "./message-bubble-components"
import { BodyAreaSelector, SymptomSlider } from "./symptom-components"
import { getSymptomByName } from "./symptom-data"
import { MaterialIcon } from "@/components/ui/material-icon"

// Helper function to extract symptom ID for body area selector
const extractSymptomId = (step: FlowStep): string => {
  // Extract symptom ID from step question or use a default mapping
  const question = step.question.toLowerCase()
  if (question.includes('abdominal') || question.includes('abdomen')) return 'abdominal-pain'
  if (question.includes('headache') || question.includes('head')) return 'headache'
  if (question.includes('heartburn') || question.includes('chest')) return 'heartburn'
  if (question.includes('injection site')) return 'injection-site'
  return 'abdominal-pain' // default
}

// Smart icon mapping based on question type and content
const getQuestionTypeIcon = (step: FlowStep): { icon: string; title: string } => {
  const question = step.question.toLowerCase()
  const stepId = step.id.toLowerCase()
  
  // Map based on step ID for consistency
  if (stepId.includes('onset') || stepId.includes('timing') || stepId.includes('frequency')) {
    return { icon: 'schedule', title: getQuestionTitle(step.question, 'Timeline') }
  }
  if (stepId.includes('trigger') || stepId.includes('cause')) {
    return { icon: 'bolt', title: getQuestionTitle(step.question, 'Triggers') }
  }
  if (stepId.includes('intensity') || stepId.includes('severity') || stepId.includes('rating')) {
    return { icon: 'analytics', title: getQuestionTitle(step.question, 'Assessment') }
  }
  if (stepId.includes('impact') || stepId.includes('function')) {
    return { icon: 'adjust', title: getQuestionTitle(step.question, 'Impact') }
  }
  if (stepId.includes('location') || stepId.includes('body') || stepId.includes('area')) {
    return { icon: 'place', title: getQuestionTitle(step.question, 'Location') }
  }
  if (stepId.includes('intervention') || stepId.includes('treatment') || stepId.includes('management')) {
    return { icon: 'medication', title: getQuestionTitle(step.question, 'Management') }
  }
  if (stepId.includes('symptom') && stepId.includes('selection')) {
    return { icon: 'health_and_safety', title: getQuestionTitle(step.question, 'Symptoms') }
  }
  
  // Default fallback
  return { icon: 'help_outline', title: getQuestionTitle(step.question, 'Question') }
}

// Extract meaningful title from question text
const getQuestionTitle = (question: string, fallback: string): string => {
  // Look for titles like "Frequency Pattern:", "Symptom Triggers:", etc.
  const titleMatch = question.match(/^([^:]+):/);
  if (titleMatch) {
    return titleMatch[1].trim()
  }
  
  // Look for key phrases to create titles
  const lowerQuestion = question.toLowerCase()
  if (lowerQuestion.includes('frequency') || lowerQuestion.includes('often')) return 'Frequency Pattern'
  if (lowerQuestion.includes('trigger') || lowerQuestion.includes('cause')) return 'Symptom Triggers'
  if (lowerQuestion.includes('severity') || lowerQuestion.includes('intensity') || lowerQuestion.includes('rate')) return 'Severity Assessment'
  if (lowerQuestion.includes('impact') || lowerQuestion.includes('affect') || lowerQuestion.includes('activities')) return 'Functional Impact'
  if (lowerQuestion.includes('location') || lowerQuestion.includes('where') || lowerQuestion.includes('area')) return 'Anatomical Location'
  if (lowerQuestion.includes('intervention') || lowerQuestion.includes('tried') || lowerQuestion.includes('treatment')) return 'Self-Management'
  if (lowerQuestion.includes('onset') || lowerQuestion.includes('when') || lowerQuestion.includes('begin')) return 'Symptom Timeline'
  if (lowerQuestion.includes('symptom') && lowerQuestion.includes('select')) return 'Symptom Identification'
  
  return fallback
}

// Clean question text by removing redundant parts already shown in header
const getCleanQuestionText = (question: string, title: string): string => {
  // First, remove any title prefix that matches the header (e.g., "Severity Assessment: Rate...")
  let cleanQuestion = question
  
  // Remove exact title match at start
  const titleRegex = new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*`, 'i')
  cleanQuestion = cleanQuestion.replace(titleRegex, '')
  
  // Remove any colon-prefixed title at the start
  cleanQuestion = cleanQuestion.replace(/^([^:]+):\s*/, '')
  
  // Additional specific cleaning based on context
  const lowerTitle = title.toLowerCase()
  const lowerQuestion = cleanQuestion.toLowerCase()
  
  if (lowerTitle.includes('severity') || lowerTitle.includes('assessment')) {
    // For severity questions, keep only the core instruction
    cleanQuestion = cleanQuestion.replace(/^(severity assessment|rate your symptom intensity on a validated clinical scale)[\s:]*/i, 'Rate your symptom intensity on a clinical scale').trim()
  } else if (lowerTitle.includes('impact') || lowerTitle.includes('functional')) {
    // For impact questions, ensure proper capitalization
    cleanQuestion = cleanQuestion.replace(/^(functional impact|how is this symptom affecting)/i, 'How is this symptom affecting').trim()
  } else if (lowerTitle.includes('location') || lowerTitle.includes('anatomical')) {
    cleanQuestion = cleanQuestion.replace(/^(anatomical localization|please indicate)/i, 'Please indicate').trim()
  } else if (lowerTitle.includes('management') || lowerTitle.includes('intervention')) {
    cleanQuestion = cleanQuestion.replace(/^(self-management|have you tried)/i, 'Have you tried').trim()
  }
  
  // Ensure the question starts with a capital letter
  if (cleanQuestion.length > 0) {
    cleanQuestion = cleanQuestion.charAt(0).toUpperCase() + cleanQuestion.slice(1)
  }
  
  return cleanQuestion || question // Fallback to original if cleaning resulted in empty string
}

interface FlowStepComponentProps {
  step: FlowStep
  onAnswer: (stepId: string, answer: any) => void
  isActive: boolean
}

export const FlowStepComponent: React.FC<FlowStepComponentProps> = ({
  step,
  onAnswer,
  isActive
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [textInput, setTextInput] = useState<string>("")
  const [sliderValue, setSliderValue] = useState<number>(step.min || 0)
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>("")

  if (!isActive) return null

  const handleOptionSelect = (optionValue: string, hasDatePicker?: boolean) => {
    if (hasDatePicker) {
      setShowDatePicker(true)
      setSelectedOption(optionValue)
    } else {
      setSelectedOption(optionValue)
      onAnswer(step.id, optionValue)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setShowDatePicker(false)
    // Format date for display
    const displayDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    onAnswer(step.id, displayDate)
  }

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onAnswer(step.id, textInput.trim())
    }
  }

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    onAnswer(step.id, value)
  }

  const { icon, title } = getQuestionTypeIcon(step)
  const cleanQuestion = getCleanQuestionText(step.question, title)
  
  return (
    <div className="bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-sm overflow-hidden max-w-[85%]">
      {/* Enhanced Card Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center flex-shrink-0">
            <MaterialIcon icon={icon} variant="round" size={12} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--card-header-text)] truncate">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4">
        <div className="text-sm font-semibold text-gray-800 leading-relaxed mb-4">
          {cleanQuestion}
        </div>
        
        {/* Options/Controls Container */}
        <div className="bg-gray-50 border border-[var(--ds-border-default)] rounded-lg p-3">
          {(step.type === 'list' || step.type === 'options-with-inline-datepicker') && (
            <>
              <MessageOptions 
                options={step.options || []} 
                onSelect={handleOptionSelect} 
              />
              {showDatePicker && (
                <div className="mt-3 pt-3 border-t border-[var(--ds-border-default)]">
                  <MessageDatePicker onSelect={handleDateSelect} />
                </div>
              )}
            </>
          )}

          {step.type === 'text' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">💬 Use the chat input box below to type your response</p>
            </div>
          )}

          {step.type === 'slider' && (
            <MessageSlider
              min={step.min || 0}
              max={step.max || 24}
              value={sliderValue}
              unit={step.unit || 'hours'}
              onChange={setSliderValue}
              onSubmit={handleSliderChange}
            />
          )}
        </div>

        {/* Body Area Selector - Full Width */}
        {step.type === 'body-area-selector' && (
          <div className="mt-4">
            <BodyAreaSelector
              symptomId={extractSymptomId(step)}
              onSelect={(location) => onAnswer(step.id, location)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface SuccessCardProps {
  title: string
  details: string
  onViewInsights?: () => void
}

export const SuccessCard: React.FC<SuccessCardProps> = ({
  title,
  details,
  onViewInsights
}) => {
  // Extract only essential values - symptom, severity, frequency
  const extractEssentialValues = (details: string) => {
    const values: { [key: string]: string } = {}
    
    // Look for specific patterns in the details
    const lines = details.split('\n')
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.includes('Primary Symptom:') || trimmed.includes('• Primary Symptom:')) {
        values.Symptom = trimmed.replace(/.*Primary Symptom:\s*/, '').trim()
      } else if (trimmed.includes('Severity:') || trimmed.includes('• Severity:')) {
        values.Severity = trimmed.replace(/.*Severity:\s*/, '').replace(/\/10.*/, '/10').trim()
      } else if (trimmed.includes('Frequency:') || trimmed.includes('• Frequency:')) {
        values.Frequency = trimmed.replace(/.*Frequency:\s*/, '').trim()
      }
    })
    
    return values
  }
  
  const essentialValues = extractEssentialValues(details)
  
  return (
    <div className="bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-sm w-full max-w-[85%] p-4">
      {/* Success Header with Icon */}
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-[var(--ds-status-success)] flex items-center justify-center mr-3">
          <svg 
            className="w-4 h-4 text-[var(--ds-text-inverse)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <div className="text-sm font-semibold text-gray-800">
          Successfully Logged
        </div>
      </div>
        
      {/* Essential Values */}
      {Object.keys(essentialValues).length > 0 && (
        <div className="text-xs text-gray-700 space-y-1 mb-4">
          {Object.entries(essentialValues).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span> 
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* View More Button */}
      {onViewInsights && (
        <button
          onClick={onViewInsights}
          className="w-full bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] px-4 py-2 rounded-lg text-xs font-medium transition-colors duration-200"
        >
          View More
        </button>
      )}
    </div>
  )
}