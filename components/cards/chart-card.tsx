"use client"

import { BaseCard } from "./base-card"
import { SymptomChart } from "@/components/charts/symptom-chart"
import { MiniChart } from "@/components/charts/mini-chart"
import type { ChartCardProps } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

export function ChartCard({
  chartType,
  chartData,
  chartConfig = {},
  onDataPointClick,
  colorScheme,
  ...props
}: ChartCardProps) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    accent: "text-[var(--app-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    ...colorScheme,
  }

  const defaultConfig = {
    height: 240,
    showGrid: true,
    showLegend: false,
    interactive: true,
    ...chartConfig,
  }

  const renderChart = () => {
    switch (chartType) {
      case "symptom":
        return (
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="relative" style={{ height: `${defaultConfig.height + 40}px` }}>
              <SymptomChart
                dates={chartData.dates}
                symptomsByDate={chartData.symptomsByDate}
                onDayClick={onDataPointClick ?? (() => {})}
              />
            </div>
          </div>
        )

      case "trend":
      case "line":
        return (
          <div className={cn("p-4 rounded-xl", props.header?.iconColor || "bg-blue-50")}>
            <MiniChart data={chartData.data} color={colors.accent} goalValue={chartData.goalValue} />
          </div>
        )

      default:
        return (
          <div className={cn("rounded-xl p-4 text-center", colors.bgSecondary)}>
            <p className={cn("text-sm", colors.contentText)}>Chart type "{chartType}" not implemented</p>
          </div>
        )
    }
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <div className="space-y-4">
        {chartData.description && <p className={cn("text-sm", colors.contentText)}>{chartData.description}</p>}

        {renderChart()}

        {chartData.footer && (
          <div className="flex justify-between items-center text-xs text-[var(--ds-text-secondary)]">
            <span>{chartData.footer.left}</span>
            <span>{chartData.footer.right}</span>
          </div>
        )}
      </div>
    </BaseCard>
  )
}
