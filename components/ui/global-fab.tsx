"use client"

import { useFAB } from '@/contexts/fab-context'

export function GlobalFAB() {
  const { 
    isExpanded, 
    setIsExpanded, 
    isPromptSelectionOpen, 
    setIsPromptSelectionOpen, 
    previousState, 
    setPreviousState,
    actions 
  } = useFAB()

  // Get regular actions (excluding Ask Kaira and hidden actions)
  const regularActions = actions.filter(a => !a.isSpecial && !a.hidden)
  const askKairaAction = actions.find(a => a.isSpecial)
  
  // Don't render if no Ask Kaira action is available OR if Ask Kaira is hidden
  if (!askKairaAction || askKairaAction.hidden) return null

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleActionClick = (action: any) => {
    action.onClick()
    setIsExpanded(false)
  }

  const handleAskKairaClick = () => {
    // Remember current state before opening prompts
    setPreviousState(isExpanded ? 'expanded' : 'default')
    // Close any expanded actions
    setIsExpanded(false)
    // Open prompt selection
    if (askKairaAction) {
      askKairaAction.onClick()
    }
  }

  const handleBackClick = () => {
    // Close prompts
    setIsPromptSelectionOpen(false)
    // Restore previous state
    if (previousState === 'expanded') {
      setIsExpanded(true)
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Gray Overlay - covers entire content area from status bar to menu bar with blur */}
      {isExpanded && (
        <div 
          className="absolute pointer-events-auto backdrop-blur-md"
          style={{
            background: 'var(--black-alpha-80)',
            top: '0px', // Start from top of content area (status bar handled by mobile frame)
            left: '0px',
            right: '0px', 
            bottom: '80px' // End with proper spacing above bottom navigation
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* FAB Container - positioned with proper spacing above bottom navigation */}
      <div className="absolute right-4 pointer-events-auto" style={{ bottom: '90px' }}>
        {/* Expanded Actions - vertical stack above the main buttons */}
        {isExpanded && regularActions.length > 0 && (
          <div className="mb-4 space-y-3">
            {regularActions.map((action, index) => (
              <div
                key={action.id}
                className="flex items-center justify-end gap-3 animate-in slide-in-from-bottom-2 fade-in-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: '200ms'
                }}
              >
                {/* Action Label - Plain text without container */}
                <span className="text-sm font-medium text-[var(--ds-text-inverse)] whitespace-nowrap">
                  {action.label}
                </span>
                
                {/* Action Button */}
                <button
                  onClick={() => handleActionClick(action)}
                  className="w-12 h-12 bg-[var(--ds-surface-primary)] rounded-full shadow-lg border border-[var(--ds-border-default)] flex items-center justify-center hover:bg-[var(--ds-surface-secondary)] transition-all duration-200 hover:scale-105"
                >
                  <span className="material-symbols-outlined text-lg text-[var(--ds-text-primary)]">
                    {action.icon}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB - Simple clean transition */}
        {isPromptSelectionOpen ? (
          /* Collapsed Back Button - Simple and clean */
          <button
            onClick={handleBackClick}
            className="w-10 h-10 bg-[var(--app-primary)] rounded-full shadow-lg flex items-center justify-center text-[var(--ds-text-inverse)] hover:scale-105 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
          </button>
        ) : (
          /* Full FAB - Simple transition */
          <div className="flex items-center bg-[var(--app-primary)] rounded-full shadow-lg overflow-hidden">
            {/* Ask Kaira Section */}
            <button
              onClick={handleAskKairaClick}
              className="h-10 px-3 text-[var(--ds-text-inverse)] flex items-center gap-1.5 hover:bg-[var(--app-primary-hover)] transition-all duration-200"
            >
              <span className="material-symbols-outlined text-base">
                {askKairaAction.icon}
              </span>
              <span className="text-sm font-medium">
                {askKairaAction.label}
              </span>
            </button>
            
            {/* Divider */}
            <div className="w-px h-5 bg-[var(--ds-border-light)]" />
            
            {/* Chevron Button */}
            <button
              onClick={handleToggleExpand}
              className="h-10 px-2.5 text-[var(--ds-text-inverse)] flex items-center justify-center hover:bg-[var(--app-primary-hover)] transition-all duration-200"
            >
              <span 
                className={`material-symbols-outlined text-lg transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              >
                keyboard_arrow_up
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}