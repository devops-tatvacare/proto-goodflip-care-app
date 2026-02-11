"use client"

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import type { BaseCardProps, CardColorScheme } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

const defaultColorScheme: CardColorScheme = {
  headerBg: "bg-[var(--ds-surface-primary)]",
  headerText: "text-[var(--text-primary)]",
  cardBg: "bg-[var(--ds-surface-primary)]",
  contentText: "text-[var(--text-secondary)]",
  primaryButton: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]",
  secondaryButton:
    "border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--ds-surface-primary)] hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)]",
  accent: "text-[var(--app-primary)]",
  border: "border-[var(--border-color)]",
}

export function BaseCard({ className, colorScheme = {}, header, children }: BaseCardProps) {
  const colors = { ...defaultColorScheme, ...colorScheme }

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300 border-0 rounded-xl overflow-hidden", colors.cardBg, colors.border, className)}>
      {header && (
        <CardHeader className={cn("px-4 pt-4 pb-3 border-b border-gray-100", colors.headerBg)}>
          <div className="flex items-center justify-between">
            <CardTitle className={cn("text-base font-semibold flex items-center gap-2.5", colors.headerText)}>
              {header.iconSrc ? (
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                  <img src={header.iconSrc || "/placeholder.svg"} alt="" className="w-3 h-3" />
                </div>
              ) : header.icon ? (
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                  <header.icon className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                </div>
              ) : null}
              <div>
                {header.title}
                {header.subtitle && (
                  <div className={cn("text-sm text-[var(--ds-text-secondary)] mt-1.5 font-medium", colors.contentText)}>{header.subtitle}</div>
                )}
              </div>
            </CardTitle>
            <div className="flex items-center gap-1">
              {header.actions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === "primary" ? "default" : action.variant || "ghost"}
                  size="icon"
                  onClick={action.onClick}
                  className="hover:bg-gray-100 rounded-full transition-colors h-8 w-8"
                  title={action.label}
                >
                  <action.icon className="w-4 h-4 text-gray-400" />
                </Button>
              ))}
              {header.showNavigation && header.onNavigate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={header.onNavigate}
                  className="hover:bg-gray-100 rounded-full transition-colors h-8 w-8"
                >
                  <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={cn("px-4 pt-0 pb-2", colors.cardBg)}>{children}</CardContent>
    </Card>
  )
}
