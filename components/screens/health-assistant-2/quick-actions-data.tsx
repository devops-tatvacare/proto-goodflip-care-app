// Quick Actions data - smart organization, no hardcoding
// All quick action configurations and constants

import { Icon } from '@/components/ui/icon'

export interface QuickAction {
  id: string
  label: string
  icon: any
  shortLabel: string
  color: string
  description: string
}

// Action-to-flow mapping utility
export const getQuickActionById = (actionId: string): QuickAction | undefined => {
  return QUICK_ACTIONS.find(action => action.id === actionId)
}

export const getQuickActionByLabel = (label: string): QuickAction | undefined => {
  return QUICK_ACTIONS.find(action => action.label === label)
}

// Generate activity selection options for Log Activities
export const generateActivityOptions = () => {
  return {
    type: "options" as const,
    content: "Which activity would you like to log?",
    data: {
      options: QUICK_ACTIONS.map(action => action.label),
      allowMultiple: false
    }
  }
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "log-diet",
    label: "Log Diet",
    shortLabel: "Diet",
    icon: (props: any) => <Icon name="restaurant" {...props} />,
    color: "from-green-500 to-green-600",
    description: "Track your meals and nutrition"
  },
  {
    id: "log-exercise", 
    label: "Log Exercise",
    shortLabel: "Exercise",
    icon: (props: any) => <Icon name="fitnessCenter" {...props} />,
    color: "from-orange-500 to-orange-600", 
    description: "Record your workout activities"
  },
  {
    id: "log-sleep",
    label: "Log Sleep", 
    shortLabel: "Sleep",
    icon: (props: any) => <Icon name="bedtime" {...props} />,
    color: "from-purple-500 to-purple-600",
    description: "Track your sleep duration"
  },
  {
    id: "log-water",
    label: "Log Water",
    shortLabel: "Water", 
    icon: (props: any) => <Icon name="waterDrop" {...props} />,
    color: "from-blue-500 to-blue-600",
    description: "Monitor your hydration"
  },
  {
    id: "log-medications",
    label: "Log Medications",
    shortLabel: "Meds",
    icon: (props: any) => <Icon name="medication" {...props} />, 
    color: "from-red-500 to-red-600",
    description: "Track your medication intake"
  },
  {
    id: "log-symptoms",
    label: "Log Symptoms",
    shortLabel: "Symptoms",
    icon: (props: any) => <Icon name="thermostat" {...props} />,
    color: "from-pink-500 to-pink-600",
    description: "Track symptoms and side effects"
  }
]