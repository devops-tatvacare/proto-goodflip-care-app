"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AppOtpStepProps {
  phoneNumber: string
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export function AppOtpStep({ phoneNumber, value, onChange, onNext, onBack, isLoading, error }: AppOtpStepProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)

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

  const isValid = value.length === 6

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Header Banner */}
      <div
        className="mx-0 mt-0 rounded-b-2xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--slate-700) 0%, var(--slate-600) 100%)`,
          height: "120px",
        }}
      >
        {/* Static Floating Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-2 left-5 w-10 h-10 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-15)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <div
            className="absolute top-7 right-7 w-7 h-7 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-20)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <div
            className="absolute bottom-5 left-10 w-6 h-6 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-12)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <div
            className="absolute top-12 left-1/3 w-5 h-5 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-18)',
              backdropFilter: 'blur(1px)',
            }}
          />
        </div>

        {/* Centered Logo and Text */}
        <div className="flex justify-center items-center h-full relative z-10">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/goodflip-care-logo.png" 
              alt="GoodFlip Care" 
              className="h-12 w-12 object-contain" 
            />
            <span className="text-[var(--ds-text-inverse)] text-xl font-semibold">GoodFlip Care</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
            Enter verification code
          </h1>
          <p className="text-[var(--text-secondary)]">
            We've sent a 6-digit code to +91 {phoneNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
              Verification Code
            </label>
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
            {error && <p className="text-[var(--ds-status-error)] text-sm mt-1">{error}</p>}
          </div>

          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="underline text-[var(--app-primary)]"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-[var(--text-secondary)]">
                Resend code in {timeLeft}s
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Fixed Button Area */}
      <div className="p-6 space-y-3" style={{ borderTop: `1px solid var(--border-color)` }}>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full h-12 text-lg"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 text-lg"
        >
          Back
        </Button>
      </div>
    </div>
  )
}
