"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"

interface RemindersPriorityCardProps {
  onFreeDrugClick: () => void
  onAppointmentClick: () => void
  onLogWater: () => void
  onLogSleep: () => void
  onLogSteps: () => void
  onLogDiet: () => void
}

export function RemindersPriorityCard({
  onFreeDrugClick,
  onAppointmentClick,
  onLogWater,
  onLogSleep,
  onLogSteps,
  onLogDiet
}: RemindersPriorityCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <MaterialIcon icon="notifications_active" variant="round" size={12} color="white" />
            </div>
            Reminders
          </h3>
          <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">Actions pending your attention</p>
        </div>
      </div>

      <CardContent className="px-4 pt-3 pb-3 space-y-2.5">
        {/* High Priority - Compact */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-2.5 border border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--ds-surface-primary)] flex items-center justify-center shadow-sm">
                <MaterialIcon icon="local_offer" variant="filled" size={16} color="var(--metric-nutrition-fat)" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">Free Drug Available</h4>
                <p className="text-[10px] text-[var(--ds-text-secondary)]">Ready for claim</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onFreeDrugClick}
              className="h-7 px-3 text-[10px] font-medium rounded-md bg-amber-500 hover:bg-amber-600 text-[var(--ds-text-inverse)]"
            >
              Claim
            </Button>
          </div>
        </div>

        {/* Appointment - Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2.5 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--ds-surface-primary)] flex items-center justify-center shadow-sm">
                <MaterialIcon icon="event" variant="filled" size={16} color="var(--app-primary)" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">Appointment Tomorrow</h4>
                <p className="text-[10px] text-[var(--ds-text-secondary)]">Dr. Wilson 2:00 PM</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onAppointmentClick}
              className="h-7 px-3 text-[10px] font-medium rounded-md border border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)]"
            >
              View
            </Button>
          </div>
        </div>

        {/* Daily Logs - Compact Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider">Daily Logs</p>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={onLogWater}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50 transition-all duration-200"
          >
            <MaterialIcon icon="water_drop" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-gray-700 leading-tight">Water</span>
          </button>
          
          <button
            onClick={onLogSleep}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50 transition-all duration-200"
          >
            <MaterialIcon icon="bedtime" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-gray-700 leading-tight">Sleep</span>
          </button>
          
          <button
            onClick={onLogSteps}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50 transition-all duration-200"
          >
            <MaterialIcon icon="directions_walk" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-gray-700 leading-tight">Steps</span>
          </button>
          
          <button
            onClick={onLogDiet}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-blue-50 transition-all duration-200"
          >
            <MaterialIcon icon="restaurant_menu" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-gray-700 leading-tight">Diet</span>
          </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}