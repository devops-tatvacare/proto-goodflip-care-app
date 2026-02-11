"use client"

import { Icon } from '@/components/ui/icon'
import { cn } from "@/lib/utils"
import { useState } from "react"

interface HealthProgressOverviewCardProps {
  className?: string
}

export function HealthProgressOverviewCard({ className }: HealthProgressOverviewCardProps) {
  const progressMetrics = [
    { label: "Weight Loss", improvement: "12% ↓" },
    { label: "Blood Sugar Control", improvement: "15% ↓" },
    { label: "Adherence Rate", improvement: "92%" },
  ]

  const [isExpanded, setIsExpanded] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)

  return (
    <>
      <div
        className={cn("rounded-lg border shadow-md hover:shadow-lg transition-shadow duration-300", className)}
        style={{
          background: `linear-gradient(135deg, var(--icon-bg-primary), var(--icon-bg-secondary))`,
          borderColor: "var(--app-primary)",
        }}
      >
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                <Icon name="sparkles" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
              </div>
              Health Progress
            </h3>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 hover:bg-[var(--ds-surface-primary)]/20 rounded-full transition-colors"
            >
              <Icon name="info" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
          </div>
        </div>

        <div className="px-4 pt-0 pb-3 space-y-2">
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
                        <stop offset="0%" stopColor="var(--app-primary)" />
                        <stop offset="50%" stopColor="var(--app-primary-light)" />
                        <stop offset="100%" stopColor="var(--status-info)" />
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
              <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                {isExpanded ? "Hide Details" : "Show Progress Details"}
              </span>
              <Icon name="chevronDown" className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                style={{ color: "var(--app-primary)" }}
              />
            </div>

            {isExpanded && (
              <div className="px-2 pb-2">
                <div className="bg-[var(--ds-surface-primary)]/60 rounded-md p-2">
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    <strong>Excellent progress!</strong> Your weight has reduced by 12% and blood sugar levels have
                    decreased by 15%. Continue current diet and exercise plan for optimal results.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 justify-center">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-info)" }} />
            <p className="text-xs text-[var(--text-secondary)]">
              For reference only
            </p>
          </div>
        </div>
      </div>

      {/* Redesigned Info Modal - Clean and Compact */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-[var(--ds-surface-primary)] rounded-t-xl w-full max-h-[65%] overflow-y-auto" 
               style={{ borderColor: "var(--border-color)" }}>
            {/* Compact Header */}
            <div className="sticky top-0 bg-[var(--ds-surface-primary)] border-b px-4 py-3" 
                 style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" 
                       style={{ backgroundColor: "var(--chip-bg-primary)" }}>
                    <Icon name="sparkles" className="w-3.5 h-3.5" style={{ color: "var(--app-primary)" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      Health Progress Metrics
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-full transition-colors hover:opacity-70"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <span className="text-lg text-[var(--text-secondary)]">×</span>
                </button>
              </div>
            </div>

            {/* Compact Content */}
            <div className="p-4 space-y-3">
              {/* Brief Description */}
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  Track key health improvements through measurable metrics over time.
                </p>
              </div>

              {/* Compact Metrics Grid */}
              <div className="space-y-2">
                {/* Weight Loss */}
                <div className="flex items-center gap-3 p-2 rounded-lg border" 
                     style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" 
                       style={{ backgroundColor: "var(--chip-bg-primary)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--app-primary)" }}>W</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                      Weight Loss
                    </h5>
                    <p className="text-xs leading-tight text-[var(--text-secondary)]">
                      Percentage weight reduction from baseline. ↓ shows positive progress.
                    </p>
                  </div>
                </div>

                {/* Blood Sugar Control */}
                <div className="flex items-center gap-3 p-2 rounded-lg border" 
                     style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" 
                       style={{ backgroundColor: "var(--chip-bg-primary)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--app-primary)" }}>B</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                      Blood Sugar Control
                    </h5>
                    <p className="text-xs leading-tight text-[var(--text-secondary)]">
                      Glucose level improvements. ↓ indicates better diabetes management.
                    </p>
                  </div>
                </div>

                {/* Adherence Rate */}
                <div className="flex items-center gap-3 p-2 rounded-lg border" 
                     style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" 
                       style={{ backgroundColor: "var(--chip-bg-primary)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--app-primary)" }}>A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                      Adherence Rate
                    </h5>
                    <p className="text-xs leading-tight text-[var(--text-secondary)]">
                      Treatment plan compliance including medications and lifestyle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact Disclaimer */}
              <div className="rounded-lg p-2.5 border-l-2" 
                   style={{ 
                     backgroundColor: "var(--bg-secondary)",
                     borderColor: "var(--app-primary)" 
                   }}>
                <p className="text-xs text-[var(--text-secondary)]">
                  <span className="font-medium">Note:</span> For reference only. Consult healthcare provider for medical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
