"use client"

import React, { useRef } from "react"
import { QuickActionCard, QuickActionCardData } from "@/components/cards/quick-action-card"
import { Icon } from '@/components/ui/icon'

interface QuickActionsSectionProps {
  cards: QuickActionCardData[]
  showScrollHint?: boolean
  onCardClick?: (cardId: string) => void
}

export function QuickActionsSection({ cards, showScrollHint = true, onCardClick }: QuickActionsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = React.useState(false)
  const [showRightArrow, setShowRightArrow] = React.useState(true)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 105 // Width of one card (90px) plus gap (12px) plus buffer
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative">
      {/* Invisible container for natural flow */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide pl-4 pr-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {cards.map((card) => (
          <QuickActionCard 
            key={card.id} 
            data={{
              ...card,
              onClick: () => onCardClick?.(card.id) || card.onClick?.()
            }} 
          />
        ))}
      </div>

      {/* Subtle scroll indicators - only show when needed */}
      {showScrollHint && (
        <>
          {showLeftArrow && (
            <button
              onClick={() => scrollTo('left')}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--ds-surface-primary)]/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-opacity duration-200 hover:bg-[var(--ds-surface-primary)]"
              style={{ zIndex: 10 }}
            >
              <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
          )}
          
          {showRightArrow && (
            <button
              onClick={() => scrollTo('right')}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--ds-surface-primary)]/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-opacity duration-200 hover:bg-[var(--ds-surface-primary)]"
              style={{ zIndex: 10 }}
            >
              <Icon name="chevronRight" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
          )}
        </>
      )}

    </div>
  )
}
