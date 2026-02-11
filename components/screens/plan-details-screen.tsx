"use client"

import { useEffect } from "react"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScreenHeader } from "@/components/ui/screen-header"
import { Icon } from '@/components/ui/icon'

interface PlanDetailsScreenProps {
  plan: any
  onBack: () => void
}

interface DailyPlan {
  date: string
  dayNumber: number
  meals: Record<string, MealItem>
  exercises: Record<string, ExerciseItem>
}

interface MealItem {
  id: string
  title: string
  items: string[]
  calories: number
  completed: boolean
}

interface ExerciseItem {
  id: string
  title: string
  activities: string[]
  duration: number
}

type ItemStatus = "completed" | "skipped" | "pending"
type RegenerationPhase = "idle" | "analyzing" | "generating" | "finalizing" | "success"

export function PlanDetailsScreen({ plan, onBack }: PlanDetailsScreenProps) {
  const [isTimelineView, setIsTimelineView] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dailyProgress, setDailyProgress] = useState<Record<string, Record<string, ItemStatus>>>({})
  const [showMenu, setShowMenu] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportOption, setExportOption] = useState<"single" | "complete">("complete")
  const [selectedExportDate, setSelectedExportDate] = useState(new Date())
  const [exportIncludes, setExportIncludes] = useState({
    meals: true,
    exercises: true,
    progress: true,
    notes: false,
  })
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [regenerateOptions, setRegenerateOptions] = useState({
    allMeals: true,
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  })
  const [regenerateComments, setRegenerateComments] = useState("")
  const [showMealInfoOverlay, setShowMealInfoOverlay] = useState(false)
  const [regenerationPhase, setRegenerationPhase] = useState<RegenerationPhase>("idle")
  const [regenerationProgress, setRegenerationProgress] = useState(0)

  // Close menu when clicking outside
  const handleClickOutside = () => setShowMenu(false)
  useEffect(() => {
    if (showMenu) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showMenu])

  // Generate daily plan data
  const generateDailyPlan = (date: Date): DailyPlan => {
    const dayNumber = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 1
    const dateStr = date.toISOString().split("T")[0]

    return {
      date: dateStr,
      dayNumber: Math.max(1, Math.min(30, dayNumber)),
      meals: {
        breakfast: {
          id: `breakfast-${date.getTime()}`,
          title: "Protein-Rich Breakfast",
          items: ["2 scrambled eggs with spinach", "1 slice whole grain toast", "1/2 avocado", "Green tea"],
          calories: 320,
          completed: true,
        },
        lunch: {
          id: `lunch-${date.getTime()}`,
          title: "Balanced Lunch",
          items: ["Grilled chicken salad", "Mixed vegetables", "Quinoa (1/2 cup)", "Olive oil dressing"],
          calories: 450,
          completed: false,
        },
        dinner: {
          id: `dinner-${date.getTime()}`,
          title: "Light Dinner",
          items: ["Baked salmon", "Steamed broccoli", "Sweet potato (small)", "Lemon water"],
          calories: 380,
          completed: false,
        },
        snacks: {
          id: `snacks-${date.getTime()}`,
          title: "Healthy Snacks",
          items: ["Greek yogurt with berries", "Handful of almonds"],
          calories: 150,
          completed: false,
        },
      },
      exercises: {
        morning: {
          id: `morning-${date.getTime()}`,
          title: "Morning Cardio",
          activities: ["20-minute brisk walk", "5-minute stretching"],
          duration: 25,
        },
        evening: {
          id: `evening-${date.getTime()}`,
          title: "Strength Training",
          activities: ["Bodyweight squats (3x10)", "Push-ups (3x8)", "Plank (3x30s)"],
          duration: 20,
        },
      },
    }
  }

  // Progress calculations
  const calculateDailyProgress = (dayPlan: DailyPlan) => {
    const allItems = [...Object.values(dayPlan.meals), ...Object.values(dayPlan.exercises)]
    const completedItems = allItems.filter((item) => item.completed)

    return {
      completed: completedItems.length,
      total: allItems.length,
      percentage: allItems.length > 0 ? Math.round((completedItems.length / allItems.length) * 100) : 0,
    }
  }

  const getItemStatus = (date: string, itemId: string): ItemStatus => {
    return dailyProgress[date]?.[itemId] || "pending"
  }

  const updateItemStatus = (date: string, itemId: string, status: ItemStatus) => {
    setDailyProgress((prev) => ({
      ...prev,
      [date]: { ...prev[date], [itemId]: status },
    }))
  }

  // Navigation
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Event handlers
  const handleShare = () => {
    setShowMenu(false)
    if (navigator.share) {
      navigator.share({
        title: "30-Day Diet Plan",
        text: "Check out my 30-day diet plan!",
      })
    }
  }

  const handleDownloadPDF = () => {
    setShowMenu(false)
    setShowExportModal(true)
  }

  const handleExportPDF = () => {
    // PDF generation logic would go here
    console.log("Exporting PDF with options:", {
      option: exportOption,
      date: exportOption === "single" ? selectedExportDate : null,
      includes: exportIncludes,
    })
    setShowExportModal(false)
    // In a real implementation, this would generate and download the PDF
  }

  const toggleExportInclude = (key: keyof typeof exportIncludes) => {
    setExportIncludes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleToggleTimeline = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTimelineView(!isTimelineView)
  }

  const handleRegenerateMeals = () => {
    // Start the regeneration animation sequence
    setRegenerationPhase("analyzing")
    setRegenerationProgress(0)

    // Phase 1: Analyzing (0-800ms)
    setTimeout(() => {
      setRegenerationProgress(25)
      setRegenerationPhase("generating")
    }, 800)

    // Phase 2: Generating (800-1800ms)
    setTimeout(() => {
      setRegenerationProgress(60)
    }, 1200)

    setTimeout(() => {
      setRegenerationProgress(85)
      setRegenerationPhase("finalizing")
    }, 1800)

    // Phase 3: Finalizing (1800-2400ms)
    setTimeout(() => {
      setRegenerationProgress(100)
      setRegenerationPhase("success")
    }, 2400)

    // Remove the auto-close timeout - let user click "View New Meals"
    // In a real implementation, this would update the meal data
    console.log("Regenerating meals with options:", {
      options: regenerateOptions,
      comments: regenerateComments,
      date: selectedDate.toISOString().split("T")[0],
    })
  }

  const handleAddMeal = () => {
    // Handle add meal logic
    console.log("Adding new meal...")
  }

  const toggleRegenerateOption = (key: keyof typeof regenerateOptions) => {
    setRegenerateOptions((prev) => {
      const newOptions = {
        ...prev,
        [key]: !prev[key],
      }

      // If selecting a specific meal, uncheck "All Meals"
      if (key !== "allMeals" && !prev[key]) {
        newOptions.allMeals = false
      }

      // If selecting "All Meals", uncheck specific meals
      if (key === "allMeals" && !prev[key]) {
        newOptions.breakfast = false
        newOptions.lunch = false
        newOptions.dinner = false
        newOptions.snacks = false
      }

      return newOptions
    })
  }

  // Get regeneration phase content
  const getRegenerationContent = () => {
    switch (regenerationPhase) {
      case "analyzing":
        return {
          icon: <Icon name="brain" className="w-6 h-6" style={{ color: "var(--app-primary)" }} />,
          title: "Analyzing preferences...",
          subtitle: "Understanding your dietary needs",
        }
      case "generating":
        return {
          icon: <Icon name="sparkles" className="w-6 h-6" style={{ color: "var(--app-primary)" }} />,
          title: "Creating new meals...",
          subtitle: "AI is crafting personalized options",
        }
      case "finalizing":
        return {
          icon: <Icon name="loader" className="w-6 h-6 animate-spin" style={{ color: "var(--app-primary)" }} />,
          title: "Finalizing your plan...",
          subtitle: "Adding nutritional balance",
        }
      case "success":
        return {
          icon: <Icon name="check" className="w-6 h-6" style={{ color: "var(--app-primary)" }} />,
          title: "Success!",
          subtitle: "New meals have been generated",
        }
      default:
        return null
    }
  }

  // Current data
  const dailyPlan = generateDailyPlan(selectedDate)
  const currentProgress = calculateDailyProgress(dailyPlan)

  // Status Button Component
  const StatusButton = ({
    itemId,
    date,
    currentStatus,
  }: { itemId: string; date: string; currentStatus: ItemStatus }) => {
    const getNextStatus = (): ItemStatus => {
      switch (currentStatus) {
        case "pending":
          return "completed"
        case "completed":
          return "skipped"
        case "skipped":
          return "pending"
        default:
          return "completed"
      }
    }

    const getStatusIcon = () => {
      switch (currentStatus) {
        case "completed":
          return <Icon name="checkCircle" className="w-4 h-4 text-green-600" />
        case "skipped":
          return <Icon name="close" className="w-4 h-4 text-red-600" />
        default:
          return <Icon name="clock" className="w-4 h-4 text-gray-400" />
      }
    }

    const getStatusColor = () => {
      switch (currentStatus) {
        case "completed":
          return "bg-green-100 border-green-200"
        case "skipped":
          return "bg-red-100 border-red-200"
        default:
          return "bg-gray-100 border-[var(--ds-border-default)]"
      }
    }

    return (
      <button
        onClick={() => updateItemStatus(date, itemId, getNextStatus())}
        className={`p-2 rounded-full border transition-colors ${getStatusColor()}`}
      >
        {getStatusIcon()}
      </button>
    )
  }

  // Meal Card Component
  const MealCard = ({ mealType, meal, date }: { mealType: string; meal: MealItem; date: string }) => (
    <div className="border border-[var(--ds-border-default)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900 capitalize">{mealType}</h4>
          <p className="text-sm text-[var(--ds-text-secondary)]">{meal.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {meal.calories} cal
          </Badge>
          <StatusButton itemId={meal.id} date={date} currentStatus={getItemStatus(date, meal.id)} />
        </div>
      </div>
      <ul className="text-sm text-[var(--ds-text-secondary)] space-y-1">
        {meal.items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )

  // Exercise Card Component
  const ExerciseCard = ({ timeType, exercise, date }: { timeType: string; exercise: ExerciseItem; date: string }) => (
    <div className="border border-[var(--ds-border-default)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900 capitalize">{timeType}</h4>
          <p className="text-sm text-[var(--ds-text-secondary)]">{exercise.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {exercise.duration} min
          </Badge>
          <StatusButton itemId={exercise.id} date={date} currentStatus={getItemStatus(date, exercise.id)} />
        </div>
      </div>
      <ul className="text-sm text-[var(--ds-text-secondary)] space-y-1">
        {exercise.activities.map((activity, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            {activity}
          </li>
        ))}
      </ul>
    </div>
  )

  // Calendar View Component
  const CalendarView = () => (
    <div className="p-4 space-y-4">
      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-[var(--ds-surface-primary)] rounded-lg p-2 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigateDate("prev")} className="h-7 w-7">
          <Icon name="chevronLeft" className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <h3 className="font-medium text-gray-900 text-sm">{formatDate(selectedDate)}</h3>
          <p className="text-xs text-[var(--ds-text-secondary)]">Day {dailyPlan.dayNumber} of 30</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigateDate("next")} className="h-7 w-7">
          <Icon name="chevronRight" className="w-4 h-4" />
        </Button>
      </div>

      {/* Daily Progress */}
      <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--app-primary)" }}></div>
              <h3 className="font-medium text-gray-900">Daily Progress</h3>
            </div>
            <div className="text-sm text-[var(--ds-text-secondary)]">
              {currentProgress.completed}/{currentProgress.total} completed
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${currentProgress.percentage}%`,
                  backgroundColor: "var(--status-success)",
                }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-[var(--ds-text-secondary)]">
              <span>Keep going!</span>
              <span>{currentProgress.percentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Action Bar */}
      <div className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border-0 p-3">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegenerateModal(true)}
            className="flex items-center gap-2 text-sm h-9 px-4 flex-1"
          >
            <Icon name="rotateLeft" className="w-4 h-4" />
            Regenerate Meals
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddMeal}
            className="flex items-center gap-2 text-sm h-9 px-4 flex-1 bg-transparent"
          >
            <Icon name="plus" className="w-4 h-4" />
            Add Meal
          </Button>
        </div>
      </div>

      {/* Meals Section */}
      <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
        <CardContent className="p-4">
          {/* Clean Header with Info Icon Close to Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Icon name="restaurant" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
              <h3 className="font-semibold text-gray-900">Today's Meals</h3>
              <button
                onClick={() => setShowMealInfoOverlay(true)}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors ml-1"
                title="Meal plan rationale"
              >
                <Icon name="info" className="w-4 h-4" />
              </button>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Object.values(dailyPlan.meals).reduce((total, meal) => total + meal.calories, 0)} cal
            </Badge>
          </div>

          {/* Meal Cards */}
          <div className="space-y-4">
            {Object.entries(dailyPlan.meals).map(([mealType, meal]) => (
              <MealCard key={meal.id} mealType={mealType} meal={meal} date={dailyPlan.date} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercises Section */}
      <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fitnessCenter" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
            <h3 className="font-semibold text-gray-900">Today's Exercises</h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {Object.values(dailyPlan.exercises).reduce((total, exercise) => total + exercise.duration, 0)} min
            </Badge>
          </div>
          <div className="space-y-4">
            {Object.entries(dailyPlan.exercises).map(([timeType, exercise]) => (
              <ExerciseCard key={exercise.id} timeType={timeType} exercise={exercise} date={dailyPlan.date} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Timeline View Component
  const TimelineView = () => (
    <div className="p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 mb-4">30-Day Timeline</h3>
      {Array.from({ length: 30 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index)
        const dayPlan = generateDailyPlan(date)

        return (
          <Card key={index} className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Day {index + 1}</h4>
                  <p className="text-sm text-[var(--ds-text-secondary)]">{date.toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  {[...Object.values(dayPlan.meals), ...Object.values(dayPlan.exercises)].map((item, itemIndex) => {
                    const status = getItemStatus(dayPlan.date, item.id)
                    return (
                      <div
                        key={itemIndex}
                        className={`w-2 h-2 rounded-full ${
                          status === "completed" ? "bg-[var(--ds-status-success)]" : status === "skipped" ? "bg-[var(--ds-status-error)]" : "bg-gray-300"
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Meals</p>
                  <p className="text-[var(--ds-text-secondary)]">{Object.keys(dayPlan.meals).length} planned</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Exercises</p>
                  <p className="text-[var(--ds-text-secondary)]">
                    {Object.values(dayPlan.exercises).reduce((total, ex) => total + ex.duration, 0)} min
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs bg-transparent"
                onClick={() => {
                  setSelectedDate(date)
                  setIsTimelineView(false)
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header Only */}
      <div className="flex items-center justify-between py-4 px-4">
        {/* Back Button - Circular */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>
        
        {/* Title Section */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-[var(--card-header-text)]">
            30-Day Plan
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Your personalized journey</p>
        </div>
        
        {/* 3-dot menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
          >
            <Icon name="moreVertical" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-[var(--ds-surface-primary)] rounded-lg shadow-lg border border-[var(--ds-border-default)] py-1 z-50 min-w-[180px]">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[var(--ds-surface-secondary)] flex items-center gap-2"
                >
                  <Icon name="download" className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[var(--ds-surface-secondary)] flex items-center gap-2"
                >
                  <Icon name="share" className="w-4 h-4" />
                  Share
                </button>
                <div className="border-t border-[var(--ds-border-default)] my-1"></div>
                <div className="px-4 py-2 flex items-center justify-between hover:bg-[var(--ds-surface-secondary)]">
                  <span className="text-sm font-medium text-gray-700">Timeline</span>
                  <button
                    onClick={handleToggleTimeline}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
                    style={{
                      backgroundColor: isTimelineView ? "var(--app-primary)" : "#d1d5db",
                    }}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-[var(--ds-surface-primary)] transition-transform ${
                        isTimelineView ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Content - Direct Conditional Rendering with icon in scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Image Section - Now in scrollable area */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--icon-bg-primary)" }}
            >
              <Calendar className="w-10 h-10" style={{ color: "var(--app-primary)" }} />
            </div>
          </div>
        </div>
        {isTimelineView ? <TimelineView /> : <CalendarView />}
      </div>

      {/* Meal Info Overlay */}
      {showMealInfoOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-[var(--ds-surface-primary)] rounded-t-3xl w-full max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-900">Meal Plan Rationale</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowMealInfoOverlay(false)} className="h-8 w-8">
                <Icon name="close" className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 space-y-6">
              {/* Why do we recommend this? */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--ds-interactive-primary)] rounded-full" />
                  <h4 className="font-semibold text-gray-900">Why do we recommend this?</h4>
                </div>
                <div className="pl-4 text-gray-700 leading-relaxed">
                  This meal plan is specifically designed to work synergistically with Semaglutide. The combination of
                  <strong> high-quality proteins</strong>, <strong>complex carbohydrates</strong>, and{" "}
                  <strong>healthy fats</strong> helps optimize the medication's effectiveness while supporting your
                  metabolic health and weight management goals.
                </div>
              </div>

              {/* How this will help you? */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--ds-status-success)] rounded-full" />
                  <h4 className="font-semibold text-gray-900">How this will help you?</h4>
                </div>
                <div className="pl-4 space-y-2 text-gray-700 leading-relaxed">
                  <div>
                    <strong>Enhanced Satiety:</strong> Protein-rich meals work with Semaglutide to keep you feeling full
                    longer, reducing cravings and overeating.
                  </div>
                  <div>
                    <strong>Better Blood Sugar Control:</strong> Low-glycemic foods prevent blood sugar spikes,
                    complementing the medication's glucose-regulating effects.
                  </div>
                  <div>
                    <strong>Sustainable Weight Loss:</strong> Balanced macronutrients support steady energy levels while
                    promoting healthy, gradual weight reduction.
                  </div>
                </div>
              </div>

              {/* What should you be on the lookout for? */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <h4 className="font-semibold text-gray-900">What should you be on the lookout for?</h4>
                </div>
                <div className="pl-4 space-y-2 text-gray-700 leading-relaxed">
                  <div>
                    <strong>Portion Awareness:</strong> Start with smaller portions as Semaglutide increases satiety -
                    you may feel full sooner than expected.
                  </div>
                  <div>
                    <strong>Hydration:</strong> Drink plenty of water throughout the day, especially if you experience
                    any digestive changes.
                  </div>
                  <div>
                    <strong>Meal Timing:</strong> Eat slowly and mindfully to allow the medication's satiety signals to
                    register properly.
                  </div>
                  <div>
                    <strong>Side Effect Management:</strong> If you experience nausea, try eating smaller, more frequent
                    meals and avoid high-fat foods initially.
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="px-6 pb-6">
              <Button onClick={() => setShowMealInfoOverlay(false)} className="w-full h-12">
                Got it, thanks!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export PDF Modal */}
      {showExportModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--ds-surface-primary)] rounded-xl p-6 w-full max-w-sm border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="download" className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Export Diet Plan</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <Icon name="close" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Export Options:</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-[var(--ds-surface-secondary)]">
                    <input
                      type="radio"
                      name="exportOption"
                      value="single"
                      checked={exportOption === "single"}
                      onChange={(e) => setExportOption(e.target.value as "single")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-900">Single Day</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-[var(--ds-surface-secondary)]">
                    <input
                      type="radio"
                      name="exportOption"
                      value="complete"
                      checked={exportOption === "complete"}
                      onChange={(e) => setExportOption(e.target.value as "complete")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-900">Complete Plan (30d)</span>
                  </label>
                </div>
              </div>

              {exportOption === "single" && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Date:</label>
                  <select
                    value={selectedExportDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedExportDate(new Date(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-[var(--ds-surface-primary)] text-gray-900"
                  >
                    {Array.from({ length: 30 }, (_, index) => {
                      const date = new Date()
                      date.setDate(date.getDate() + index)
                      return (
                        <option key={index} value={date.toISOString().split("T")[0]}>
                          {date.toLocaleDateString()} - Day {index + 1}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Include in PDF:</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportIncludes.meals}
                      onChange={() => toggleExportInclude("meals")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-900">Meal Details</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportIncludes.exercises}
                      onChange={() => toggleExportInclude("exercises")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-900">Exercise Plans</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportIncludes.progress}
                      onChange={() => toggleExportInclude("progress")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-900">Progress Tracking Sheets</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportIncludes.notes}
                      onChange={() => toggleExportInclude("notes")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-900">Personal Notes Section</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowExportModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleExportPDF} className="flex-1">
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Meals Modal */}
      {showRegenerateModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--ds-surface-primary)] rounded-xl p-6 w-full max-w-sm border shadow-lg">
            {regenerationPhase === "idle" ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="rotateLeft" className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Regenerate Meals</h3>
                  </div>
                  <button onClick={() => setShowRegenerateModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                    <Icon name="close" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Select meals to regenerate:</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regenerateOptions.allMeals}
                          onChange={() => toggleRegenerateOption("allMeals")}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-900 font-medium">All meals for today</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regenerateOptions.breakfast}
                          onChange={() => toggleRegenerateOption("breakfast")}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-900">Breakfast only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regenerateOptions.lunch}
                          onChange={() => toggleRegenerateOption("lunch")}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-900">Lunch only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regenerateOptions.dinner}
                          onChange={() => toggleRegenerateOption("dinner")}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-900">Dinner only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regenerateOptions.snacks}
                          onChange={() => toggleRegenerateOption("snacks")}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-900">Snacks only</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Food preferences or requests:
                    </label>
                    <textarea
                      value={regenerateComments}
                      onChange={(e) => setRegenerateComments(e.target.value)}
                      placeholder="e.g., I want more protein, avoid dairy, include Mediterranean dishes..."
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-[var(--ds-surface-primary)] text-gray-900 resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-[var(--ds-text-secondary)] mt-1">Optional: Tell us what kind of food you'd like</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setShowRegenerateModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleRegenerateMeals} className="flex-1">
                      Regenerate
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Animation Content */}
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                    <div className="relative flex items-center justify-center w-12 h-12">
                      {getRegenerationContent()?.icon}
                      {regenerationPhase !== "success" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
                            style={{
                              borderTopColor: "var(--app-primary)",
                              borderRightColor: "var(--app-primary)",
                              borderBottomColor: "transparent",
                              borderLeftColor: "transparent",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{getRegenerationContent()?.title}</h3>
                  <p className="text-sm text-[var(--ds-text-secondary)] mb-6">{getRegenerationContent()?.subtitle}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="h-2 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${regenerationProgress}%`,
                        backgroundColor: "var(--app-primary)",
                      }}
                    />
                  </div>

                  <div className="text-xs text-[var(--ds-text-secondary)] mb-6">{regenerationProgress}% complete</div>

                  {regenerationPhase === "success" && (
                    <div className="space-y-3">
                      <div
                        className="p-3 rounded-lg border"
                        style={{
                          backgroundColor: "var(--chip-bg-primary)",
                          borderColor: "var(--chip-border-primary)",
                        }}
                      >
                        <p className="text-sm font-medium" style={{ color: "var(--app-primary)" }}>
                          ✨ Your personalized meals are ready!
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          // In a real implementation, this would refresh the meal data
                          // For now, we'll just close the modal and reset state
                          setShowRegenerateModal(false)
                          setRegenerationPhase("idle")
                          setRegenerationProgress(0)
                          setRegenerateComments("")

                          // Here you would typically:
                          // 1. Fetch new meal data from API
                          // 2. Update the dailyPlan state with new meals
                          // 3. Show a toast notification confirming the update
                        }}
                        className="w-full"
                        style={{ backgroundColor: "var(--app-primary)" }}
                      >
                        View New Meals
                      </Button>
                    </div>
                  )}
                </div>

                {/* Add spinning animation keyframes */}
                <style jsx>{`
                  @keyframes spin {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
