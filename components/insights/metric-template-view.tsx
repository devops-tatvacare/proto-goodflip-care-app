"use client"

import { useState, useRef, useEffect } from "react"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScreenNavigation } from "@/lib/hooks/use-screen-navigation"
import { useModal } from "@/lib/hooks/use-modal"
import { GoalModal } from "@/components/modals/goal-modal"
import { ReminderModal } from "@/components/modals/reminder-modal"
import { MedicationModal } from "@/components/modals/medication-modal"
import { ResponsiveMetricChart } from "@/components/charts/responsive-metric-chart"
import { CorrelationChart } from "@/components/charts/correlation-chart";
import { MedicationTrendsChart } from "@/components/charts/medication-trends-chart"
import { RechartsMetricChart } from "@/components/charts/recharts-metric-chart"

import { metricsData, MetricType, TimePeriod } from "@/lib/sample-data"
import { generateChartData, generateHistoryLogs } from "@/lib/vitals-metric-configs"

interface EnhancedHistoryEntry {
  date: string
  time: string
  mainValue: string
  unit: string
  inputs?: Array<{
    question: string
    answer: string
  }>
  outputs?: Array<{
    metric: string
    value: string
  }>
  status?: string
}

type TimeRange = "daily" | "weekly" | "monthly" | "yearly"
type MetricScreen = "main" | "history" | "data-sources" | "education" | "recipes"

// Helper function to get appropriate image for recipe
function getRecipeImage(title: string): string {
  const titleLower = title.toLowerCase()
  
  // Match titles to appropriate local images with new Downloads images
  if (titleLower.includes('breakfast') || titleLower.includes('bowl') || titleLower.includes('smoothie')) {
    return '/images/meal-planning.jpg'
  }
  if (titleLower.includes('snack') || titleLower.includes('healthy snack')) {
    return '/images/healthy-snacks.jpg'
  }
  if (titleLower.includes('bean') || titleLower.includes('protein') || titleLower.includes('quinoa')) {
    return '/images/portion-control.jpg'
  }
  if (titleLower.includes('gazpacho') || titleLower.includes('salad') || titleLower.includes('cucumber')) {
    return '/images/hydration.jpg'
  }
  if (titleLower.includes('tostada') || titleLower.includes('avocado')) {
    return '/images/healthy-snacks.jpg'
  }
  if (titleLower.includes('energy') || titleLower.includes('power')) {
    return '/images/meal-planning.jpg'
  }
  
  // Default fallback to meal planning image
  return '/images/meal-planning.jpg'
}

// Helper function to get recipe data for Diet metric
function getRecipeData() {
  return {
    "Immune Support": [
      { id: 1, title: "Black Bean and Avocado Breakfast Tostadas", calories: 384, image: getRecipeImage("Black Bean and Avocado Breakfast Tostadas") },
      { id: 2, title: "Green Cucumber Gazpacho", calories: 151, image: getRecipeImage("Green Cucumber Gazpacho") },
      { id: 3, title: "Healthy Morning Bowl", calories: 321, image: getRecipeImage("Healthy Morning Bowl") }
    ],
    "Pantry Staples": [
      { id: 4, title: "Creamy Almond Butter and Banana Smoothie", calories: 377, image: getRecipeImage("Creamy Almond Butter and Banana Smoothie") },
      { id: 5, title: "White Bean Bowl with Broccoli Pesto", calories: 343, image: getRecipeImage("White Bean Bowl with Broccoli Pesto") },
      { id: 6, title: "Protein Power Bowl", calories: 425, image: getRecipeImage("Protein Power Bowl") }
    ],
    "Pre-Workout": [
      { id: 7, title: "Energy Smoothie Bowl", calories: 289, image: getRecipeImage("Energy Smoothie Bowl") },
      { id: 8, title: "Quinoa Power Salad", calories: 356, image: getRecipeImage("Quinoa Power Salad") }
    ]
  }
}

// Helper function to get appropriate education image
function getEducationImage(title: string, metricName: string): string {
  const titleLower = title.toLowerCase()
  const metric = metricName.toLowerCase()
  
  // Specific title-based mapping first
  if (titleLower.includes('nutrition') || titleLower.includes('label')) {
    return '/images/meal-planning.jpg'
  }
  if (titleLower.includes('meal planning') || titleLower.includes('planning')) {
    return '/images/meal-planning.jpg'
  }
  if (titleLower.includes('snack') || titleLower.includes('snacking')) {
    return '/images/healthy-snacks.jpg'
  }
  if (titleLower.includes('portion') || titleLower.includes('control')) {
    return '/images/portion-control.jpg'
  }
  if (titleLower.includes('hydration') || titleLower.includes('water')) {
    return '/images/hydration.jpg'
  }
  if (titleLower.includes('dehydration') || titleLower.includes('signs')) {
    return '/images/dehydration.jpg'
  }
  if (titleLower.includes('sleep') || titleLower.includes('hygiene') || titleLower.includes('disorders')) {
    return '/images/managing-sleep.jpg'
  }
  if (titleLower.includes('walking') || titleLower.includes('health')) {
    return '/images/indoor-exercise.jpg'
  }
  if (titleLower.includes('goals') || titleLower.includes('realistic')) {
    return '/images/setting-realistic-goals.jpg'
  }
  if (titleLower.includes('indoor') || titleLower.includes('exercise')) {
    return '/images/indoor-exercise.jpg'
  }
  if (titleLower.includes('medication') || titleLower.includes('timely')) {
    return '/images/timely-medication.jpg'
  }
  if (titleLower.includes('progress') || titleLower.includes('track')) {
    return '/images/track-your-progress.jpg'
  }
  
  // Metric-based fallback
  if (metric.includes('water')) return '/images/hydration.jpg'
  if (metric.includes('sleep')) return '/images/managing-sleep.jpg'
  if (metric.includes('steps')) return '/images/indoor-exercise.jpg'
  if (metric.includes('diet')) return '/images/meal-planning.jpg'
  if (metric.includes('medication')) return '/images/timely-medication.jpg'
  if (metric.includes('blood') || metric.includes('lab')) return '/images/track-your-progress.jpg'
  if (metric.includes('weight') || metric.includes('bmi')) return '/images/track-your-progress.jpg'
  if (metric.includes('heart') || metric.includes('cardiovascular')) return '/images/track-your-progress.jpg'
  if (metric.includes('glucose') || metric.includes('sugar')) return '/images/track-your-progress.jpg'
  
  // Default fallback
  return '/images/track-your-progress.jpg'
}

