"use client"

import { Button } from "@/components/ui/button"

interface DurationEditorProps {
  startDate: string
  endDate?: string
  onChange: (startDate: string, endDate?: string) => void
}

export function DurationEditor({ startDate, endDate, onChange }: DurationEditorProps) {
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    return isToday
      ? `${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })} (Today)`
      : date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--ds-text-inverse)]">Duration</h3>

      <div className="bg-gray-700 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">START DATE</p>
            <p className="text-[var(--ds-text-inverse)] text-lg">{formatDisplayDate(startDate)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">END DATE</p>
            <p className="text-[var(--ds-text-inverse)] text-lg">{endDate ? formatDisplayDate(endDate) : "None"}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 p-0 h-auto"
          onClick={() => {
            // This would open a date picker in a real implementation
            // For now, we'll just toggle between having an end date or not
            if (endDate) {
              onChange(startDate, undefined)
            } else {
              const futureDate = new Date()
              futureDate.setMonth(futureDate.getMonth() + 1)
              onChange(startDate, futureDate.toISOString().split("T")[0])
            }
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  )
}
