"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'

interface TreatmentJourneyCardProps {
  onNavigate: () => void
}

export function TreatmentJourneyCard({ onNavigate }: TreatmentJourneyCardProps) {
  const treatmentItems = [
    {
      id: "completed",
      label: "Cycles Completed",
      value: "3",
      icon: (props: any) => <Icon name="checkCircle" {...props} />,
    },
    {
      id: "next",
      label: "Next Cycle",
      value: "April 20, 2025",
      icon: (props: any) => <Icon name="clock" {...props} />,
    },
  ]

  return (
    <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <CardContent className="p-3">
        {/* Header with drill-down */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="calendar" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            <h3 className="font-semibold text-gray-900">Treatment Journey</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full transition-colors h-8 w-8"
            onClick={onNavigate}
          >
            <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        {/* Treatment Items */}
        <div className="space-y-1">
          {treatmentItems.map((item) => {
            const ItemIcon = item.icon
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--icon-bg-primary)" }}
                  >
                    <ItemIcon className="w-3 h-3" style={{ color: "var(--app-primary)" }} />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{item.value}</span>
              </div>
            )
          })}
        </div>

        {/* Banner */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div
            className="rounded-lg p-3"
            style={{
              background: `linear-gradient(135deg, var(--banner-bg-start), var(--banner-bg-end))`,
              border: `1px solid var(--banner-border)`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--icon-bg-secondary)" }}
                >
                  <Icon name="upload" className="w-3 h-3" style={{ color: "var(--app-primary)" }} />
                </div>
                <span className="text-sm font-medium text-gray-800">Upload your documents for your next cycle</span>
              </div>
              <Button
                variant="default"
                size="sm"
                className="text-xs font-medium px-3 py-1.5 h-auto rounded-md shadow-sm"
                style={{
                  backgroundColor: "var(--app-primary)",
                  color: "var(--ds-text-inverse)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--app-primary-hover)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--app-primary)"
                }}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
