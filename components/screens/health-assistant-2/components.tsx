import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// Assessment Choice Component
export const AssessmentChoiceComponent = ({ 
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
    console.log("Option clicked:", option, "isActive:", isActive, "hasAnswered:", hasAnswered)
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
    <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-sm p-3 shadow-lg border border-white/20 max-w-full">
      <div className="text-sm mb-3">{content}</div>
      <div className="space-y-2 mb-3">
        {data.options?.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={!isActive || hasAnswered}
            className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors border ${
              selectedOptions.includes(option)
                ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)] border-[var(--app-primary)]'
                : hasAnswered
                ? 'bg-gray-100 text-gray-400 border-[var(--ds-border-default)] cursor-not-allowed'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-[var(--ds-border-default)] cursor-pointer'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {data.questionType === "multiple-choice" && selectedOptions.length > 0 && !hasAnswered && (
        <button
          onClick={handleSubmitMultiple}
          disabled={!isActive}
          className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--app-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue ({selectedOptions.length} selected)
        </button>
      )}
    </div>
  )
}

// Assessment Input Component
export const AssessmentInputComponent = ({ 
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
    <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-sm p-3 shadow-lg border border-white/20 max-w-full">
      <div className="text-sm mb-3">{content}</div>
      <div className="space-y-3">
        {data.questionType === "text" ? (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isActive || hasAnswered}
            placeholder={data.placeholder}
            className="w-full p-2.5 border border-[var(--ds-border-default)] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] disabled:bg-gray-100 disabled:text-gray-400"
            rows={3}
          />
        ) : (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isActive || hasAnswered}
            placeholder={data.placeholder}
            className="w-full p-2.5 border border-[var(--ds-border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] disabled:bg-gray-100 disabled:text-gray-400"
          />
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!isActive || hasAnswered || !inputValue.trim()}
          className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--app-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// AI Generation Component
export const AIGenerationComponent = () => {
  return (
    <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-sm p-4 shadow-lg border border-white/20 max-w-full">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-primary)]"></div>
        <div>
          <div className="text-sm font-medium mb-1">AI is analyzing your responses...</div>
          <div className="text-xs text-[var(--ds-text-secondary)]">Creating your personalized health plan</div>
        </div>
      </div>
    </div>
  )
}

// Plan Ready Card Component
export const PlanReadyCardComponent = ({ 
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
    console.log("Navigate to plan ready screen", data.assessmentData)
    onNavigateToPlan?.(data)
  }

  return (
    <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-sm p-3 shadow-lg border border-white/20 max-w-full">
      <div className="text-sm mb-3">{content}</div>
      
      {/* Plan Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-lg">✨</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Your Personalized Plan</h3>
            <p className="text-sm text-[var(--ds-text-secondary)] mb-3">{data.planSummary}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[var(--ds-surface-primary)]/80 rounded-lg p-2">
                <div className="font-medium">🍽️ Nutrition</div>
                <div className="text-[var(--ds-text-secondary)]">Custom meal plan</div>
              </div>
              <div className="bg-[var(--ds-surface-primary)]/80 rounded-lg p-2">
                <div className="font-medium">💪 Exercise</div>
                <div className="text-[var(--ds-text-secondary)]">Tailored workouts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Plan Button */}
      <button
        onClick={handleViewPlan}
        className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--app-primary-hover)] transition-colors cursor-pointer"
        type="button"
      >
        <span>View My Complete Plan</span>
        <span>→</span>
      </button>
    </div>
  )
}

// Options List Component
export const OptionsList = ({ options, onOptionClick }: { options: any[]; onOptionClick: (action: string) => void }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((option, index) => (
      <button
        key={index}
        onClick={() => onOptionClick(option.action || option.label || option)}
        className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors border border-[var(--ds-border-default)]"
      >
        <div className="font-medium text-gray-900">{option.label || option}</div>
        {option.description && (
          <div className="text-xs text-[var(--ds-text-secondary)] mt-1">{option.description}</div>
        )}
      </button>
    ))}
  </div>
)

// Slider Widget Component
export const SliderWidget = ({ data }: { data: any }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-900">{data.label}</span>
      <span className="text-sm text-[var(--ds-text-secondary)]">{data.value}{data.unit}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${(data.value / data.max) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-xs text-[var(--ds-text-secondary)] mt-1">
      <span>{data.min}</span>
      <span>{data.max}</span>
    </div>
  </div>
)