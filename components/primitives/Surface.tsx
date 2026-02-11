"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export type SurfaceVariant = 'primary' | 'secondary' | 'tertiary' | 'elevated' | 'inverse'
export type SurfaceRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
export type SurfaceElevation = 'none' | 'subtle' | 'default' | 'elevated' | 'high'
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg'

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The HTML element to render. Defaults to 'div'.
   */
  as?: keyof JSX.IntrinsicElements
  
  /**
   * Surface background variant using semantic color tokens
   */
  variant?: SurfaceVariant
  
  /**
   * Border radius using design system radius tokens
   */
  radius?: SurfaceRadius
  
  /**
   * Box shadow elevation using design system shadow tokens
   */
  elevation?: SurfaceElevation
  
  /**
   * Internal padding using design system spacing tokens
   */
  padding?: SurfacePadding
  
  /**
   * Whether to show a border
   */
  bordered?: boolean
  
  /**
   * Whether the surface should fill available width
   */
  fullWidth?: boolean
  
  /**
   * Whether the surface should fill available height
   */
  fullHeight?: boolean
}

const variantClasses: Record<SurfaceVariant, string> = {
  primary: 'bg-[var(--ds-surface-primary)]',
  secondary: 'bg-[var(--ds-surface-secondary)]',
  tertiary: 'bg-[var(--ds-surface-tertiary)]',
  elevated: 'bg-[var(--ds-surface-elevated)]',
  inverse: 'bg-[var(--ds-surface-inverse)]',
}

const radiusClasses: Record<SurfaceRadius, string> = {
  none: 'rounded-none',
  xs: 'rounded-[var(--ds-radius-xs)]',
  sm: 'rounded-[var(--ds-radius-sm)]',
  md: 'rounded-[var(--ds-radius-md)]',
  lg: 'rounded-[var(--ds-radius-lg)]',
  xl: 'rounded-[var(--ds-radius-xl)]',
  '2xl': 'rounded-[var(--ds-radius-2xl)]',
  '3xl': 'rounded-[var(--ds-radius-3xl)]',
  full: 'rounded-[var(--ds-radius-full)]',
}

const elevationClasses: Record<SurfaceElevation, string> = {
  none: '',
  subtle: 'shadow-[var(--ds-shadow-subtle)]',
  default: 'shadow-[var(--ds-shadow-default)]',
  elevated: 'shadow-[var(--ds-shadow-elevated)]',
  high: 'shadow-[var(--ds-shadow-high)]',
}

const paddingClasses: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-[var(--ds-card-padding-sm)]',
  md: 'p-[var(--ds-card-padding)]',
  lg: 'p-[var(--ds-card-padding-lg)]',
}

/**
 * Surface - A base container component with consistent background, radius, and elevation
 */
export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ 
    as: Component = 'div',
    variant = 'primary',
    radius = 'lg',
    elevation = 'none',
    padding = 'none',
    bordered = false,
    fullWidth = false,
    fullHeight = false,
    className,
    children,
    ...props
  }, ref) => {
    const classes = cn(
      // Base styles
      'relative',
      
      // Background variant
      variantClasses[variant],
      
      // Border radius
      radiusClasses[radius],
      
      // Elevation (box shadow)
      elevationClasses[elevation],
      
      // Padding
      paddingClasses[padding],
      
      // Border
      bordered && 'border border-[var(--ds-border-default)]',
      
      // Full dimensions
      fullWidth && 'w-full',
      fullHeight && 'h-full',
      
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

Surface.displayName = 'Surface'

/**
 * CardSurface - A pre-configured Surface for card-like containers
 */
export const CardSurface = React.forwardRef<HTMLDivElement, Omit<SurfaceProps, 'variant' | 'radius' | 'elevation' | 'padding'>>(
  ({ bordered = true, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        variant="primary"
        radius="lg"
        elevation="default"
        padding="md"
        bordered={bordered}
        {...props}
      />
    )
  }
)

CardSurface.displayName = 'CardSurface'