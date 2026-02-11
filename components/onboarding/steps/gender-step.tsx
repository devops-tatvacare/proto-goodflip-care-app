"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { cn } from "@/lib/utils"

interface GenderStepProps {
  value: 'male' | 'female' | 'other' | null
  onChange: (value: 'male' | 'female' | 'other') => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  userType: 'patient' | 'caregiver' | null
}

export function GenderStep({ value, onChange, onNext, onBack, isLoading, userType }: GenderStepProps) {
  const handleSubmit = () => {
    if (value) {
      onNext()
    }
  }

  const getDescription = () => {
    if (userType === 'caregiver') {
      return "Select the patient's gender"
    }
    return "This helps us provide personalized care recommendations"
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Clean Header with Logo */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-col items-center mb-4">
          <img 
            src="/images/goodflip-care-logo.png" 
            alt="GoodFlip Care" 
            className="h-12 w-12 object-contain mb-2" 
          />
          <h1 className="text-xl font-bold text-[var(--app-primary)]">
            GoodFlip Care
          </h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 pb-4">
        <ProgressIndicator currentStep={5} totalSteps={10} />
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Please tell us your Gender
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {getDescription()}
          </p>
        </div>

        <div className="space-y-4">
          {[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value as 'male' | 'female' | 'other')}
              className="w-full p-4 rounded-xl border-2 transition-all text-left"
              style={{
                borderColor: value === option.value ? 'var(--app-primary)' : 'var(--border-color)',
                backgroundColor: value === option.value ? 'var(--bg-secondary)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.borderColor = 'var(--app-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--text-primary)]">{option.label}</span>
                {value === option.value && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--app-primary)' }}>
                    <div className="w-2 h-2 rounded-full bg-[var(--ds-surface-primary)]" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Button Area */}
      <div className="p-6 mt-auto" style={{ borderTop: `1px solid var(--border-color)` }}>
        <Button
          onClick={handleSubmit}
          disabled={!value || isLoading}
          className={cn(
            "w-full h-12 text-base font-medium rounded-xl transition-all duration-200 mb-3",
            value ? "shadow-lg hover:shadow-xl" : ""
          )}
          style={{
            backgroundColor: value ? 'var(--app-primary)' : 'var(--border-color)',
            color: value ? 'white' : 'var(--text-secondary)'
          }}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 text-base font-medium rounded-xl"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          Back
        </Button>
      </div>

      {/* Browser Bar */}
      <div className="p-4 bg-[var(--bg-secondary)]">
        <div className="bg-[var(--ds-surface-primary)] rounded-full px-4 py-2 flex items-center justify-center border border-[var(--border-color)]">
          <span className="text-xs flex items-center text-[var(--text-muted)]">
            🔍 <span className="mx-2">goodflip.com</span> 🔒
          </span>
        </div>
      </div>
    </div>
  )
}