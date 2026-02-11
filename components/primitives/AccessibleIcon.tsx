"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "./VisuallyHidden"

export interface AccessibleIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Accessible label for the icon - required
   */
  'aria-label': string
  
  /**
   * Whether the icon is decorative (aria-hidden)
   */
  decorative?: boolean
  
  /**
   * Size variant
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  
  /**
   * Color variant using design tokens
   */
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error' | 'inverse'
  
  /**
   * Icon content (emoji, SVG, etc.)
   */
  children: React.ReactNode
}

const sizeClasses = {
  xs: 'w-3 h-3 text-xs',
  sm: 'w-4 h-4 text-sm', 
  md: 'w-5 h-5 text-base',
  lg: 'w-6 h-6 text-lg',
  xl: 'w-8 h-8 text-xl'
}

const colorClasses = {
  default: 'text-[var(--ds-text-primary)]',
  muted: 'text-[var(--ds-text-muted)]',
  primary: 'text-[var(--ds-interactive-primary)]',
  success: 'text-[var(--ds-status-success)]',
  warning: 'text-[var(--ds-status-warning)]',
  error: 'text-[var(--ds-status-error)]',
  inverse: 'text-[var(--ds-text-inverse)]'
}

/**
 * AccessibleIcon - Provides consistent icon rendering with proper accessibility
 */
const AccessibleIcon = React.forwardRef<HTMLSpanElement, AccessibleIconProps>(
  ({
    'aria-label': ariaLabel,
    decorative = false,
    size = 'md',
    color = 'default',
    className,
    children,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        aria-hidden={decorative}
        aria-label={decorative ? undefined : ariaLabel}
        role={decorative ? undefined : "img"}
        {...props}
      >
        {children}
        {!decorative && <VisuallyHidden>{ariaLabel}</VisuallyHidden>}
      </span>
    )
  }
)
AccessibleIcon.displayName = "AccessibleIcon"

/**
 * Medical Icon - Pre-configured for healthcare contexts
 */
export interface MedicalIconProps extends Omit<AccessibleIconProps, 'aria-label'> {
  /**
   * Medical context type
   */
  type: 'vital' | 'medication' | 'appointment' | 'emergency' | 'record' | 'alert' | 'success' | 'warning'
  
  /**
   * Optional custom label, otherwise uses default medical labels
   */
  customLabel?: string
}

const MedicalIcon = React.forwardRef<HTMLSpanElement, MedicalIconProps>(
  ({ type, customLabel, color, ...props }, ref) => {
    const medicalLabels = {
      vital: 'Vital signs',
      medication: 'Medication',
      appointment: 'Appointment',
      emergency: 'Emergency',
      record: 'Medical record',
      alert: 'Medical alert',
      success: 'Success indicator',
      warning: 'Warning indicator'
    }

    const medicalColors: Record<typeof type, typeof color> = {
      vital: 'primary',
      medication: 'primary',
      appointment: 'default',
      emergency: 'error',
      record: 'default',
      alert: 'warning',
      success: 'success',
      warning: 'warning'
    }

    return (
      <AccessibleIcon
        ref={ref}
        aria-label={customLabel || medicalLabels[type]}
        color={color || medicalColors[type]}
        {...props}
      />
    )
  }
)
MedicalIcon.displayName = "MedicalIcon"

/**
 * Status Icon - For displaying status indicators with accessibility
 */
export interface StatusIconProps extends Omit<AccessibleIconProps, 'aria-label' | 'color'> {
  /**
   * Status type
   */
  status: 'success' | 'warning' | 'error' | 'info' | 'pending'
  
  /**
   * Context for the status (e.g., "medication taken", "appointment confirmed")
   */
  context?: string
  
  /**
   * Whether to include status text in the label
   */
  includeStatusText?: boolean
}

const StatusIcon = React.forwardRef<HTMLSpanElement, StatusIconProps>(
  ({ status, context, includeStatusText = true, ...props }, ref) => {
    const statusLabels = {
      success: 'Success',
      warning: 'Warning', 
      error: 'Error',
      info: 'Information',
      pending: 'Pending'
    }

    const statusColors = {
      success: 'success' as const,
      warning: 'warning' as const,
      error: 'error' as const,
      info: 'primary' as const,
      pending: 'muted' as const
    }

    const getAriaLabel = () => {
      if (!includeStatusText) return context || statusLabels[status]
      if (!context) return statusLabels[status]
      return `${statusLabels[status]}: ${context}`
    }

    return (
      <AccessibleIcon
        ref={ref}
        aria-label={getAriaLabel()}
        color={statusColors[status]}
        {...props}
      />
    )
  }
)
StatusIcon.displayName = "StatusIcon"

/**
 * Interactive Icon - For clickable icons that need enhanced accessibility
 */
export interface InteractiveIconProps extends Omit<AccessibleIconProps, 'aria-label'> {
  /**
   * Action description for accessibility
   */
  actionLabel: string
  
  /**
   * Additional context for the action
   */
  actionContext?: string
  
  /**
   * Click handler
   */
  onClick?: () => void
  
  /**
   * Whether the icon is in a pressed state
   */
  pressed?: boolean
  
  /**
   * Whether the icon represents a toggle
   */
  toggle?: boolean
}

const InteractiveIcon = React.forwardRef<HTMLButtonElement, InteractiveIconProps>(
  ({ 
    actionLabel, 
    actionContext, 
    onClick, 
    pressed, 
    toggle = false,
    size = 'md',
    color = 'default',
    className,
    children,
    ...props 
  }, ref) => {
    const getAriaLabel = () => {
      let label = actionLabel
      if (actionContext) label += ` ${actionContext}`
      if (toggle && pressed !== undefined) {
        label += pressed ? ' (currently active)' : ' (currently inactive)'
      }
      return label
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--ds-radius-sm)] p-1 hover:bg-[var(--ds-surface-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-focus-ring)] focus:ring-offset-2",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        aria-label={getAriaLabel()}
        aria-pressed={toggle ? pressed : undefined}
        {...props}
      >
        {children}
        <VisuallyHidden>{getAriaLabel()}</VisuallyHidden>
      </button>
    )
  }
)
InteractiveIcon.displayName = "InteractiveIcon"

export { 
  AccessibleIcon, 
  MedicalIcon, 
  StatusIcon, 
  InteractiveIcon,
  sizeClasses,
  colorClasses
}