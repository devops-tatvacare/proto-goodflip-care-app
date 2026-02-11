"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { useScreenNavigation } from "@/lib/hooks/use-screen-navigation"
import { useModal } from "@/lib/hooks/use-modal"
import { GoalModal } from "@/components/modals/goal-modal"
import { ReminderModal } from "@/components/modals/reminder-modal"
import { DataSourcesScreen } from "./data-sources-screen"

type TimeRange = "3M" | "6M" | "1Y" | "2Y"
type ViewMode = "trends" | "calendar"
type MenstrualScreen = "main" | "history" | "data-sources"

interface CycleData {
  id: string
  startDate: string
  endDate?: string
  cycleLength: number
  periodLength: number
  flow: "Light" | "Medium" | "Heavy"
  symptoms: string[]
  mood: string
  notes: string
  predicted?: boolean
}

interface MenstrualDetailViewProps {
  title?: string
  onClose?: () => void
}

export function MenstrualDetailView({ title = "Menstruation Logs", onClose }: MenstrualDetailViewProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("6M")
  const [viewMode, setViewMode] = useState<ViewMode>("trends")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentCycle, setCurrentCycle] = useState<CycleData | null>(null)
  const [isLoggingPeriod, setIsLoggingPeriod] = useState(false)
  const [aiInsight, setAiInsight] = useState<string>("")
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)
  const { currentScreen, navigateTo, goBack } = useScreenNavigation<MenstrualScreen>("main")
  
  // Modals
  const goalModal = useModal()
  const reminderModal = useModal()

  // Generate cycle data with predictions
  const generateCycleData = (): CycleData[] => {
    const cycles: CycleData[] = []
    const today = new Date()
    const months = selectedTimeRange === "3M" ? 3 : selectedTimeRange === "6M" ? 6 : selectedTimeRange === "1Y" ? 12 : 24
    
    // Generate historical cycles
    for (let i = 0; i < months; i++) {
      const cycleStart = new Date(today)
      cycleStart.setMonth(today.getMonth() - i)
      cycleStart.setDate(Math.floor(Math.random() * 5) + 1)
      
      const cycleLength = Math.floor(Math.random() * 7) + 25 // 25-31 days
      const periodLength = Math.floor(Math.random() * 3) + 4 // 4-6 days
      
      const endDate = new Date(cycleStart)
      endDate.setDate(cycleStart.getDate() + periodLength - 1)
      
      cycles.push({
        id: `cycle-${i}`,
        startDate: cycleStart.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        cycleLength,
        periodLength,
        flow: ["Light", "Medium", "Heavy"][Math.floor(Math.random() * 3)] as any,
        symptoms: generateSymptoms(),
        mood: ["Happy", "Neutral", "Sad", "Irritable", "Anxious"][Math.floor(Math.random() * 5)],
        notes: `Cycle ${i + 1} data`,
        predicted: false
      })
    }

    // Add predicted cycles
    const lastCycle = cycles[0]
    if (lastCycle) {
      const avgCycleLength = cycles.reduce((sum, c) => sum + c.cycleLength, 0) / cycles.length
      
      for (let i = 1; i <= 3; i++) {
        const nextStart = new Date(lastCycle.startDate)
        nextStart.setDate(nextStart.getDate() + (avgCycleLength * i))
        
        const nextEnd = new Date(nextStart)
        nextEnd.setDate(nextStart.getDate() + lastCycle.periodLength - 1)
        
        cycles.unshift({
          id: `predicted-${i}`,
          startDate: nextStart.toISOString().split("T")[0],
          endDate: nextEnd.toISOString().split("T")[0],
          cycleLength: Math.round(avgCycleLength),
          periodLength: lastCycle.periodLength,
          flow: lastCycle.flow,
          symptoms: [],
          mood: "",
          notes: "Predicted cycle",
          predicted: true
        })
      }
    }

    return cycles.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }

  const generateSymptoms = () => {
    const allSymptoms = ["Cramps", "Headache", "Bloating", "Breast Tenderness", "Fatigue", "Mood Swings", "Acne", "Back Pain"]
    const numSymptoms = Math.floor(Math.random() * 4) + 1
    const symptoms = []
    
    for (let i = 0; i < numSymptoms; i++) {
      const symptom = allSymptoms[Math.floor(Math.random() * allSymptoms.length)]
      if (!symptoms.includes(symptom)) {
        symptoms.push(symptom)
      }
    }
    
    return symptoms
  }

  const cycles = generateCycleData()
  const currentCycleData = cycles.find(c => !c.predicted) || cycles[0]

  // Calculate cycle insights
  const avgCycleLength = cycles.filter(c => !c.predicted).reduce((sum, c) => sum + c.cycleLength, 0) / cycles.filter(c => !c.predicted).length
  const nextPeriodDate = cycles.find(c => c.predicted)?.startDate
  const daysUntilPeriod = nextPeriodDate ? Math.ceil((new Date(nextPeriodDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

  const handleAskKaira = async () => {
    setIsLoadingInsight(true)
    setTimeout(() => {
      setAiInsight(`Based on your cycle patterns, you have a ${Math.round(avgCycleLength)}-day average cycle. Your next period is predicted in ${daysUntilPeriod} days. Your cycles show good regularity with typical variations. Consider tracking symptoms to identify patterns and discuss any concerns with your healthcare provider.`)
      setIsLoadingInsight(false)
    }, 2000)
  }

  const handleLogPeriod = () => {
    setIsLoggingPeriod(true)
    // In a real app, this would open a modal to log period details
    setTimeout(() => {
      setIsLoggingPeriod(false)
      // Add new cycle entry
    }, 1000)
  }

  const handleSetGoal = (value: number) => {
    console.log(`Setting cycle goal to:`, value)
    goalModal.close()
  }

  const handleSetReminder = (reminderData: any) => {
    console.log(`Setting period reminder:`, reminderData)
    reminderModal.close()
  }

  // Calendar generation
  const generateCalendar = () => {
    const calendar = []
    const today = new Date()
    const currentMonth = selectedDate.getMonth()
    const currentYear = selectedDate.getFullYear()
    
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + (week * 7) + day)
        
        const dateStr = currentDate.toISOString().split("T")[0]
        const cycleForDate = cycles.find(c => 
          dateStr >= c.startDate && 
          c.endDate && 
          dateStr <= c.endDate
        )
        
        weekDays.push({
          date: currentDate,
          isCurrentMonth: currentDate.getMonth() === currentMonth,
          isToday: dateStr === today.toISOString().split("T")[0],
          hasPeriod: !!cycleForDate,
          isPredicted: cycleForDate?.predicted || false,
          flow: cycleForDate?.flow
        })
      }
      calendar.push(weekDays)
      
      if (weekDays[6].date > lastDay) break
    }
    
    return calendar
  }

  // History Screen
  if (currentScreen === "history") {
    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-7 h-7 rounded-full border border-[var(--ds-border-default)] flex items-center justify-center hover:bg-[var(--ds-surface-secondary)] transition-colors"
            >
              <Icon name="chevronLeft" className="w-3.5 h-3.5 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-sm font-semibold text-gray-900">Cycle History</h2>
            <div className="w-7" />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="space-y-1">
              {cycles.filter(c => !c.predicted).map((cycle) => (
                <div key={cycle.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {new Date(cycle.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-[10px] text-[var(--ds-text-secondary)]">
                      Cycle: {cycle.cycleLength} days • Period: {cycle.periodLength} days • {cycle.flow}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      cycle.flow === "Heavy" ? "bg-red-100 text-red-700" :
                      cycle.flow === "Medium" ? "bg-orange-100 text-orange-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {cycle.flow}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScreenLayout>
    )
  }

  // Data Sources Screen
  if (currentScreen === "data-sources") {
    return <DataSourcesScreen onBack={goBack} currentMetric={title} />
  }

  const calendar = generateCalendar()

  // Main Screen
  return (
    <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
      {/* Compact Header */}
      <div className="px-3 py-1.5 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">Period Tracker</h2>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => reminderModal.open()}
                className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[var(--ds-text-secondary)]" style={{ fontSize: "16px" }}>notifications</span>
              </button>
              <button 
                onClick={() => goalModal.open()}
                className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[var(--ds-text-secondary)]" style={{ fontSize: "16px" }}>target</span>
              </button>
              <button 
                onClick={handleLogPeriod}
                disabled={isLoggingPeriod}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity bg-pink-500"
              >
                <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: "16px" }}>
                  {isLoggingPeriod ? "hourglass_empty" : "add"}
                </span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{daysUntilPeriod} days</p>
            <p className="text-[10px] text-[var(--ds-text-secondary)]">until next period</p>
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {[
            { key: "trends", label: "Trends", icon: "trending_up" },
            { key: "calendar", label: "Calendar", icon: "calendar_month" }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as ViewMode)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                viewMode === mode.key
                  ? "bg-[var(--ds-surface-primary)] text-pink-600 shadow-sm"
                  : "text-[var(--ds-text-secondary)] hover:text-gray-700"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "trends" && (
          <div className="px-3 py-1.5">
            {/* Current Cycle Info */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 mb-3 border border-pink-100">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Current Cycle</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">{Math.round(avgCycleLength)}</div>
                  <div className="text-[10px] text-[var(--ds-text-secondary)]">Avg Cycle Length</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">{currentCycleData?.periodLength || 5}</div>
                  <div className="text-[10px] text-[var(--ds-text-secondary)]">Avg Period Length</div>
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Cycle Trends</h3>
              <div className="inline-flex rounded-md bg-gray-100 p-0.5">
                {(["3M", "6M", "1Y", "2Y"] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                      selectedTimeRange === range
                        ? "bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm"
                        : "text-[var(--ds-text-secondary)] hover:text-gray-700"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Cycle Length Chart */}
            <div className="bg-gray-50 rounded-lg p-2 mb-3">
              <div className="text-[10px] font-medium text-[var(--ds-text-secondary)] mb-2">Cycle Length (Days)</div>
              <div className="relative h-24">
                <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-between text-[8px] text-gray-400">
                  <span>35</span>
                  <span>28</span>
                  <span>21</span>
                </div>
                <div className="ml-5 h-full flex items-end justify-between gap-0.5">
                  {cycles.filter(c => !c.predicted).slice(0, 8).reverse().map((cycle, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className="w-full rounded-t transition-all hover:opacity-80"
                        style={{
                          height: `${(cycle.cycleLength / 35) * 100}%`,
                          backgroundColor: cycle.cycleLength >= 25 && cycle.cycleLength <= 31 ? "#ec4899" : "#94a3b8",
                          minHeight: "1px"
                        }}
                      />
                      <span className="text-[8px] text-gray-400 mt-0.5">
                        {new Date(cycle.startDate).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">AI Insights</h3>
              
              {!aiInsight ? (
                <button
                  onClick={handleAskKaira}
                  disabled={isLoadingInsight}
                  className="w-full py-2 rounded-lg font-medium text-xs text-[var(--ds-text-inverse)] transition-all hover:opacity-90 disabled:opacity-50 bg-gradient-to-r from-pink-500 to-pink-600"
                >
                  {isLoadingInsight ? "Analyzing..." : "Ask Kaira"}
                </button>
              ) : (
                <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg p-2.5 border border-blue-100/50">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: "14px" }}>auto_awesome</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[var(--ds-text-secondary)] leading-relaxed">{aiInsight}</p>
                      <button
                        onClick={handleAskKaira}
                        className="mt-1.5 text-[10px] font-medium text-pink-500"
                      >
                        Refresh →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === "calendar" && (
          <div className="px-3 py-1.5">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
              </button>
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="chevronRight" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-50 rounded-lg p-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-[10px] font-medium text-[var(--ds-text-secondary)] py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {calendar.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <button
                      key={dayIndex}
                      className={`aspect-square text-[10px] rounded transition-colors relative ${
                        !day.isCurrentMonth 
                          ? "text-gray-300" 
                          : day.isToday 
                            ? "bg-pink-500 text-[var(--ds-text-inverse)] font-medium" 
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day.date.getDate()}
                      {day.hasPeriod && (
                        <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                          day.isPredicted 
                            ? "bg-pink-300 opacity-60" 
                            : day.flow === "Heavy" 
                              ? "bg-[var(--ds-status-error)]" 
                              : day.flow === "Medium" 
                                ? "bg-pink-500" 
                                : "bg-pink-300"
                        }`} />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-[var(--ds-text-secondary)]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[var(--ds-status-error)] rounded-full" />
                Heavy
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                Medium
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-300 rounded-full" />
                Light
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-300 opacity-60 rounded-full" />
                Predicted
              </div>
            </div>
          </div>
        )}

        {/* History & Data Sources */}
        <div className="px-3 pb-2 space-y-1">
          <button
            onClick={() => navigateTo("history")}
            className="w-full bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs font-medium text-gray-700">Show All Data</span>
            <Icon name="chevronRight" className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => navigateTo("data-sources")}
            className="w-full bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs font-medium text-gray-700">Data Sources & Access</span>
            <Icon name="chevronRight" className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <GoalModal
        title="Cycle Tracking Goal"
        isOpen={goalModal.isOpen}
        onClose={goalModal.close}
        onSave={handleSetGoal}
      />

      <ReminderModal
        isOpen={reminderModal.isOpen}
        onClose={reminderModal.close}
        onSave={handleSetReminder}
        metricType="Period Tracking"
      />
    </div>
  )
}