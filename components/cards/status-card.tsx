"use client"

import { BaseCard } from "./base-card"
import { Badge } from "@/components/ui/badge"
import { TrendIndicator } from "@/components/ui/trend-indicator"
import type { StatusCardProps } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

export function StatusCard({ status, indicators = [], colorScheme, ...props }: StatusCardProps) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    accent: "text-[var(--app-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    ...colorScheme,
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <div className="space-y-4">
        {/* Main Status */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={cn("text-3xl font-bold", status.color)}>{status.value}</span>
            {status.trend && <TrendIndicator trend={status.trend} />}
          </div>
          <Badge className={cn("text-xs font-medium", status.color)}>{status.label}</Badge>
          {status.description && <p className={cn("text-sm mt-2", colors.contentText)}>{status.description}</p>}
        </div>

        {/* Status Indicators */}
        {indicators.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {indicators.map((indicator, index) => (
              <div key={index} className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {indicator.icon && <indicator.icon className={cn("w-4 h-4", indicator.color)} />}
                  <span className={cn("text-sm font-bold", indicator.color)}>{indicator.value}</span>
                </div>
                <p className={cn("text-xs", colors.contentText)}>{indicator.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseCard>
  )
}
