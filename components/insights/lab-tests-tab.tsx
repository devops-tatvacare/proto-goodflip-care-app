"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'
import { StatusIndicator } from "@/components/ui/universal-status-badge"
import { TrendIndicator } from "@/components/ui/trend-indicator"
import { LAB_REPORTS } from "@/lib/constants/data"
import type { LabReport } from "@/lib/types"

interface LabTestsTabProps {
  onViewPDF?: (reportId: string) => void
}

export function LabTestsTab({ onViewPDF }: LabTestsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Group reports by test type
  const groupedReports = LAB_REPORTS.reduce(
    (acc, report) => {
      if (!acc[report.name]) {
        acc[report.name] = []
      }
      acc[report.name].push(report)
      return acc
    },
    {} as Record<string, LabReport[]>,
  )

  // Sort reports within each group by date (newest first)
  Object.keys(groupedReports).forEach((testName) => {
    groupedReports[testName].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  const categories = ["All", ...new Set(LAB_REPORTS.map((report) => report.category))]

  const filteredReports =
    selectedCategory === "All"
      ? groupedReports
      : Object.fromEntries(
          Object.entries(groupedReports).filter(([_, reports]) => reports[0].category === selectedCategory),
        )

  const getOverallTrend = (reports: LabReport[]) => {
    if (reports.length < 2) return "stable"

    const latest = reports[0]
    const previous = reports[1]

    const statusScore = (status: string) => {
      switch (status) {
        case "Normal":
          return 4
        case "Good":
          return 3
        case "Needs Attention":
          return 2
        case "Critical":
          return 1
        default:
          return 3
      }
    }

    const latestScore = statusScore(latest.status)
    const previousScore = statusScore(previous.status)

    if (latestScore > previousScore) return "up"
    if (latestScore < previousScore) return "down"
    return "stable"
  }

  const getInsightSummary = (testName: string, reports: LabReport[]) => {
    const insights = {
      "Complete Blood Count (CBC)":
        "Your blood parameters show consistent improvement over time. Hemoglobin levels have increased from 12.8 to 13.2 g/dL, indicating better iron absorption likely due to consistent medication adherence and improved hydration habits.",
      "Lipid Profile":
        "Significant improvement in cardiovascular health markers. Total cholesterol decreased from 285 to 220 mg/dL (23% reduction) following dietary modifications and increased physical activity. Your step count improvements correlate with better lipid management.",
      "Liver Function Test":
        "Liver function remains excellent with all parameters within normal range. Your consistent medication adherence and adequate hydration (averaging 1,850ml daily) support optimal liver health.",
    }
    return (
      insights[testName as keyof typeof insights] ||
      "Test results are being monitored for trends and correlations with your health habits."
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-[var(--ds-text-secondary)] hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Lab Test Summaries */}
      <div className="space-y-6">
        {Object.entries(filteredReports).map(([testName, reports]) => {
          const latestReport = reports[0]
          const trend = getOverallTrend(reports)

          return (
            <Card key={testName} className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
              <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Icon name="science" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-sm font-bold text-gray-800">{testName}</CardTitle>
                        <StatusIndicator status={latestReport.status} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--ds-text-secondary)]">
                        <span>{latestReport.date}</span>
                        <span>•</span>
                        <span>
                          {reports.length} report{reports.length > 1 ? "s" : ""}
                        </span>
                        <TrendIndicator trend={trend} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* AI Insight Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Icon name="sparkles" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">AI Health Insights</h4>
                      <p className="text-xs text-purple-600">Based on your health data correlation</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-700 leading-relaxed">{getInsightSummary(testName, reports)}</p>
                </div>

                {/* Key Parameters Grid */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Icon name="glucose" className="w-4 h-4" />
                    Latest Results
                  </h4>
                  <div
                    className="flex gap-3 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {latestReport.results.map((result, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-[var(--ds-border-default)] min-w-[140px] flex-shrink-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700">{result.parameter}</span>
                          <TrendIndicator trend={result.trend} />
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-lg font-bold text-gray-800">{result.value}</span>
                          <span className="text-xs text-[var(--ds-text-secondary)]">{result.unit}</span>
                        </div>
                        <div className="text-xs text-[var(--ds-text-secondary)]">Normal: {result.range}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test History */}
                {reports.length > 1 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Icon name="calendar" className="w-4 h-4" />
                      Test History
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div
                        className="flex gap-2 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        <style jsx>{`
                          div::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>
                        {/* Generate 4 test reports */}
                        {Array.from({ length: 4 }, (_, index) => {
                          const report = reports[index] || {
                            id: `generated-${index}`,
                            date: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            }),
                            time: "10:30 AM",
                            status: index === 0 ? "Normal" : ["Good", "Normal", "Needs Attention"][index % 3],
                          }

                          return (
                            <div
                              key={report.id}
                              onClick={() => onViewPDF?.(report.id)}
                              className="bg-[var(--ds-surface-primary)] rounded-lg border border-[var(--ds-border-default)] hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group min-w-[120px] flex-shrink-0 p-3"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="relative">
                                  <div
                                    className={`w-2 h-2 rounded-full ${index === 0 ? "bg-[var(--ds-interactive-primary)]" : "bg-gray-300"}`}
                                  ></div>
                                  {index === 0 && (
                                    <div className="absolute -inset-0.5 bg-[var(--ds-interactive-primary)] rounded-full animate-ping opacity-20"></div>
                                  )}
                                </div>
                                <Icon name="fileText" className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-gray-800">{report.date}</div>
                                <div className="text-xs text-[var(--ds-text-secondary)]">{report.time}</div>
                                <StatusIndicator status={report.status} />
                              </div>
                            </div>
                          )
                        })}

                        {/* More Link Card */}
                        <div
                          onClick={() => {
                            // Navigate to records screen lab tests tab with CBC filter
                            const event = new CustomEvent("navigate-to-records", {
                              detail: {
                                tab: "lab-tests",
                                filter: "CBC",
                                testName: testName,
                              },
                              bubbles: true,
                            })

                            // Dispatch the event
                            document.dispatchEvent(event)

                            // Store filter in sessionStorage for persistence
                            try {
                              sessionStorage.setItem(
                                "recordsFilter",
                                JSON.stringify({
                                  tab: "lab-tests",
                                  filter: "CBC",
                                  timestamp: Date.now(),
                                }),
                              )
                            } catch (error) {
                              console.warn("Failed to store filter in sessionStorage:", error)
                            }

                            // Alternative approach: Use a global state or context if available
                            if (typeof window !== "undefined" && window.parent) {
                              window.parent.postMessage(
                                {
                                  type: "NAVIGATE_TO_RECORDS",
                                  payload: {
                                    tab: "lab-tests",
                                    filter: "CBC",
                                  },
                                },
                                "*",
                              )
                            }

                            // Debug logging
                            console.log("Navigation event dispatched:", {
                              tab: "lab-tests",
                              filter: "CBC",
                              testName: testName,
                            })
                          }}
                          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group min-w-[120px] flex-shrink-0 p-3 flex flex-col items-center justify-center"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Icon name="chevronRight" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-blue-700">More</div>
                            <div className="text-xs text-blue-600">+{Math.max(0, reports.length - 4)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {latestReport.recommendations && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Icon name="heart" className="w-4 h-4 text-[var(--ds-status-error)]" />
                      Recommendations
                    </h4>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
                      <div className="space-y-2">
                        {latestReport.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-[var(--ds-status-success)] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-[var(--ds-text-inverse)] text-xs font-bold">{index + 1}</span>
                            </div>
                            <div className="bg-[var(--ds-surface-primary)] rounded-lg p-2 flex-1 border border-green-200">
                              <span className="text-sm text-green-800">{rec}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
