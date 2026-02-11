// Elegant Message Bubble Components - consistent design across all message types
// Clean, modern, visually appealing chat bubbles

import React from "react"

interface UserMessageBubbleProps {
  content: string
}

export const UserMessageBubble: React.FC<UserMessageBubbleProps> = ({ content }) => (
  <div className="bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded-lg max-w-[80%]">
    <p className="text-sm">{content}</p>
  </div>
)

interface AIMessageBubbleProps {
  children: React.ReactNode
  variant?: 'default' | 'interactive' | 'success' | 'body-selector'
}

export const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  // Body selector cards need more width for better visualization
  const maxWidth = variant === 'body-selector' ? 'max-w-[95%]' : 'max-w-[85%]'
  const padding = variant === 'body-selector' ? 'px-4 py-4' : 'px-3 py-2'
  
  return (
    <div 
      className={`bg-[var(--ds-surface-primary)] text-gray-800 rounded-lg ${padding} ${maxWidth} relative overflow-hidden shadow-sm`}
      style={{
        border: '1px solid',
        borderImageSource: 'linear-gradient(135deg, var(--gradient-purple-light) 0%, var(--gradient-pink-light) 50%, var(--gradient-blue-light) 100%)',
        borderImageSlice: 1
      }}
    >
      {children}
    </div>
  )
}

interface MessageQuestionProps {
  question: string
}

export const MessageQuestion: React.FC<MessageQuestionProps> = ({ question }) => (
  <div className="text-sm text-gray-800 mb-2">
    {question}
  </div>
)

interface MessageOptionsProps {
  options: Array<{
    id: string
    label: string
    value: string
    hasDatePicker?: boolean
  }>
  onSelect: (value: string, hasDatePicker?: boolean) => void
}

export const MessageOptions: React.FC<MessageOptionsProps> = ({ options, onSelect }) => (
  <div className="space-y-2">
    {options.map((option, index) => (
      <button
        key={index}
        onClick={() => onSelect(option.value, option.hasDatePicker)}
        className="w-full text-left px-3 py-2 rounded border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50 text-sm text-gray-700 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <span>{option.label}</span>
          {option.hasDatePicker && (
            <span className="text-xs text-gray-400">📅</span>
          )}
        </div>
      </button>
    ))}
  </div>
)

interface MessageSliderProps {
  min: number
  max: number
  value: number
  unit: string
  onChange: (value: number) => void
  onSubmit: (value: number) => void
}

export const MessageSlider: React.FC<MessageSliderProps> = ({ 
  min, 
  max, 
  value, 
  unit, 
  onChange, 
  onSubmit 
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--ds-text-secondary)]">0 {unit}</span>
      <span className="px-2 py-1 bg-[var(--app-primary)] text-[var(--ds-text-inverse)] rounded text-xs">
        {value} {unit}
      </span>
      <span className="text-[var(--ds-text-secondary)]">{max} {unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
    <button
      onClick={() => onSubmit(value)}
      className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded text-sm"
    >
      Log {value} {unit}
    </button>
  </div>
)

interface MessageDatePickerProps {
  onSelect: (date: string) => void
}

export const MessageDatePicker: React.FC<MessageDatePickerProps> = ({ onSelect }) => (
  <div className="mt-2 p-3 bg-gray-50 rounded border">
    <div className="text-sm text-gray-700 mb-2">📅 Select a date:</div>
    <input
      type="date"
      onChange={(e) => onSelect(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[var(--app-primary)]"
      max={new Date().toISOString().split('T')[0]}
    />
  </div>
)

interface MessageTextInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export const MessageTextInput: React.FC<MessageTextInputProps> = ({ 
  placeholder, 
  value, 
  onChange, 
  onSubmit 
}) => (
  <div className="mt-2 space-y-2">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[var(--app-primary)] focus:outline-none resize-none"
      rows={3}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          onSubmit()
        }
      }}
    />
    <button
      onClick={onSubmit}
      disabled={!value.trim()}
      className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continue
    </button>
  </div>
)

interface SuggestionChip {
  id: string
  label: string
  icon?: string
  action: string
}

interface SuggestionChipsProps {
  suggestions: SuggestionChip[]
  onChipClick: (action: string) => void
  className?: string
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ 
  suggestions, 
  onChipClick, 
  className = "" 
}) => {
  if (!suggestions.length) return null

  return (
    <div className={`flex flex-wrap gap-1.5 mt-2 ${className}`}>
      {suggestions.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onChipClick(chip.action)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'var(--chip-bg-primary)',
            color: 'var(--chip-text-primary)',
            border: '1px solid var(--chip-border-primary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--app-primary)'
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.borderColor = 'var(--app-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--chip-bg-primary)'
            e.currentTarget.style.color = 'var(--chip-text-primary)'
            e.currentTarget.style.borderColor = 'var(--chip-border-primary)'
          }}
        >
          {chip.icon && <span className="text-xs">{chip.icon}</span>}
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  )
}