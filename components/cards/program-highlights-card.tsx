"use client"

import { Icon } from '@/components/ui/icon'
import { BaseCard } from "./base-card"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ProgramHighlightsCardProps {
  onLearnMore: () => void
  className?: string
}

export function ProgramHighlightsCard({ onLearnMore, className }: ProgramHighlightsCardProps) {
  const progressMetrics = [
    { label: "Liver Function", improvement: "+48%" },
    { label: "Symptom Relief", improvement: "+70%" },
    { label: "Adherence Rate", improvement: "80%" },
  ]

  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <BaseCard
      className={cn("overflow-hidden", className)}
      header={{
        title: "Program Highlights",
        icon: (props: any) => <Icon name="award" {...props} />,
        iconColor: "text-[var(--app-primary)]",
      }}
    >
      <div className="space-y-3">
        {/* Learn More Section - HIDDEN */}
        <div
          onClick={onLearnMore}
          className="hidden flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 cursor-pointer hover:shadow-sm transition-shadow"
        >
          <div className="flex-1">
            <h3 className="font-medium text-[var(--text-primary)] text-sm">Care Program Overview</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Comprehensive liver care with dedicated specialists
            </p>
          </div>
          <Icon name="chevronRight" className="w-4 h-4 text-[var(--text-muted)]" />
        </div>

        {/* AI Summary Section - Always Open */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between p-3 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                <Icon name="sparkles" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
              </div>
              <div>
                <h3 className="font-medium text-purple-800 text-sm">Progress Summary</h3>
              </div>
            </div>
            <Icon name="trendingUp" className="w-4 h-4 text-green-600" />
          </div>

          <div className="px-3 pb-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {progressMetrics.map((metric, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 27}`}
                        strokeDashoffset="0"
                        className="transition-all duration-300"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--chart-blue)" />
                          <stop offset="50%" stopColor="var(--chart-purple)" />
                          <stop offset="100%" stopColor="var(--chart-pink)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="font-bold text-gray-900" style={{ fontSize: "75%" }}>
                        {metric.improvement}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--ds-text-secondary)] text-center">{metric.label}</div>
                </div>
              ))}
            </div>
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-[var(--ds-surface-primary)]/40 rounded-md cursor-pointer hover:bg-[var(--ds-surface-primary)]/60 transition-colors"
            >
              <div className="flex items-center justify-between p-2">
                <span className="text-xs font-medium text-purple-700">
                  {isExpanded ? "Hide Details" : "Show Progress Details"}
                </span>
                <Icon name="chevronDown" className={`w-3 h-3 text-purple-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>

              {isExpanded && (
                <div className="px-2 pb-2">
                  <div className="bg-[var(--ds-surface-primary)]/60 rounded-md p-2">
                    <p className="text-xs text-purple-700 leading-relaxed">
                      <strong>Excellent progress!</strong> Your liver function has improved significantly with 70%
                      reduction in symptoms. Continue current treatment plan for optimal recovery.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <p className="text-xs text-purple-600">For reference only</p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
