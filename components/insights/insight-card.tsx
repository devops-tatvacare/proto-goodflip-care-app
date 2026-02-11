"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { MiniChart } from "@/components/charts/mini-chart"
import type { InsightData } from "@/lib/types"

interface InsightCardProps {
  insight: InsightData
  goalValue?: number
  onSetGoal?: () => void
  onAddMedication?: () => void
  onViewDetails: () => void
  onStartLogging?: () => void
  onSetReminder?: () => void
  hideActionButtons?: boolean
}

export function InsightCard({
  insight,
  goalValue,
  onSetGoal,
  onAddMedication,
  onViewDetails,
  onStartLogging,
  onSetReminder,
  hideActionButtons = false,
}: InsightCardProps) {
  const IconComponent = insight.icon

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                <IconComponent className="w-3 h-3 text-[var(--ds-text-inverse)]" />
              </div>
              {insight.title}
            </CardTitle>
            <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">{insight.description}</p>
          </div>
          <div className="flex items-center gap-1 self-center">
            {!hideActionButtons && (
              <>
                {insight.title === "Medication Logs" ? (
                  <button
                    onClick={onAddMedication}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors h-7 w-7"
                    title="Add Medication"
                  >
                    <Icon name="medication" className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                ) : (
                  <>
                    {insight.title === "Water Logs" && onSetReminder && (
                      <button
                        onClick={onSetReminder}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors h-7 w-7"
                        title="Add Reminder"
                      >
                        <Icon name="notifications" className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                    )}
                    {onSetGoal && (
                      <button
                        onClick={onSetGoal}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors h-7 w-7"
                        title={`Set Goal (${goalValue || 0} ${insight.unit.split(" ")[0]})`}
                      >
                        <Icon name="goal" className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            <button onClick={onViewDetails} className="p-1 hover:bg-gray-100 rounded-full transition-colors h-7 w-7">
              <Icon name="chevronRight" className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          </div>
        </div>
      </div>
      <CardContent className="px-4 pt-0 pb-3 space-y-3">

        {!insight.hasData ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <IconComponent className="w-8 h-8 opacity-50" style={{ color: "var(--accent-primary)" }} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-[var(--text-secondary)]">
              No Data Logged
            </h3>
            <p className="text-sm mb-4 max-w-sm mx-auto text-[var(--text-muted)]">
              Start tracking your {insight.title.toLowerCase()} to see insights and patterns over time.
            </p>
            <Button
              className="font-medium text-[var(--ds-text-inverse)] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--accent-primary)" }}
              onClick={onStartLogging}
            >
              Start Logging
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1 h-[51px]">
              <div
                className="rounded-lg py-1 px-1 text-center flex flex-col justify-center space-y-0.5"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <p
                  className="text-[8px] font-medium uppercase tracking-wide leading-tight text-[var(--text-muted)]"
                >
                  Average
                </p>
                <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {(() => {
                    if (!insight.chart || insight.chart.length === 0) return insight.logged

                    const average = insight.chart.reduce((sum, val) => sum + val, 0) / insight.chart.length

                    // Format based on insight type
                    switch (insight.title) {
                      case "Medication Logs":
                        return Math.round(average * 10) / 10 // Show as medications per day
                      case "Water Logs":
                        return Math.round(average)
                      case "Sleep Logs":
                        return Math.round(average * 10) / 10
                      case "Steps Logs":
                        return Math.round(average).toLocaleString()
                      default:
                        return Math.round(average * 10) / 10
                    }
                  })()}
                </p>
                <p className="text-[8px] leading-tight text-[var(--text-muted)]">
                  {insight.title === "Medication Logs" ? "medications / day" : insight.unit}
                </p>
              </div>
              <div
                className="rounded-lg py-1 px-1 text-center flex flex-col justify-center space-y-0.5"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <p
                  className="text-[8px] font-medium uppercase tracking-wide leading-tight text-[var(--text-muted)]"
                >
                  Latest
                </p>
                <p className="text-sm font-bold leading-tight" style={{ color: "var(--accent-primary)" }}>
                  {insight.title === "Steps Logs" ? insight.logged.toLocaleString() : insight.logged}
                </p>
                <p className="text-[8px] leading-tight text-[var(--text-muted)]">
                  {insight.title === "Medication Logs" ? "medications" : insight.unit.replace(" per day", "")}
                </p>
              </div>
            </div>

            <div className="rounded-xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <MiniChart
                data={insight.chart}
                color="var(--accent-primary)"
                goalValue={insight.title === "Medication Logs" ? undefined : goalValue}
                hideLabels={true}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
