import React from 'react'

interface ChatAccessibilityWrapperProps {
  children: React.ReactNode
  isActive: boolean
  messagesCount: number
  composerMode: 'idle' | 'recording' | 'transcribing-send' | 'transcribing-stop'
}

export function ChatAccessibilityWrapper({
  children,
  isActive,
  messagesCount,
  composerMode,
}: ChatAccessibilityWrapperProps) {
  const getAriaLabel = () => {
    const base = 'Health assistant chat'
    const messageInfo = messagesCount > 0 ? `, ${messagesCount} messages` : ', no messages yet'
    const statusInfo = composerMode === 'recording' ? ', recording in progress' 
      : composerMode.includes('transcribing') ? ', transcribing audio'
      : ''
    
    return `${base}${messageInfo}${statusInfo}`
  }

  const getAriaLive = () => {
    if (composerMode === 'recording' || composerMode.includes('transcribing')) {
      return 'polite'
    }
    return 'off'
  }

  return (
    <div
      role="region"
      aria-label={getAriaLabel()}
      aria-live={getAriaLive()}
      aria-atomic="false"
      aria-relevant="additions text"
      tabIndex={isActive ? 0 : -1}
      className={`chat-region ${isActive ? 'chat-region--active' : 'chat-region--inactive'}`}
    >
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {composerMode === 'recording' && 'Recording started'}
        {composerMode === 'transcribing-send' && 'Processing your voice message'}
        {composerMode === 'transcribing-stop' && 'Transcription complete'}
      </div>

      {/* Skip link for keyboard users */}
      <a 
        href="#chat-input" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[var(--app-primary)] text-white px-3 py-1 rounded z-50"
      >
        Skip to chat input
      </a>

      {children}
    </div>
  )
}

// Screen reader only utility classes
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .focus\\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: revert;
    margin: revert;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }

  .chat-region--inactive {
    visibility: hidden;
  }
  
  .chat-region--active {
    visibility: visible;
  }
`