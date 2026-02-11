"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface OtpScreenProps {
  phoneNumber: string
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export function OtpScreen({ phoneNumber, value, onChange, onNext, onBack, isLoading, error }: OtpScreenProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length === 6) {
      onNext()
    }
  }

  const handleResend = () => {
    setTimeLeft(30)
    setCanResend(false)
    // Add resend logic here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6)
    onChange(digits)
  }

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    }
    return digits
  }

  const isValid = value.length === 6
  const isComplete = value.length === 6

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
            Enter verification code
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Sent to +91 {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              6-Digit Code
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="123456"
                className={cn(
                  "text-center text-xl tracking-[0.5em] font-mono h-14 rounded-xl transition-all duration-200",
                  focused && "border-2",
                  focused && !error ? "border-[var(--app-primary)]" : "",
                  error ? "border-[var(--status-error)]" : "",
                  isComplete ? "border-[var(--status-success)]" : ""
                )}
                maxLength={6}
              />
              {isComplete && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Icon name="check" className="w-5 h-5 text-[var(--status-success)]" />
                </div>
              )}
            </div>
            
            {/* Dynamic feedback */}
            {error ? (
              <p className="text-sm mt-2 text-[var(--status-error)]">{error}</p>
            ) : value.length > 0 && value.length < 6 ? (
              <p className="text-sm mt-2 text-[var(--text-secondary)]">
                {6 - value.length} more digits needed
              </p>
            ) : isComplete ? (
              <p className="text-sm mt-2 text-[var(--status-success)]">
                Ready to verify
              </p>
            ) : null}
          </div>

          {/* Resend Code */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm underline font-medium text-[var(--app-primary)]"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                Resend in {timeLeft}s
              </p>
            )}
          </div>

          {/* Compact Privacy Notice */}
          <p className="text-xs text-center text-[var(--text-secondary)]">
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={onBack}
              className="underline font-medium text-[var(--app-primary)]"
            >
              Change phone number
            </button>
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
              <span>Verifying...</span>
            </div>
          ) : (
            `Verify Code${isComplete ? ' ✓' : ''}`
          )}
        </Button>
        
        {isValid && (
          <p className="text-center text-xs mt-3 text-[var(--text-secondary)]">
            This will log you into your account
          </p>
        )}
      </div>
    </div>
  )
}