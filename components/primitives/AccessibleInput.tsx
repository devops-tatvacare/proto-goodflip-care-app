"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "./VisuallyHidden"
import { useFocusRing } from "./FocusRing"

export interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text - required for accessibility
   */
  label: string
  
  /**
   * Whether to show the label visually
   */
  showLabel?: boolean
  
  /**
   * Helper text displayed below the input
   */
  helperText?: string
  
  /**
   * Error message to display
   */
  error?: string
  
  /**
   * Success message to display
   */
  success?: string
  
  /**
   * Additional instructions for screen readers
   */
  instructions?: string
  
  /**
   * Input variant
   */
  variant?: 'default' | 'medical' | 'emergency'
  
  /**
   * Size variant
   */
  size?: 'sm' | 'default' | 'lg'
}

const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({
    className,
    type,
    label,
    showLabel = true,
    helperText,
    error,
    success,
    instructions,
    variant = 'default',
    size = 'default',
    id,
    'aria-describedby': ariaDescribedBy,
    ...props
  }, ref) => {
    const inputId = id || React.useId()
    const helperTextId = `${inputId}-helper`
    const instructionsId = `${inputId}-instructions`
    const errorId = `${inputId}-error`
    const successId = `${inputId}-success`
    
    const focusRingClasses = useFocusRing('primary', 'md', true)
    
    // Build describedBy string
    const describedBy = [
      ariaDescribedBy,
      helperText && helperTextId,
      instructions && instructionsId,
      error && errorId,
      success && successId
    ].filter(Boolean).join(' ') || undefined

    const variantClasses = {
      default: '',
      medical: 'border-[var(--ds-blue-600)]',
      emergency: 'border-[var(--ds-status-error)]'
    }
    
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      default: 'h-10 px-3',
      lg: 'h-11 px-4 text-lg'
    }

    return (
      <div className="space-y-2">
        {/* Label */}
        {showLabel ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--ds-text-primary)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && (
              <span className="text-[var(--ds-status-error)] ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        ) : (
          <VisuallyHidden asChild>
            <label htmlFor={inputId}>{label}</label>
          </VisuallyHidden>
        )}

        {/* Input */}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] px-3 py-2 text-sm placeholder:text-[var(--ds-text-muted)] disabled:cursor-not-allowed disabled:opacity-50",
            focusRingClasses,
            sizeClasses[size],
            error && "border-[var(--ds-status-error)] bg-[var(--ds-status-error-bg)]",
            success && "border-[var(--ds-status-success)] bg-[var(--ds-status-success-bg)]",
            variantClasses[variant],
            className
          )}
          id={inputId}
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {/* Helper Text */}
        {helperText && (
          <p id={helperTextId} className="text-sm text-[var(--ds-text-muted)]">
            {helperText}
          </p>
        )}

        {/* Instructions (hidden) */}
        {instructions && (
          <VisuallyHidden id={instructionsId}>
            {instructions}
          </VisuallyHidden>
        )}

        {/* Error Message */}
        {error && (
          <p 
            id={errorId} 
            className="text-sm text-[var(--ds-status-error)]" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p 
            id={successId} 
            className="text-sm text-[var(--ds-status-success)]"
            role="status"
            aria-live="polite"
          >
            {success}
          </p>
        )}
      </div>
    )
  }
)
AccessibleInput.displayName = "AccessibleInput"

/**
 * Medical Input - Pre-configured for healthcare contexts
 */
export interface MedicalInputProps extends Omit<AccessibleInputProps, 'variant'> {
  /**
   * Type of medical data being collected
   */
  medicalType?: 'vital' | 'medication' | 'allergy' | 'symptom' | 'diagnosis' | 'general'
}

const MedicalInput = React.forwardRef<HTMLInputElement, MedicalInputProps>(
  ({ medicalType = 'general', instructions, ...props }, ref) => {
    const medicalInstructions = {
      vital: 'Enter numerical values only. Use standard medical units.',
      medication: 'Include dosage and frequency. Example: 500mg twice daily',
      allergy: 'List all known allergies and reactions. Separate multiple entries with commas.',
      symptom: 'Describe symptoms in detail including onset, duration, and severity.',
      diagnosis: 'Enter medical diagnosis using standard terminology when possible.',
      general: 'Provide accurate medical information for healthcare records.'
    }

    const combinedInstructions = instructions 
      ? `${instructions}. ${medicalInstructions[medicalType]}`
      : medicalInstructions[medicalType]

    return (
      <AccessibleInput
        ref={ref}
        variant="medical"
        instructions={combinedInstructions}
        {...props}
      />
    )
  }
)
MedicalInput.displayName = "MedicalInput"

/**
 * Patient Search Input - Specialized for patient lookup
 */
export interface PatientSearchInputProps extends Omit<AccessibleInputProps, 'variant' | 'type'> {
  /**
   * Search results count for screen readers
   */
  resultsCount?: number
  
  /**
   * Whether search is in progress
   */
  isSearching?: boolean
}

const PatientSearchInput = React.forwardRef<HTMLInputElement, PatientSearchInputProps>(
  ({ resultsCount, isSearching, ...props }, ref) => {
    const searchInstructions = `Search by patient name, ID, or medical record number. ${
      resultsCount !== undefined 
        ? `${resultsCount} result${resultsCount !== 1 ? 's' : ''} found.`
        : ''
    } ${isSearching ? 'Search in progress.' : ''}`

    return (
      <AccessibleInput
        ref={ref}
        type="search"
        variant="default"
        role="searchbox"
        instructions={searchInstructions}
        aria-busy={isSearching}
        {...props}
      />
    )
  }
)
PatientSearchInput.displayName = "PatientSearchInput"

export { AccessibleInput, MedicalInput, PatientSearchInput }