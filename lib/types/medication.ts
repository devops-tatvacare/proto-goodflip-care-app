export interface TimeSlot {
  id: string
  time: string // "16:40"
  dosage: string // "1 capsule"
}

export interface ScheduleFrequency {
  type: "daily" | "weekly" | "custom"
  interval?: number // for custom intervals
  daysOfWeek?: number[] // for weekly (0-6, Sunday=0)
}

export interface MedicationSchedule {
  id: string
  medicationName: string
  frequency: ScheduleFrequency
  timeSlots: TimeSlot[]
  startDate: string // ISO date string
  endDate?: string // ISO date string, optional
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MedicationReminder {
  id: string
  scheduleId: string
  medicationName: string
  scheduledTime: string // ISO datetime string
  dosage: string
  status: "pending" | "taken" | "missed" | "skipped"
  actualTime?: string // when actually taken
  notes?: string
}
