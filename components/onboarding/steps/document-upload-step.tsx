"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { Icon } from '@/components/ui/icon'
import { cn } from "@/lib/utils"

interface DocumentUploadStepProps {
  value: {
    prescription?: File
    purchaseInvoice?: File
  }
  onChange: (value: { prescription?: File; purchaseInvoice?: File }) => void
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export function DocumentUploadStep({ value, onChange, onNext, onBack, isLoading, error }: DocumentUploadStepProps) {
  const handleFileUpload = (type: 'prescription' | 'purchaseInvoice', files: FileList | null) => {
    if (!files) return
    
    onChange({
      ...value,
      [type]: files[0],
    })
  }

  const removeFile = (type: 'prescription' | 'purchaseInvoice') => {
    onChange({
      ...value,
      [type]: undefined,
    })
  }

  const handleSubmit = () => {
    if (value.prescription) {
      onNext()
    }
  }

  const isValid = !!value.prescription

  const FileUploadArea = ({ 
    type, 
    title, 
    description, 
    required = false 
  }: { 
    type: 'prescription' | 'purchaseInvoice'
    title: string
    description: string
    required?: boolean
  }) => (
    <div className="border border-dashed rounded-lg p-4 border-[var(--border-color)]">
      <div className="text-center">
        <Icon name="upload" className="mx-auto h-8 w-8 mb-2 text-[var(--text-muted)]" />
        <h3 className="text-sm font-medium mb-1 text-[var(--text-primary)]">
          {title} {required && <span className="text-[var(--status-error)]">*</span>}
        </h3>
        <p className="text-xs mb-3 text-[var(--text-secondary)]">{description}</p>
        
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(type, e.target.files)}
          className="hidden"
          id={`file-${type}`}
        />
        <label
          htmlFor={`file-${type}`}
          className="inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium"
          style={{
            backgroundColor: value[type] ? 'var(--status-success)' : 'var(--app-primary)',
            color: 'var(--ds-text-inverse)'
          }}
        >
          {value[type] ? `✓ Uploaded` : 'Choose File'}
        </label>
      </div>

      {/* Display uploaded file */}
      {value[type] && (
        <div className="mt-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-secondary)]">
            <div className="flex items-center space-x-2">
              <Icon name="fileText" size={14} className="text-[var(--app-primary)]" />
              <span className="text-sm truncate text-[var(--text-primary)]">{value[type]?.name}</span>
            </div>
            <button
              onClick={() => removeFile(type)}
              className="transition-colors p-1 text-[var(--status-error)]"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )

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
        <ProgressIndicator currentStep={8} totalSteps={10} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-1 text-[var(--text-primary)]">
            Upload Documents
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Upload your medical documents for better care coordination
          </p>
        </div>

        <div className="space-y-4">
          <FileUploadArea
            type="prescription"
            title="Prescription"
            description="Upload your current prescription (Required)"
            required
          />

          <FileUploadArea
            type="purchaseInvoice"
            title="Purchase Invoice"
            description="Upload your purchase receipt or invoice (Optional)"
          />
        </div>

        {error && <p className="text-sm mt-4 text-[var(--status-error)]">{error}</p>}

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
            {isLoading ? "Uploading..." : "Continue"}
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
          
          {isValid && (
            <p className="text-center text-xs text-[var(--text-secondary)]">
              Your documents will be securely reviewed
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