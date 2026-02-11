"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { cn } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'

interface OtpStepProps {
  phoneNumber: string
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export function OtpStep({ phoneNumber, value, onChange, onNext, onBack, isLoading, error }: OtpStepProps) {
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
  }

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1)
    const otpArray = value.split('')
    otpArray[index] = digit
    
    while (otpArray.length < 6) {
      otpArray.push('')
    }
    
    const newOtp = otpArray.join('')
    onChange(newOtp)
    
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(paste)
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
        <ProgressIndicator currentStep={2} totalSteps={10} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-1 text-[var(--text-primary)]">
            Enter verification code
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Sent to +91 {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              6-Digit Code
            </label>
            <div className="flex justify-center space-x-2 mb-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={value[index] || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className={cn(
                    "w-10 h-10 text-center text-lg font-mono rounded-lg border transition-all",
                    focused && !error ? "border-[var(--app-primary)]" : "border-[var(--border-color)]",
                    error ? "border-[var(--status-error)]" : "",
                    value[index] ? "border-[var(--status-success)]" : ""
                  )}
                  maxLength={1}
                />
              ))}
            </div>
            {isComplete && (
              <div className="flex justify-center mb-2">
                <Icon name="check" className="w-4 h-4 text-[var(--status-success)]" />
              </div>
            )}
            
            {error ? (
              <p className="text-xs mt-2 text-[var(--status-error)]">{error}</p>
            ) : value.length > 0 && value.length < 6 ? (
              <p className="text-xs mt-2 text-[var(--text-secondary)]">
                {6 - value.length} more digits needed
              </p>
            ) : isComplete ? (
              <p className="text-xs mt-2 text-[var(--status-success)]">
                Ready to verify
              </p>
            ) : null}
          </div>

          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm underline text-[var(--app-primary)]"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                Resend in {timeLeft}s
              </p>
            )}
          </div>

          <p className="text-xs text-center text-[var(--text-secondary)]">
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={onBack}
              className="underline text-[var(--app-primary)]"
            >
              Change phone number
            </button>
          </p>
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
            {isLoading ? "Verifying..." : "Verify Code"}
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