// Generate enhanced history logs with inputs and outputs based on health assistant flows
function generateEnhancedHistoryLogs(config: MetricConfig, count: number): EnhancedHistoryEntry[] {
  const entries: EnhancedHistoryEntry[] = []
  
  for (let i = 0; i < count; i++) {
    const daysAgo = i
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    const baseTime = new Date(date)
    baseTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
    
    const metricName = config.name.toLowerCase()
    
    if (metricName.includes('diet')) {
      const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
      const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)]
      const foods = [
        'Grilled salmon, brown rice, steamed broccoli',
        'Greek yogurt with berries and nuts',
        'Quinoa salad with vegetables and olive oil',
        'Chicken breast with sweet potato and asparagus',
        'Oatmeal with banana and almond butter'
      ]
      const food = foods[Math.floor(Math.random() * foods.length)]
      
      entries.push({
        date: date.toISOString(),
        time: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mainValue: `${485 + Math.floor(Math.random() * 200)}`,
        unit: 'kcal',
        inputs: [
          { question: 'Meal Type', answer: mealType },
          { question: 'Food Description', answer: food },
          { question: 'Eating Speed', answer: '15-20 minutes' },
          { question: 'Pre-meal Glucose', answer: 'Within target range' }
        ],
        outputs: [
          { metric: 'Total Calories', value: `${485 + Math.floor(Math.random() * 200)} kcal` },
          { metric: 'Protein', value: `${25 + Math.floor(Math.random() * 15)}g` },
          { metric: 'Carbohydrates', value: `${45 + Math.floor(Math.random() * 20)}g` },
          { metric: 'Fat', value: `${15 + Math.floor(Math.random() * 10)}g` },
          { metric: 'Fiber', value: `${6 + Math.floor(Math.random() * 5)}g` },
          { metric: 'Glycemic Load', value: 'Medium (12)' }
        ],
        status: 'Good nutritional balance achieved'
      })
    } else if (metricName.includes('water')) {
      const amounts = ['250', '350', '500', '750']
      const amount = amounts[Math.floor(Math.random() * amounts.length)]
      const types = ['Plain Water', 'Sparkling Water', 'Herbal Tea', 'Electrolyte Water']
      const type = types[Math.floor(Math.random() * types.length)]
      
      entries.push({
        date: date.toISOString(),
        time: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mainValue: amount,
        unit: 'ml',
        inputs: [
          { question: 'Fluid Type', answer: type },
          { question: 'Amount', answer: `${amount} ml` },
          { question: 'Timing', answer: baseTime.getHours() < 12 ? 'Morning' : 'Afternoon' },
          { question: 'Thirst Level', answer: 'Slightly thirsty' }
        ],
        outputs: [
          { metric: 'Daily Total', value: `${1200 + parseInt(amount)} ml` },
          { metric: 'Daily Progress', value: `${Math.floor((1200 + parseInt(amount)) / 25)}%` },
          { metric: 'Remaining Goal', value: `${Math.max(2500 - 1200 - parseInt(amount), 0)} ml` },
          { metric: 'Hydration Status', value: 'On Track' }
        ],
        status: 'Good hydration progress'
      })
    } else if (metricName.includes('sleep')) {
      const bedtimes = ['9:00-10:00 PM', '10:00-11:00 PM', '11:00 PM-12:00 AM']
      const bedtime = bedtimes[Math.floor(Math.random() * bedtimes.length)]
      const hours = 6 + Math.random() * 3
      const quality = hours >= 7 ? 'Good' : 'Fair'
      
      entries.push({
        date: date.toISOString(),
        time: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mainValue: hours.toFixed(1),
        unit: 'hours',
        inputs: [
          { question: 'Bedtime', answer: bedtime },
          { question: 'Sleep Duration', answer: `${hours.toFixed(1)} hours` },
          { question: 'Sleep Quality', answer: quality },
          { question: 'Disruptions', answer: Math.random() > 0.5 ? 'None' : 'Bathroom visits' }
        ],
        outputs: [
          { metric: 'Quality Rating', value: quality },
          { metric: 'Sleep Efficiency', value: `${Math.floor(85 + Math.random() * 10)}%` },
          { metric: 'REM Sleep', value: `${Math.floor(hours * 0.2 * 10) / 10}h` },
          { metric: 'Deep Sleep', value: `${Math.floor(hours * 0.15 * 10) / 10}h` }
        ],
        status: hours >= 7 ? 'Excellent sleep duration' : 'Consider increasing sleep time'
      })
    } else if (metricName.includes('steps') || metricName.includes('exercise')) {
      const exercises = ['Walking', 'Running', 'Cycling', 'Swimming', 'Resistance']
      const exercise = exercises[Math.floor(Math.random() * exercises.length)]
      const duration = 20 + Math.floor(Math.random() * 40)
      const calories = Math.floor(duration * (exercise === 'Running' ? 12 : exercise === 'Cycling' ? 10 : 8))
      
      entries.push({
        date: date.toISOString(),
        time: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mainValue: `${3000 + Math.floor(Math.random() * 5000)}`,
        unit: 'steps',
        inputs: [
          { question: 'Exercise Type', answer: exercise },
          { question: 'Duration', answer: `${duration} minutes` },
          { question: 'Intensity', answer: 'Moderate' },
          { question: 'Timing', answer: 'Post-meal' }
        ],
        outputs: [
          { metric: 'Calories Burned', value: `${calories} kcal` },
          { metric: 'MET-Minutes', value: `${Math.floor(duration * 6)}` },
          { metric: 'Distance', value: `${(duration * 0.05).toFixed(1)} km` },
          { metric: 'Active Minutes', value: `${duration} min` }
        ],
        status: 'Excellent exercise session'
      })
    } else if (metricName.includes('medication')) {
      const medications = ['Semaglutide', 'Metformin', 'Atorvastatin', 'Lisinopril']
      const medication = medications[Math.floor(Math.random() * medications.length)]
      
      entries.push({
        date: date.toISOString(),
        time: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mainValue: '1',
        unit: 'dose',
        inputs: [
          { question: 'Medication', answer: medication },
          { question: 'Dose Taken', answer: 'As prescribed' },
          { question: 'Food Timing', answer: 'With meal' },
          { question: 'Side Effects', answer: 'None' }
        ],
        outputs: [
          { metric: 'Adherence Rate', value: `${90 + Math.floor(Math.random() * 10)}%` },
          { metric: 'Next Dose', value: medication === 'Semaglutide' ? '7 days' : '24 hours' },
          { metric: 'Tolerance', value: 'Good' },
          { metric: 'Effectiveness', value: 'Optimal' }
        ],
        status: 'Medication taken as prescribed'
      })
    } else {
      // Generic entry for other metrics
      entries.push({
        date: date.toISOString(),
        time: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mainValue: `${Math.floor(Math.random() * 100)}`,
        unit: config.unit,
        inputs: [
          { question: 'Entry Method', answer: 'Manual' },
          { question: 'Value', answer: `${Math.floor(Math.random() * 100)}` }
        ],
        outputs: [
          { metric: 'Status', value: 'Normal' },
          { metric: 'Trend', value: 'Stable' }
        ],
        status: 'Data logged successfully'
      })
    }
  }
  
  return entries
}

