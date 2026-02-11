"use client"

import { BaseCard } from "./base-card"
import { Button } from "@/components/ui/button"
import type { ActionCardProps } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

export function ActionCard({ content, actions, colorScheme, ...props }: ActionCardProps) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    primaryButton: "",
    secondaryButton: "",
    ...colorScheme,
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <div className="space-y-4">
        {content && (
          <div className="space-y-3">
            {content.imageSrc && (
              <div className="w-full h-32 rounded-xl overflow-hidden">
                <img src={content.imageSrc || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            {content.text && <h3 className={cn("font-semibold text-base", colors.contentText)}>{content.text}</h3>}
            {content.description && <p className={cn("text-sm", colors.contentText)}>{content.description}</p>}
          </div>
        )}

        {(actions?.primary || actions?.secondary) && (
          <div className="flex gap-3">
            {actions.secondary && (
              <Button variant="outline" onClick={actions.secondary.onClick} className="flex-1">
                {actions.secondary.icon && <actions.secondary.icon className="w-4 h-4 mr-2" />}
                {actions.secondary.label}
              </Button>
            )}
            {actions.primary && (
              <Button onClick={actions.primary.onClick} className="flex-1">
                {actions.primary.icon && <actions.primary.icon className="w-4 h-4 mr-2" />}
                {actions.primary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  )
}
