"use client"

import React, { useState, useRef } from "react"
import { Icon } from '@/components/ui/icon'

interface UpsellCarouselProps {
  onGoodFlipClick: () => void
}

export function UpsellCarousel({ onGoodFlipClick }: UpsellCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const slides = [
    {
      id: 'goodflip',
      title: 'Enjoy the GoodFlip experience',
      onClick: onGoodFlipClick
    },
    {
      id: 'empty',
      title: '', // Empty card for now
      onClick: undefined
    }
  ]

  const scrollTo = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * index
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
      setCurrentSlide(index)
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft
      const cardWidth = scrollContainerRef.current.clientWidth
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentSlide(newIndex)
    }
  }

  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* GoodFlip Card */}
        <div 
          className="flex-shrink-0 w-full snap-start cursor-pointer"
          onClick={onGoodFlipClick}
        >
          <div 
            className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative border-0 bg-[var(--ds-surface-primary)]"
            style={{ 
              height: '140px',
              background: 'linear-gradient(135deg, #0B4D3C 0%, #0E6B4A 50%, #119E73 100%)',
            }}
          >
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between p-6">
              <div className="flex-1">
                <h3 className="text-[var(--ds-text-inverse)] text-lg font-bold mb-2">
                  Enjoy the GoodFlip experience
                </h3>
                <p className="text-green-100 text-sm opacity-90">
                  Download our comprehensive health app
                </p>
              </div>
              
              {/* Logo with circular white background */}
              <div className="flex-shrink-0 ml-4">
                <div className="bg-[var(--ds-surface-primary)] rounded-full p-4 shadow-sm w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/images/goodflip-care-logo.png" 
                    alt="GoodFlip Care" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--ds-surface-primary)]/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--ds-surface-primary)]/5 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </div>

        {/* Empty Card Placeholder */}
        <div className="flex-shrink-0 w-full snap-start">
          <div className="rounded-2xl shadow-md border-2 border-dashed border-gray-300 bg-gray-50/50 flex items-center justify-center transition-shadow duration-300" style={{ height: '140px' }}>
            <div className="text-center text-gray-400">
              <div className="text-sm font-medium">Coming Soon</div>
              <div className="text-xs mt-1">More features on the way</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {slides.map((slide, index) => (
          <button
            key={`carousel-dot-${slide.id}-${index}`}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index 
                ? 'bg-green-600' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than one slide */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--ds-surface-primary)]/90 shadow-lg flex items-center justify-center transition-opacity ${
              currentSlide === 0 ? 'opacity-50' : 'opacity-80 hover:opacity-100'
            }`}
            style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
          </button>
          
          <button
            onClick={() => scrollTo(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--ds-surface-primary)]/90 shadow-lg flex items-center justify-center transition-opacity ${
              currentSlide === slides.length - 1 ? 'opacity-50' : 'opacity-80 hover:opacity-100'
            }`}
            style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <Icon name="chevronRight" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
          </button>
        </>
      )}
    </div>
  )
}
