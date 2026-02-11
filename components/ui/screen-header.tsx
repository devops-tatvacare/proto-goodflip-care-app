"use client"

import type React from "react"
import { Icon } from '@/components/ui/icon'

interface ScreenHeaderProps {
  title?: string
  onBack?: () => void
  rightElement?: React.ReactNode
  hidden?: boolean
}

export function ScreenHeader({ title, onBack, rightElement, hidden }: ScreenHeaderProps) {
  if (hidden) {
    return null
  }

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Screen header back button clicked")
    if (onBack) {
      onBack()
    }
  }

  return (
    <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-4 py-4 flex-shrink-0">
      <div className="flex items-center justify-between relative">
        {onBack && (
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--bg-secondary)] transition-colors z-10"
            aria-label="Go back"
          >
            <Icon name="arrowLeft" className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{title || ''}</h1>
        </div>

        {rightElement && (
          <div className="ml-auto z-10">
            {console.log("Right element received:", rightElement)}
            {rightElement}
          </div>
        )}
        {!rightElement && console.log("No right element provided for title:", title)}
      </div>
    </div>
  )
}
