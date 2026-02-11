"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked"> {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Design-system Checkbox with indeterminate support.
 * Minimal styling to match existing tokens used by table selection.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate = false, onCheckedChange, disabled, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate && !checked)
      }
    }, [indeterminate, checked])

    return (
      <input
        ref={innerRef}
        type="checkbox"
        className={cn(
          "h-4 w-4 appearance-none rounded-[var(--ds-radius-sm)] border border-[var(--ds-border-default)]",
          "bg-[var(--ds-surface-primary)] text-[var(--ds-interactive-primary)]",
          "checked:bg-[var(--ds-interactive-primary)] checked:border-[var(--ds-interactive-primary)]",
          "checked:[&]:bg-[var(--ds-interactive-primary)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--ds-focus-ring)]/50 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-checked={indeterminate ? "mixed" : checked}
        checked={Boolean(checked)}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

