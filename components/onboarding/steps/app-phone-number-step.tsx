"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AppPhoneNumberStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  isLoading?: boolean
  error?: string
}

export function AppPhoneNumberStep({ value, onChange, onNext, isLoading, error }: AppPhoneNumberStepProps) {
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length === 10 && agreed) {
      onNext()
    }
  }

  const isValid = value.length === 10 && agreed

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
          <div
            className="absolute bottom-7 right-5 w-6 h-6 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-10)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <div
            className="absolute top-10 right-12 w-4 h-4 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-25)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <div
            className="absolute bottom-10 left-1/4 w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-20)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <div
            className="absolute top-14 right-1/3 w-4 h-4 rounded-full"
            style={{
              backgroundColor: 'var(--white-alpha-14)',
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

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
            Enter your phone number
          </h1>
          <p className="text-[var(--text-secondary)]">
            We'll send you a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
              Phone Number
            </label>
            <div className="flex">
              <div 
                className="flex items-center px-3 border-2 border-r-0 rounded-l-lg"
                style={{ 
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <span className="text-[var(--text-primary)]">+91</span>
              </div>
              <Input
                type="tel"
                value={value}
                onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                className={cn("flex-1 rounded-l-none border-l-0", error && "border-[var(--ds-status-error)]")}
                maxLength={10}
              />
            </div>
            {error && <p className="text-[var(--ds-status-error)] text-sm mt-1">{error}</p>}
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-[var(--text-secondary)]">
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
      </div>

      {/* Fixed Button Area */}
      <div className="p-6" style={{ borderTop: `1px solid var(--border-color)` }}>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full h-12 text-lg"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    </div>
  )
}
