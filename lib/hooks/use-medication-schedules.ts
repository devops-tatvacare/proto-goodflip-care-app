"use client"

import { useState, useCallback } from "react"
import type { MedicationSchedule } from "@/lib/types/medication"

export function useMedicationSchedules() {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([])

  const addSchedule = useCallback((schedule: Omit<MedicationSchedule, "id" | "createdAt" | "updatedAt">) => {
    const newSchedule: MedicationSchedule = {
      ...schedule,
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSchedules((prev) => [...prev, newSchedule])
    return newSchedule
  }, [])

  const updateSchedule = useCallback((scheduleId: string, updates: Partial<MedicationSchedule>) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, ...updates, updatedAt: new Date().toISOString() } : schedule,
      ),
    )
  }, [])

  const deleteSchedule = useCallback((scheduleId: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== scheduleId))
  }, [])

  const getScheduleByMedication = useCallback(
    (medicationName: string) => {
      return schedules.find((schedule) => schedule.medicationName === medicationName)
    },
    [schedules],
  )

  const getActiveSchedules = useCallback(() => {
    return schedules.filter((schedule) => schedule.isActive)
  }, [schedules])

  return {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleByMedication,
    getActiveSchedules,
  }
}
