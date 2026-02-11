import type { BaseEntity, ChartDataPoint } from "./common"

export interface HealthMetric extends BaseEntity {
  name: string
  value: number
  unit: string
  trend?: "up" | "down" | "stable"
  status: "normal" | "warning" | "critical"
  lastUpdated: Date
  target?: {
    min?: number
    max?: number
    optimal?: number
  }
}

export interface Device extends BaseEntity {
  name: string
  type: "glucose" | "blood_pressure" | "weight" | "heart_rate"
  brand: string
  model: string
  status: "connected" | "disconnected" | "syncing" | "error"
  lastSync?: Date
  batteryLevel?: number
  metrics: HealthMetric[]
}

export interface Medication extends BaseEntity {
  name: string
  dosage: string
  frequency: string
  instructions?: string
  startDate: Date
  endDate?: Date
  status: "active" | "paused" | "completed"
  reminders: MedicationReminder[]
}

export interface MedicationReminder extends BaseEntity {
  time: string
  taken: boolean
  takenAt?: Date
  skipped?: boolean
  notes?: string
}

export interface Appointment extends BaseEntity {
  title: string
  type: "consultation" | "lab" | "procedure" | "follow_up"
  provider: string
  date: Date
  duration: number
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  location?: string
  notes?: string
}

export interface LabResult extends BaseEntity {
  testName: string
  value: number
  unit: string
  referenceRange: {
    min: number
    max: number
  }
  status: "normal" | "high" | "low" | "critical"
  date: Date
  provider: string
}

export interface TreatmentCycle extends BaseEntity {
  cycleNumber: number
  medication: string
  startDate: Date
  endDate?: Date
  status: "active" | "completed" | "paused" | "cancelled"
  progress: number
  sideEffects?: string[]
  notes?: string
}

export interface SymptomLog extends BaseEntity {
  symptom: string
  severity: 1 | 2 | 3 | 4 | 5
  date: Date
  notes?: string
  triggers?: string[]
  medications?: string[]
}

export interface HealthInsight extends BaseEntity {
  title: string
  description: string
  type: "trend" | "alert" | "recommendation" | "achievement"
  priority: "low" | "medium" | "high"
  data?: ChartDataPoint[]
  actionable: boolean
  actions?: string[]
}