// Helper function to get education materials based on metric
function getEducationMaterials(metricName: string) {
  const materialMap: { [key: string]: Array<{title: string, description: string, duration: string, image: string}> } = {
    "Diet": [
      { title: "Understanding Nutrition Labels", description: "Learn to read and interpret food labels for better dietary choices", duration: "3 min", image: getEducationImage("Understanding Nutrition Labels", "Diet") },
      { title: "Meal Planning Basics", description: "Simple strategies for planning balanced meals throughout the week", duration: "5 min", image: getEducationImage("Meal Planning Basics", "Diet") },
      { title: "Healthy Snacking", description: "Smart snacking choices to maintain energy and nutrition", duration: "2 min", image: getEducationImage("Healthy Snacking", "Diet") },
      { title: "Portion Control Guide", description: "Visual guides and tips for managing portion sizes effectively", duration: "4 min", image: getEducationImage("Portion Control Guide", "Diet") }
    ],
    "Water": [
      { title: "Daily Hydration Guide", description: "How much water do you really need and when to drink it", duration: "3 min", image: getEducationImage("Daily Hydration Guide", "Water") },
      { title: "Signs of Dehydration", description: "Recognizing early warning signs and staying ahead of dehydration", duration: "2 min", image: getEducationImage("Signs of Dehydration", "Water") },
      { title: "Hydration for Exercise", description: "Optimal hydration strategies before, during, and after workouts", duration: "4 min", image: getEducationImage("Hydration for Exercise", "Water") }
    ],
    "Sleep": [
      { title: "Sleep Hygiene Essentials", description: "Create the perfect environment and routine for quality sleep", duration: "5 min", image: getEducationImage("Sleep Hygiene Essentials", "Sleep") },
      { title: "Managing Sleep Disorders", description: "Understanding common sleep issues and when to seek help", duration: "6 min", image: getEducationImage("Managing Sleep Disorders", "Sleep") },
      { title: "Natural Sleep Aids", description: "Safe, natural methods to improve sleep quality", duration: "3 min", image: getEducationImage("Natural Sleep Aids", "Sleep") }
    ],
    "Steps": [
      { title: "Walking for Health", description: "The science behind walking and its impact on overall health", duration: "4 min", image: getEducationImage("Walking for Health", "Steps") },
      { title: "Setting Realistic Goals", description: "How to set achievable daily step goals and stay motivated", duration: "3 min", image: getEducationImage("Setting Realistic Goals", "Steps") },
      { title: "Indoor Exercise Options", description: "Staying active when you can't get outside", duration: "5 min", image: getEducationImage("Indoor Exercise Options", "Steps") }
    ],
    "Medication": [
      { title: "Timely Medication Taking", description: "Best practices for taking medications at the right time", duration: "4 min", image: getEducationImage("Timely Medication Taking", "Medication") },
      { title: "Medication Tracking", description: "How to track and monitor your medication schedule effectively", duration: "3 min", image: getEducationImage("Medication Tracking", "Medication") },
      { title: "Understanding Side Effects", description: "Recognizing and managing common medication side effects", duration: "5 min", image: getEducationImage("Understanding Side Effects", "Medication") }
    ],
    "Blood Panel": [
      { title: "Understanding Blood Tests", description: "Learn what different blood markers mean for your health", duration: "5 min", image: getEducationImage("Understanding Blood Tests", "Blood Panel") },
      { title: "Preparing for Blood Work", description: "How to prepare properly for accurate blood test results", duration: "3 min", image: getEducationImage("Preparing for Blood Work", "Blood Panel") },
      { title: "Reading Lab Results", description: "Interpreting your blood test results and normal ranges", duration: "4 min", image: getEducationImage("Reading Lab Results", "Blood Panel") }
    ],
    "Weight": [
      { title: "Healthy Weight Management", description: "Sustainable approaches to maintaining a healthy weight", duration: "5 min", image: getEducationImage("Healthy Weight Management", "Weight") },
      { title: "Understanding BMI", description: "What BMI means and its limitations as a health indicator", duration: "3 min", image: getEducationImage("Understanding BMI", "Weight") },
      { title: "Weight Tracking Tips", description: "Best practices for accurate and meaningful weight monitoring", duration: "4 min", image: getEducationImage("Weight Tracking Tips", "Weight") }
    ],
    "Heart Rate": [
      { title: "Understanding Heart Rate", description: "What your heart rate tells you about cardiovascular health", duration: "4 min", image: getEducationImage("Understanding Heart Rate", "Heart Rate") },
      { title: "Target Heart Rate Zones", description: "Optimal heart rate ranges for different activities and health goals", duration: "5 min", image: getEducationImage("Target Heart Rate Zones", "Heart Rate") },
      { title: "Heart Rate Monitoring", description: "How to track and interpret your heart rate data effectively", duration: "3 min", image: getEducationImage("Heart Rate Monitoring", "Heart Rate") }
    ],
    "Blood Glucose": [
      { title: "Blood Sugar Basics", description: "Understanding blood glucose levels and what they mean", duration: "5 min", image: getEducationImage("Blood Sugar Basics", "Blood Glucose") },
      { title: "Glucose Monitoring", description: "Best practices for tracking your blood sugar levels", duration: "4 min", image: getEducationImage("Glucose Monitoring", "Blood Glucose") },
      { title: "Managing Blood Sugar", description: "Lifestyle strategies for maintaining healthy glucose levels", duration: "6 min", image: getEducationImage("Managing Blood Sugar", "Blood Glucose") }
    ]
  }
  
  const baseName = metricName.replace(' Logs', '').replace('Logs', '')
  return materialMap[baseName] || [
    { title: "Health & Wellness Tips", description: "General guidance for maintaining a healthy lifestyle", duration: "3 min", image: getEducationImage("Health & Wellness Tips", metricName) },
    { title: "Understanding Your Metrics", description: "How to interpret and use your health data effectively", duration: "4 min", image: getEducationImage("Understanding Your Metrics", metricName) }
  ]
}

