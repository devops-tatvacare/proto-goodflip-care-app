"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ContentContainerProps {
  children: React.ReactNode
  className?: string
  spacing?: "none" | "sm" | "md" | "lg"
  padding?: "none" | "sm" | "md" | "lg"
}

export function ContentContainer({ children, className, spacing = "md", padding = "md" }: ContentContainerProps) {
  const spacingClasses = {
    none: "",
    sm: "space-y-[var(--space-2)]",
    md: "space-y-[var(--space-3)]",
    lg: "space-y-[var(--space-4)]",
  }

  const paddingClasses = {
    none: "",
    sm: "p-[var(--space-2)]",
    md: "p-[var(--space-3)]",
    lg: "p-[var(--space-4)]",
  }

  return (
    <div className={cn("flex-1 overflow-y-auto", paddingClasses[padding], spacingClasses[spacing], className)}>
      {children}
    </div>
  )
}
