"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"

interface ServicesPriorityCardProps {
  onBookAppointment: () => void
  onBookLabTest: () => void
  onViewPlans: () => void
  onRefillPrescription: () => void
  onVisitStore: () => void
}

export function ServicesPriorityCard({
  onBookAppointment,
  onBookLabTest,
  onViewPlans,
  onRefillPrescription,
  onVisitStore
}: ServicesPriorityCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--ds-border-subtle)]">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <MaterialIcon icon="medical_services" variant="round" size={12} color="var(--ds-text-inverse)" />
            </div>
            Services For You
          </h3>
          <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">Quick access to care services</p>
        </div>
      </div>

      <CardContent className="px-4 pt-3 pb-3 space-y-2.5">
        {/* Featured Service - Compact */}
        <div className="bg-gradient-to-r from-[var(--ds-blue-50)] to-[var(--ds-blue-50)] rounded-lg p-2.5 border border-[var(--ds-blue-100)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--ds-surface-primary)] flex items-center justify-center shadow-sm">
                <MaterialIcon icon="calendar_month" variant="filled" size={16} color="var(--app-primary)" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--ds-text-primary)] text-sm leading-tight">Book Appointment</h4>
                <p className="text-[10px] text-[var(--ds-text-secondary)]">With Specialists</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onBookAppointment}
              className="h-7 px-3 text-[10px] font-medium rounded-md bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]"
            >
              Book
            </Button>
          </div>
        </div>

        {/* More Services - Compact Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-semibold text-[var(--ds-text-muted)] uppercase tracking-wider">More Services</p>
            <div className="flex-1 h-px bg-[var(--ds-border-default)]"></div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={onBookLabTest}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-[var(--ds-blue-50)] transition-all duration-200"
          >
            <MaterialIcon icon="biotech" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-[var(--ds-text-primary)] leading-tight">Lab Tests</span>
          </button>
          
          <button
            onClick={onViewPlans}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-[var(--ds-blue-50)] transition-all duration-200"
          >
            <MaterialIcon icon="auto_awesome" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-[var(--ds-text-primary)] leading-tight">Plans</span>
          </button>
          
          <button
            onClick={onRefillPrescription}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-[var(--ds-blue-50)] transition-all duration-200"
          >
            <MaterialIcon icon="medication" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-[var(--ds-text-primary)] leading-tight">Meds</span>
          </button>
          
          <button
            onClick={onVisitStore}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--app-primary)] hover:bg-[var(--ds-blue-50)] transition-all duration-200"
          >
            <MaterialIcon icon="local_pharmacy" variant="outlined" size={16} color="var(--app-primary)" />
            <span className="text-[10px] font-medium text-[var(--ds-text-primary)] leading-tight">Store</span>
          </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}