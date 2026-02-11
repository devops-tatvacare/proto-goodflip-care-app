"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface DateOfBirthStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
  userType: 'patient' | 'caregiver' | null
}

export function DateOfBirthStep({ value, onChange, onNext, onBack, isLoading, error, userType }: DateOfBirthStepProps) {
  const [focused, setFocused] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value) {
      onNext()
    }
  }

  const isValid = value !== ''
  const isComplete = value !== ''

  const getDescription = () => {
    if (userType === 'caregiver') {
      return "Enter the patient's date of birth"
    }
    return "This helps us provide age-appropriate care recommendations"
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
        <ProgressIndicator currentStep={6} totalSteps={10} />
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Please tell us your Date of Birth
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {getDescription()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Date of Birth
            </label>
            <div className="relative">
              <Input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={cn(
                  "h-12 rounded-xl text-base transition-all duration-200",
                  focused && "border-2",
                  focused && !error ? "border-[var(--app-primary)]" : "",
                  error ? "border-[var(--status-error)]" : "",
                  isComplete ? "border-[var(--status-success)]" : ""
                )}
                max={new Date().toISOString().split('T')[0]}
              />
              {isComplete && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Icon name="check" className="w-5 h-5 text-[var(--status-success)]" />
                </div>
              )}
            </div>
            {error ? (
              <p className="text-sm mt-2 text-[var(--status-error)]">{error}</p>
            ) : isComplete ? (
              <p className="text-sm mt-2 text-[var(--status-success)]">
                Date selected!
              </p>
            ) : null}
          </div>
        </form>
      </div>

      {/* Fixed Button Area */}
      <div className="p-6 mt-auto" style={{ borderTop: `1px solid var(--border-color)` }}>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={cn(
            "w-full h-12 text-base font-medium rounded-xl transition-all duration-200 mb-3",
            isValid ? "shadow-lg hover:shadow-xl" : ""
          )}
          style={{
            backgroundColor: isValid ? 'var(--app-primary)' : 'var(--border-color)',
            color: isValid ? 'white' : 'var(--text-secondary)'
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