export interface MetricConfig {
  name: string
  color: string
  unit: string
  currentValue: string | number
  goal: string | number
  percentage: number
  icon: string
  aiInsightPrompt: string
  metricType: MetricType | string
  normalRange?: string
  chartData?: Array<{ day: string; value: number }>
  historyLogs?: Array<{
    id: string
    date: string
    time: string
    value: string
    status: string
    notes: string
    dataSource: string
  }>
  dataSources: Array<{
    name: string
    status: "connected" | "active" | "not_connected"
    description: string
    lastSync?: string
    entries?: string
  }>
}

interface MetricTemplateViewProps {
  config: MetricConfig
  onClose?: () => void
  isVitalsCategory?: boolean
  availableMetrics?: Array<{ name: string; config: MetricConfig }>
  selectedMetric?: string
  onMetricSelect?: (metricName: string) => void
  isBodyComposition?: boolean
  showTodaysProgress?: boolean
}


export function MetricTemplateView({ 
  config, 
  onClose, 
  isVitalsCategory, 
  availableMetrics, 
  selectedMetric, 
  onMetricSelect, 
  isBodyComposition,
  showTodaysProgress = true
}: MetricTemplateViewProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("weekly")
  const [rangeOffset, setRangeOffset] = useState(0) // 0 = current period, 1 = previous period, etc.
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [medications, setMedications] = useState<string[]>(["Paracetamol", "Vitamin D", "Aspirin"])
  const [selectedMedication, setSelectedMedication] = useState<string>(medications[0] || "")
  const [correlationMetric, setCorrelationMetric] = useState<string | null>(null)
  const [showCorrelationDropdown, setShowCorrelationDropdown] = useState(false)
  const [isMedicationDropdownOpen, setIsMedicationDropdownOpen] = useState(false)
  const [clickedBarIndex, setClickedBarIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const medicationDropdownRef = useRef<HTMLDivElement>(null)
  const correlationDropdownRef = useRef<HTMLDivElement>(null)
  const { currentScreen, navigateTo, goBack } = useScreenNavigation<MetricScreen>("main")
  
  // Get range display text based on offset
  const getRangeDisplayText = () => {
    const now = new Date()
    
    if (selectedTimeRange === 'daily') {
      if (rangeOffset === 0) return 'Today'
      if (rangeOffset === 1) return 'Yesterday'
      // For older dates, show the actual date
      const targetDate = new Date(now)
      targetDate.setDate(targetDate.getDate() - rangeOffset)
      return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    if (selectedTimeRange === 'weekly') {
      if (rangeOffset === 0) return 'This Week'
      if (rangeOffset === 1) return 'Last Week'
      // For older weeks, show date range
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 - (rangeOffset * 7)) // Monday
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6) // Sunday
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
    
    if (selectedTimeRange === 'monthly') {
      if (rangeOffset === 0) return 'This Month'
      if (rangeOffset === 1) return 'Last Month'
      // For older months, show month and year
      const targetDate = new Date(now)
      targetDate.setMonth(targetDate.getMonth() - rangeOffset)
      return targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    
    return ''
  }

  // Reset offset when time range changes
  useEffect(() => {
    setRangeOffset(0)
  }, [selectedTimeRange])

  // Handle bar click to show tooltip
  const handleBarClick = (index: number) => {
    setClickedBarIndex(clickedBarIndex === index ? null : index)
  }

  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (medicationDropdownRef.current && !medicationDropdownRef.current.contains(event.target as Node)) {
        setIsMedicationDropdownOpen(false)
      }
      if (correlationDropdownRef.current && !correlationDropdownRef.current.contains(event.target as Node)) {
        setShowCorrelationDropdown(false)
      }
    }

    if (isDropdownOpen || showCorrelationDropdown || isMedicationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, showCorrelationDropdown, isMedicationDropdownOpen])
  
  // Modals
  const goalModal = useModal()
  const reminderModal = useModal()
  const medicationModal = useModal()

  // Get current metric data
  const currentMetricData = metricsData[config.metricType as MetricType]
  const currentChartData = (() => {
    // First check if config has chartData
    if ((config as any).chartData) {
      return (config as any).chartData
    }
    // Otherwise generate or get from metricsData
    if (typeof config.metricType === 'string' && ['labs', 'body', 'cardiovascular', 'glucose', 'nutrition'].includes(config.metricType)) {
      const days = selectedTimeRange === 'daily' ? 24 : selectedTimeRange === 'weekly' ? 7 : selectedTimeRange === 'monthly' ? 30 : 365
      return generateChartData(config, days)
    }
    return currentMetricData?.[selectedTimeRange as TimePeriod] || []
  })()

  // Calculate trend
  const getTrend = () => {
    if (currentChartData.length < 2) return null
    const lastValue = currentChartData[currentChartData.length - 1].value
    const previousValue = currentChartData[currentChartData.length - 2].value
    const change = ((lastValue - previousValue) / previousValue) * 100
    return {
      direction: change > 0 ? 'up' : 'down',
      value: Math.abs(change).toFixed(1)
    }
  }

  const trend = getTrend()

  const generateInsights = () => {
    setIsLoadingInsight(true)
    setTimeout(() => {
      const insights = []
      
      // Add goal progress insight
      if (config.percentage >= 90) {
        insights.push(`✓ On track - ${config.percentage}% of daily goal achieved`)
      } else if (config.percentage >= 70) {
        insights.push(`• Good progress - ${config.percentage}% of goal`)
      } else {
        insights.push(`! Below target - increase by ${(100 - config.percentage).toFixed(0)}%`)
      }
      
      // Add trend insight
      if (trend && trend.value !== "0.0") {
        if (trend.direction === 'up') {
          insights.push(`↑ ${trend.value}% increase from yesterday`)
        } else {
          insights.push(`↓ ${trend.value}% decrease from yesterday`)
        }
      }
      
      // Add pattern insight
      const avgValue = currentChartData.reduce((sum: number, d: { value: number }) => sum + d.value, 0) / currentChartData.length
      const currentValue = typeof config.currentValue === 'string' 
        ? parseFloat(config.currentValue.replace(/,/g, '')) 
        : config.currentValue
      
      if (currentValue > avgValue * 1.1) {
        insights.push(`• Above average for this ${selectedTimeRange === 'weekly' ? 'week' : 'period'}`)
      } else if (currentValue < avgValue * 0.9) {
        insights.push(`• Below average for this ${selectedTimeRange === 'weekly' ? 'week' : 'period'}`)
      } else {
        insights.push(`• Consistent with ${selectedTimeRange === 'weekly' ? 'weekly' : 'period'} average`)
      }
      
      setAiInsights(insights)
      setIsLoadingInsight(false)
    }, 1000)
  }

  useEffect(() => {
    generateInsights()
  }, [selectedTimeRange, config.currentValue])

  // History Screen - Enhanced to show inputs and outputs
  if (currentScreen === "history") {
    const enhancedHistoryData = generateEnhancedHistoryLogs(config, 15)

    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Show All Data</h2>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3">
              <p className="text-xs text-[var(--ds-text-secondary)] mb-4">
                Showing detailed logs from health assistant action flows with user inputs and calculated outputs.
              </p>
            </div>
            
            <div className="space-y-3 px-4 pb-6">
              {enhancedHistoryData.map((entry, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {/* Header with date and overall result */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(entry.date).toLocaleDateString("en-US", { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-[var(--ds-text-secondary)]">{entry.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{entry.mainValue}</p>
                      <p className="text-xs text-[var(--ds-text-secondary)]">{entry.unit}</p>
                    </div>
                  </div>

                  {/* User Inputs Section */}
                  {entry.inputs && entry.inputs.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">User Inputs Selected:</h4>
                      <div className="space-y-1">
                        {entry.inputs.map((input, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-[var(--ds-text-secondary)]">{input.question}:</span>
                            <span className="text-gray-800 font-medium ml-2 text-right flex-1">
                              {input.answer}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculated Outputs Section */}
                  {entry.outputs && entry.outputs.length > 0 && (
                    <div className="pt-3 border-t border-[var(--ds-border-default)]">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">Calculated Results:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {entry.outputs.map((output, idx) => (
                          <div key={idx} className="bg-[var(--ds-surface-primary)] rounded-lg p-2 border border-gray-100">
                            <p className="text-[10px] text-[var(--ds-text-secondary)] uppercase font-medium">
                              {output.metric}
                            </p>
                            <p className="text-xs font-semibold text-gray-800">
                              {output.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status/Notes */}
                  {entry.status && (
                    <div className="mt-3 pt-3 border-t border-[var(--ds-border-default)]">
                      <p className={`text-xs font-medium ${
                        entry.status.includes('Good') || entry.status.includes('Excellent') 
                          ? 'text-green-600' 
                          : entry.status.includes('Alert') || entry.status.includes('Warning')
                          ? 'text-amber-600'
                          : 'text-[var(--ds-text-secondary)]'
                      }`}>
                        {entry.status}
                      </p>
                    </div>
                  )}
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
    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Data Sources</h2>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {config.dataSources.map((source, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{source.name}</h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] mt-1">{source.description}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      source.status === "connected" ? "bg-green-100 text-green-700" :
                      source.status === "active" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-200 text-gray-700"
                    }`}>
                      {source.status === "connected" ? "Connected" :
                       source.status === "active" ? "Active" : "Not Connected"}
                    </div>
                  </div>
                  {source.lastSync && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--ds-text-secondary)]">Last sync</span>
                      <span className="text-gray-700">{source.lastSync}</span>
                    </div>
                  )}
                  {source.entries && (
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-[var(--ds-text-secondary)]">Entries today</span>
                      <span className="text-gray-700">{source.entries}</span>
                    </div>
                  )}
                  {source.status === "not_connected" && (
                    <button className="text-xs font-medium mt-3" style={{ color: config.color }}>
                      Connect Device →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScreenLayout>
    )
  }

  // Education Screen
  if (currentScreen === "education") {
    const educationMaterials = getEducationMaterials(config.name)
    
    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Education</h2>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {educationMaterials.map((material, index) => (
                <div key={index} className="bg-[var(--ds-surface-primary)] rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <div 
                    className="h-32 bg-cover bg-center relative"
                    style={{ 
                      backgroundImage: `url(${material.image})`
                    }}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 bg-[var(--ds-surface-primary)]/95 rounded-full flex items-center justify-center shadow-sm">
                        <Icon name="fileText" className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 text-gray-900">
                      {material.title}
                    </h3>
                    <p className="text-sm text-[var(--ds-text-secondary)] mb-3 leading-relaxed">
                      {material.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--ds-text-secondary)]">{material.duration}</span>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                        Watch Video
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScreenLayout>
    )
  }

  // Recipes Screen
  if (currentScreen === "recipes") {
    const recipeData = getRecipeData()
    
    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <Icon name="chevronLeft" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Recipes</h2>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {Object.entries(recipeData).map(([category, recipes]) => (
                <div key={category}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                    <button className="text-sm text-[var(--ds-text-secondary)] hover:text-gray-700">
                      View More <Icon name="chevronRight" className="w-4 h-4 inline ml-1" />
                    </button>
                  </div>
                  
                  {/* Recipe Cards */}
                  <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide" style={{ paddingBottom: '12px' }}>
                    {recipes.map((recipe) => (
                      <div key={recipe.id} className="flex-shrink-0 w-48">
                        <div className="bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                          {/* Recipe Image */}
                          <div 
                            className="h-32 bg-cover bg-center relative"
                            style={{ 
                              backgroundImage: `url(${recipe.image})`
                            }}
                          >
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute top-3 right-3">
                              <div className="w-8 h-8 bg-[var(--ds-surface-primary)]/90 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--ds-status-error)]" style={{ fontSize: '16px' }}>bookmark</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4">
                            <h4 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight text-gray-900">
                              {recipe.title}
                            </h4>
                            <p className="text-sm text-[var(--ds-text-secondary)] font-medium">
                              {recipe.calories} Cal
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScreenLayout>
    )
  }

  // Main Screen - Redesigned Layout
  return (
    <div className="flex flex-col h-full relative">
      {/* Container with rounded top edges */}
      <div className="flex-1 rounded-t-3xl overflow-y-auto">
        {/* Today's Progress Section - Conditional based on showTodaysProgress */}
        {showTodaysProgress && (
          <div className="mx-4 mt-3 p-3 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Today's Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold text-gray-900">
                  {config.currentValue}
                </div>
                <span className="text-sm text-[var(--ds-text-secondary)]">{config.unit}</span>
                {config.goal && (
                  <span className="text-sm text-[var(--ds-text-secondary)]">
                    of {config.goal} {config.unit}
                  </span>
                )}
              </div>
              
              {config.percentage && (
                <div className="text-sm font-medium text-gray-700">
                  {config.percentage}%
                </div>
              )}
            </div>
            
            {config.percentage && (
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(config.percentage, 100)}%`,
                    backgroundColor: config.color
                  }}
                />
              </div>
            )}
          </div>
        )}


        {/* Dropdown Selector for Sub-metrics */}
        {isVitalsCategory && availableMetrics && onMetricSelect && (
          <div className="mx-4 mt-3 flex items-center gap-2">
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[var(--ds-surface-primary)] rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-900 shadow-sm"
              >
                <span>{selectedMetric || config.name}</span>
                <Icon name="chevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {availableMetrics.map((metric) => (
                    <button
                      key={metric.name}
                      onClick={() => {
                        onMetricSelect(metric.name)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm first:rounded-t-xl last:rounded-b-xl ${
                        selectedMetric === metric.name ? 'bg-blue-50 text-blue-900' : 'hover:bg-[var(--ds-surface-secondary)]'
                      }`}
                    >
                      {metric.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {isBodyComposition && (
              <div className="relative" ref={correlationDropdownRef}>
                {correlationMetric ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">
                      vs {correlationMetric}
                    </span>
                    <button
                      onClick={() => setCorrelationMetric(null)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCorrelationDropdown(!showCorrelationDropdown)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Icon name="plus" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
                  </button>
                )}
                {showCorrelationDropdown && availableMetrics && (
                  <div className="absolute top-full right-0 mt-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                    {availableMetrics
                      .filter((m) => m.name !== selectedMetric)
                      .map((metric) => (
                        <button
                          key={metric.name}
                          onClick={() => {
                            setCorrelationMetric(metric.name)
                            setShowCorrelationDropdown(false)
                          }}
                          className={`w-full px-4 py-3 text-left text-sm first:rounded-t-xl last:rounded-b-xl hover:bg-[var(--ds-surface-secondary)]`}
                        >
                          {metric.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dropdown Selector for Medications */}
        {config.metricType === 'medication' && (
          <div className="mx-4 mt-3">
            <div className="relative" ref={medicationDropdownRef}>
              <button
                onClick={() => setIsMedicationDropdownOpen(!isMedicationDropdownOpen)}
                className="w-full bg-[var(--ds-surface-primary)] rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-900 shadow-sm"
              >
                <span>{selectedMedication}</span>
                <Icon name="chevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${isMedicationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMedicationDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {medications.map((med) => (
                    <button
                      key={med}
                      onClick={() => {
                        setSelectedMedication(med)
                        setIsMedicationDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm first:rounded-t-xl last:rounded-b-xl ${
                        selectedMedication === med ? 'bg-blue-50 text-blue-900' : 'hover:bg-[var(--ds-surface-secondary)]'
                      }`}
                    >
                      {med}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chart Section with Time Toggles and Range Switcher */}
        <div className="mx-4 mt-4 bg-[var(--ds-surface-primary)] rounded-xl shadow-sm">
          <div className="p-3 pb-2">
            {/* Header with Range Switcher on left and Time Toggles on right */}
            <div className="flex items-center justify-between">
              {/* Range Switcher - Left side */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setRangeOffset(prev => prev + 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Icon name="chevronLeft" className="w-3.5 h-3.5 text-[var(--ds-text-secondary)]" />
                </button>
                <span className="text-xs font-medium text-gray-700 min-w-[90px] text-center">
                  {getRangeDisplayText()}
                </span>
                <button 
                  onClick={() => setRangeOffset(prev => Math.max(0, prev - 1))}
                  disabled={rangeOffset === 0}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    rangeOffset === 0 
                      ? 'bg-gray-50 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Icon name="chevronRight" className={`w-3.5 h-3.5 ${
                    rangeOffset === 0 ? 'text-gray-300' : 'text-[var(--ds-text-secondary)]'
                  }`} />
                </button>
              </div>
              
              {/* Time Toggles - Right side with shortcodes */}
              <div className="inline-flex rounded-lg bg-gray-100 p-0.5">
                {[
                  { value: 'daily', label: 'D' },
                  { value: 'weekly', label: 'W' },
                  { value: 'monthly', label: 'M' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedTimeRange(range.value as TimeRange)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedTimeRange === range.value
                        ? 'bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm'
                        : 'text-[var(--ds-text-secondary)]'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
            
          {/* Chart */}
          <div className="relative h-52 overflow-hidden">
            {config.metricType === 'medication' ? (
              <MedicationTrendsChart 
                selectedPeriod={selectedTimeRange === 'daily' ? 'D' : 'W'} 
                medications={medications}
                selectedMedication={selectedMedication}
              />
            ) : correlationMetric && availableMetrics ? (
              (() => {
                const correlationConfig = availableMetrics.find(m => m.name === correlationMetric)?.config
                return correlationConfig ? (
                  <CorrelationChart
                    primaryMetric={config}
                    secondaryMetric={availableMetrics.find(m => m.name === correlationMetric)?.config}
                    days={selectedTimeRange === 'daily' ? 24 : selectedTimeRange === 'weekly' ? 7 : selectedTimeRange === 'monthly' ? 30 : 365}
                  />
                ) : (
                  <RechartsMetricChart
                    data={currentChartData}
                    timePeriod={selectedTimeRange as TimePeriod}
                    color={config.color}
                    unit={config.unit}
                    onBarClick={handleBarClick}
                    clickedBarIndex={clickedBarIndex}
                  />
                )
              })()
            ) : (
              <RechartsMetricChart
                data={currentChartData}
                timePeriod={selectedTimeRange as TimePeriod}
                color={config.color}
                unit={config.unit}
                onBarClick={handleBarClick}
                clickedBarIndex={clickedBarIndex}
              />
            )}
          </div>
        </div>

        {/* Education Section - Card Style */}
        <div className="mx-4 mt-4">
          <div className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold flex items-center gap-2.5 text-gray-900">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: '12px' }}>school</span>
                    </div>
                    Education
                  </h3>
                  <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">Learn more about {config.name.replace(' Logs', '').toLowerCase()}</p>
                </div>
                <button
                  onClick={() => navigateTo("education")}
                  className="hover:bg-gray-100 rounded-full transition-colors h-7 w-7 flex items-center justify-center"
                >
                  <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="px-4 pt-4 pb-4">
              <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide" style={{ paddingBottom: '12px' }}>
                {getEducationMaterials(config.name).map((material, index) => (
                  <div key={index} className="flex-shrink-0 w-48">
                    <div className="h-full bg-[var(--ds-surface-primary)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                      {/* Image Header */}
                      <div 
                        className="h-16 bg-cover bg-center relative"
                        style={{ 
                          backgroundImage: `url(${material.image})`
                        }}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute top-3 left-3">
                          <div className="w-7 h-7 bg-[var(--ds-surface-primary)]/95 rounded-full flex items-center justify-center shadow-sm">
                            <Icon name="fileText" className="w-3.5 h-3.5" style={{ color: config.color }} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 flex flex-col flex-1">
                        <div className="mb-3 flex-1">
                          <h4 className="font-semibold text-xs mb-1 line-clamp-2 leading-tight text-gray-900">
                            {material.title}
                          </h4>
                          <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed line-clamp-2">
                            {material.description}
                          </p>
                        </div>
                        <button className="w-full h-6 text-[10px] font-medium rounded-md transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-700">
                          {material.duration} • Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section - Only for Diet metric */}
        {config.name === "Diet" && (
          <div className="mx-4 mt-4">
            <div className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold flex items-center gap-2.5 text-gray-900">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: '12px' }}>restaurant</span>
                      </div>
                      Recipes
                    </h3>
                    <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">Healthy recipes tailored to your goals</p>
                  </div>
                  <button
                    onClick={() => navigateTo("recipes")}
                    className="hover:bg-gray-100 rounded-full transition-colors h-7 w-7 flex items-center justify-center"
                  >
                    <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="px-4 pt-4 pb-4">
                {Object.entries(getRecipeData()).slice(0, 1).map(([category, recipes]) => (
                  <div key={category}>
                    <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide" style={{ paddingBottom: '12px' }}>
                      {recipes.map((recipe) => (
                        <div key={recipe.id} className="flex-shrink-0 w-48">
                          <div className="h-full bg-[var(--ds-surface-primary)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                            {/* Recipe Image */}
                            <div 
                              className="h-24 bg-cover bg-center relative"
                              style={{ 
                                backgroundImage: `url(${recipe.image})`
                              }}
                            >
                              <div className="absolute inset-0 bg-black/10" />
                              <div className="absolute top-3 right-3">
                                <div className="w-7 h-7 bg-[var(--ds-surface-primary)]/95 rounded-full flex items-center justify-center shadow-sm">
                                  <span className="material-symbols-outlined text-[var(--ds-status-error)]" style={{ fontSize: '14px' }}>bookmark</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-3">
                              <h4 className="font-semibold text-xs mb-1 line-clamp-2 leading-tight text-gray-900">
                                {recipe.title}
                              </h4>
                              <p className="text-xs text-[var(--ds-text-secondary)]">
                                {recipe.calories} Cal
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show All Data & Data Sources Section */}
        <div className="px-4 py-4 space-y-3 pb-24">
          <button
            onClick={() => navigateTo("history")}
            className="w-full bg-[var(--ds-surface-primary)] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100"
          >
            <span className="text-sm font-medium text-gray-700">Show All Data</span>
            <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => navigateTo("data-sources")}
            className="w-full bg-[var(--ds-surface-primary)] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100"
          >
            <span className="text-sm font-medium text-gray-700">Data Sources</span>
            <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      

      {/* Modals */}
      <GoalModal
        title={config.name}
        isOpen={goalModal.isOpen}
        onClose={goalModal.close}
        onSave={(value) => {
          console.log(`Setting goal for ${config.name} to:`, value)
          goalModal.close()
        }}
      />

      <ReminderModal
        isOpen={reminderModal.isOpen}
        onClose={reminderModal.close}
        onSave={(data) => {
          console.log(`Setting reminder for ${config.name}:`, data)
          reminderModal.close()
        }}
        metricType={config.name}
      />
      
      {config.metricType === 'medication' && (
        <MedicationModal
          isOpen={medicationModal.isOpen}
          onClose={medicationModal.close}
          medications={medications}
          onAdd={(med) => setMedications(prev => [...prev, med])}
          onRemove={(index) => setMedications(prev => prev.filter((_, i) => i !== index))}
        />
      )}
    </div>
  )
}
