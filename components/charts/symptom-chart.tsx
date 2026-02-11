"use client"

import { formatDate, timeToPercentage } from "@/lib/utils/formatters"
import { CHART_CONFIG } from "@/lib/constants/chart-config"
import type { SymptomLog } from "@/lib/types"

interface SymptomChartProps {
  dates: string[]
  symptomsByDate: Record<string, SymptomLog[]>
  onDayClick: (date: string) => void
}

export function SymptomChart({ dates, symptomsByDate, onDayClick }: SymptomChartProps) {
  return (
    <div className="relative h-full">
      {/* Y-axis time labels */}
      <div
        className="absolute left-0 top-0 flex flex-col justify-between text-xs text-[var(--ds-text-secondary)] font-medium z-50 backdrop-blur-sm border-r"
        style={{
          height: `${CHART_CONFIG.height}px`,
          width: `${CHART_CONFIG.yAxisWidth}px`,
          backgroundColor: "var(--banner-bg-start)",
          borderColor: "var(--chip-border-primary)",
        }}
      >
        <div className="text-right pr-1">23:00</div>
        <div className="text-right pr-1">17:00</div>
        <div className="text-right pr-1">12:00</div>
        <div className="text-right pr-1">06:00</div>
        <div className="text-right pr-1">00:00</div>
      </div>

      {/* Scrollable content area */}
      <div
        className="absolute overflow-x-auto"
        style={{
          left: `${CHART_CONFIG.yAxisWidth}px`,
          top: 0,
          right: 0,
          height: `${CHART_CONFIG.height + CHART_CONFIG.xAxisHeight}px`,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          className="relative"
          style={{
            width: `${dates.length * CHART_CONFIG.containerWidth}px`,
            height: `${CHART_CONFIG.height + CHART_CONFIG.xAxisHeight}px`,
          }}
        >
          {/* Symptom containers */}
          <div className="absolute top-0 left-0">
            <div className="flex">
              {dates.map((date) => {
                const daySymptoms = symptomsByDate[date] || []
                return <SymptomColumn key={date} date={date} symptoms={daySymptoms} onClick={() => onDayClick(date)} />
              })}
            </div>
          </div>

          {/* X-axis date labels */}
          <div
            className="absolute"
            style={{
              top: `${CHART_CONFIG.height}px`,
              left: 0,
              height: `${CHART_CONFIG.xAxisHeight}px`,
              width: `${dates.length * CHART_CONFIG.containerWidth}px`,
              backgroundColor: "var(--banner-bg-start)",
            }}
          >
            <div className="flex pt-2">
              {dates.map((date) => (
                <div
                  key={date}
                  className="text-xs text-[var(--ds-text-secondary)] text-center font-medium flex flex-col justify-center"
                  style={{ width: `${CHART_CONFIG.containerWidth}px` }}
                >
                  <div>{formatDate(date)}</div>
                  <div className="text-gray-400 text-xs">
                    {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

function SymptomColumn({
  date,
  symptoms,
  onClick,
}: {
  date: string
  symptoms: SymptomLog[]
  onClick: () => void
}) {
  return (
    <div className="flex flex-col items-center" style={{ width: `${CHART_CONFIG.containerWidth}px` }}>
      <div
        className="relative rounded-full cursor-pointer transition-all duration-200 border-2 shadow-sm"
        style={{
          height: `${CHART_CONFIG.height}px`,
          width: "48px",
          background:
            "linear-gradient(to bottom, var(--icon-bg-primary), var(--banner-bg-start), var(--icon-bg-primary))",
          borderColor: "var(--chip-border-primary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, var(--icon-bg-secondary), var(--banner-bg-end), var(--icon-bg-secondary))"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, var(--icon-bg-primary), var(--banner-bg-start), var(--icon-bg-primary))"
        }}
        onClick={onClick}
      >
        {/* Symptom count indicator */}
        {symptoms.length > 0 && (
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 text-[var(--ds-text-inverse)] text-xs rounded-full w-5 h-5 flex items-center justify-center z-10 font-bold shadow-sm"
            style={{ backgroundColor: "var(--app-primary)" }}
          >
            {symptoms.length}
          </div>
        )}

        {/* Symptom icons positioned by time */}
        {symptoms.map((symptom) => {
          const topPercentage = timeToPercentage(symptom.time)
          return (
            <div
              key={symptom.id}
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--ds-surface-primary)] rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform duration-200 z-10 cursor-pointer"
              style={{
                top: `${Math.max(12, Math.min(88, topPercentage))}%`,
                width: `${CHART_CONFIG.iconSize}px`,
                height: `${CHART_CONFIG.iconSize}px`,
              }}
              title={`${symptom.symptom} at ${symptom.time} - Pain: ${symptom.painScale}/10`}
            >
              <symptom.icon className={`w-4 h-4 ${symptom.color}`} />
            </div>
          )
        })}

        {/* Empty state */}
        {symptoms.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-6 h-6 border-2 border-dashed rounded-full opacity-30"
              style={{ borderColor: "var(--chip-border-primary)" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
