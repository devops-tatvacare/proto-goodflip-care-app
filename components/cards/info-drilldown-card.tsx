"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { cn } from "@/lib/utils"

interface InfoItem {
  id: string
  label: string
  value: string
  icon?: LucideIcon
  iconColor?: string
  iconBg?: string
  status?: "success" | "warning" | "info" | "error"
  metadata?: string
  onClick?: () => void
}

interface InfoDrilldownCardProps {
  title: string
  titleIcon: LucideIcon
  items: InfoItem[]
  onNavigate?: () => void
  actionButton?: {
    label: string
    onClick: () => void
    variant?: "primary" | "secondary"
  }
  className?: string
}

const statusColors = {
  success: {
    iconBg: "bg-orange-50",
    iconColor: "text-[var(--orange-primary)]",
    itemBg: "bg-[var(--ds-surface-primary)]",
    border: "border-[var(--ds-border-default)]",
  },
  warning: {
    iconBg: "bg-orange-50",
    iconColor: "text-[var(--orange-primary)]",
    itemBg: "bg-[var(--ds-surface-primary)]",
    border: "border-[var(--ds-border-default)]",
  },
  info: {
    iconBg: "bg-orange-50",
    iconColor: "text-[var(--orange-primary)]",
    itemBg: "bg-[var(--ds-surface-primary)]",
    border: "border-[var(--ds-border-default)]",
  },
  error: {
    iconBg: "bg-orange-50",
    iconColor: "text-[var(--orange-primary)]",
    itemBg: "bg-[var(--ds-surface-primary)]",
    border: "border-[var(--ds-border-default)]",
  },
}

export function InfoDrilldownCard({
  title,
  titleIcon: TitleIcon,
  items,
  onNavigate,
  actionButton,
  className,
}: InfoDrilldownCardProps) {
  return (
    <Card className={cn("shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden", className)}>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-black">
            {title === "Treatment Journey" ? (
              <Icon name="medicalServices" className="w-4 h-4 text-gray-700" />
            ) : (
              <TitleIcon className="w-4 h-4 text-gray-700" />
            )}
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
      </div>
      <CardContent className="px-4 pt-0 pb-3">
        <div className="space-y-1">
          {items
            .filter((item) => item.label !== "Glucose")
            .map((item, index) => {
              const ItemIcon = item.icon
              const colors = item.status
                ? statusColors[item.status]
                : {
                    iconBg: "bg-orange-50",
                    iconColor: "text-[var(--orange-primary)]",
                    itemBg: "bg-[var(--ds-surface-primary)]",
                    border: "border-[var(--ds-border-default)]",
                  }

              const itemContent = (
                <div
                  className={cn(
                    "flex items-center justify-between py-1.5 px-2.5 rounded-lg border w-full",
                    item.id === "free-drug" ? "bg-orange-50 border-orange-200" : colors.itemBg,
                    item.id !== "free-drug" && colors.border,
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 max-w-[70%]">
                    {ItemIcon && (
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-md flex-shrink-0",
                          "w-5 h-5",
                          colors.iconBg,
                        )}
                      >
                        <ItemIcon className={cn("w-3 h-3", colors.iconColor)} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium text-xs leading-tight truncate",
                          item.id === "free-drug" ? "text-gray-800" : "text-gray-900",
                        )}
                        title={item.label}
                      >
                        {item.label}
                      </p>
                      {item.metadata && (
                        <p
                          className={cn(
                            "text-xs leading-tight truncate",
                            item.id === "free-drug" ? "text-[var(--ds-text-secondary)]" : "text-[var(--ds-text-secondary)]",
                          )}
                          title={item.metadata}
                        >
                          {item.metadata}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end flex-shrink-0 min-w-0 max-w-[30%] ml-2">
                    <div
                      className={cn(
                        "px-2 py-1 rounded-md flex items-center justify-center min-w-fit",
                        item.id === "free-drug" ? "bg-orange-100" : "bg-gray-100",
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm font-semibold leading-tight text-center whitespace-nowrap",
                          item.id === "free-drug" ? "text-orange-800" : "text-gray-900",
                        )}
                        title={item.value}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              )

              // Handle individual item onClick first (especially for free-drug)
              if (item.onClick) {
                return (
                  <button key={item.id} onClick={item.onClick} className="w-full text-left">
                    {itemContent}
                  </button>
                )
              }

              // If no individual onClick but onNavigate exists, make item clickable
              // BUT NOT for Treatment Journey card AND NOT for free-drug items
              if (onNavigate && title !== "Treatment Journey" && !item.onClick) {
                return (
                  <button key={item.id} onClick={onNavigate} className="w-full text-left">
                    {itemContent}
                  </button>
                )
              }

              return <div key={item.id}>{itemContent}</div>
            })}
        </div>

        {actionButton && (
          <div className="pt-2">
            <Button
              size="sm"
              className={cn(
                "w-full font-medium text-xs h-7",
                actionButton.variant === "secondary" ? "variant-outline" : "",
              )}
              onClick={actionButton.onClick}
            >
              {actionButton.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
