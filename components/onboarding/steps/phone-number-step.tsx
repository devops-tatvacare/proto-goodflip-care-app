"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface PhoneNumberStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  isLoading?: boolean
  error?: string
}

export function PhoneNumberStep({ value, onChange, onNext, isLoading, error }: PhoneNumberStepProps) {
  const [agreed, setAgreed] = useState(false)
  const [focused, setFocused] = useState(false)

  const formatPhoneNumber = (input: string): string => {
    const digits = input.replace(/\D/g, "").slice(0, 10)
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else if (digits.length > 0) {
      return `(${digits}`
    }
    return digits
  }

  const getDigitsOnly = (input: string): string => {
    return input.replace(/\D/g, "")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const digitsOnly = getDigitsOnly(rawValue)
    onChange(digitsOnly)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const digits = getDigitsOnly(value)
    if (digits.length >= 8 && agreed) {
      onNext()
    }
  }

  const digits = getDigitsOnly(value)
  const formattedValue = formatPhoneNumber(value)
  const isValid = digits.length >= 8 && digits.length <= 11 && agreed
  const isComplete = digits.length === 10

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
        <ProgressIndicator currentStep={1} totalSteps={10} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-1 text-[var(--text-primary)]">
            Enter your phone number
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We'll send you a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Phone Number
            </label>
            <div className="relative">
              <div className="flex">
                <div 
                  className="flex items-center px-3 border rounded-l-lg transition-colors"
                  style={{ 
                    borderColor: focused ? 'var(--app-primary)' : 'var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <span className="text-sm text-[var(--text-primary)]">+91</span>
                </div>
                <Input
                  type="tel"
                  value={formattedValue}
                  onChange={handleInputChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="(123) 456-7890"
                  className={cn(
                    "flex-1 rounded-l-none border-l-0 rounded-r-lg h-10 transition-all",
                    focused && "border-[var(--app-primary)]",
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
            </div>
            
            {error ? (
              <p className="text-xs mt-1 text-[var(--status-error)]">{error}</p>
            ) : digits.length > 0 && digits.length < 8 ? (
              <p className="text-xs mt-1 text-[var(--text-secondary)]">
                Please enter at least 8 digits
              </p>
            ) : isComplete ? (
              <p className="text-xs mt-1 text-[var(--status-success)]">
                Ready to send code
              </p>
            ) : null}
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-[var(--text-secondary)]">
              I agree to the{" "}
              <a href="#" className="underline text-[var(--app-primary)]">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-[var(--app-primary)]">
                Privacy Policy
              </a>
            </label>
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
            {isLoading ? "Sending..." : "Send Code"}
          </Button>
          
          {isValid && (
            <p className="text-center text-xs text-[var(--text-secondary)]">
              You'll receive a 6-digit code via SMS
            </p>
          )}
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