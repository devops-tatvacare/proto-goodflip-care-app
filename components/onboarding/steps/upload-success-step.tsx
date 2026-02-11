"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { cn } from "@/lib/utils"

interface UploadSuccessStepProps {
  onNext: () => void
  isLoading?: boolean
}

export function UploadSuccessStep({ onNext, isLoading }: UploadSuccessStepProps) {
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
            Documents Uploaded!
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Your documents are being reviewed by our medical team.
          </p>
        </div>

        <div className="rounded-lg p-[var(--ds-card-padding)] mb-6 max-w-sm w-full bg-[var(--bg-secondary)]">
          <h3 className="font-medium mb-3 text-sm text-[var(--text-primary)]">
            What happens next?
          </h3>
          <ul className="text-xs space-y-1.5 text-left text-[var(--text-secondary)]">
            <li>• Medical team reviews documents</li>
            <li>• Confirmation within 24 hours</li>
            <li>• Personalized care plan ready</li>
          </ul>
        </div>

        {/* Button */}
        <Button
          onClick={onNext}
          disabled={isLoading}
          className="w-full h-9 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow max-w-sm"
          style={{
            backgroundColor: 'var(--app-primary)',
            color: 'var(--ds-text-inverse)'
          }}
        >
          {isLoading ? "Processing..." : "Continue Setup"}
        </Button>
        
        <p className="text-center text-xs mt-3 text-[var(--text-secondary)]">
          Almost done! Just a few more steps.
        </p>
      </div>

      {/* Browser Bar */}
      <div className="p-[var(--ds-space-md)] bg-[var(--bg-secondary)]">
        <div className="bg-[var(--ds-surface-primary)] rounded-full px-3 py-1.5 flex items-center justify-center border border-[var(--border-color)]">
          <span className="text-xs flex items-center text-[var(--text-muted)]">
            🔍 <span className="mx-2">goodflip.com</span> 🔒
          </span>
        </div>
      </div>
    </div>
  )
}