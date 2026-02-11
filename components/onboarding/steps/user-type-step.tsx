"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { Icon } from '@/components/ui/icon'

interface UserTypeStepProps {
  value: 'patient' | 'caregiver' | null
  onChange: (value: 'patient' | 'caregiver') => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
}

export function UserTypeStep({ value, onChange, onNext, onBack, isLoading }: UserTypeStepProps) {
  const handleSubmit = () => {
    if (value) {
      onNext()
    }
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
        <ProgressIndicator currentStep={3} totalSteps={10} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-1 text-[var(--text-primary)]">
            Who are you?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Select your role to personalize your experience
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onChange('patient')}
            className={`w-full p-6 rounded-lg border-2 transition-all ${
              value === 'patient'
                ? 'border-[var(--app-primary)] bg-[var(--bg-secondary)]'
                : 'border-[var(--border-color)] hover:border-[var(--app-primary)]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                value === 'patient' ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)]' : 'bg-[var(--bg-secondary)]'
              }`}>
                <Icon name="person" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[var(--text-primary)]">I'm a Patient</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  I'm managing my own health condition
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onChange('caregiver')}
            className={`w-full p-6 rounded-lg border-2 transition-all ${
              value === 'caregiver'
                ? 'border-[var(--app-primary)] bg-[var(--bg-secondary)]'
                : 'border-[var(--border-color)] hover:border-[var(--app-primary)]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                value === 'caregiver' ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)]' : 'bg-[var(--bg-secondary)]'
              }`}>
                <Icon name="group" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[var(--text-primary)]">I'm a Caregiver</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  I'm helping someone else manage their health
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={!value || isLoading}
            className="w-full h-9 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
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
