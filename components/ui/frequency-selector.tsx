"use client"

import { Button } from "@/components/ui/button"
import type { ScheduleFrequency } from "@/lib/types/medication"

interface FrequencySelectorProps {
  frequency: ScheduleFrequency
  onChange: (frequency: ScheduleFrequency) => void
}

export function FrequencySelector({ frequency, onChange }: FrequencySelectorProps) {
  const getFrequencyText = () => {
    switch (frequency.type) {
      case "daily":
        return "Every Day"
      case "weekly":
        return "Weekly"
      case "custom":
        return `Every ${frequency.interval} days`
      default:
        return "Every Day"
    }
  }

  const handleFrequencyChange = () => {
    // Cycle through frequency types
    if (frequency.type === "daily") {
      onChange({ type: "weekly", daysOfWeek: [1, 2, 3, 4, 5] }) // Weekdays
    } else if (frequency.type === "weekly") {
      onChange({ type: "custom", interval: 2 })
    } else {
      onChange({ type: "daily" })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--ds-text-inverse)]">When will you take this?</h3>

      <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
        <span className="text-[var(--ds-text-inverse)] text-lg">{getFrequencyText()}</span>
        <Button onClick={handleFrequencyChange} variant="ghost" className="text-blue-400 hover:text-blue-300">
          Change
        </Button>
      </div>

      {frequency.type === "weekly" && (
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-3">Select days:</p>
          <div className="flex gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <button
                key={day}
                onClick={() => {
                  const currentDays = frequency.daysOfWeek || []
                  const newDays = currentDays.includes(index)
                    ? currentDays.filter((d) => d !== index)
                    : [...currentDays, index]
                  onChange({ ...frequency, daysOfWeek: newDays })
                }}
                className={`w-10 h-10 rounded-full text-xs font-medium transition-colors ${
                  frequency.daysOfWeek?.includes(index)
                    ? "bg-[var(--ds-interactive-primary)] text-[var(--ds-text-inverse)]"
                    : "bg-gray-600 text-gray-300 hover:bg-[var(--ds-surface-secondary)]0"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {frequency.type === "custom" && (
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-3">Every how many days?</p>
          <input
            type="number"
            min="1"
            max="30"
            value={frequency.interval || 1}
            onChange={(e) => onChange({ ...frequency, interval: Number.parseInt(e.target.value) || 1 })}
            className="w-20 bg-gray-600 text-[var(--ds-text-inverse)] rounded px-3 py-2 text-center"
          />
          <span className="text-gray-300 ml-2">days</span>
        </div>
      )}
    </div>
  )
}
