"use client"

import { useEffect, useState } from "react"
import { Icon } from '@/components/ui/icon'

interface AIGenerationScreenProps {
  onComplete: () => void
}

export function AIGenerationScreen({ onComplete }: AIGenerationScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Analyzing your health profile...",
    "Processing dietary preferences...",
    "Creating exercise recommendations...",
    "Finalizing your personalized plan...",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 60) // Complete in 3 seconds (100 / 2 = 50 intervals * 60ms = 3000ms)

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 750) // Change step every 750ms

    return () => {
      clearInterval(timer)
      clearInterval(stepTimer)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header Only - No back button for automatic flow */}
      <div className="flex items-center justify-center py-4 px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--card-header-text)]">
            Generating Your Plan
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mt-1">AI-powered personalization</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-8">
        <div className="text-center max-w-sm">
          {/* Animated AI Icon */}
          <div className="relative mb-8">
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse"
              style={{ backgroundColor: "var(--icon-bg-primary)" }}
            >
              <Icon name="brain" className="w-12 h-12" style={{ color: "var(--app-primary)" }} />
            </div>

            {/* Floating Icons */}
            <div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--ds-surface-primary)] shadow-lg animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <Icon name="sparkles" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            </div>
            <div
              className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--ds-surface-primary)] shadow-lg animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              <Icon name="restaurant" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            </div>
            <div
              className="absolute top-1/2 -right-4 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--ds-surface-primary)] shadow-lg animate-bounce"
              style={{ animationDelay: "1.5s" }}
            >
              <Icon name="fitnessCenter" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            </div>
          </div>

          {/* Progress Text */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">Creating Your Plan</h2>
          <p className="text-sm text-[var(--ds-text-secondary)] mb-6">
            Our AI is analyzing your responses to create the perfect plan for you
          </p>

          {/* Current Step */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-800 mb-2">{steps[currentStep]}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="h-3 rounded-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: "var(--app-primary)",
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Progress Percentage */}
          <p className="text-sm text-[var(--ds-text-secondary)]">{Math.round(progress)}% Complete</p>
        </div>
        </div>
      </div>
    </div>
  )
}
