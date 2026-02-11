// Context screen data - organized and configurable
// Smart data organization for Patient Context functionality

import { Icon } from '@/components/ui/icon'

// Patient Profile Data
export interface PatientProfile {
  name: string
  age: number
  gender: 'M' | 'F' | 'Other'
  height: number // cm
  weight: number // kg
  bmi: number
  conditions: string[]
}

export const DEFAULT_PATIENT_PROFILE: PatientProfile = {
  name: "John Doe",
  age: 45,
  gender: "M",
  height: 175,
  weight: 92,
  bmi: 30.1,
  conditions: ["Type 2 Diabetes", "Hypertension"]
}

// Health Context Data
export interface HealthContextData {
  currentMedications: Array<{
    name: string
    dosage: string
    frequency: string
    lastTaken?: string
  }>
  vitals: Array<{
    label: string
    value: string
    status: 'normal' | 'elevated' | 'low'
    lastUpdated: string
  }>
  allergies: string[]
  emergencyContacts: Array<{
    name: string
    relationship: string
    phone: string
  }>
}

export const DEFAULT_HEALTH_CONTEXT: HealthContextData = {
  currentMedications: [
    {
      name: "Semaglutide",
      dosage: "0.5mg",
      frequency: "Weekly",
      lastTaken: "3 days ago"
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      lastTaken: "8 hours ago"
    }
  ],
  vitals: [
    {
      label: "Blood Glucose",
      value: "126 mg/dL",
      status: "elevated",
      lastUpdated: "2 hours ago"
    },
    {
      label: "Blood Pressure",
      value: "138/82 mmHg",
      status: "elevated", 
      lastUpdated: "1 day ago"
    },
    {
      label: "Heart Rate",
      value: "72 bpm",
      status: "normal",
      lastUpdated: "2 hours ago"
    }
  ],
  allergies: ["Penicillin", "Shellfish"],
  emergencyContacts: [
    {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 (555) 123-4567"
    },
    {
      name: "Dr. Smith",
      relationship: "Primary Care",
      phone: "+1 (555) 987-6543"
    }
  ]
}

// AI Personalization Settings
export interface AIPersonalizationData {
  communicationStyle: 'formal' | 'casual' | 'medical'
  reminderFrequency: 'low' | 'medium' | 'high'
  dataSharing: {
    anonymizedResearch: boolean
    healthcareProviders: boolean
    emergencyServices: boolean
  }
  preferences: {
    units: 'metric' | 'imperial'
    language: string
    timezone: string
  }
}

export const DEFAULT_AI_PERSONALIZATION: AIPersonalizationData = {
  communicationStyle: 'casual',
  reminderFrequency: 'medium',
  dataSharing: {
    anonymizedResearch: true,
    healthcareProviders: true,
    emergencyServices: true
  },
  preferences: {
    units: 'metric',
    language: 'English',
    timezone: 'America/New_York'
  }
}

// Context Screen Section Configuration
export interface ContextSection {
  id: keyof typeof INITIAL_CONTEXT_SECTIONS
  title: string
  icon: any
  description: string
  previewItems: Array<{
    icon: any
    text: string
  }>
}

export const CONTEXT_SECTIONS: ContextSection[] = [
  {
    id: 'coreProfile',
    title: 'Core Patient Profile',
    icon: (props: any) => <Icon name="person" {...props} />,
    description: 'Basic demographic and physical characteristics',
    previewItems: [
      { icon: (props: any) => <Icon name="person" {...props} />, text: `${DEFAULT_PATIENT_PROFILE.name}, ${DEFAULT_PATIENT_PROFILE.age}${DEFAULT_PATIENT_PROFILE.gender}` },
      { icon: (props: any) => <Icon name="heartMonitor" {...props} />, text: `BMI: ${DEFAULT_PATIENT_PROFILE.bmi}` },
      { icon: (props: any) => <Icon name="medication" {...props} />, text: DEFAULT_PATIENT_PROFILE.conditions[0] }
    ]
  },
  {
    id: 'healthContext',
    title: 'Dynamic Health Context',
    icon: (props: any) => <Icon name="heart" {...props} />,
    description: 'Current medications, vitals, and health status',
    previewItems: [
      { icon: (props: any) => <Icon name="medication" {...props} />, text: `${DEFAULT_HEALTH_CONTEXT.currentMedications.length} active medications` },
      { icon: (props: any) => <Icon name="heartMonitor" {...props} />, text: `Latest: ${DEFAULT_HEALTH_CONTEXT.vitals[0].value}` },
      { icon: (props: any) => <Icon name="shield" {...props} />, text: `${DEFAULT_HEALTH_CONTEXT.allergies.length} known allergies` }
    ]
  },
  {
    id: 'aiPersonalization',
    title: 'AI Personalization & Controls',
    icon: (props: any) => <Icon name="brain" {...props} />,
    description: 'Customize how your AI assistant communicates and behaves',
    previewItems: [
      { icon: (props: any) => <Icon name="brain" {...props} />, text: `Communication: ${DEFAULT_AI_PERSONALIZATION.communicationStyle}` },
      { icon: (props: any) => <Icon name="settings" {...props} />, text: `Reminders: ${DEFAULT_AI_PERSONALIZATION.reminderFrequency}` },
      { icon: (props: any) => <Icon name="shield" {...props} />, text: 'Privacy controls active' }
    ]
  }
]

// Import the initial state from existing constants
import { INITIAL_CONTEXT_SECTIONS } from './constants-minimal'
export { INITIAL_CONTEXT_SECTIONS }