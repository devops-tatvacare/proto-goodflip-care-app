"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { MaterialIcon } from "@/components/ui/material-icon"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ExpandableRemindersCardProps {
  onFreeDrugClick: () => void
  onAppointmentClick: () => void
  onNavigateToAssistant: () => void
  onNavigate?: (screen: string, data?: any) => void
}

export function ExpandableRemindersCard({
  onFreeDrugClick,
  onAppointmentClick,
  onNavigateToAssistant,
  onNavigate,
}: ExpandableRemindersCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLogAction = (type: string) => {
    if (onNavigate) {
      onNavigateToAssistant()
    }
  }

  return (
    <Card className="bg-[var(--ds-surface-primary)] border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <MaterialIcon icon="notifications_active" variant="round" size={12} color="white" />
            </div>
            Reminders
          </h3>
          <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">See what's pending</p>
        </div>
      </div>
      <CardContent className="px-4 pt-0 pb-3">

        {/* High Priority Reminders - Always Visible */}
        <div className="space-y-1 mb-2">
          <div
            className="flex items-center justify-between py-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg cursor-pointer transition-colors"
            onClick={onFreeDrugClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
                   style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                <MaterialIcon icon="local_offer" variant="filled" size={18} color="var(--app-primary)" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">Free Drug Available</p>
                <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">Ready for claim</p>
              </div>
            </div>
            <Button
              size="sm"
              className="h-8 px-4 text-xs font-medium rounded-lg bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] transition-all duration-200"
            >
              Claim
            </Button>
          </div>

          <div
            className="flex items-center justify-between py-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg cursor-pointer transition-colors"
            onClick={onAppointmentClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
                   style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                <MaterialIcon icon="event" variant="filled" size={18} color="var(--app-primary)" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">Appointment Tomorrow</p>
                <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">Dr. Sarah Wilson at 2:00 PM</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
            >
              View
            </Button>
          </div>
        </div>

        {/* Expandable Health Logs */}
        {isExpanded && (
          <div className="space-y-1 mt-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between py-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
                     style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                  <MaterialIcon icon="water_drop" variant="outlined" size={18} color="var(--app-primary)" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">Water Intake</p>
                </div>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
                onClick={() => handleLogAction("water")}
              >
                Log Now
              </Button>
            </div>

            <div className="flex items-center justify-between py-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
                     style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                  <MaterialIcon icon="bedtime" variant="outlined" size={18} color="var(--app-primary)" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">Sleep Log</p>
                </div>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
                onClick={() => handleLogAction("sleep")}
              >
                Log Now
              </Button>
            </div>

            <div className="flex items-center justify-between py-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
                     style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                  <MaterialIcon icon="directions_walk" variant="outlined" size={18} color="var(--app-primary)" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">Steps</p>
                </div>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
                onClick={() => handleLogAction("steps")}
              >
                Log Now
              </Button>
            </div>

            <div className="flex items-center justify-between py-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
                     style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                  <MaterialIcon icon="restaurant_menu" variant="outlined" size={18} color="var(--app-primary)" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">Diet Log</p>
                </div>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
                onClick={() => handleLogAction("diet")}
              >
                Log Now
              </Button>
            </div>
          </div>
        )}
        {/* Bottom Chevron */}
        <div className="pt-1 mt-1">
          <div className="flex justify-center">
            <div className="relative">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-2 rounded-full transition-colors ${
                  !isExpanded ? "bg-gray-100 hover:bg-gray-200 border border-[var(--ds-border-default)]" : "hover:bg-gray-100"
                }`}
              >
                <Icon name="chevronDown" className={`w-4 h-4 text-[var(--ds-text-secondary)] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
                {/* Integrated badge dot */}
                {!isExpanded && (
                  <div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white"
                    style={{ backgroundColor: "var(--app-primary)" }}
                  ></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
