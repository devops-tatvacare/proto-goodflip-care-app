"use client"

import React, { useEffect, useRef } from 'react'
import { FocusScope } from '@radix-ui/react-focus-scope'
import { cn } from '@/lib/utils'

export interface FocusTrapProps {
  /**
   * Whether the focus trap is active
   */
  trapped?: boolean
  
  /**
   * Called when the user tries to escape the focus scope
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  
  /**
   * Whether to loop focus (when reaching the last focusable element, focus the first)
   */
  loop?: boolean
  
  /**
   * Whether to restore focus to the previously focused element when the trap is deactivated
   */
  restoreFocus?: boolean
  
  /**
   * Element to focus when the trap is activated
   */
  autoFocus?: boolean | HTMLElement
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * The content to wrap with the focus trap
   */
  children: React.ReactNode
}

/**
 * FocusTrap - Wraps content with focus management for accessibility
 * Essential for modal dialogs, sheets, and popover components
 */
export const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  ({
    trapped = true,
    onEscapeKeyDown,
    loop = true,
    restoreFocus = true,
    autoFocus = true,
    className,
    children,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!trapped || !onEscapeKeyDown) return

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onEscapeKeyDown(event)
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [trapped, onEscapeKeyDown])

    if (!trapped) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      )
    }

    return (
      <FocusScope
        trapped={trapped}
        loop={loop}
        restoreFocus={restoreFocus}
        autoFocus={autoFocus}
      >
        <div
          ref={ref || containerRef}
          className={cn('focus:outline-none', className)}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </FocusScope>
    )
  }
)

FocusTrap.displayName = 'FocusTrap'

/**
 * Portal component for rendering content outside the normal DOM tree
 * Used by modal components that need to escape their container's stacking context
 */
export interface PortalProps {
  /**
   * The container element to portal into. Defaults to document.body
   */
  container?: HTMLElement | null
  
  /**
   * The content to portal
   */
  children: React.ReactNode
}

export const Portal: React.FC<PortalProps> = ({ 
  container,
  children 
}) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  if (typeof document === 'undefined') {
    return null
  }

  const portalContainer = container || document.body

  return React.createPortal(children, portalContainer)
}

/**
 * Hook for managing focus trap in modal components
 */
export const useFocusTrap = (isOpen: boolean) => {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus the container after a microtask to ensure it's rendered
      setTimeout(() => {
        if (containerRef.current) {
          const firstFocusable = containerRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          firstFocusable?.focus()
        }
      }, 0)
    } else {
      // Restore focus when closing
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
    }
  }, [isOpen])

  return containerRef
}