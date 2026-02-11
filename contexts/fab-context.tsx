"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

// Types for FAB actions
export interface FABAction {
  id: string
  label: string
  icon: string // Material icon name
  onClick: () => void
  isSpecial?: boolean // For special styling like Ask Kaira
  hidden?: boolean // To conditionally hide actions
}

// FAB context state
interface FABContextState {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  isPromptSelectionOpen: boolean
  setIsPromptSelectionOpen: (open: boolean) => void
  previousState: 'default' | 'expanded'
  setPreviousState: (state: 'default' | 'expanded') => void
  currentContext: string
  setCurrentContext: (context: string) => void
  actions: FABAction[]
  setActions: (actions: FABAction[]) => void
  updateActionsForMetric: (metricType: string, metricName: string) => void
  setAskKairaAction: (action: () => void) => void
  setAskKairaVisible: (visible: boolean) => void
  currentMetricType?: "health" | "vitals" | "symptoms"
  setCurrentMetricType: (type: "health" | "vitals" | "symptoms") => void
  currentMetricName?: string
  setCurrentMetricName: (name: string) => void
}

const FABContext = createContext<FABContextState | undefined>(undefined)

// Metric-specific action configurations
const METRIC_ACTION_CONFIGS: Record<string, (metricName: string) => FABAction[]> = {
  'Diet Logs': () => [
    { id: 'log-diet', label: 'Log Diet', icon: 'restaurant', onClick: () => console.log('Log Diet') },
    { id: 'add-meal', label: 'Add Meal', icon: 'add_circle', onClick: () => console.log('Add Meal') },
  ],
  'Water Logs': () => [
    { id: 'log-water', label: 'Log Water', icon: 'water_drop', onClick: () => console.log('Log Water') },
    { id: 'quick-add', label: 'Quick +250ml', icon: 'add', onClick: () => console.log('Quick Add Water') },
  ],
  'Sleep Logs': () => [
    { id: 'log-sleep', label: 'Log Sleep', icon: 'bedtime', onClick: () => console.log('Log Sleep') },
  ],
  'Medication Logs': () => [
    { id: 'log-medication', label: 'Log Medication', icon: 'medication', onClick: () => console.log('Log Medication') },
    { id: 'add-medication', label: 'Add Medication', icon: 'add', onClick: () => console.log('Add Medication') },
  ],
  'Steps Logs': () => [
    { id: 'log-steps', label: 'Log Steps', icon: 'directions_walk', onClick: () => console.log('Log Steps') },
  ],
}

// Standard actions available for all metrics
const STANDARD_ACTIONS: FABAction[] = [
  { id: 'reminder', label: 'Set Reminder', icon: 'notifications', onClick: () => console.log('Set Reminder') },
  { id: 'goal', label: 'Set Goal', icon: 'flag', onClick: () => console.log('Set Goal') },
]

// Ask Kaira action (always present) - will be overridden by components
const ASK_KAIRA_ACTION: FABAction = {
  id: 'ask-kaira',
  label: 'Ask Kaira',
  icon: 'chat',
  onClick: () => console.log('Ask Kaira - Default'),
  isSpecial: true
}

export function FABProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPromptSelectionOpen, setIsPromptSelectionOpen] = useState(false)
  const [previousState, setPreviousState] = useState<'default' | 'expanded'>('default')
  const [currentContext, setCurrentContext] = useState('default')
  const [actions, setActions] = useState<FABAction[]>([...STANDARD_ACTIONS, ASK_KAIRA_ACTION])
  const [currentMetricType, setCurrentMetricType] = useState<"health" | "vitals" | "symptoms">("health")
  const [currentMetricName, setCurrentMetricName] = useState<string>("")

  // Update actions based on metric type and name
  const updateActionsForMetric = useCallback((metricType: string, metricName: string) => {
    const metricSpecificActions = METRIC_ACTION_CONFIGS[metricName]?.(metricName) || []
    setActions(currentActions => {
      // Find the current Ask Kaira action to preserve any custom onClick handler
      const currentAskKairaAction = currentActions.find(action => action.id === 'ask-kaira') || ASK_KAIRA_ACTION
      const allActions = [
        ...metricSpecificActions,
        ...STANDARD_ACTIONS,
        currentAskKairaAction
      ]
      return allActions
    })
    setCurrentContext(`${metricType}-${metricName}`)
    setCurrentMetricType(metricType as "health" | "vitals" | "symptoms")
    setCurrentMetricName(metricName)
  }, [])

  // Function to update Ask Kaira action
  const setAskKairaAction = useCallback((onClick: () => void) => {
    setActions(currentActions => 
      currentActions.map(action => 
        action.id === 'ask-kaira' 
          ? { ...action, onClick }
          : action
      )
    )
  }, [])

  // Function to toggle Ask Kaira visibility
  const setAskKairaVisible = useCallback((visible: boolean) => {
    setActions(currentActions => 
      currentActions.map(action => 
        action.id === 'ask-kaira' 
          ? { ...action, hidden: !visible }
          : action
      )
    )
  }, [])

  return (
    <FABContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        isPromptSelectionOpen,
        setIsPromptSelectionOpen,
        previousState,
        setPreviousState,
        currentContext,
        setCurrentContext,
        actions,
        setActions,
        updateActionsForMetric,
        setAskKairaAction,
        setAskKairaVisible,
        currentMetricType,
        setCurrentMetricType,
        currentMetricName,
        setCurrentMetricName,
      }}
    >
      {children}
    </FABContext.Provider>
  )
}

export function useFAB() {
  const context = useContext(FABContext)
  if (context === undefined) {
    throw new Error('useFAB must be used within a FABProvider')
  }
  return context
}