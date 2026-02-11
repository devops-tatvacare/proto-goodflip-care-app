"use client"
import { cn } from "@/lib/utils"
import { UniversalCard } from "./universal-card"
import { UniversalStatusBadge } from "./universal-status-badge"
import { useStatusConfig } from "@/lib/hooks/use-status-config"
import type { ListItem } from "@/lib/types/common"

interface UniversalListProps {
  items: ListItem[]
  onItemClick?: (item: ListItem) => void
  statusCategory?: keyof typeof import("@/lib/constants/app-config").APP_CONFIG.status
  className?: string
  emptyMessage?: string
  loading?: boolean
}

export function UniversalList({
  items,
  onItemClick,
  statusCategory,
  className,
  emptyMessage = "No items found",
  loading = false,
}: UniversalListProps) {
  const statusConfigs = items.map((item) =>
    statusCategory && item.status ? useStatusConfig(statusCategory, item.status) : null,
  )

  if (loading) {
    return (
      <div className={cn("space-y-[var(--space-3)]", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <UniversalCard key={index} className="animate-pulse">
            <div className="space-y-[var(--space-2)]">
              <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4" />
              <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2" />
            </div>
          </UniversalCard>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={cn("text-center py-[var(--space-8)]", className)}>
        <p className="app-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-[var(--space-3)]", className)}>
      {items.map((item, index) => {
        const statusConfig = statusConfigs[index]

        return (
          <UniversalCard
            key={item.id}
            interactive={Boolean(onItemClick)}
            onClick={() => onItemClick?.(item)}
            header={{
              title: item.title,
              subtitle: item.subtitle,
              actions: item.actions,
            }}
          >
            <div className="space-y-[var(--space-2)]">
              {item.description && <p className="app-text-secondary">{item.description}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[var(--space-2)]">
                  {statusConfig && <UniversalStatusBadge status={statusConfig} size="sm" />}
                </div>

                {item.metadata && (
                  <div className="flex gap-[var(--space-4)]">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <div key={key} className="text-right">
                        <p className="app-text-muted capitalize">{key}</p>
                        <p className="app-text-secondary font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </UniversalCard>
        )
      })}
    </div>
  )
}
