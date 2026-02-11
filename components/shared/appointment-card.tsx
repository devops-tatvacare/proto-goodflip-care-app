"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AppointmentCardProps {
  title: string
  date: string
  time: string
  location: string
  description?: string
  onCancel?: () => void
  onReschedule?: () => void
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  title,
  date,
  time,
  location,
  description,
  onCancel,
  onReschedule,
}) => {
  return (
    <Card className="max-w-2xl mx-auto mt-6 mb-6 bg-[var(--bg-primary)] border-[var(--border-color)]">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h2>
        <p className="text-base text-[var(--text-secondary)] mb-1">
          {date} - {time}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-2">Location: {location}</p>
        {description && <p className="text-sm text-[var(--text-secondary)] mb-4">Description: {description}</p>}
        <div className="flex gap-4 mt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onReschedule && <Button onClick={onReschedule}>Reschedule</Button>}
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentCard
