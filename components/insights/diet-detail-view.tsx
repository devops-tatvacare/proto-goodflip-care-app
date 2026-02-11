"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { PlanDetailsScreen } from "@/components/screens/plan-details-screen"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GoalModal } from "@/components/modals/goal-modal"
import { ReminderModal } from "@/components/modals/reminder-modal"
import { DataSourcesScreen } from "./data-sources-screen"
import { useModal } from "@/lib/hooks/use-modal"

interface DietDetailViewProps {
  title: string
}

type NutrientType = "calories" | "carbs" | "protein" | "fiber" | "fat"
type ChartPeriod = "D" | "W" | "M" | "Y"

export function DietDetailView({ title }: DietDetailViewProps) {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("W")
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientType>("calories")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)
  const [showDataSources, setShowDataSources] = useState(false)
  const [showPlanDetails, setShowPlanDetails] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [trendSummary, setTrendSummary] = useState<string | null>(null)
  const [isGeneratingTrend, setIsGeneratingTrend] = useState(false)

  const goalModal = useModal()
  const reminderModal = useModal()

  const nutrients = [
    { id: "calories", label: "Calories", unit: "kcal" },
    { id: "carbs", label: "Carbs", unit: "g" },
    { id: "protein", label: "Protein", unit: "g" },
    { id: "fiber", label: "Fiber", unit: "g" },
    { id: "fat", label: "Fat", unit: "g" },
  ]

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

    const baseValues = {
      calories: 2000,
      carbs: 250,
      protein: 150,
      fiber: 25,
      fat: 65,
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

      const baseValue = baseValues[selectedNutrient]
      const variation = baseValue * 0.2 * (Math.random() - 0.5)
      const value = Math.round(baseValue + variation)

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

  const generateDietData = () => {
    const logs: any[] = []
    const today = new Date()
    const meals = ["Breakfast", "Lunch", "Dinner", "Snack"]
    const foods = [
      "Grilled Chicken Salad", "Quinoa Bowl", "Greek Yogurt", "Almonds",
      "Salmon with Vegetables", "Avocado Toast", "Protein Smoothie", "Apple with Peanut Butter"
    ]

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      meals.forEach((meal, mealIndex) => {
        if (Math.random() > 0.15) { // 85% chance of having each meal
          const food = foods[Math.floor(Math.random() * foods.length)]
          const calories = Math.floor(Math.random() * 400) + 200
          
          logs.push({
            id: `${dateStr}-${mealIndex}`,
            date: dateStr,
            time: mealIndex === 0 ? "08:00" : mealIndex === 1 ? "13:00" : mealIndex === 2 ? "19:00" : "15:30",
            meal: meal,
            food: food,
            calories: calories,
            carbs: Math.floor(calories * 0.45 / 4),
            protein: Math.floor(calories * 0.25 / 4),
            fat: Math.floor(calories * 0.30 / 9),
            fiber: Math.floor(Math.random() * 8) + 2,
            status: Math.random() > 0.1 ? "Logged" : "Missed",
            dataSource: Math.random() > 0.4 ? "Manual Entry" : "Photo Recognition",
          })
        }
      })
    }

    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const generateTrendSummary = async () => {
    setIsGeneratingTrend(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    const nutrientName = nutrients.find(n => n.id === selectedNutrient)?.label || "Nutrition"
    const periodName = chartPeriod === "D" ? "Daily" : chartPeriod === "W" ? "Weekly" : chartPeriod === "M" ? "Monthly" : "Yearly"

    setTrendSummary(`**${periodName} ${nutrientName} Analysis**

Based on your ${periodName.toLowerCase()} nutrition data, here are key insights:

**Nutritional Trends:**
• Your ${nutrientName.toLowerCase()} intake shows consistent patterns with your health goals
• Peak intake typically occurs during main meal periods
• There's good balance across different meal types throughout the tracking period

**Recommendations:**
• Continue maintaining your balanced nutrition approach
• Consider meal prep strategies for consistent nutrient timing
• Focus on whole foods to optimize ${nutrientName.toLowerCase()} quality

**Health Impact:**
Regular nutrition tracking helps maintain optimal energy levels and supports your overall wellness journey. Your current patterns show you're making good progress toward balanced nutrition goals.`)

    setIsGeneratingTrend(false)
  }

  const logData = generateDietData()
  const filteredData = logData.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(log).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilters =
      selectedFilters.length === 0 || selectedFilters.some((filter) => Object.values(log).includes(filter))

    return matchesSearch && matchesFilters
  })

  const getFilters = () => {
    return ["Breakfast", "Lunch", "Dinner", "Snack", "Logged", "Missed", "Manual Entry", "Photo Recognition"]
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

  if (showPlanDetails && selectedPlan) {
    return (
      <PlanDetailsScreen
        plan={selectedPlan}
        onBack={() => {
          setShowPlanDetails(false)
          setSelectedPlan(null)
        }}
      />
    )
  }

  const chartData = generateChartData()
  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--app-login-gradient)" }}>
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-16 right-10 w-28 h-28 bg-gradient-to-br from-orange-200/25 to-transparent rounded-full blur-lg"></div>
        <div className="absolute top-40 left-12 w-20 h-20 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-md"></div>
        <div className="absolute bottom-24 right-16 w-36 h-36 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-xl"></div>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Nutrient Selector */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-4 py-3 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {nutrients.map((nutrient) => (
                <button
                  key={nutrient.id}
                  onClick={() => setSelectedNutrient(nutrient.id as NutrientType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    selectedNutrient === nutrient.id
                      ? "bg-orange-500 text-[var(--ds-text-inverse)] shadow-sm"
                      : "bg-gray-100 text-[var(--ds-text-secondary)] hover:bg-gray-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">restaurant</span>
                  {nutrient.label}
                </button>
              ))}
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goalModal.open()}
                className="p-2 bg-orange-500 text-[var(--ds-text-inverse)] rounded-lg hover:bg-orange-600 transition-colors"
                title="Set Nutrition Goals"
              >
                <span className="material-symbols-outlined text-lg">target</span>
              </button>
              <button
                onClick={() => reminderModal.open()}
                className="p-2 bg-gray-600 text-[var(--ds-text-inverse)] rounded-lg hover:bg-gray-700 transition-colors"
                title="Meal Reminders"
              >
                <span className="material-symbols-outlined text-lg">notifications</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-4 py-3 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium text-gray-900">
              {nutrients.find(n => n.id === selectedNutrient)?.label} Trends
            </h4>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["D", "W", "M", "Y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period as ChartPeriod)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    chartPeriod === period
                      ? "bg-[var(--ds-surface-primary)] text-orange-600 shadow-sm"
                      : "text-[var(--ds-text-secondary)] hover:text-gray-800"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="relative w-full">
              <div className="flex items-end justify-between gap-1 pb-6">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center group flex-1">
                    <div className="relative w-full flex justify-center">
                      <div
                        className="w-8 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm transition-all duration-300 group-hover:opacity-80 mb-2"
                        style={{
                          height: `${(item.value / maxValue) * 120}px`,
                          minHeight: "4px",
                        }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-[var(--ds-text-inverse)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        {item.value} {nutrients.find(n => n.id === selectedNutrient)?.unit}
                      </div>
                    </div>
                    <span className="text-xs text-gray-700 mt-1 text-center truncate w-full">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-4 py-3 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-orange-500">auto_awesome</span>
              AI Insights
            </h4>
            <Button
              onClick={generateTrendSummary}
              disabled={isGeneratingTrend}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-[var(--ds-text-inverse)]"
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
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-4 py-3 shadow-lg shadow-black/10">
          <button
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-orange-500">history</span>
              View History
            </h4>
            <span className="material-symbols-outlined text-lg text-[var(--ds-text-secondary)]">
              {isHistoryExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>

        {/* Data Sources Section */}
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-b border-[var(--ds-border-default)]/50 px-4 py-3 shadow-lg shadow-black/10">
          <button
            onClick={() => setShowDataSources(true)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-orange-500">database</span>
              Data Sources
            </h4>
            <span className="material-symbols-outlined text-lg text-[var(--ds-text-secondary)]">chevron_right</span>
          </button>
        </div>

        {/* Collapsible History Section */}
        {isHistoryExpanded && (
          <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl shadow-lg shadow-black/10">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-medium text-gray-900">Meal History</h4>
                <button
                  onClick={() => setIsHistoryExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-lg text-[var(--ds-text-secondary)]">expand_less</span>
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Search meals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[var(--ds-border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="material-symbols-outlined text-lg text-[var(--ds-text-secondary)]">filter_list</span>
                  {getFilters().map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedFilters.includes(filter)
                          ? "bg-orange-500 text-[var(--ds-text-inverse)]"
                          : "bg-gray-100 text-[var(--ds-text-secondary)] hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredData.length === 0 ? (
                <div className="p-8 text-center text-[var(--ds-text-secondary)]">
                  <span className="material-symbols-outlined text-5xl mx-auto mb-3 text-gray-300 block">restaurant</span>
                  <p className="text-sm">No meal entries found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredData.map((log) => (
                    <div key={log.id} className="p-3 hover:bg-[var(--ds-surface-secondary)] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(log.date)}
                            </span>
                            <span className="text-xs text-[var(--ds-text-secondary)]">{log.time}</span>
                            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                              {log.meal}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">{log.food}</span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[var(--ds-text-secondary)]">
                            <span>{log.calories} kcal</span>
                            <span>{log.carbs}g carbs</span>
                            <span>{log.protein}g protein</span>
                            <span>{log.fat}g fat</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            log.status === "Logged" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {log.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {log.dataSource}
                          </span>
                        </div>
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
      <GoalModal
        title={title}
        isOpen={goalModal.isOpen}
        onClose={goalModal.close}
        onSave={(value) => console.log("Nutrition goal saved:", value)}
      />

      <ReminderModal 
        isOpen={reminderModal.isOpen} 
        onClose={reminderModal.close} 
        onSave={(data) => console.log("Meal reminder saved:", data)} 
      />
    </div>
  )
}