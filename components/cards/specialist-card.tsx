"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils/formatters"

interface Specialist {
  name: string
  role: string
  avatar: string
  price?: number
  experience?: string
}

interface SpecialistCardProps {
  specialist: Specialist
  showPricing?: boolean
  compact?: boolean
  onBook?: (specialist: Specialist) => void
}

export function SpecialistCard({ specialist, showPricing = false, compact = false, onBook }: SpecialistCardProps) {
  if (compact) {
    return (
      <div className="flex-shrink-0 w-48 text-center">
        <div className="bg-gray-50 rounded-xl p-4 h-52 flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-white shadow-sm">
              <AvatarImage src="/images/doctor-avatar.png" />
              <AvatarFallback className="bg-[var(--ds-interactive-primary)] text-[var(--ds-text-inverse)] font-medium">
                {specialist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2 min-h-[2rem] flex items-center text-center">
              {specialist.name}
            </h3>
            <p className="text-xs text-[var(--ds-text-secondary)] mb-2 line-clamp-1">{specialist.role}</p>
            {showPricing && specialist.price && (
              <span className="text-lg font-bold text-green-600 mb-2">{formatCurrency(specialist.price)}</span>
            )}
          </div>
          <Button className="w-full font-medium mt-2" onClick={() => onBook?.(specialist)}>
            Book
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
            <AvatarImage src="/images/doctor-avatar.png" />
            <AvatarFallback className="bg-[var(--ds-interactive-primary)] text-[var(--ds-text-inverse)] font-medium">{specialist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">{specialist.name}</h3>
            <p className="text-sm text-[var(--ds-text-secondary)] mb-1">{specialist.role}</p>
            {specialist.experience && <p className="text-xs text-[var(--ds-text-secondary)]">{specialist.experience}</p>}
            <div className="flex items-center justify-between mt-3">
              {specialist.price && (
                <span className="text-lg font-bold text-green-600">{formatCurrency(specialist.price)}</span>
              )}
              <Button className="font-medium" onClick={() => onBook?.(specialist)}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
