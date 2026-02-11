"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'

interface UnifiedMessageSection {
  title: string
  type: string
  items: Array<{
    id: string
    title: string
    subtitle: string
    icon: string
    action: string
    actionType?: string
  }>
}

interface UnifiedMessageProps {
  content?: string
  showRecommendations?: boolean
  recommendationSections?: UnifiedMessageSection[]
  showSuccessCard?: boolean
  successCardData?: {
    icon: any
    title: string
    subtitle: string
    buttonText: string
    buttonIcon: any
    type: string
  }
  showOptions?: boolean
  optionsData?: {
    type: string
    options: Array<{
      id: string
      label: string
      value: string
    }>
  }
  onItemClick?: (item: any) => void
  onOptionSelect?: (option: any, type: string) => void
  onSuccessCardClick?: (type: string) => void
  isActive?: boolean
}

export function UnifiedMessageContainer({
  content,
  showRecommendations = false,
  recommendationSections = [],
  showSuccessCard = false,
  successCardData,
  showOptions = false,
  optionsData,
  onItemClick,
  onOptionSelect,
  onSuccessCardClick,
  isActive = false,
}: UnifiedMessageProps) {
  const [expandedSection, setExpandedSection] = useState<number>(0) // First section expanded by default

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? -1 : index)
  }

  const shortenTitle = (title: string) => {
    const titleMap: { [key: string]: string } = {
      "Understanding Your Liver": "Understanding Liver",
      "Liver Function Basics": "Liver Function",
      "Actibile Treatment Guide": "Actibile Guide",
      "Lab Results Explained": "Lab Results",
      "Foods that Heal Your Liver": "Healing Foods",
      "Gentle Yoga for Liver Health": "Liver Yoga",
      "Stress & Liver Connection": "Stress & Liver",
      "Log Today's Actibile": "Log Actibile",
      "Schedule Next Lab Test": "Schedule Lab",
      "Start Liver-Friendly Diet": "Liver Diet",
      "Set Medication Reminder": "Set Reminder",
      "Managing Symptoms on Semaglutide": "Symptom Guide",
      "Semaglutide Nutrition Guide": "Nutrition Guide",
      "Contact Care Team": "Contact Team",
      "Review Medication Timing": "Med Timing",
      "Set Symptom Tracking": "Track Symptoms",
      "Adjust Meal Planning": "Meal Planning",
      "Quick Sugar Sources": "Quick Sugar",
      "Stabilizing Foods": "Stabilizing",
      "Complex Carbohydrates": "Complex Carbs",
      "Gentle Walking": "Walking",
      "Chair Exercises": "Chair Exercise",
      "Deep Breathing": "Breathing",
      "Bland Foods": "Bland Foods",
      "Ginger-Based Foods": "Ginger Foods",
      "Small Frequent Meals": "Small Meals",
      "Light Stretching": "Stretching",
      "Fresh Air Walk": "Fresh Air",
      "Clear Liquids": "Clear Liquids",
      "BRAT Diet": "BRAT Diet",
      "Rest & Recovery": "Rest",
      "Hydration Focus": "Hydration",
      "Binding Foods": "Binding Foods",
      "Probiotic Foods": "Probiotics",
      "Gentle Movement": "Movement",
      "Steady Blood Sugar Foods": "Steady Sugar",
      "Hydrating Foods": "Hydrating",
      "Balance Exercises": "Balance",
      "Avoid Sudden Movements": "Move Slowly",
      "Protein-Rich Options": "Protein Rich",
      "Balanced Meal Ideas": "Balanced Meals",
      "Blood Sugar Friendly": "Blood Sugar",
      "Indian Breakfast Options": "Indian Options",
      "Mediterranean Style": "Mediterranean",
      "Asian Fusion": "Asian Fusion",
      "Plan Tomorrow's Meals": "Plan Meals",
      "Set Meal Reminders": "Meal Reminders",
      "Generate Grocery List": "Grocery List",
    }
    return titleMap[title] || title
  }

  return (
    <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-md p-3 shadow-lg border border-white/20 max-w-full overflow-hidden">
      {/* Main Content */}
      {content && <div className="text-sm whitespace-pre-line mb-3">{content}</div>}

      {/* Success Card */}
      {showSuccessCard && successCardData && (
        <div className="bg-[var(--ds-surface-primary)]/98 backdrop-blur-sm rounded-lg border border-white/30 p-4 mb-3 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <successCardData.icon className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{successCardData.title}</h3>
              <p className="text-xs text-[var(--ds-text-secondary)] mb-3">{successCardData.subtitle}</p>
              <Button
                variant="outline"
                size="sm"
                className="text-[var(--app-primary)] border-[var(--app-primary)]/30 hover:bg-[var(--app-primary)]/10 hover:border-[var(--app-primary)] transition-colors bg-transparent"
                onClick={() => onSuccessCardClick?.(successCardData.type)}
              >
                <successCardData.buttonIcon className="w-4 h-4 mr-2" />
                {successCardData.buttonText}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Options */}
      {showOptions && optionsData && isActive && (
        <div className="space-y-2 mb-3">
          {optionsData.options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              size="sm"
              className="w-full justify-start bg-[var(--ds-surface-primary)]/98 backdrop-blur-sm text-gray-800 hover:bg-[var(--app-primary)]/10 border-white/30 shadow-sm"
              onClick={() => onOptionSelect?.(option, optionsData.type)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}

      {/* Recommendations Sections */}
      {showRecommendations && recommendationSections.length > 0 && isActive && (
        <div className="space-y-2 max-w-full">
          {recommendationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-[var(--ds-surface-primary)] border border-gray-300 rounded-lg overflow-hidden shadow-md">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-[var(--ds-surface-secondary)] transition-colors"
              >
                <h4 className="text-xs font-medium text-[var(--app-primary)]">{section.title}</h4>
                {expandedSection === sectionIndex ? (
                  <Icon name="chevronDown" className="w-3 h-3 text-[var(--app-primary)]" />
                ) : (
                  <Icon name="chevronRight" className="w-3 h-3 text-[var(--app-primary)]" />
                )}
              </button>

              {/* Section Content */}
              {expandedSection === sectionIndex && (
                <div className="px-3 pb-3">
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <Button
                        key={itemIndex}
                        variant="outline"
                        size="sm"
                        className="w-full h-auto px-3 py-2 flex items-center justify-start gap-2 text-left bg-[var(--ds-surface-primary)] border-gray-300 hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)]/10 transition-colors text-gray-800 hover:text-[var(--app-primary)] rounded-lg shadow-md hover:shadow-lg"
                        onClick={() => onItemClick?.(item)}
                      >
                        <span className="text-sm flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-medium truncate">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-[var(--ds-text-secondary)] truncate mt-0.5">{item.subtitle}</div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
