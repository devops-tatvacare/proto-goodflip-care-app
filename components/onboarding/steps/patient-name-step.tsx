"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface PatientNameStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
  userType: 'patient' | 'caregiver' | null
}

export function PatientNameStep({ value, onChange, onNext, onBack, isLoading, error, userType }: PatientNameStepProps) {
  const [focused, setFocused] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onNext()
    }
  }

  const isValid = value.trim().length > 0
  const isComplete = value.trim().length >= 2

  const getDescription = () => {
    if (userType === 'caregiver') {
      return "Enter the name of the person you're caring for"
    }
    return "Enter your full name as it appears on your ID"
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Simple Header */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src="/images/goodflip-care-logo.png" 
            alt="GoodFlip Care" 
            className="h-8 w-8 object-contain" 
          />
          <h1 className="text-base font-semibold text-[var(--app-primary)]">
            GoodFlip Care
          </h1>
        </div>
        <ProgressIndicator currentStep={4} totalSteps={10} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-1 text-[var(--text-primary)]">
            Please tell us your Name
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {getDescription()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Full Name
            </label>
            <div className="relative">
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter your full name"
                className={cn(
                  "h-10 rounded-lg transition-all",
                  focused && !error ? "border-[var(--app-primary)]" : "border-[var(--border-color)]",
                  error ? "border-[var(--status-error)]" : "",
                  isComplete ? "border-[var(--status-success)]" : ""
                )}
              />
              {isComplete && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Icon name="check" className="w-4 h-4 text-[var(--status-success)]" />
                </div>
              )}
            </div>
            {error ? (
              <p className="text-xs mt-1 text-[var(--status-error)]">{error}</p>
            ) : value.length > 0 && value.length < 2 ? (
              <p className="text-xs mt-1 text-[var(--text-secondary)]">
                Please enter your full name
              </p>
            ) : isComplete ? (
              <p className="text-xs mt-1 text-[var(--status-success)]">
                Looks good!
              </p>
            ) : null}
          </div>
        </form>
        
        {/* Buttons */}
        <div className="mt-6 space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={cn(
              "w-full h-9 text-sm font-medium rounded-lg transition-all",
              isValid ? "shadow-sm hover:shadow" : ""
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
            className="w-full h-8 text-sm rounded-lg"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            Back
          </Button>
        </div>
      </div>

      {/* Browser Bar */}
      <div className="p-3 bg-[var(--bg-secondary)]">
        <div className="bg-[var(--ds-surface-primary)] rounded-full px-3 py-1.5 flex items-center justify-center border border-[var(--border-color)]">
          <span className="text-xs flex items-center text-[var(--text-muted)]">
            🔍 <span className="mx-2">goodflip.com</span> 🔒
          </span>
        </div>
      </div>
    </div>
  )
}
