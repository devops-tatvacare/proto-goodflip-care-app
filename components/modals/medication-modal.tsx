"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from '@/components/ui/icon'
import { useToast } from "@/lib/hooks/use-toast"

interface MedicationModalProps {
  isOpen: boolean
  onClose: () => void
  medications: string[]
  onAdd: (medication: string) => void
  onRemove: (index: number) => void
}

interface MedicationForm {
  name: string
  type: string
  strength: string
  unit: string
  hasReminder: boolean
  frequency: "everyday" | "selectDays"
  selectedDays: number[]
  startDate: string
  endDate: string
  doseTimes: string[]
}

const MEDICATION_TYPES = [
  "Capsule",
  "Tablet",
  "Injection",
  "Syrup",
  "Drops",
  "Cream",
  "Ointment",
  "Inhaler",
  "Patch",
  "Suppository",
]

const STRENGTH_UNITS = ["mg", "mcg", "g", "mL", "IU", "units", "%"]

const DAYS = [
  { short: "S", full: "Sunday", value: 0 },
  { short: "M", full: "Monday", value: 1 },
  { short: "T", full: "Tuesday", value: 2 },
  { short: "W", full: "Wednesday", value: 3 },
  { short: "T", full: "Thursday", value: 4 },
  { short: "F", full: "Friday", value: 5 },
  { short: "S", full: "Saturday", value: 6 },
]

