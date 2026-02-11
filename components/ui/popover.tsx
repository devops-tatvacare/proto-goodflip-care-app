"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { FocusScope } from "@radix-ui/react-focus-scope"
import { VisuallyHidden } from "@/components/primitives/VisuallyHidden"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    /**
     * Whether to trap focus within the popover
     */
    trapFocus?: boolean
    /**
     * Whether to loop focus within the popover
     */
    loopFocus?: boolean
    /**
     * Accessible label for the popover
     */
    'aria-label'?: string
    /**
     * Optional aria-labelledby for accessibility
     */
    'aria-labelledby'?: string
    /**
     * Optional aria-describedby for accessibility
     */
    'aria-describedby'?: string
  }
>(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  trapFocus = false,
  loopFocus = true,
  children,
  ...props 
}, ref) => {
  const content = (
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-[var(--ds-radius-md)] border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] p-[var(--ds-card-padding)] text-[var(--ds-text-primary)] shadow-[var(--ds-shadow-elevated)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      role="dialog"
      aria-modal={trapFocus}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  )

  // Wrap with focus scope if focus trapping is enabled
  if (trapFocus) {
    return (
      <PopoverPrimitive.Portal>
        <FocusScope trapped={true} loop={loopFocus} restoreFocus={true}>
          {content}
        </FocusScope>
      </PopoverPrimitive.Portal>
    )
  }

  return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/**
 * Enhanced popover specifically for healthcare forms and complex interactions
 * Includes focus management and proper ARIA labeling
 */
const PopoverForm = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    /**
     * Title for the popover form
     */
    title?: string
    /**
     * Description for the popover form
     */
    description?: string
    /**
     * Whether to show a close button
     */
    showCloseButton?: boolean
  }
>(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  title,
  description,
  showCloseButton = false,
  children,
  ...props 
}, ref) => {
  const titleId = React.useId()
  const descriptionId = React.useId()

  return (
    <PopoverPrimitive.Portal>
      <FocusScope trapped={true} loop={true} restoreFocus={true}>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 w-80 rounded-[var(--ds-radius-md)] border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] p-[var(--ds-card-padding)] text-[var(--ds-text-primary)] shadow-[var(--ds-shadow-elevated)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          {...props}
        >
          {title && (
            <div className="mb-[var(--ds-space-md)]">
              <h2 
                id={titleId}
                className="text-lg font-semibold text-[var(--ds-text-primary)]"
              >
                {title}
              </h2>
              {description && (
                <p 
                  id={descriptionId}
                  className="text-sm text-[var(--ds-text-muted)] mt-[var(--ds-space-xs)]"
                >
                  {description}
                </p>
              )}
            </div>
          )}
          
          {children}
          
          {showCloseButton && (
            <PopoverPrimitive.Close
              className={cn(
                "absolute right-[var(--ds-space-md)] top-[var(--ds-space-md)] rounded-[var(--ds-radius-sm)] opacity-70 ring-offset-[var(--ds-surface-primary)] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--ds-focus-ring)] focus:ring-offset-2 disabled:pointer-events-none"
              )}
              aria-label="Close popover"
            >
              ✕
              <VisuallyHidden>Close popover</VisuallyHidden>
            </PopoverPrimitive.Close>
          )}
        </PopoverPrimitive.Content>
      </FocusScope>
    </PopoverPrimitive.Portal>
  )
})
PopoverForm.displayName = "PopoverForm"

/**
 * Simple popover for tooltips and non-interactive content
 * Does not trap focus to maintain natural tab flow
 */
const PopoverTooltip = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  children,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-xs rounded-[var(--ds-radius-md)] border border-[var(--ds-border-default)] bg-[var(--ds-surface-elevated)] px-[var(--ds-space-md)] py-[var(--ds-space-sm)] text-sm text-[var(--ds-text-primary)] shadow-[var(--ds-shadow-elevated)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      role="tooltip"
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverTooltip.displayName = "PopoverTooltip"

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverForm,
  PopoverTooltip,
}