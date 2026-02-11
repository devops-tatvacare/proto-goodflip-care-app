"use client"

import { cn } from "@/lib/utils"

interface MiniChartProps {
  data: number[] | Array<{ date: string; value: number }>
  className?: string
  color?: string
  goalValue?: number
  hideLabels?: boolean
}

export function MiniChart({ data, className, color = "var(--app-primary)", goalValue, hideLabels }: MiniChartProps) {
  if (!data || data.length === 0) {
    return <div className={cn("h-16 w-full bg-gray-100 rounded overflow-hidden", className)} />
  }

  // Handle both array formats
  const chartData =
    Array.isArray(data) && typeof data[0] === "object"
      ? (data as Array<{ date: string; value: number }>).map((d) => d.value)
      : (data as number[])

  const chartMax = Math.max(...chartData)
  const chartMin = Math.min(...chartData)
  const range = chartMax - chartMin || 1

  return (
    <div className={cn("relative h-16 w-full overflow-hidden", className)}>
      <div className="absolute inset-0 flex items-end justify-center gap-0.5 p-1">
        {chartData.map((value, index) => {
          const heightPercent = range > 0 ? ((value - chartMin) / range) * 100 : 0
          const safeHeight = Math.max(heightPercent, 5)

          return (
            <div
              key={index}
              className="flex-1 rounded-t-sm transition-all duration-300 max-h-full"
              style={{
                height: `${safeHeight}%`,
                backgroundColor: color,
              }}
            />
          )
        })}
      </div>

      {/* Goal line overlay */}
      {goalValue && goalValue > 0 && chartMax > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed opacity-60"
            style={{
              borderColor: color,
              top: `${100 - (goalValue / chartMax) * 90 + 10}%`,
            }}
          />
          <div
            className="absolute right-1 text-xs font-medium px-1 py-0.5 rounded text-[var(--ds-text-inverse)]"
            style={{
              backgroundColor: color,
              top: `${100 - (goalValue / chartMax) * 90 + 10 - 12}%`,
            }}
          >
            Goal
          </div>
        </div>
      )}
    </div>
  )
}