export function MedicationModal({ isOpen, onClose, medications, onAdd, onRemove }: MedicationModalProps) {
  const { toast } = useToast()
  const [currentView, setCurrentView] = useState<"list" | "form">("list")
  const [medicationForm, setMedicationForm] = useState<MedicationForm>({
    name: "",
    type: "Capsule",
    strength: "",
    unit: "mg",
    hasReminder: false,
    frequency: "everyday",
    selectedDays: [1, 2, 3, 4, 5], // Default to weekdays
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    doseTimes: ["08:00"],
  })

  const resetForm = () => {
    setMedicationForm({
      name: "",
      type: "Capsule",
      strength: "",
      unit: "mg",
      hasReminder: false,
      frequency: "everyday",
      selectedDays: [1, 2, 3, 4, 5],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      doseTimes: ["08:00"],
    })
  }

  const handleClose = () => {
    setCurrentView("list")
    resetForm()
    onClose()
  }

  const handleAddNewMedication = () => {
    setCurrentView("form")
    resetForm()
  }

  const handleBackToList = () => {
    setCurrentView("list")
    resetForm()
  }

  const handleRemoveMedication = (index: number) => {
    const medication = medications[index]
    onRemove(index)
    toast({
      title: "Medication Removed",
      description: `${medication} has been removed from your list`,
      type: "success",
    })
  }

  const handleSaveMedication = () => {
    if (!medicationForm.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a medication name",
        type: "error",
      })
      return
    }

    if (!medicationForm.strength.trim()) {
      toast({
        title: "Error",
        description: "Please enter medication strength",
        type: "error",
      })
      return
    }

    // Create medication name with details
    const medicationDetails = `${medicationForm.name} ${medicationForm.strength}${medicationForm.unit} (${medicationForm.type})`

    onAdd(medicationDetails)

    toast({
      title: "Medication Added!",
      description: `${medicationForm.name} has been added to your list${medicationForm.hasReminder ? " with reminders" : ""}`,
      type: "success",
    })

    handleBackToList()
  }

  const handleToggleDay = (dayValue: number) => {
    setMedicationForm((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayValue)
        ? prev.selectedDays.filter((d) => d !== dayValue)
        : [...prev.selectedDays, dayValue],
    }))
  }

  const handleAddDoseTime = () => {
    setMedicationForm((prev) => ({
      ...prev,
      doseTimes: [...prev.doseTimes, "12:00"],
    }))
  }

  const handleRemoveDoseTime = (index: number) => {
    if (medicationForm.doseTimes.length > 1) {
      setMedicationForm((prev) => ({
        ...prev,
        doseTimes: prev.doseTimes.filter((_, i) => i !== index),
      }))
    }
  }

  const handleUpdateDoseTime = (index: number, time: string) => {
    setMedicationForm((prev) => ({
      ...prev,
      doseTimes: prev.doseTimes.map((t, i) => (i === index ? time : t)),
    }))
  }

  if (currentView === "list") {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Add Medication"
        actions={
          <Button 
            onClick={handleClose} 
            className="text-xs py-2 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] w-full"
          >
            Done
          </Button>
        }
      >
        <div className="space-y-3">
          {/* Add New Medication Button */}
          <Button
            onClick={handleAddNewMedication}
            className="w-full bg-green-600 hover:bg-green-700 text-[var(--ds-text-inverse)] text-xs py-2.5"
          >
            <Icon name="plus" className="w-3.5 h-3.5 mr-1.5" />
            Add New Medication
          </Button>

          {/* Existing Medications */}
          {medications.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Existing Medications:</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {medications.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Icon name="medication" className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-800 font-medium truncate">{med}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-[var(--ds-text-secondary)] hover:text-gray-700 hover:bg-gray-200"
                      >
                        <Icon name="edit" className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleRemoveMedication(index)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-[var(--ds-status-error)] hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="close" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    )
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleBackToList}
      title={
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToList} className="h-8 w-8 p-0">
            <Icon name="arrowLeft" className="h-4 w-4" />
          </Button>
          <span>Add New Medication</span>
        </div>
      }
      actions={
        <>
          <Button 
            variant="outline" 
            onClick={handleBackToList} 
            className="flex-1 text-xs py-2 border-[var(--ds-border-default)] text-[var(--ds-text-secondary)] hover:bg-[var(--ds-surface-secondary)]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMedication} 
            className="flex-1 text-xs py-2 bg-green-600 hover:bg-green-700 text-[var(--ds-text-inverse)]"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-3 max-h-[55vh] overflow-y-auto">
        {/* Medicine Name */}
        <div className="space-y-1.5">
          <Label htmlFor="medicineName" className="text-xs font-medium text-gray-700">
            Medicine Name
          </Label>
          <Input
            id="medicineName"
            type="text"
            value={medicationForm.name}
            onChange={(e) => setMedicationForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter medicine name"
            className="text-xs py-2 border-[var(--ds-border-default)] focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label htmlFor="medicineType" className="text-xs font-medium text-gray-700">
            Type
          </Label>
          <select
            id="medicineType"
            value={medicationForm.type}
            onChange={(e) => setMedicationForm((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-[var(--ds-border-default)] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            {MEDICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Strength */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700">Strength</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={medicationForm.strength}
              onChange={(e) => setMedicationForm((prev) => ({ ...prev, strength: e.target.value }))}
              placeholder="25"
              className="flex-1 text-xs py-2 border-[var(--ds-border-default)] focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <select
              value={medicationForm.unit}
              onChange={(e) => setMedicationForm((prev) => ({ ...prev, unit: e.target.value }))}
              className="px-2 py-2 border border-[var(--ds-border-default)] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 min-w-[60px]"
            >
              {STRENGTH_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Reminder Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Add Reminder</Label>
            <button
              type="button"
              onClick={() => setMedicationForm((prev) => ({ ...prev, hasReminder: !prev.hasReminder }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                medicationForm.hasReminder ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[var(--ds-surface-primary)] transition-transform ${
                  medicationForm.hasReminder ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Reminder Settings */}
          {medicationForm.hasReminder && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {/* Frequency */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Frequency</Label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="everyday"
                      checked={medicationForm.frequency === "everyday"}
                      onChange={(e) => setMedicationForm((prev) => ({ ...prev, frequency: "everyday" }))}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Everyday</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="selectDays"
                      checked={medicationForm.frequency === "selectDays"}
                      onChange={(e) => setMedicationForm((prev) => ({ ...prev, frequency: "selectDays" }))}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Select Days</span>
                  </label>
                </div>
              </div>

              {/* Days Selection */}
              {medicationForm.frequency === "selectDays" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Days</Label>
                  <div className="flex gap-1">
                    {DAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleToggleDay(day.value)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                          medicationForm.selectedDays.includes(day.value)
                            ? "bg-blue-600 text-[var(--ds-text-inverse)]"
                            : "bg-gray-100 text-[var(--ds-text-secondary)] hover:bg-gray-200"
                        }`}
                        title={day.full}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
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
                      value={medicationForm.startDate}
                      onChange={(e) => setMedicationForm((prev) => ({ ...prev, startDate: e.target.value }))}
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
                      value={medicationForm.endDate}
                      onChange={(e) => setMedicationForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Dose Times */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Pick a time for dose</Label>
                <div className="space-y-2">
                  {medicationForm.doseTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon name="clock" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => handleUpdateDoseTime(index, e.target.value)}
                        className="flex-1 text-sm"
                      />
                      {medicationForm.doseTimes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDoseTime(index)}
                          className="h-8 w-8 p-0 text-[var(--ds-status-error)] hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="minus" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddDoseTime}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                  >
                    <Icon name="plus" className="h-4 w-4 mr-1" />
                    Add Dose
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
