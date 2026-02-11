import type { LucideIcon } from "@/lib/icons"

export interface BaseEntity {
  id: string
  name: string
}

export interface Specialist extends BaseEntity {
  role: string
  avatar: string
  price?: number
  experience?: string
}

export interface Device extends BaseEntity {
  type: string
  brand: string
  model: string
  isConnected: boolean
  lastSync: string
  batteryLevel?: number
  icon: LucideIcon
  color: string
  bgColor: string
  stats?: DeviceStat[]
}

export interface DeviceStat {
  label: string
  value: string
  unit: string
  trend?: "up" | "down" | "stable"
}

export interface Notification {
  id: number
  title: string
  message: string
  type: string
  isRead: boolean
  timestamp: string
  icon: LucideIcon
  color: string
  bgColor: string
}

export interface InsightData {
  title: string
  icon: LucideIcon
  color: string
  bgColor: string
  logged: number
  missed: number
  unit: string
  description: string
  chart: number[]
  period: string
  hasData: boolean
}

export interface SymptomLog {
  id: string
  symptom: string
  icon: LucideIcon
  time: string
  date: string
  painScale?: number
  duration: string
  notes?: string
  color: string
}

export interface LabReport {
  id: string
  name: string
  date: string
  time: string
  status: "Normal" | "Good" | "Needs Attention" | "Critical"
  category: string
  results: LabResult[]
  summary: string
  recommendations?: string[]
}

export interface LabResult {
  parameter: string
  value: string
  unit: string
  range: string
  status: "Normal" | "High" | "Low" | "Critical"
  trend?: "up" | "down" | "stable"
}

export interface LogEntry {
  id: string
  date: string
  [key: string]: any
}

export interface FilterableItem {
  category?: string
  role?: string
  tags?: string[]
  [key: string]: any
}
