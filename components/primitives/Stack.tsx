"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The HTML element to render. Defaults to 'div'.
   */
  as?: keyof JSX.IntrinsicElements
  
  /**
   * Gap between child elements using design system gap tokens
   */
  gap?: StackGap
  
  /**
   * Alignment of child elements along the cross axis
   */
  align?: StackAlign
  
  /**
   * Justification of child elements along the main axis
   */
  justify?: StackJustify
  
  /**
   * Whether the stack should wrap its children
   */
  wrap?: boolean
  
  /**
   * Whether the stack should fill available height
   */
  fullHeight?: boolean
  
  /**
   * Whether the stack should fill available width
   */
  fullWidth?: boolean
}

const gapClasses: Record<StackGap, string> = {
  xs: 'gap-[var(--ds-space-xs)]',     // 4px
  sm: 'gap-[var(--ds-space-sm)]',     // 8px  
  md: 'gap-[var(--ds-space-md)]',     // 12px
  lg: 'gap-[var(--ds-space-lg)]',     // 16px
  xl: 'gap-[var(--ds-space-xl)]',     // 20px
  '2xl': 'gap-[var(--ds-space-2xl)]', // 24px
  '3xl': 'gap-[var(--ds-space-3xl)]', // 32px
  '4xl': 'gap-[var(--ds-space-4xl)]', // 40px
  '5xl': 'gap-[var(--ds-space-5xl)]', // 48px
}

const alignClasses: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyClasses: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

/**
 * Stack - A vertical flex container with consistent gap spacing
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    as: Component = 'div',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    fullHeight = false,
    fullWidth = false,
    className,
    children,
    ...props
  }, ref) => {
    const classes = cn(
      // Base flex column styles
      'flex flex-col',
      
      // Gap
      gapClasses[gap],
      
      // Alignment
      alignClasses[align],
      
      // Justification
      justifyClasses[justify],
      
      // Wrap
      wrap && 'flex-wrap',
      
      // Full dimensions
      fullHeight && 'h-full',
      fullWidth && 'w-full',
      
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

Stack.displayName = 'Stack'