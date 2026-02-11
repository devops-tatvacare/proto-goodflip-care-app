"use client"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { StatusConfig } from "@/lib/types/common"

// Union type supporting both simple strings and full config objects
type StatusInput = 
  | string
  | StatusConfig
  | {
      label: string
      type?: "success" | "warning" | "error" | "info" | "neutral"
      color?: string
      bgColor?: string
    }

interface UniversalStatusBadgeProps {
  status: StatusInput
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "solid" | "outline" | "soft"
  
  // Backward compatibility props
  children?: React.ReactNode
}

export function UniversalStatusBadge({ 
  status, 
  className, 
  size = "md", 
  variant = "soft", 
  children 
}: UniversalStatusBadgeProps) {
  
  // Normalize status input to consistent format
  const normalizedStatus = typeof status === "string" 
    ? { label: status, type: "neutral" as const }
    : "type" in status && status.type
    ? status
    : "label" in status 
    ? { ...status, type: (status.type || "neutral") as const }
    : status

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2 py-1", 
    lg: "text-sm px-3 py-1",
  }

  const variantClasses = {
    success: {
      solid: "bg-green-600 text-[var(--ds-text-inverse)]",
      outline: "border border-green-600 text-green-600 bg-transparent",
      soft: "bg-green-100 text-green-800",
    },
    warning: {
      solid: "bg-yellow-600 text-[var(--ds-text-inverse)]",
      outline: "border border-yellow-600 text-yellow-600 bg-transparent",
      soft: "bg-yellow-100 text-yellow-800",
    },
    error: {
      solid: "bg-red-600 text-[var(--ds-text-inverse)]",
      outline: "border border-red-600 text-red-600 bg-transparent",
      soft: "bg-red-100 text-red-800",
    },
    info: {
      solid: "bg-blue-600 text-[var(--ds-text-inverse)]",
      outline: "border border-blue-600 text-blue-600 bg-transparent",
      soft: "bg-blue-100 text-blue-800",
    },
    neutral: {
      solid: "bg-gray-600 text-[var(--ds-text-inverse)]",
      outline: "border border-gray-300 text-[var(--ds-text-secondary)] bg-transparent",
      soft: "bg-[var(--ds-surface-secondary)] text-gray-800",
    },
  }

  const statusType = normalizedStatus.type || "neutral"
  const label = children || normalizedStatus.label

  return (
    <Badge
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        variantClasses[statusType][variant],
        className,
      )}
    >
      {label}
    </Badge>
  )
}

// Export as StatusBadge for backward compatibility
export { UniversalStatusBadge as StatusBadge }
export { UniversalStatusBadge as StatusIndicator }
