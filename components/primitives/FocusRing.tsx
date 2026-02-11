"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export type FocusRingVariant = 'default' | 'primary' | 'error' | 'warning' | 'success'
export type FocusRingSize = 'sm' | 'md' | 'lg'

export interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The HTML element to render. Defaults to 'div'.
   */
  as?: keyof JSX.IntrinsicElements
  
  /**
   * Focus ring color variant
   */
  variant?: FocusRingVariant
  
  /**
   * Focus ring size
   */
  size?: FocusRingSize
  
  /**
   * Whether the focus ring should always be visible (for testing/debugging)
   */
  forceVisible?: boolean
  
  /**
   * Whether to use rounded corners
   */
  rounded?: boolean
}

const variantClasses: Record<FocusRingVariant, string> = {
  default: 'focus-within:ring-[var(--ds-focus-ring)]',
  primary: 'focus-within:ring-[var(--ds-focus-ring)]',
  error: 'focus-within:ring-[var(--ds-status-error)]',
  warning: 'focus-within:ring-[var(--ds-status-warning)]',
  success: 'focus-within:ring-[var(--ds-status-success)]',
}

const sizeClasses: Record<FocusRingSize, string> = {
  sm: 'focus-within:ring-1',
  md: 'focus-within:ring-2',
  lg: 'focus-within:ring-4',
}

const forceVisibleClasses: Record<FocusRingVariant, string> = {
  default: 'ring-[var(--ds-focus-ring)]',
  primary: 'ring-[var(--ds-focus-ring)]',
  error: 'ring-[var(--ds-status-error)]',
  warning: 'ring-[var(--ds-status-warning)]',
  success: 'ring-[var(--ds-status-success)]',
}

const forceVisibleSizeClasses: Record<FocusRingSize, string> = {
  sm: 'ring-1',
  md: 'ring-2',
  lg: 'ring-4',
}

/**
 * FocusRing - Wraps content with consistent focus ring styles for accessibility
 */
export const FocusRing = React.forwardRef<HTMLDivElement, FocusRingProps>(
  ({ 
    as: Component = 'div',
    variant = 'default',
    size = 'md',
    forceVisible = false,
    rounded = true,
    className,
    children,
    ...props
  }, ref) => {
    const classes = cn(
      // Base focus ring styles
      'focus-within:outline-none',
      'focus-within:ring-offset-[var(--ds-focus-ring-offset)]',
      'focus-within:ring-offset-[var(--ds-surface-primary)]',
      
      // Focus ring variant (only when not force visible)
      !forceVisible && variantClasses[variant],
      !forceVisible && sizeClasses[size],
      
      // Force visible styles (for testing/debugging)
      forceVisible && forceVisibleClasses[variant],
      forceVisible && forceVisibleSizeClasses[size],
      
      // Rounded corners
      rounded && 'rounded-[var(--ds-radius-md)]',
      
      // Custom classes
      className
    )

    return (
      <Component
        ref={ref as any}
        className={classes}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

FocusRing.displayName = 'FocusRing'

/**
 * useFocusRing - Hook for applying focus ring classes to existing components
 */
export const useFocusRing = (
  variant: FocusRingVariant = 'default',
  size: FocusRingSize = 'md',
  rounded: boolean = true
) => {
  return cn(
    'focus:outline-none',
    'focus:ring-offset-[var(--ds-focus-ring-offset)]',
    'focus:ring-offset-[var(--ds-surface-primary)]',
    variantClasses[variant].replace('focus-within:', 'focus:'),
    sizeClasses[size].replace('focus-within:', 'focus:'),
    rounded && 'rounded-[var(--ds-radius-md)]'
  )
}