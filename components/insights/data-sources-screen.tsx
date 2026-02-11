"use client"

import { ScreenLayout } from "@/components/layouts/screen-layout"

interface DataSourcesScreenProps {
  onBack: () => void
  currentMetric: string
}

export function DataSourcesScreen({ onBack, currentMetric }: DataSourcesScreenProps) {
  const getSourcesForMetric = (metric: string) => {
    switch (metric) {
      case "Medication Logs":
        return ["Health App (Manual Entry)"]
      case "Water Logs":
        return ["Health App (Manual Entry)"]
      case "Sleep Logs":
        return ["Health App (Manual Entry)", "Sleep Tracker", "Smart Watch"]
      case "Steps Logs":
        return ["Health App (Manual Entry)", "Mobile Device", "Smart Watch"]
      default:
        return ["Health App (Manual Entry)"]
    }
  }

  const sources = getSourcesForMetric(currentMetric)

  return (
    <ScreenLayout title="Data Sources" onBack={onBack}>
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-3">
          <div className="bg-[var(--ds-surface-primary)] rounded-lg p-3 border border-[var(--ds-border-default)]">
            <h3 className="font-medium text-gray-800 mb-2">{currentMetric}</h3>
            <div className="text-sm text-[var(--ds-text-secondary)] space-y-1">
              {sources.map((source, index) => (
                <p key={index}>• {source}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  )
}
