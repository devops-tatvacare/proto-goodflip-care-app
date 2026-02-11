"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { CircularProgress } from "@/components/ui/circular-progress"
import { MiniChart } from "@/components/charts/mini-chart"
import type { LucideIcon } from "../../lib/icons"

interface InsightCardProps {
  header: {
    title: string
    icon: LucideIcon
    iconColor: string
    showNavigation?: boolean
    onNavigate?: () => void
    actions?: Array<{
      icon: LucideIcon
      onClick: () => void
      label: string
    }>
  }
  insight: {
    value: number | string
    unit: string
    description: string
    chartData?: Array<{ date: string; value: number }>
    hasData: boolean
  }
  controls?: {
    goalValue?: number
  }
  colorScheme: {
    accent: string
    headerText: string
  }
  onViewDetails?: () => void
  onStartLogging?: () => void
  onSetReminder?: () => void
}

export function InsightCard({
  header,
  insight,
  controls,
  colorScheme,
  onViewDetails,
  onStartLogging,
  onSetReminder,
}: InsightCardProps) {
  const IconComponent = header.icon
  const progressValue = typeof insight.value === "number" ? insight.value : 0
  const goalValue = controls?.goalValue || 100

  return (
    <Card className="bg-[var(--bg-primary)] border-[var(--border-color)] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${header.iconColor} p-2 rounded-lg`}>
              <IconComponent className="w-5 h-5 text-[var(--app-primary)]" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)]">{header.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {header.actions?.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className="h-8 w-8 p-0 hover:bg-[var(--bg-secondary)]"
                title={action.label}
              >
                <action.icon className="w-4 h-4 text-[var(--text-secondary)]" />
              </Button>
            ))}
            {header.showNavigation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={header.onNavigate}
                className="h-8 w-8 p-0 hover:bg-[var(--bg-secondary)]"
              >
                <Icon name="chevronRight" className="w-4 h-4 text-[var(--text-secondary)]" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {insight.hasData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">{insight.value}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{insight.unit}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-1">{insight.description}</p>
              </div>
              <div className="flex-shrink-0">
                <CircularProgress
                  value={progressValue}
                  max={goalValue}
                  size={60}
                  strokeWidth={6}
                  className="text-[var(--app-primary)]"
                />
              </div>
            </div>

            {insight.chartData && insight.chartData.length > 0 && (
              <div className="relative">
                <MiniChart data={insight.chartData} color="var(--app-primary)" goalValue={goalValue} />
                {goalValue > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed opacity-60"
                      style={{
                        borderColor: "var(--app-primary)",
                        top: `${100 - (goalValue / Math.max(...insight.chartData.map((d) => d.value), goalValue)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute right-0 text-xs font-medium px-1 py-0.5 rounded text-[var(--app-primary)] bg-[var(--bg-primary)]"
                      style={{
                        top: `${100 - (goalValue / Math.max(...insight.chartData.map((d) => d.value), goalValue)) * 100 - 12}%`,
                      }}
                    >
                      Goal: {goalValue}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={onViewDetails}
              variant="outline"
              className="w-full border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] bg-transparent"
            >
              View Details
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
              <IconComponent className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-secondary)] mb-2">No data yet</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">{insight.description}</p>
            <Button
              onClick={onStartLogging}
              className="bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]"
            >
              Start Logging
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
