"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export type TextVariant = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
export type TextTone = 'default' | 'muted' | 'secondary' | 'inverted' | 'success' | 'warning' | 'error'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The HTML element to render. Defaults to 'span'.
   */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'legend'
  
  /**
   * Text size variant using design system scales
   */
  variant?: TextVariant
  
  /**
   * Color tone using semantic color tokens
   */
  tone?: TextTone
  
  /**
   * Font weight using design system weights
   */
  weight?: TextWeight
  
  /**
   * Whether text should be truncated with ellipsis
   */
  truncate?: boolean
  
  /**
   * Number of lines to clamp text to (uses line-clamp)
   */
  lineClamp?: number
}

const variantClasses: Record<TextVariant, string> = {
  xs: 'text-xs', // 12px
  sm: 'text-sm', // 14px
  base: 'text-base', // 16px
  lg: 'text-lg', // 18px
  xl: 'text-xl', // 20px
  '2xl': 'text-2xl', // 24px
  '3xl': 'text-3xl', // 30px
  '4xl': 'text-4xl', // 36px
  '5xl': 'text-5xl', // 48px
}

const toneClasses: Record<TextTone, string> = {
  default: 'text-[var(--ds-text-default)]',
  muted: 'text-[var(--ds-text-muted)]',
  secondary: 'text-[var(--ds-text-secondary)]',
  inverted: 'text-[var(--ds-text-inverse)]',
  success: 'text-[var(--ds-status-success)]',
  warning: 'text-[var(--ds-status-warning)]',
  error: 'text-[var(--ds-status-error)]',
}

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const getLineClampClass = (lines: number): string => {
  const clampClasses: Record<number, string> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
  }
  return clampClasses[lines] || `[display:-webkit-box] [-webkit-line-clamp:${lines}] [-webkit-box-orient:vertical] [overflow:hidden]`
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    as: Component = 'span',
    variant = 'base',
    tone = 'default',
    weight = 'normal',
    truncate = false,
    lineClamp,
    className,
    children,
    ...props
  }, ref) => {
    const classes = cn(
      // Base styles
      'leading-relaxed',
      
      // Variant (size)
      variantClasses[variant],
      
      // Tone (color)
      toneClasses[tone],
      
      // Weight
      weightClasses[weight],
      
      // Truncate
      truncate && 'truncate',
      
      // Line clamp
      lineClamp && getLineClampClass(lineClamp),
      
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

Text.displayName = 'Text'