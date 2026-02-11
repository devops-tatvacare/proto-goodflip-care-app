"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface PhoneNumberScreenProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  isLoading?: boolean
  error?: string
}

export function PhoneNumberScreen({ value, onChange, onNext, isLoading, error }: PhoneNumberScreenProps) {
  const [focused, setFocused] = useState(false)

  // Auto-format phone number as user types
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

  // Get clean digits for validation
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
    if (digits.length >= 8) { // More flexible validation
      onNext()
    }
  }

  const digits = getDigitsOnly(value)
  const formattedValue = formatPhoneNumber(value)
  const isValid = digits.length >= 8 && digits.length <= 11
  const isComplete = digits.length === 10

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Clean Header with Logo */}
      <div className="px-6 pt-6 pb-4">

        {/* Clean GoodFlip Care Logo */}
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

      {/* Content Area */}
      <div className="flex-1 px-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Enter your phone number
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We'll send you a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Enhanced Phone Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Phone Number
            </label>
            <div className="relative">
              <div className="flex">
                <div 
                  className="flex items-center px-4 border-2 border-r-0 rounded-l-xl transition-colors"
                  style={{ 
                    borderColor: focused ? 'var(--app-primary)' : 'var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <span className="text-sm font-medium text-[var(--text-primary)]">+91</span>
                </div>
                <Input
                  type="tel"
                  value={formattedValue}
                  onChange={handleInputChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="(123) 456-7890"
                  className={cn(
                    "flex-1 rounded-l-none border-l-0 rounded-r-xl text-base h-12 transition-all duration-200",
                    focused && "border-2",
                    focused && !error ? "border-[var(--app-primary)]" : "",
                    error ? "border-[var(--status-error)]" : "",
                    isComplete ? "border-[var(--status-success)]" : ""
                  )}
                />
                {isComplete && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Icon name="check" className="w-5 h-5 text-[var(--status-success)]" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Dynamic feedback */}
            {error ? (
              <p className="text-sm mt-2 text-[var(--status-error)]">{error}</p>
            ) : digits.length > 0 && digits.length < 8 ? (
              <p className="text-sm mt-2 text-[var(--text-secondary)]">
                Please enter at least 8 digits
              </p>
            ) : isComplete ? (
              <p className="text-sm mt-2 text-[var(--status-success)]">
                Perfect! Ready to send verification code
              </p>
            ) : null}
          </div>


          {/* Compact Privacy Notice */}
          <p className="text-xs text-center text-[var(--text-secondary)]">
            By continuing, you agree to our{" "}
            <a href="#" className="underline text-[var(--app-primary)]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-[var(--app-primary)]">
              Privacy Policy
            </a>
          </p>
        </form>
      </div>

      {/* Fixed Button Area */}
      <div 
        className="p-6 mt-auto"
        style={{ borderTop: `1px solid var(--border-color)` }}
      >
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={cn(
            "w-full h-12 text-base font-medium rounded-xl transition-all duration-200",
            isValid ? "shadow-lg hover:shadow-xl" : ""
          )}
          style={{
            backgroundColor: isValid ? 'var(--app-primary)' : 'var(--border-color)',
            color: isValid ? 'white' : 'var(--text-secondary)'
          }}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Code...</span>
            </div>
          ) : (
            `Send Verification Code${isComplete ? ' ✓' : ''}`
          )}
        </Button>
        
        {isValid && (
          <p className="text-center text-xs mt-3 text-[var(--text-secondary)]">
            You'll receive a 6-digit code via SMS
          </p>
        )}
      </div>
    </div>
  )
}