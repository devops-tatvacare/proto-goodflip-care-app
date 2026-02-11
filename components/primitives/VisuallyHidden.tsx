"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The HTML element to render. Defaults to 'span'.
   */
  as?: keyof JSX.IntrinsicElements
  
  /**
   * Whether the content should be focusable (useful for skip links)
   */
  focusable?: boolean
}

/**
 * VisuallyHidden - Hides content visually but keeps it accessible to screen readers
 * 
 * This component uses the standard visually hidden technique that:
 * - Clips the content to 1px x 1px
 * - Positions it absolutely
 * - Adds negative margins to remove layout impact
 * - Ensures overflow is hidden
 * - Optionally allows focusing for skip links
 */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ 
    as: Component = 'span',
    focusable = false,
    className,
    children,
    ...props
  }, ref) => {
    const classes = cn(
      // Standard visually hidden styles
      'absolute',
      'w-px h-px',
      'p-0 -m-px',
      'overflow-hidden',
      'clip-[rect(0,0,0,0)]',
      'whitespace-nowrap',
      'border-0',
      
      // Make focusable if needed (for skip links)
      focusable && [
        'focus:static',
        'focus:w-auto',
        'focus:h-auto',
        'focus:p-1',
        'focus:m-0',
        'focus:overflow-visible',
        'focus:clip-auto',
        'focus:whitespace-normal',
        'focus:border',
        'focus:bg-[var(--ds-surface-primary)]',
        'focus:text-[var(--ds-text-primary)]',
        'focus:rounded-[var(--ds-radius-sm)]',
        'focus:z-50',
      ],
      
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

VisuallyHidden.displayName = 'VisuallyHidden'

/**
 * SkipLink - A pre-configured VisuallyHidden component for skip navigation
 */
export const SkipLink = React.forwardRef<HTMLAnchorElement, 
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    /**
     * The target to skip to (should be an element ID)
     */
    target: string
    /**
     * The text to display (defaults to "Skip to main content")
     */
    children?: React.ReactNode
  }
>(
  ({ target, children = 'Skip to main content', className, ...props }, ref) => {
    return (
      <VisuallyHidden
        as="a"
        ref={ref as any}
        focusable
        href={`#${target}`}
        className={cn(
          'focus:absolute',
          'focus:top-4',
          'focus:left-4',
          'focus:px-4',
          'focus:py-2',
          className
        )}
        {...props}
      >
        {children}
      </VisuallyHidden>
    )
  }
)

SkipLink.displayName = 'SkipLink'