"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Text } from './Text'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'default' | 'subtle' | 'strong'
export type DividerSize = 'sm' | 'md' | 'lg'

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The HTML element to render. Defaults to 'hr'.
   */
  as?: 'hr' | 'div'
  
  /**
   * Orientation of the divider
   */
  orientation?: DividerOrientation
  
  /**
   * Visual variant of the divider
   */
  variant?: DividerVariant
  
  /**
   * Size of the divider (affects spacing around it)
   */
  size?: DividerSize
  
  /**
   * Label to show in the center of the divider
   */
  label?: React.ReactNode
  
  /**
   * Whether to add decorative elements around the label
   */
  decorative?: boolean
}

const variantClasses: Record<DividerVariant, string> = {
  default: 'border-[var(--ds-border-default)]',
  subtle: 'border-[var(--ds-border-subtle)]',
  strong: 'border-[var(--ds-border-strong)]',
}

const sizeClasses: Record<DividerOrientation, Record<DividerSize, string>> = {
  horizontal: {
    sm: 'my-[var(--ds-space-sm)]',
    md: 'my-[var(--ds-space-md)]',
    lg: 'my-[var(--ds-space-lg)]',
  },
  vertical: {
    sm: 'mx-[var(--ds-space-sm)]',
    md: 'mx-[var(--ds-space-md)]',
    lg: 'mx-[var(--ds-space-lg)]',
  },
}

const orientationClasses: Record<DividerOrientation, string> = {
  horizontal: 'w-full border-t',
  vertical: 'h-full border-l',
}

/**
 * Divider - A standardized separator element with consistent styling
 */
export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ 
    as: Component = 'hr',
    orientation = 'horizontal',
    variant = 'default',
    size = 'md',
    label,
    decorative = false,
    className,
    ...props
  }, ref) => {
    // If there's a label, we need to render a different structure
    if (label) {
      return (
        <div
          className={cn(
            'relative flex items-center',
            orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
            sizeClasses[orientation][size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'flex-1',
              orientationClasses[orientation],
              variantClasses[variant]
            )}
          />
          <div
            className={cn(
              'flex items-center justify-center bg-[var(--ds-surface-primary)]',
              orientation === 'horizontal' 
                ? 'px-[var(--ds-space-md)]' 
                : 'py-[var(--ds-space-md)]'
            )}
          >
            {decorative && (
              <span className="text-[var(--ds-text-muted)] text-sm mr-2">•</span>
            )}
            {typeof label === 'string' ? (
              <Text variant="sm" tone="muted" weight="medium">
                {label}
              </Text>
            ) : (
              label
            )}
            {decorative && (
              <span className="text-[var(--ds-text-muted)] text-sm ml-2">•</span>
            )}
          </div>
          <div
            className={cn(
              'flex-1',
              orientationClasses[orientation],
              variantClasses[variant]
            )}
          />
        </div>
      )
    }

    // Standard divider without label
    const classes = cn(
      // Base styles
      'border-0',
      
      // Orientation
      orientationClasses[orientation],
      
      // Variant
      variantClasses[variant],
      
      // Size (spacing)
      sizeClasses[orientation][size],
      
      // Custom classes
      className
    )

    return (
      <Component
        ref={ref as any}
        className={classes}
        role={Component === 'div' ? 'separator' : undefined}
        aria-orientation={Component === 'div' ? orientation : undefined}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'