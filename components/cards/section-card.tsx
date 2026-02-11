"use client"

import type React from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'

interface SectionCardProps {
  title: string
  icon?: LucideIcon
  iconColor?: string
  description?: string
  onNavigate?: () => void
  children: React.ReactNode
}

export function SectionCard({
  title,
  icon: Icon,
  iconColor = "text-blue-600",
  description,
  onNavigate,
  children,
}: SectionCardProps) {
  return (
    <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--card-header-text)" }}>
            {Icon && <Icon className="w-4 h-4" />}
            {title}
          </CardTitle>
          {onNavigate && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 rounded-full transition-colors h-8 w-8"
              onClick={onNavigate}
            >
              <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
            </Button>
          )}
        </div>
        {description && <p className="text-sm text-[var(--ds-text-secondary)] mt-1">{description}</p>}
      </div>
      <CardContent className="px-4 pt-0 pb-3">{children}</CardContent>
    </Card>
  )
}
