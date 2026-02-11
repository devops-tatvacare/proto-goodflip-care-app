"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from '@/components/ui/icon'
import type { MedicationSchedule, TimeSlot, ScheduleFrequency } from "@/lib/types/medication"

interface MedicationScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  medications: string[]
  existingSchedules?: MedicationSchedule[]
  onSave: (schedule: Omit<MedicationSchedule, "id" | "createdAt" | "updatedAt">) => void
}

export function MedicationScheduleModal({
  isOpen,
  onClose,
  medications,
  existingSchedules = [],
  onSave,
}: MedicationScheduleModalProps) {
  const [selectedMedication, setSelectedMedication] = useState<string>("")
  const [frequency, setFrequency] = useState<ScheduleFrequency>({ type: "daily" })
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: `slot_${Date.now()}`,
      time: "08:00",
      dosage: "1 capsule",
    },
  ])
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    if (isOpen && medications.length > 0 && !selectedMedication) {
      setSelectedMedication(medications[0])
    }
  }, [isOpen, medications, selectedMedication])

  useEffect(() => {
    if (selectedMedication) {
      const existingSchedule = existingSchedules.find((s) => s.medicationName === selectedMedication)
      if (existingSchedule) {
        setFrequency(existingSchedule.frequency)
        setTimeSlots(existingSchedule.timeSlots)
        setStartDate(existingSchedule.startDate)
        setEndDate(existingSchedule.endDate || "")
      } else {
        // Reset to defaults for new schedule
        setFrequency({ type: "daily" })
        setTimeSlots([
          {
            id: `slot_${Date.now()}`,
            time: "08:00",
            dosage: "1 capsule",
          },
        ])
        setStartDate(new Date().toISOString().split("T")[0])
        setEndDate("")
      }
    }
  }, [selectedMedication, existingSchedules])

  const handleSave = () => {
    if (!selectedMedication || timeSlots.length === 0) {
      return
    }

    const schedule: Omit<MedicationSchedule, "id" | "createdAt" | "updatedAt"> = {
      medicationName: selectedMedication,
      frequency,
      timeSlots,
      startDate,
      endDate: endDate || undefined,
      isActive: true,
    }

    onSave(schedule)
    onClose()
  }

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: "12:00",
      dosage: "1 capsule",
    }
    setTimeSlots([...timeSlots, newSlot])
  }

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
    }
  }

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(timeSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)))
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="bg-[var(--ds-surface-primary)] rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--ds-border-default)]">
          <h2 className="text-lg font-medium text-gray-900">Set Medication Reminder</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <Icon name="close" className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Medication Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="medication" className="text-sm font-medium text-gray-700">
              Medication
            </Label>
            <select
              id="medication"
              value={selectedMedication}
              onChange={(e) => setSelectedMedication(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {medications.map((med) => (
                <option key={med} value={med}>
                  {med}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Frequency</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={frequency.type === "daily"}
                  onChange={(e) => setFrequency({ type: "daily" })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Daily</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value="weekly"
                  checked={frequency.type === "weekly"}
                  onChange={(e) => setFrequency({ type: "weekly", daysOfWeek: [1, 2, 3, 4, 5] })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Weekly</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value="custom"
                  checked={frequency.type === "custom"}
                  onChange={(e) => setFrequency({ type: "custom", interval: 2 })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Custom</span>
              </label>
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Times</Label>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.time}
                    onChange={(e) => updateTimeSlot(slot.id, "time", e.target.value)}
                    className="w-24 text-sm"
                  />
                  <Input
                    type="text"
                    value={slot.dosage}
                    onChange={(e) => updateTimeSlot(slot.id, "dosage", e.target.value)}
                    placeholder="1 capsule"
                    className="flex-1 text-sm"
                  />
                  {timeSlots.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimeSlot(slot.id)}
                      className="h-8 w-8 p-0 text-[var(--ds-status-error)] hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="minus" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addTimeSlot}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
              >
                <Icon name="plus" className="h-4 w-4 mr-1" />
                Add Time
              </Button>
            </div>
          </div>

          {/* Duration Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Duration</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startDate" className="text-xs text-[var(--ds-text-secondary)]">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs text-[var(--ds-text-secondary)]">
                  End Date (Optional)
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notification Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="info" className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Notifications will remind you to take your medications at the scheduled times.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-[var(--ds-border-default)]">
          <Button variant="outline" onClick={onClose} className="text-sm bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="text-sm">
            Save Reminder
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
