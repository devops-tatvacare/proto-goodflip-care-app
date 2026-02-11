"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "./VisuallyHidden"
import { useFocusRing } from "./FocusRing"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--ds-radius-md)] text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--ds-interactive-primary)] text-white hover:bg-[var(--ds-interactive-primary-hover)]",
        destructive: "bg-[var(--ds-status-error)] text-white hover:opacity-90",
        outline: "border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] hover:bg-[var(--ds-surface-secondary)]",
        secondary: "bg-[var(--ds-surface-secondary)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-surface-tertiary)]",
        ghost: "hover:bg-[var(--ds-surface-secondary)]",
        link: "text-[var(--ds-text-link)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[var(--ds-radius-md)] px-3",
        lg: "h-11 rounded-[var(--ds-radius-md)] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether to render as a child element
   */
  asChild?: boolean
  
  /**
   * Accessible label - required for icon-only buttons
   */
  "aria-label"?: string
  
  /**
   * Hidden accessible description
   */
  accessibleDescription?: string
  
  /**
   * Loading state
   */
  isLoading?: boolean
  
  /**
   * Loading text for screen readers
   */
  loadingText?: string
  
  /**
   * Icon element (for icon buttons)
   */
  icon?: React.ReactNode
  
  /**
   * Whether this is an icon-only button (requires aria-label)
   */
  iconOnly?: boolean
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    "aria-label": ariaLabel,
    accessibleDescription,
    isLoading = false,
    loadingText = "Loading...",
    icon,
    iconOnly = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const focusRingClasses = useFocusRing('primary', 'md', true)
    
    // Validate icon-only buttons have aria-label
    if (iconOnly && !ariaLabel) {
      console.warn('AccessibleButton: iconOnly buttons must have an aria-label')
    }

    const isDisabled = disabled || isLoading

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          focusRingClasses,
          isLoading && "cursor-not-allowed opacity-50"
        )}
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-describedby={accessibleDescription ? `${props.id || 'button'}-description` : undefined}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <VisuallyHidden>{loadingText}</VisuallyHidden>
            {!iconOnly && (children || "Loading...")}
          </>
        ) : (
          <>
            {icon && <span className={iconOnly ? "" : "mr-2"}>{icon}</span>}
            {!iconOnly && children}
            {iconOnly && children && <VisuallyHidden>{children}</VisuallyHidden>}
          </>
        )}
        
        {accessibleDescription && (
          <VisuallyHidden id={`${props.id || 'button'}-description`}>
            {accessibleDescription}
          </VisuallyHidden>
        )}
      </Comp>
    )
  }
)
AccessibleButton.displayName = "AccessibleButton"

/**
 * Accessible Icon Button - Pre-configured for icon-only use cases
 */
export interface AccessibleIconButtonProps 
  extends Omit<AccessibleButtonProps, 'iconOnly' | 'size'> {
  /**
   * Size variant for icon buttons
   */
  size?: 'sm' | 'default' | 'lg'
}

const AccessibleIconButton = React.forwardRef<HTMLButtonElement, AccessibleIconButtonProps>(
  ({ size = "icon", children, ...props }, ref) => {
    return (
      <AccessibleButton
        ref={ref}
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon'}
        iconOnly
        icon={children}
        {...props}
      />
    )
  }
)
AccessibleIconButton.displayName = "AccessibleIconButton"

/**
 * Healthcare Action Button - Pre-configured for medical contexts
 */
export interface HealthcareActionButtonProps extends AccessibleButtonProps {
  /**
   * The medical action being performed
   */
  action: 'schedule' | 'cancel' | 'confirm' | 'emergency' | 'medication' | 'vitals' | 'records' | 'call'
  
  /**
   * Patient context for accessibility
   */
  patientContext?: string
}

const HealthcareActionButton = React.forwardRef<HTMLButtonElement, HealthcareActionButtonProps>(
  ({ action, patientContext, "aria-label": providedAriaLabel, accessibleDescription, ...props }, ref) => {
    const actionLabels = {
      schedule: 'Schedule appointment',
      cancel: 'Cancel appointment', 
      confirm: 'Confirm action',
      emergency: 'Emergency contact',
      medication: 'Manage medications',
      vitals: 'Record vital signs',
      records: 'Access medical records',
      call: 'Call healthcare provider'
    }
    
    const actionVariants = {
      schedule: 'default' as const,
      cancel: 'outline' as const,
      confirm: 'default' as const,
      emergency: 'destructive' as const,
      medication: 'secondary' as const,
      vitals: 'secondary' as const,
      records: 'outline' as const,
      call: 'default' as const
    }

    const contextualLabel = patientContext 
      ? `${actionLabels[action]} for ${patientContext}`
      : actionLabels[action]

    const contextualDescription = patientContext
      ? `This action will ${actionLabels[action].toLowerCase()} for patient ${patientContext}`
      : undefined

    return (
      <AccessibleButton
        ref={ref}
        variant={actionVariants[action]}
        aria-label={providedAriaLabel || contextualLabel}
        accessibleDescription={accessibleDescription || contextualDescription}
        {...props}
      />
    )
  }
)
HealthcareActionButton.displayName = "HealthcareActionButton"

export { AccessibleButton, AccessibleIconButton, HealthcareActionButton, buttonVariants }