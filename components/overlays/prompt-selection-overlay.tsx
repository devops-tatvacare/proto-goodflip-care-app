"use client"

import { KairaPrompt } from "@/lib/constants/kaira-prompts"

interface PromptSelectionOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSelectPrompt: (prompt: KairaPrompt) => void
  prompts: KairaPrompt[]
  title: string
}

export function PromptSelectionOverlay({
  isOpen,
  onClose,
  onSelectPrompt,
  prompts,
  title
}: PromptSelectionOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Gray Overlay - exactly like FAB expanded state */}
      {isOpen && (
        <div 
          className="absolute pointer-events-auto backdrop-blur-md"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            top: '0px',
            left: '0px',
            right: '0px', 
            bottom: '80px'
          }}
          onClick={onClose}
        />
      )}

      {/* Prompt Actions Container - positioned exactly like FAB container */}
      <div className="absolute right-4 pointer-events-auto" style={{ bottom: '90px' }}>
        {/* Prompt Actions - vertical stack above the FAB, with proper spacing */}
        {isOpen && prompts.length > 0 && (
          <div className="mb-4 space-y-3">
            {prompts.map((prompt, index) => (
              <div
                key={prompt.id}
                className="flex items-center justify-end gap-3 animate-in slide-in-from-bottom-2 fade-in-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: '200ms'
                }}
              >
                {/* Prompt Text - Plain text without container, like FAB labels */}
                <span className="text-sm font-medium text-[var(--ds-text-inverse)] whitespace-nowrap text-right">
                  {prompt.text}
                </span>
                
                {/* Prompt Button - styled exactly like FAB action buttons */}
                <button
                  onClick={() => onSelectPrompt(prompt)}
                  className="w-12 h-12 bg-[var(--ds-surface-primary)] rounded-full shadow-lg border border-[var(--ds-border-default)] flex items-center justify-center hover:bg-[var(--ds-surface-secondary)] transition-all duration-200 hover:scale-105"
                >
                  <span className="material-symbols-outlined text-lg text-gray-700">
                    {prompt.icon || 'chat'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Invisible placeholder to maintain the same structure as FAB */}
        {/* This ensures the prompts are positioned correctly relative to where the FAB button would be */}
        <div className="h-10 w-full" />
      </div>
    </div>
  )
}