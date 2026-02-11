"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface BaseLayoutProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "padded" | "full"
}

export function BaseLayout({ children, className, variant = "default" }: BaseLayoutProps) {
  const variantClasses = {
    default: "app-container",
    padded: "app-container p-[var(--space-4)]",
    full: "h-full w-full",
  }

  return <div className={cn(variantClasses[variant], className)}>{children}</div>
}
