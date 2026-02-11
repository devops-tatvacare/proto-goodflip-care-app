"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { SymptomLogsList } from "@/components/insights/symptom-logs-list"
import { SymptomChart } from "@/components/charts/symptom-chart"
import { GoalModal } from "@/components/modals/goal-modal"
import { MedicationModal } from "@/components/modals/medication-modal"
import { DaySymptomOverlay } from "@/components/modals/day-symptom-overlay"
import { useScreenNavigation } from "@/lib/hooks/use-screen-navigation"
import { useModal } from "@/lib/hooks/use-modal"
import { useInsightsData, useSymptomData, useGoals, useMedications } from "@/lib/hooks/use-insights-data"
import { ReminderModal } from "@/components/modals/reminder-modal"
import { useToast } from "@/lib/hooks/use-toast"
import { DietDetailView } from "@/components/insights/diet-detail-view"
import { MenstrualDetailView } from "@/components/insights/menstrual-detail-view"
import { MetricDetailView } from "@/components/insights/metric-detail-view"
import { MetricTemplateView } from "@/components/insights/metric-template-view"
import { MedicationDetailView } from "@/components/insights/medication-detail-view"
import { waterConfig, sleepConfig, stepsConfig, fatigueConfig, dietConfig, heartRateConfig, weightConfig, medicationConfig, bloodPressureConfig, bloodPanelConfig, cholesterolConfig, bodyFatConfig, muscleMassConfig, bloodGlucoseConfig, hba1cConfig, fatConfig, proteinConfig, carbohydratesConfig } from "@/lib/metric-configs"
import { 
  whiteBloodCellConfig, omega6Config, progesteroneConfig, prolactinConfig, 
  redBloodCellConfig, vitaminDConfig, vitaminB12Config, zincConfig,
  leanBodyMassConfig, visceralFatConfig, subcutaneousFatConfig, skeletalMuscleConfig,
  boneMassConfig, bmiConfig, respirationRateConfig, timeInRangeConfig
} from "@/lib/vitals-metric-configs"
import { useFAB } from '@/contexts/fab-context'
import { MiniChatOverlay } from '@/components/overlays/mini-chat-overlay'
import { PromptSelectionOverlay } from '@/components/overlays/prompt-selection-overlay'
import { DevicesOverlay } from "@/components/overlays/devices-overlay"
import { getPromptsForMetric, getPromptSelectionTitle, KairaPrompt } from '@/lib/constants/kaira-prompts'

interface InsightsScreenProps {
  onNavigateToAssistant?: (action: string) => void
  initialMetric?: string
  isZeroStatePreview?: boolean
  onDeviceInstallerModeChange?: (active: boolean) => void
}

type InsightScreen = "main" | "detail" | "symptom-logs" | "pdf-viewer" | "diet-detail" | "menstrual-detail"

