"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface DoctorDetailsStepProps {
  value: {
    name: string
    hospitalName: string
    contactNumber: string
  }
  onChange: (value: { name: string; hospitalName: string; contactNumber: string }) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export function DoctorDetailsStep({ value, onChange, onNext, onBack, isLoading, error }: DoctorDetailsStepProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.name && value.hospitalName && value.contactNumber) {
      onNext()
    }
  }

  const handleChange = (field: string, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    })
  }

  const isValid = value.name && value.hospitalName && value.contactNumber
  const isFieldComplete = (field: string) => {
    if (field === 'name') return value.name.length >= 2
    if (field === 'hospitalName') return value.hospitalName.length >= 2
    if (field === 'contactNumber') return value.contactNumber.length >= 10
    return false
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
        <ProgressIndicator currentStep={7} totalSteps={10} />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Please provide your Doctor details
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            This helps us coordinate your care with your healthcare provider
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Doctor's Name
            </label>
            <div className="relative">
              <Input
                type="text"
                value={value.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Dr. John Smith"
                className={cn(
                  "h-12 rounded-xl text-base transition-all duration-200",
                  focusedField === 'name' && "border-2",
                  focusedField === 'name' && !error ? "border-[var(--app-primary)]" : "",
                  error ? "border-[var(--status-error)]" : "",
                  isFieldComplete('name') ? "border-[var(--status-success)]" : ""
                )}
              />
              {isFieldComplete('name') && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Icon name="check" className="w-5 h-5 text-[var(--status-success)]" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Hospital/Clinic Name
            </label>
            <div className="relative">
              <Input
                type="text"
                value={value.hospitalName}
                onChange={(e) => handleChange('hospitalName', e.target.value)}
                onFocus={() => setFocusedField('hospitalName')}
                onBlur={() => setFocusedField(null)}
                placeholder="City Medical Center"
                className={cn(
                  "h-12 rounded-xl text-base transition-all duration-200",
                  focusedField === 'hospitalName' && "border-2",
                  focusedField === 'hospitalName' && !error ? "border-[var(--app-primary)]" : "",
                  error ? "border-[var(--status-error)]" : "",
                  isFieldComplete('hospitalName') ? "border-[var(--status-success)]" : ""
                )}
              />
              {isFieldComplete('hospitalName') && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Icon name="check" className="w-5 h-5 text-[var(--status-success)]" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Contact Number
            </label>
            <div className="relative">
              <Input
                type="tel"
                value={value.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value.replace(/\D/g, "").slice(0, 10))}
                onFocus={() => setFocusedField('contactNumber')}
                onBlur={() => setFocusedField(null)}
                placeholder="9876543210"
                className={cn(
                  "h-12 rounded-xl text-base transition-all duration-200",
                  focusedField === 'contactNumber' && "border-2",
                  focusedField === 'contactNumber' && !error ? "border-[var(--app-primary)]" : "",
                  error ? "border-[var(--status-error)]" : "",
                  isFieldComplete('contactNumber') ? "border-[var(--status-success)]" : ""
                )}
                maxLength={10}
              />
              {isFieldComplete('contactNumber') && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Icon name="check" className="w-5 h-5 text-[var(--status-success)]" />
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}
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