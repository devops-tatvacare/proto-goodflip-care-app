"use client"

import { useState } from "react"

interface MedicationEntry {
  id: string
  medication: string
  day: string
  time: string
  status: "scheduled" | "taken" | "missed"
  dayIndex: number
  timeSlot: number
  scheduledTime: string
}

interface MedicationTrendsChartProps {
  selectedPeriod: "D" | "W"
  medications: string[]
  selectedMedication: string
}

export function MedicationTrendsChart({ selectedPeriod, medications, selectedMedication }: MedicationTrendsChartProps) {

  // Sample medication schedules
  const getMedicationSchedule = (medicationName: string): string[] => {
    const schedules: Record<string, string[]> = {
      Paracetamol: ["8:00", "14:00", "20:00"], // 3x daily
      "Vitamin D": ["9:00"], // Once daily
      Aspirin: ["8:30", "20:30"], // Twice daily
      Actibile: ["7:00", "19:00"], // Twice daily
      Dolo: ["8:00", "16:00"], // Twice daily
    }
    return schedules[medicationName] || ["8:00", "20:00"] // Default schedule
  }

  // Generate realistic medication data
  const generateMedicationData = (): MedicationEntry[] => {
    const data: MedicationEntry[] = []
    const days = selectedPeriod === "W" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Today"]

    // Get current day for comparison (simulate current day as Wednesday for demo)
    const currentDayIndex = selectedPeriod === "W" ? 3 : 0 // Wednesday
    const currentTime = new Date()
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()

    days.forEach((day, dayIndex) => {
      medications.forEach((med) => {
        const schedule = getMedicationSchedule(med)

        schedule.forEach((scheduledTime, scheduleIndex) => {
          const [hour, minute] = scheduledTime.split(":").map(Number)

          // Determine time slot for positioning
          let timeSlot = 0
          if (hour >= 4 && hour < 8) timeSlot = 1
          else if (hour >= 8 && hour < 12) timeSlot = 2
          else if (hour >= 12 && hour < 16) timeSlot = 3
          else if (hour >= 16 && hour < 20) timeSlot = 4
          else if (hour >= 20 || hour < 4) timeSlot = 5

          // Determine if this time is in the past or future
          const isPastTime =
            dayIndex < currentDayIndex ||
            (dayIndex === currentDayIndex && (hour < currentHour || (hour === currentHour && minute < currentMinute)))

          if (isPastTime) {
            // For past times, show either taken or missed (never scheduled)
            const wasTaken = Math.random() < 0.7 // 70% compliance rate

            if (wasTaken) {
              // Create taken entry with slight time variation (±15 minutes)
              const takenMinute = minute + (Math.random() - 0.5) * 30
              const takenHour = hour + Math.floor(takenMinute / 60)
              const finalMinute = Math.max(0, Math.min(59, Math.floor(takenMinute % 60)))
              const finalHour = Math.max(0, Math.min(23, takenHour))
              const takenTime = `${finalHour}:${finalMinute.toString().padStart(2, "0")}`

              data.push({
                id: `${day}-${med}-${scheduleIndex}-taken`,
                medication: med,
                day,
                time: takenTime,
                status: "taken",
                dayIndex,
                timeSlot,
                scheduledTime,
              })
            } else {
              // Create missed entry at exact scheduled position
              data.push({
                id: `${day}-${med}-${scheduleIndex}-missed`,
                medication: med,
                day,
                time: scheduledTime,
                status: "missed",
                dayIndex,
                timeSlot,
                scheduledTime,
              })
            }
          } else {
            // For future times, show only scheduled
            data.push({
              id: `${day}-${med}-${scheduleIndex}-scheduled`,
              medication: med,
              day,
              time: scheduledTime,
              status: "scheduled",
              dayIndex,
              timeSlot,
              scheduledTime,
            })
          }
        })
      })
    })

    return data
  }

  const medicationData = generateMedicationData()

  // Filter data based on selected medication
  const filteredData = medicationData.filter((entry) => entry.medication === selectedMedication)

  const days = selectedPeriod === "W" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Today"]
  const timeSlots = [
    { slot: 0, label: "12 am" },
    { slot: 1, label: "4 am" },
    { slot: 2, label: "8 am" },
    { slot: 3, label: "12 pm" },
    { slot: 4, label: "4 pm" },
    { slot: 5, label: "8 pm" },
  ]

  // ONLY CHANGE: Make it smaller for template view
  const chartWidth = selectedPeriod === "W" ? 300 : 150
  const chartHeight = 100
  const dayWidth = chartWidth / days.length
  const timeHeight = chartHeight / timeSlots.length

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart */}
      <div className="flex-1 bg-gray-50 rounded-xl p-1">
        <div className="relative w-full h-full">
          <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth + 30} ${chartHeight + 30}`} className="w-full h-full" preserveAspectRatio="xMinYMin meet">
            {/* Y-axis labels (Time) */}
            {timeSlots.map((timeSlot, index) => (
              <text
                key={timeSlot.slot}
                x="15"
                y={20 + index * timeHeight + timeHeight / 2}
                textAnchor="end"
                className="text-[9px] fill-gray-500"
                dominantBaseline="middle"
              >
                {timeSlot.label}
              </text>
            ))}

            {/* X-axis labels (Days) */}
            {days.map((day, index) => (
              <text
                key={day}
                x={25 + index * dayWidth + dayWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-[9px] fill-gray-500"
              >
                {day}
              </text>
            ))}

            {/* Grid lines */}
            {timeSlots.map((_, index) => (
              <line
                key={`hline-${index}`}
                x1="20"
                y1={20 + index * timeHeight}
                x2={20 + chartWidth}
                y2={20 + index * timeHeight}
                stroke="var(--gray-200)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {days.map((_, index) => (
              <line
                key={`vline-${index}`}
                x1={25 + index * dayWidth}
                y1="15"
                x2={25 + index * dayWidth}
                y2={20 + chartHeight}
                stroke="var(--gray-200)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {/* Data points */}
            {filteredData.map((entry) => {
              // Calculate position based on actual time
              const [hour, minute] = entry.time.split(":").map(Number)
              const timeInMinutes = hour * 60 + minute

              // Map time to Y position within the appropriate time slot
              const slotStartTime = entry.timeSlot * 4 * 60 // Start time of slot in minutes
              const slotEndTime = (entry.timeSlot + 1) * 4 * 60 // End time of slot in minutes
              const relativePosition = (timeInMinutes - slotStartTime) / (slotEndTime - slotStartTime)

              const x =
                25 +
                entry.dayIndex * dayWidth +
                dayWidth / 2 +
                (entry.status === "taken" ? (Math.random() - 0.5) * 10 : 0)
              const y = 20 + entry.timeSlot * timeHeight + relativePosition * timeHeight

              return (
                <g key={entry.id}>
                  {/* Data point */}
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={entry.status === "taken" ? "var(--chart-blue)" : entry.status === "missed" ? "var(--chart-red)" : "none"}
                    stroke={entry.status === "taken" ? "var(--chart-blue)" : entry.status === "missed" ? "var(--chart-red)" : "var(--chart-blue)"}
                    strokeWidth="2"
                    className="hover:r-6 transition-all cursor-pointer"
                  />

                  {/* Time label */}
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-[8px] pointer-events-none"
                    fill={entry.status === "missed" ? "var(--chart-red)" : "var(--chart-blue)"}
                  >
                    {entry.time}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend - Compact */}
        <div className="flex items-center justify-center gap-3 mt-1 pt-1 border-t border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-transparent"></div>
            <span className="text-xs text-[var(--ds-text-secondary)]">Scheduled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--ds-interactive-primary)]"></div>
            <span className="text-xs text-[var(--ds-text-secondary)]">Taken</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--ds-status-error)] bg-transparent"></div>
            <span className="text-xs text-[var(--ds-text-secondary)]">Missed</span>
          </div>
        </div>
      </div>
    </div>
  )
}