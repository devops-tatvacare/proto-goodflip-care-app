"use client"

import { BaseCard } from "./base-card"
import type { ContentCardProps } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

export function ContentCard({ content, colorScheme, ...props }: ContentCardProps) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    cardBg: "bg-[var(--bg-primary)]",
    ...colorScheme,
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      {content && (
        <div className="space-y-4">
          {content.imageSrc && content.imagePosition === "top" && (
            <div className="w-full h-48 rounded-xl overflow-hidden">
              <img
                src={content.imageSrc || "/placeholder.svg"}
                alt={content.imageAlt || ""}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className={cn(
              "flex gap-4",
              content.imagePosition === "left" && "flex-row",
              content.imagePosition === "right" && "flex-row-reverse",
            )}
          >
            {content.imageSrc && (content.imagePosition === "left" || content.imagePosition === "right") && (
              <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={content.imageSrc || "/placeholder.svg"}
                  alt={content.imageAlt || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              {content.text && <h3 className={cn("font-semibold text-lg mb-2", colors.contentText)}>{content.text}</h3>}
              {content.description && (
                <p className={cn("text-sm leading-relaxed", colors.contentText)}>{content.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  )
}
