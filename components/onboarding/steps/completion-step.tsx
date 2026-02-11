"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'

interface CompletionStepProps {
  onComplete: () => void
  patientName: string
  isLoading?: boolean
}

export function CompletionStep({ onComplete, patientName, isLoading }: CompletionStepProps) {
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
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 text-center">
        <div className="mb-6">
          <Icon name="checkCircle" className="mx-auto h-12 w-12 mb-3 text-[var(--status-success)]" />
          
          <h2 className="text-lg font-medium mb-2 text-[var(--text-primary)]">
            Welcome to GoodFlip Care, {patientName}!
          </h2>
          
          <p className="text-sm text-[var(--text-secondary)]">
            Your account is ready. Let's start your personalized health journey.
          </p>
        </div>

        <div className="rounded-lg p-4 mb-6 max-w-sm w-full bg-[var(--bg-secondary)]">
          <h3 className="font-medium mb-3 text-sm flex items-center justify-center text-[var(--text-primary)]">
            <Icon name="sparkles" className="mr-2 h-4 w-4 text-[var(--app-primary)]" />
            What's Ready for You
          </h3>
          <ul className="text-xs space-y-1.5 text-left text-[var(--text-secondary)]">
            <li className="flex items-start">
              <span className="mr-2 text-[var(--status-success)]">✓</span>
              Personalized health dashboard
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[var(--status-success)]">✓</span>
              AI-powered health assistant
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[var(--status-success)]">✓</span>
              Medication reminders & tracking
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[var(--status-success)]">✓</span>
              Direct connection with your care team
            </li>
          </ul>
        </div>

        {/* Button */}
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className="w-full h-9 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow max-w-sm"
          style={{
            backgroundColor: 'var(--app-primary)',
            color: 'var(--ds-text-inverse)'
          }}
        >
          {isLoading ? "Setting up your account..." : "Start Your Health Journey"}
        </Button>
        
        <p className="text-center text-xs mt-3 text-[var(--text-secondary)]">
          Welcome to your personalized care experience
        </p>
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
