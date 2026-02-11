"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'
import type { InsightData, LogEntry } from "@/lib/types"
import { DataSourcesScreen } from "./data-sources-screen"
import { MedicationTrendsChart } from "@/components/charts/medication-trends-chart"
import { MedicationModal } from "@/components/modals/medication-modal"
import { GoalModal } from "@/components/modals/goal-modal"
import { ReminderModal } from "@/components/modals/reminder-modal"
import { useModal } from "@/lib/hooks/use-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MetricDetailViewProps {
  title: string
  data: InsightData
  onClose?: () => void
}

export function MetricDetailView({ title, data, onClose }: MetricDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showDataSources, setShowDataSources] = useState(false)
  const [chartPeriod, setChartPeriod] = useState<"D" | "W" | "M" | "Y">("W")
  const [trendSummary, setTrendSummary] = useState<string | null>(null)
  const [isGeneratingTrend, setIsGeneratingTrend] = useState(false)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  // Medication management state
  const [medications, setMedications] = useState<string[]>(["Paracetamol", "Vitamin D", "Aspirin", "Actibile", "Dolo"])
  const medicationModal = useModal()
  const goalModal = useModal()
  const reminderModal = useModal()

  const handleAddMedication = (medication: string) => {
    setMedications((prev) => [...prev, medication])
  }

  const handleRemoveMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSetGoals = () => {
    goalModal.open()
  }

  const handleSetReminder = () => {
    reminderModal.open()
  }

  const generateLogData = (): LogEntry[] => {
    const logs: LogEntry[] = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      if (title === "Medication Logs") {
        const times = ["08:00", "14:00", "20:00"]
        medications.forEach((med, index) => {
          for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
            logs.push({
              id: `${dateStr}-${index}`,
              date: dateStr,
              time: times[timeIndex],
              medication: med,
              dosage: "1 tablet",
              status: Math.random() > 0.1 ? "Taken" : "Missed",
              notes: `${med} taken as prescribed`,
              dataSource: Math.random() > 0.3 ? "Synced from Device" : "Logged in App",
            })
          }
        })
      } else if (title === "Water Logs") {
        const amounts = [200, 300, 500, 250, 400]
        amounts.forEach((amount, index) => {
          logs.push({
            id: `${dateStr}-${index}`,
            date: dateStr,
            time: `${8 + index * 2}:00`,
            amount: `${amount}ml`,
            type: "Water",
            status: "Logged",
            dataSource: Math.random() > 0.3 ? "Synced from Device" : "Logged in App",
          })
        })
      } else if (title === "Sleep Logs") {
        logs.push({
          id: `${dateStr}-sleep`,
          date: dateStr,
          bedtime: "22:30",
          wakeup: "06:30",
          duration: "8h 0m",
          quality: ["Poor", "Fair", "Good", "Excellent"][Math.floor(Math.random() * 4)],
          dataSource: Math.random() > 0.3 ? "Synced from Device" : "Logged in App",
        })
      } else if (title === "Steps Logs") {
        logs.push({
          id: `${dateStr}-steps`,
          date: dateStr,
          steps: Math.floor(Math.random() * 5000) + 5000,
          distance: `${(Math.random() * 3 + 2).toFixed(1)}km`,
          calories: Math.floor(Math.random() * 200) + 200,
          status: "Synced",
          dataSource: Math.random() > 0.3 ? "Synced from Device" : "Logged in App",
        })
      }
    }

    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const generateChartData = () => {
    const chartData = []
    const today = new Date()
    let periods = 7

    switch (chartPeriod) {
      case "D":
        periods = 24
        break
      case "W":
        periods = 7
        break
      case "M":
        periods = 30
        break
      case "Y":
        periods = 12
        break
    }

    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today)
      if (chartPeriod === "D") {
        date.setHours(today.getHours() - i)
      } else if (chartPeriod === "W") {
        date.setDate(today.getDate() - i)
      } else if (chartPeriod === "M") {
        date.setDate(today.getDate() - i)
      } else {
        date.setMonth(today.getMonth() - i)
      }

      let value = 0
      if (title === "Medication Logs") {
        value = Math.floor(Math.random() * 5) + 3
      } else if (title === "Water Logs") {
        value = Math.floor(Math.random() * 1000) + 1500
      } else if (title === "Sleep Logs") {
        value = Math.floor(Math.random() * 2) + 7
      } else if (title === "Steps Logs") {
        value = Math.floor(Math.random() * 5000) + 5000
      } else if (title === "Fatigue Logs") {
        value = Math.floor(Math.random() * 6) + 3
      }

      chartData.push({
        label: chartPeriod === "D" ? `${date.getHours()}:00` : 
               chartPeriod === "W" ? date.toLocaleDateString("en-US", { weekday: "short" }) :
               chartPeriod === "M" ? `${date.getMonth() + 1}/${date.getDate()}` :
               date.toLocaleDateString("en-US", { month: "short" }),
        value: value,
        date: date.toISOString().split("T")[0],
      })
    }

    return chartData
  }

  const generateTrendSummary = async () => {
    setIsGeneratingTrend(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const metricName = title.replace(" Logs", "")
    const periodName = chartPeriod === "D" ? "Daily" : chartPeriod === "W" ? "Weekly" : chartPeriod === "M" ? "Monthly" : "Yearly"

    setTrendSummary(`**${periodName} ${metricName} Analysis**

Based on your ${periodName.toLowerCase()} ${metricName.toLowerCase()} data, here are key insights:

**Trends Observed:**
• Your ${metricName.toLowerCase()} patterns show consistent improvement over the selected period
• Peak activity typically occurs during mid-period timeframes
• There's a positive correlation with your overall health metrics

**Recommendations:**
• Continue maintaining your current ${metricName.toLowerCase()} routine
• Consider setting reminders during low-activity periods
• Track additional factors that might influence these patterns

**Health Impact:**
Regular ${metricName.toLowerCase()} monitoring contributes significantly to your overall wellness journey. The data shows you're on the right track for achieving your health goals.`)

    setIsGeneratingTrend(false)
  }

  const logData = generateLogData()
  const filteredData = logData.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(log).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilters =
      selectedFilters.length === 0 || selectedFilters.some((filter) => Object.values(log).includes(filter))

    return matchesSearch && matchesFilters
  })

  const getFilters = () => {
    if (title === "Medication Logs") {
      return [...medications, "Taken", "Missed"]
    } else if (title === "Water Logs") {
      return ["200ml", "300ml", "500ml", "Water"]
    } else if (title === "Sleep Logs") {
      return ["Poor", "Fair", "Good", "Excellent"]
    } else if (title === "Steps Logs") {
      return ["Synced", "Manual"]
    }
    return []
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (showDataSources) {
    return <DataSourcesScreen onBack={() => setShowDataSources(false)} currentMetric={title} />
  }

  const chartData = generateChartData()
  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--app-login-gradient)" }}>
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-gradient-to-br from-green-200/20 to-transparent rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Chart Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-5 py-4 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {title !== "Medication Logs" && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["D", "W", "M", "Y"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period as "D" | "W" | "M" | "Y")}
                      className={`px-4 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                        chartPeriod === period
                          ? "bg-[var(--ds-surface-primary)] text-[var(--app-primary)] shadow-sm"
                          : "text-[var(--ds-text-secondary)] hover:text-gray-800"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
              {title === "Medication Logs" && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["D", "W"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period as "D" | "W")}
                      className={`px-4 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                        chartPeriod === period
                          ? "bg-[var(--ds-surface-primary)] text-[var(--app-primary)] shadow-sm"
                          : "text-[var(--ds-text-secondary)] hover:text-gray-800"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              {title === "Medication Logs" && (
                <button
                  onClick={() => medicationModal.open()}
                  className="p-2.5 bg-[var(--app-primary)] text-[var(--ds-text-inverse)] rounded-lg hover:bg-[var(--app-primary-hover)] transition-colors"
                  title="Add Medication"
                >
                  <span className="material-symbols-outlined text-xl">medication</span>
                </button>
              )}
              {(title === "Water Logs" || title === "Sleep Logs" || title === "Steps Logs" || title === "Fatigue Logs") && (
                <>
                  <button
                    onClick={() => goalModal.open()}
                    className="p-2.5 bg-[var(--app-primary)] text-[var(--ds-text-inverse)] rounded-lg hover:bg-[var(--app-primary-hover)] transition-colors"
                    title="Set Goals"
                  >
                    <span className="material-symbols-outlined text-xl">target</span>
                  </button>
                  <button
                    onClick={() => reminderModal.open()}
                    className="p-2.5 bg-gray-600 text-[var(--ds-text-inverse)] rounded-lg hover:bg-gray-700 transition-colors"
                    title="Set Reminder"
                  >
                    <span className="material-symbols-outlined text-xl">notifications</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {title === "Medication Logs" ? (
            <MedicationTrendsChart selectedPeriod={chartPeriod as "D" | "W"} medications={medications} />
          ) : (
            <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="relative w-full">
                <div className="flex items-end justify-between gap-1 pb-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center group flex-1">
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-8 bg-gradient-to-t from-[var(--app-primary)] to-[var(--app-primary-light)] rounded-t-sm transition-all duration-300 group-hover:opacity-80 mb-2"
                          style={{
                            height: `${(item.value / maxValue) * 120}px`,
                            minHeight: "4px",
                          }}
                        />
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-900 text-[var(--ds-text-inverse)] text-sm px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                          {item.value}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 mt-1.5 text-center truncate w-full">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-5 py-4 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-xl text-[var(--app-primary)]">auto_awesome</span>
              AI Insights
            </h4>
            <Button
              onClick={generateTrendSummary}
              disabled={isGeneratingTrend}
              size="sm"
              className="bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]"
            >
              {isGeneratingTrend ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                "Generate Analysis"
              )}
            </Button>
          </div>
          
          {trendSummary && (
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {trendSummary.split('\n').map((line, index) => (
                <p key={index} className={line.startsWith('**') ? 'font-semibold text-gray-900 mt-3 mb-1' : 'mb-2'}>
                  {line.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* View History Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-5 py-4 shadow-lg shadow-black/10">
          <button
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-xl text-[var(--app-primary)]">history</span>
              View History
            </h4>
            <span className="material-symbols-outlined text-xl text-[var(--ds-text-secondary)]">
              {isHistoryExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>

        {/* Data Sources Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-5 py-4 shadow-lg shadow-black/10">
          <button
            onClick={() => setShowDataSources(true)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-xl text-[var(--app-primary)]">database</span>
              Data Sources
            </h4>
            <span className="material-symbols-outlined text-xl text-[var(--ds-text-secondary)]">chevron_right</span>
          </button>
        </div>

        {/* Collapsible History Section */}
        {isHistoryExpanded && (
          <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl shadow-lg shadow-black/10">
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-gray-900">History</h4>
                <button
                  onClick={() => setIsHistoryExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-xl text-[var(--ds-text-secondary)]">expand_less</span>
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">search</span>
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-5 py-2.5 border border-[var(--ds-border-default)] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
                  />
                </div>

                {getFilters().length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="material-symbols-outlined text-xl text-[var(--ds-text-secondary)]">filter_list</span>
                    {getFilters().map((filter) => (
                      <button
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                          selectedFilters.includes(filter)
                            ? "bg-[var(--app-primary)] text-[var(--ds-text-inverse)]"
                            : "bg-gray-100 text-[var(--ds-text-secondary)] hover:bg-gray-200"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* History List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredData.length === 0 ? (
                <div className="p-8 text-center text-[var(--ds-text-secondary)]">
                  <span className="material-symbols-outlined text-6xl mx-auto mb-4 text-gray-300 block">database</span>
                  <p className="text-base">No entries found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredData.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-[var(--ds-surface-secondary)] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-medium text-gray-900">
                              {formatDate(log.date)}
                            </span>
                            {log.time && (
                              <span className="text-sm text-[var(--ds-text-secondary)]">{log.time}</span>
                            )}
                          </div>
                          
                          {title === "Medication Logs" && (
                            <div className="text-base text-gray-700">
                              <span className="font-medium">{log.medication}</span> - {log.dosage}
                              <span className={`ml-2.5 px-3 py-1 rounded-full text-sm ${
                                log.status === "Taken" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          )}
                          
                          {title === "Water Logs" && (
                            <div className="text-base text-gray-700">
                              <span className="font-medium">{log.amount}</span> of {log.type}
                            </div>
                          )}
                          
                          {title === "Sleep Logs" && (
                            <div className="text-base text-gray-700">
                              <span className="font-medium">{log.duration}</span> 
                              <span className="mx-2">•</span>
                              Quality: <span className="font-medium">{log.quality}</span>
                            </div>
                          )}
                          
                          {title === "Steps Logs" && (
                            <div className="text-base text-gray-700">
                              <span className="font-medium">{log.steps?.toLocaleString()} steps</span>
                              <span className="mx-2">•</span>
                              {log.distance}
                            </div>
                          )}
                        </div>
                        
                        <span className="text-sm text-gray-400 ml-5">
                          {log.dataSource}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MedicationModal
        isOpen={medicationModal.isOpen}
        onClose={medicationModal.close}
        medications={medications}
        onAdd={handleAddMedication}
        onRemove={handleRemoveMedication}
      />

      <GoalModal
        title={title}
        isOpen={goalModal.isOpen}
        onClose={goalModal.close}
        onSave={(value) => console.log("Goal saved:", value)}
      />

      <ReminderModal 
        isOpen={reminderModal.isOpen} 
        onClose={reminderModal.close} 
        onSave={(data) => console.log("Reminder saved:", data)} 
      />
    </div>
  )
}