export function InsightsScreen({ onNavigateToAssistant, initialMetric, isZeroStatePreview = false, onDeviceInstallerModeChange }: InsightsScreenProps = {}) {
  const { toast } = useToast()
  const { updateActionsForMetric, setAskKairaAction, setAskKairaVisible, isPromptSelectionOpen, setIsPromptSelectionOpen } = useFAB()
  const [activeTab, setActiveTab] = useState<"health" | "vitals" | "symptoms">("health")
  const [isTransitioningMode, setIsTransitioningMode] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string>(initialMetric || "Diet Logs")
  const [selectedVitalsCategory, setSelectedVitalsCategory] = useState<string>("Labs")
  const [selectedVitalsMetric, setSelectedVitalsMetric] = useState<string>("Blood Panel")
  const [selectedDietMetric, setSelectedDietMetric] = useState<string>("Calories")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<KairaPrompt | undefined>()
  const [chatPrompts, setChatPrompts] = useState<KairaPrompt[]>([])
  const [showBcaInstaller, setShowBcaInstaller] = useState(false)
  const metricSelectorRef = useRef<HTMLDivElement>(null)
  const { currentScreen, navigateTo, goBack, getScreenData } = useScreenNavigation<InsightScreen>("main")

  // Modals
  const goalModal = useModal()
  const medicationModal = useModal()
  const daySymptomModal = useModal()
  const reminderModal = useModal()

  // Tab change handler with smooth transition
  const handleTabChange = (tab: "health" | "vitals" | "symptoms") => {
    if (activeTab === tab) return
    
    setIsTransitioningMode(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsTransitioningMode(false)
    }, 250)
  }

  // Data hooks
  const insights = useInsightsData()
  const { dates, symptomLogs, symptomsByDate } = useSymptomData()
  const { getGoalValue, setGoal } = useGoals()
  const { medications, addMedication, removeMedication } = useMedications()

  const handleSetGoal = (title: string, value: number) => {
    setGoal(title, value)
    goalModal.close()
  }

  const handleSetReminder = (reminderData: any) => {
    console.log("Setting reminder:", reminderData)
    reminderModal.close()
  }

  const handleViewDetails = (insightTitle: string) => {
    if (insightTitle === "Diet Logs") {
      navigateTo("diet-detail", { title: insightTitle })
    } else if (insightTitle === "Menstruation Logs") {
      navigateTo("menstrual-detail", { title: insightTitle })
    } else {
      navigateTo("detail", { title: insightTitle })
    }
  }

  const handleViewSymptomLogs = () => {
    navigateTo("symptom-logs")
  }

  const handleViewPDF = (reportId: string) => {
    navigateTo("pdf-viewer", { reportId })
  }

  // Stable callback for opening prompt selection
  const openPromptSelection = useCallback(() => {
    setIsPromptSelectionOpen(true)
  }, [setIsPromptSelectionOpen])

  // Handle prompt selection
  const handlePromptSelected = useCallback((prompt: KairaPrompt) => {
    const currentMetric = activeTab === 'health' ? selectedMetric : 
                         activeTab === 'vitals' ? selectedVitalsMetric : 
                         'Symptom Tracking'
    const allPrompts = getPromptsForMetric(activeTab, currentMetric)
    const otherPrompts = allPrompts.filter(p => p.id !== prompt.id)
    
    setSelectedPrompt(prompt)
    setChatPrompts(otherPrompts)
    setIsPromptSelectionOpen(false)
    setIsChatOpen(true)
    // Hide FAB when chat opens
    setAskKairaVisible(false)
  }, [activeTab, selectedMetric, selectedVitalsMetric, setAskKairaVisible, setIsPromptSelectionOpen])

  // Handle chat close
  const handleChatClose = useCallback(() => {
    setIsChatOpen(false)
    setSelectedPrompt(undefined)
    setChatPrompts([])
    // Show FAB again when chat closes
    setAskKairaVisible(true)
  }, [setAskKairaVisible])

  // Handle navigate to assistant
  const handleNavigateToAssistant = useCallback(() => {
    if (onNavigateToAssistant) {
      onNavigateToAssistant('chat')
    }
  }, [onNavigateToAssistant])

  // Combined FAB context management
  useEffect(() => {
    // Update metric-specific actions first
    if (activeTab === 'health') {
      updateActionsForMetric('health', selectedMetric)
    } else if (activeTab === 'vitals') {
      updateActionsForMetric('vitals', selectedVitalsMetric)
    } else if (activeTab === 'symptoms') {
      updateActionsForMetric('symptoms', 'Symptom Tracking')
    }

    // Then, immediately set the correct action for Ask Kaira
    setAskKairaAction(openPromptSelection)
  }, [activeTab, selectedMetric, selectedVitalsMetric, updateActionsForMetric, setAskKairaAction, openPromptSelection])

  // Screen routing
  if (currentScreen === "detail") {
    const screenData = getScreenData("detail")
    const selectedInsight = insights.find((insight) => insight.title === screenData?.title)
    if (selectedInsight) {
      return <MetricDetailView title={screenData.title} data={selectedInsight} onClose={goBack} />
    }
  }

  if (currentScreen === "diet-detail") {
    const screenData = getScreenData("diet-detail")
    return <DietDetailView title={screenData?.title || "Diet Logs"} />
  }

  if (currentScreen === "menstrual-detail") {
    return <MenstrualDetailView />
  }

  if (currentScreen === "symptom-logs") {
    return <SymptomLogsList symptomLogs={symptomLogs} onBack={goBack} />
  }

  if (currentScreen === "pdf-viewer") {
    const screenData = getScreenData("pdf-viewer")
    return <PDFViewer reportId={screenData?.reportId} onBack={goBack} />
  }

  // Add Diet Logs and Menstruation Logs to insights data
  const extendedInsights = [
    // Move Diet Logs to the top
    {
      title: "Diet Logs",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      logged: 18,
      missed: 3,
      unit: "meals",
      description: "Track your daily nutrition intake and dietary patterns",
      chart: [1800, 2100, 1950, 2200, 1750, 2000, 1900],
      period: "7 days",
      hasData: true,
      value: "1,950",
      chartData: [
        { day: "Mon", value: 1800 },
        { day: "Tue", value: 2100 },
        { day: "Wed", value: 1950 },
        { day: "Thu", value: 2200 },
        { day: "Fri", value: 1750 },
        { day: "Sat", value: 2000 },
        { day: "Sun", value: 1900 },
      ],
    },
    ...insights, // Keep all existing insights after Diet Logs
  ]


  // Define metric icons for health tab
  const healthMetricIcons = [
    { title: "Diet Logs", materialIcon: "restaurant", color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Water Logs", materialIcon: "water_full", color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Sleep Logs", materialIcon: "bed", color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Steps Logs", materialIcon: "directions_walk", color: "text-teal-600", bgColor: "bg-teal-50" },
    { title: "Medication Logs", materialIcon: "medication", color: "text-green-700", bgColor: "bg-green-50" },
    { title: "Menstruation Logs", materialIcon: "menstrual_health", color: "text-pink-600", bgColor: "bg-pink-50" },
  ]

  // Define vitals category icons
  const vitalsCategoryIcons = [
    { title: "Labs", materialIcon: "lab_panel", color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Body Composition", materialIcon: "metabolism", color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Cardiovascular", materialIcon: "cardiology", color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Glucose Monitoring", materialIcon: "glucose", color: "text-purple-600", bgColor: "bg-purple-50" },
  ]

  // Helper function to get background color for metric icons
  const getBgColor = (bgColor: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-orange-50': '#FEF3E8',
      'bg-green-50': '#E8FEF3', 
      'bg-blue-50': '#E8F3FE',
      'bg-purple-50': '#F3E8FE',
      'bg-teal-50': '#E8FEF8',
      'bg-red-50': '#FEE8E8',
      'bg-pink-50': '#FEE8F3',
      'bg-brown-50': 'rgba(120, 53, 15, 0.1)'
    }
    return colorMap[bgColor] || '#F3F4F6'
  }

  // Handle metric selection
  const handleMetricSelect = (metricTitle: string) => {
    setSelectedMetric(metricTitle)
  }

  // Handle vitals category selection
  const handleVitalsCategorySelect = (categoryTitle: string) => {
    setSelectedVitalsCategory(categoryTitle)
    // Set default metric for each category
    const defaultMetrics: { [key: string]: string } = {
      "Labs": "Blood Panel",
      "Body Composition": "Weight",
      "Cardiovascular": "Heart Rate", 
      "Glucose Monitoring": "Blood Glucose"
    }
    setSelectedVitalsMetric(defaultMetrics[categoryTitle] || "Blood Panel")
  }

  // Handle vitals metric selection (within category)
  const handleVitalsMetricSelect = (metricTitle: string) => {
    setSelectedVitalsMetric(metricTitle)
  }

  // Define metrics for each vitals category
  const vitalsMetricsMap = {
    "Labs": [
      { name: "Blood Panel", config: bloodPanelConfig },
      { name: "Cholesterol", config: cholesterolConfig },
      { name: "White Blood Cell Count", config: whiteBloodCellConfig },
      { name: "Omega 6", config: omega6Config },
      { name: "Progesterone", config: progesteroneConfig },
      { name: "Prolactin", config: prolactinConfig },
      { name: "Red Blood Cell", config: redBloodCellConfig },
      { name: "Vitamin D", config: vitaminDConfig },
      { name: "Vitamin B12", config: vitaminB12Config },
      { name: "Zinc", config: zincConfig }
    ],
    "Body Composition": [
      { name: "Weight", config: weightConfig },
      { name: "Body Fat", config: bodyFatConfig },
      { name: "Muscle Mass", config: muscleMassConfig },
      { name: "Lean Body Mass", config: leanBodyMassConfig },
      { name: "Visceral Fat", config: visceralFatConfig },
      { name: "Subcutaneous Fat", config: subcutaneousFatConfig },
      { name: "Skeletal Muscle", config: skeletalMuscleConfig },
      { name: "Bone Mass", config: boneMassConfig },
      { name: "BMI", config: bmiConfig }
    ],
    "Cardiovascular": [
      { name: "Heart Rate", config: heartRateConfig },
      { name: "Blood Pressure", config: bloodPressureConfig },
      { name: "Respiration Rate", config: respirationRateConfig }
    ],
    "Glucose Monitoring": [
      { name: "Blood Glucose", config: bloodGlucoseConfig },
      { name: "HbA1c", config: hba1cConfig },
      { name: "Time in Range", config: timeInRangeConfig }
    ]
  }

  // Get current vitals config based on selected category and metric
  const getVitalsConfig = () => {
    const categoryMetrics = vitalsMetricsMap[selectedVitalsCategory as keyof typeof vitalsMetricsMap]
    const selectedMetricConfig = categoryMetrics?.find(m => m.name === selectedVitalsMetric)
    return selectedMetricConfig?.config || bloodPanelConfig
  }

  // Render health tab content
  const renderHealthContent = () => {
    const contentMap: { [key: string]: React.ReactNode } = {
      "Diet Logs": (
        <MetricTemplateView 
          config={dietConfig} 
          isVitalsCategory={true}
          availableMetrics={[
            { name: "Calories", config: dietConfig },
            { name: "Fat", config: fatConfig },
            { name: "Protein", config: proteinConfig },
            { name: "Carbohydrates", config: carbohydratesConfig }
          ]}
          selectedMetric={selectedDietMetric}
          onMetricSelect={(metricName) => setSelectedDietMetric(metricName)}
        />
      ),
      "Water Logs": <MetricTemplateView config={waterConfig} />,
      "Sleep Logs": <MetricTemplateView config={sleepConfig} />,
      "Steps Logs": <MetricTemplateView config={stepsConfig} />,
      "Weight Logs": <MetricTemplateView config={weightConfig} />,
      "Heart Rate": <MetricTemplateView config={heartRateConfig} />,
      "Medication Logs": <MetricTemplateView config={medicationConfig} />,
      "Fatigue Logs": <MetricTemplateView config={fatigueConfig} />,
      "Menstruation Logs": <MenstrualDetailView />
    }
    
    return contentMap[selectedMetric] || null
  }

  const isBodyCompositionZeroState = isZeroStatePreview && activeTab === "vitals" && selectedVitalsCategory === "Body Composition"

  return (
    <ScreenLayout contentPadding="none">
      <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
        {/* Tab Navigation - Reduced padding */}
        <div className="flex justify-center py-1.5">
          <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 rounded-full shadow-lg shadow-black/10 p-1.5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTabChange('health')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'health' 
                    ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                    : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
                }`}
                style={activeTab === 'health' ? {
                  background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
                } : {}}
              >
                <Icon name="heartMonitor" className="w-4 h-4" />
                Health
              </button>
              
              <button
                onClick={() => handleTabChange('vitals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'vitals' 
                    ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                    : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
                }`}
                style={activeTab === 'vitals' ? {
                  background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
                } : {}}
              >
                <Icon name="cardiology" className="w-4 h-4" />
                Vitals
              </button>
              
              <button
                onClick={() => handleTabChange('symptoms')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'symptoms' 
                    ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                    : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
                }`}
                style={activeTab === 'symptoms' ? {
                  background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
                } : {}}
              >
                <Icon name="stethoscope" className="w-4 h-4" />
                Symptoms
              </button>
            </div>
          </div>
        </div>

        {/* Content Area with Transitions */}
        <div className={`flex-1 flex flex-col overflow-x-hidden transition-all duration-500 ${
          isTransitioningMode ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
        }`}>
          
          {/* Metric/Category Selector - Unified at same level */}
          {(activeTab === 'health' || activeTab === 'vitals') && (
            <div 
              ref={activeTab === 'health' ? metricSelectorRef : undefined}
              className="flex items-center gap-4 overflow-x-auto scrollbar-hide px-4 py-3"
              style={{ scrollBehavior: 'smooth' }}
            >
                {(activeTab === 'health' ? healthMetricIcons : vitalsCategoryIcons).map((item) => {
                  const isSelected = activeTab === 'health' 
                    ? selectedMetric === item.title
                    : selectedVitalsCategory === item.title
                  
                  return (
                    <button
                      key={item.title}
                      onClick={() => {
                        if (activeTab === 'health') {
                          handleMetricSelect(item.title)
                        } else {
                          handleVitalsCategorySelect(item.title)
                        }
                      }}
                      className="flex items-center justify-center transition-all duration-300 shrink-0"
                    >
                      <div
                        className={`${
                          isSelected ? 'w-14' : 'w-12'
                        } aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'shadow-lg ring-2 ring-[var(--app-primary)]'
                            : 'shadow-md hover:shadow-lg opacity-100'
                        } flex-none shrink-0`}
                        style={{
                          backgroundColor: isSelected ? 'var(--app-primary)' : getBgColor(item.bgColor)
                        }}
                      >
                        <span 
                          className={`material-symbols-outlined text-lg transition-colors duration-300 leading-none block ${
                            isSelected ? 'text-[var(--ds-text-inverse)]' : item.color
                          }`}
                        >
                          {item.materialIcon}
                        </span>
                      </div>
                    </button>
                  )
                })}
            </div>
          )}

          {/* Selected Item Name Display */}
          {(activeTab === 'health' || activeTab === 'vitals') && (
            <p className="text-center py-1 text-sm font-bold text-gray-800">
              {activeTab === 'health' 
                ? selectedMetric.replace(' Logs', '') 
                : selectedVitalsCategory}
            </p>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'health' && renderHealthContent()}
            
            {activeTab === 'vitals' && !isBodyCompositionZeroState && (
              <MetricTemplateView 
                config={getVitalsConfig()}
                isVitalsCategory={true}
                availableMetrics={vitalsMetricsMap[selectedVitalsCategory as keyof typeof vitalsMetricsMap]}
                selectedMetric={selectedVitalsMetric}
                onMetricSelect={handleVitalsMetricSelect}
                isBodyComposition={selectedVitalsCategory === "Body Composition"}
                showTodaysProgress={false}
              />
            )}

            {activeTab === 'vitals' && isBodyCompositionZeroState && (
              <div className="h-full px-4 py-3">
                <Card className="shadow-md border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <CardTitle className="text-base font-semibold text-[var(--card-header-text)]">Body Compositions</CardTitle>
                    <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">No data yet. Connect your BCA to start tracking.</p>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 h-52 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 mx-auto flex items-center justify-center mb-2">
                            <Icon name="scale" className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">No body composition entries</p>
                        </div>
                      </div>
                      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 320 160" preserveAspectRatio="none">
                        <path d="M0 120 L50 110 L90 118 L140 104 L185 112 L230 98 L280 108 L320 100" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5 6" />
                      </svg>
                    </div>

                    <div className="mt-4 rounded-xl border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/5 p-3">
                      <div className="flex items-center gap-3">
                        <img src="/images/bca.png" alt="BCA" className="w-10 h-10 object-contain" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">Connect your BCA</p>
                          <p className="text-xs text-gray-600">Enable body composition graph and trend insights</p>
                        </div>
                        <button
                          onClick={() => setShowBcaInstaller(true)}
                          className="h-9 px-3 rounded-lg text-xs font-semibold text-white"
                          style={{ backgroundColor: "var(--app-primary)" }}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'symptoms' && (
              <div className="h-full px-4 py-3">
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: '12px' }}>monitor_heart</span>
                          </div>
                          Symptom Trends
                        </CardTitle>
                        <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">
                          Track your symptoms over time to identify patterns and triggers.
                        </p>
                      </div>
                      <button
                        onClick={handleViewSymptomLogs}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors h-7 w-7 self-center"
                      >
                        <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="relative bg-gray-50 rounded-lg" style={{ height: '280px' }}>
                        <SymptomChart
                          dates={dates}
                          symptomsByDate={symptomsByDate}
                          onDayClick={(date) => daySymptomModal.open(date)}
                        />
                      </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <GoalModal
        title={goalModal.data || ""}
        isOpen={goalModal.isOpen}
        onClose={goalModal.close}
        onSave={(value) => goalModal.data && handleSetGoal(goalModal.data, value)}
      />

      <MedicationModal
        isOpen={medicationModal.isOpen}
        onClose={medicationModal.close}
        medications={medications}
        onAdd={addMedication}
        onRemove={removeMedication}
      />

      {daySymptomModal.isOpen && (
        <DaySymptomOverlay
          date={daySymptomModal.data}
          symptoms={symptomsByDate[daySymptomModal.data] || []}
          onClose={daySymptomModal.close}
        />
      )}

      <ReminderModal isOpen={reminderModal.isOpen} onClose={reminderModal.close} onSave={handleSetReminder} />

      {/* Prompt Selection Overlay */}
      <PromptSelectionOverlay
        isOpen={isPromptSelectionOpen}
        onClose={() => {
          setIsPromptSelectionOpen(false)
          setAskKairaVisible(true)
        }}
        onSelectPrompt={handlePromptSelected}
        prompts={getPromptsForMetric(
          activeTab,
          activeTab === 'health' ? selectedMetric : 
          activeTab === 'vitals' ? selectedVitalsMetric : 
          undefined
        )}
        title={getPromptSelectionTitle(
          activeTab,
          activeTab === 'health' ? selectedMetric : 
          activeTab === 'vitals' ? selectedVitalsMetric : 
          undefined
        )}
      />

      {/* Mini Chat Overlay */}
      <MiniChatOverlay 
        isOpen={isChatOpen} 
        onClose={handleChatClose}
        initialPrompt={selectedPrompt}
        otherPrompts={chatPrompts}
        metricContext={
          activeTab === 'health' ? selectedMetric : 
          activeTab === 'vitals' ? selectedVitalsMetric : 
          'Symptom Tracking'
        }
        onNavigateToAssistant={handleNavigateToAssistant}
      />

      <DevicesOverlay
        isOpen={showBcaInstaller}
        onClose={() => setShowBcaInstaller(false)}
        launchInstallerDirect={true}
        onInstallerModeChange={onDeviceInstallerModeChange}
      />
    </ScreenLayout>
  )
}

// PDF Viewer Component (simplified for now)
function PDFViewer({ reportId, onBack }: { reportId: string; onBack: () => void }) {
  return (
    <ScreenLayout title="Lab Report" onBack={onBack}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF Viewer</h3>
          <p className="text-sm text-[var(--ds-text-secondary)]">Report ID: {reportId}</p>
          <p className="text-xs text-[var(--ds-text-secondary)] mt-2">PDF viewer implementation would go here</p>
        </div>
      </div>
    </ScreenLayout>
  )
}
