"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ScreenContainerProps {
  children: React.ReactNode
  className?: string
  hasHeader?: boolean
  hasNavigation?: boolean
}

export function ScreenContainer({ children, className, hasHeader = true, hasNavigation = true }: ScreenContainerProps) {
  return <div className={cn("app-screen", className)}>{children}</div>
}
