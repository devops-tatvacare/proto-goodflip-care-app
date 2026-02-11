"use client"

import { useState } from "react"
import { BaseCard } from "./base-card"
import { Icon } from '@/components/ui/icon'
import type { DetailCardProps, DetailSection } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

function DetailSectionComponent({
  section,
  colorScheme,
}: {
  section: DetailSection
  colorScheme?: any
}) {
  const [isExpanded, setIsExpanded] = useState(!section.defaultCollapsed)
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    accent: "text-[var(--app-primary)]",
    ...colorScheme,
  }

  if (!section.collapsible) {
    return (
      <div className="space-y-3">
        <h4 className={cn("text-sm font-bold flex items-center gap-2", colors.contentText)}>{section.title}</h4>
        <div>{section.content}</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn("w-full text-left text-sm font-bold flex items-center justify-between gap-2", colors.contentText)}
      >
        {section.title}
        {isExpanded ? <Icon name="chevronUp" className="w-4 h-4" /> : <Icon name="chevronDown" className="w-4 h-4" />}
      </button>

      {isExpanded && <div className="space-y-2">{section.content}</div>}
    </div>
  )
}

export function DetailCard({
  sections,
  expandable = false,
  defaultExpanded = true,
  colorScheme,
  ...props
}: DetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <BaseCard
      colorScheme={colorScheme}
      header={{
        ...props.header,
        actions: [
          ...(props.header?.actions || []),
          ...(expandable
            ? [
                {
                  icon: isExpanded ? ChevronUp : ChevronDown,
                  onClick: () => setIsExpanded(!isExpanded),
                  label: isExpanded ? "Collapse" : "Expand",
                },
              ]
            : []),
        ],
      }}
      {...props}
    >
      {(!expandable || isExpanded) && (
        <div className="space-y-6">
          {sections.map((section) => (
            <DetailSectionComponent key={section.id} section={section} colorScheme={colorScheme} />
          ))}
        </div>
      )}
    </BaseCard>
  )
}
