"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import type { ButtonVariant } from "@/lib/types/common"

interface UniversalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant["variant"]
  size?: ButtonVariant["size"]
  className?: string
  loading?: boolean
}

export function UniversalButton({
  children,
  variant = "primary",
  size = "md",
  className,
  loading = false,
  disabled,
  ...props
}: UniversalButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-normal ease-out focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "app-button-primary focus:ring-[var(--app-primary)]",
    secondary: "app-button-secondary focus:ring-[var(--border-medium)]",
    outline:
      "border border-[var(--border-medium)] bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]",
    ghost: "bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]",
    destructive:
      "bg-[var(--status-error)] hover:bg-[var(--status-error)]/90 text-[var(--ds-text-inverse)] focus:ring-[var(--status-error)]",
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-[var(--text-sm)]",
    md: "h-[var(--button-height)] px-[var(--space-4)] text-[var(--text-base)]",
    lg: "h-12 px-6 text-[var(--text-lg)]",
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
