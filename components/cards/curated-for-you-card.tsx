"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CuratedContent {
  id: string
  type: "educational" | "video" | "nutrition" | "exercise" | "wellness" | "progress"
  title: string
  ctaText: string
  ctaAction: () => void
  category: string
  image?: string
  imagePosition?: "background" | "top"
}

export function CuratedForYouCard() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const curatedContent: CuratedContent[] = [
    {
      id: "1",
      type: "educational",
      title: "Understanding Diabetes Management",
      ctaText: "Learn More",
      ctaAction: () => console.log("Navigate to educational content"),
      category: "Education",
      image: "/images/liver-health-card.png",
      imagePosition: "top",
    },
    {
      id: "2",
      type: "nutrition",
      title: "Foods That Control Blood Sugar",
      ctaText: "View Recipes",
      ctaAction: () => console.log("Navigate to nutrition content"),
      category: "Nutrition",
      image: "/images/foods-heal-liver-card.png",
      imagePosition: "top",
    },
    {
      id: "3",
      type: "video",
      title: "Gentle Exercise for Weight Loss",
      ctaText: "Watch Now",
      ctaAction: () => console.log("Play video content"),
      category: "Exercise",
      image: "/images/gentle-yoga-card.png",
      imagePosition: "top",
    },
    {
      id: "4",
      type: "wellness",
      title: "Managing Diabetes Stress",
      ctaText: "Try Now",
      ctaAction: () => console.log("Navigate to wellness content"),
      category: "Wellness",
      image: "/images/stress-management-card.png",
      imagePosition: "top",
    },
    {
      id: "5",
      type: "progress",
      title: "Your Weight Loss Progress",
      ctaText: "View Insights",
      ctaAction: () => console.log("Navigate to progress insights"),
      category: "Progress",
      image: "/placeholder.svg?height=64&width=64&text=Progress",
      imagePosition: "top",
    },
  ]

  const visibleCards = 2.2
  const maxIndex = Math.max(0, curatedContent.length - Math.floor(visibleCards))

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const renderCard = (content: CuratedContent) => {
    // All cards now use the same top image layout with app color scheme bottom section
    return (
      <div className="rounded-xl h-44 flex flex-col relative overflow-hidden bg-[var(--ds-surface-primary)] border border-gray-100 shadow-sm">
        <div className="h-24 bg-[var(--ds-surface-primary)] flex items-center justify-center p-2">
          <img src={content.image || "/placeholder.svg"} alt={content.title} className="h-16 w-16 object-contain" />
        </div>
        <div
          className="flex-1 flex flex-col px-2 py-2"
          style={{
            background: `linear-gradient(135deg, var(--app-primary), var(--app-primary-hover))`,
          }}
        >
          <div className="flex-1 flex items-center min-h-0">
            <h3 className="font-medium text-[var(--ds-text-inverse)] text-xs leading-tight line-clamp-2">{content.title}</h3>
          </div>
          <div className="mt-1">
            <Button
              size="sm"
              onClick={content.ctaAction}
              className="w-full font-medium text-xs h-6 bg-[var(--ds-surface-primary)] hover:bg-[var(--ds-surface-secondary)] px-2"
              style={{ color: "var(--app-primary)" }}
            >
              {content.ctaText}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-1.5 border-b border-gray-100">
        <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
            <Icon name="sparkles" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
          </div>
          Recommended For You
        </CardTitle>
      </div>

      <CardContent className="px-4 pt-0 pb-3 relative">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              gap: "0.75rem",
            }}
          >
            {curatedContent.map((content) => (
              <div
                key={content.id}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / visibleCards}% - ${(0.75 * (visibleCards - 1)) / visibleCards}rem)`,
                }}
              >
                {renderCard(content)}
              </div>
            ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-[var(--ds-surface-primary)]/90 shadow-md hover:bg-[var(--ds-surface-primary)] rounded-full w-7 h-7"
          >
            <Icon name="chevronLeft" className="w-3 h-3" />
          </Button>
        )}

        {currentIndex < maxIndex && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-[var(--ds-surface-primary)]/90 shadow-md hover:bg-[var(--ds-surface-primary)] rounded-full w-7 h-7"
          >
            <Icon name="chevronRight" className="w-3 h-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
