"use client"

import React, { useState } from "react"
import { BaseCard } from "./base-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from '@/components/ui/icon'
import type { ListCardProps, ListItem } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

function ListItemComponent({
  item,
  template = "simple",
  onClick,
  colorScheme,
}: {
  item: ListItem
  template?: "simple" | "detailed" | "media" | "status"
  onClick?: (item: ListItem) => void
  colorScheme?: any
}) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    mutedText: "text-[var(--text-muted)]",
    borderColor: "border-[var(--border-color)]",
    bgPrimary: "bg-[var(--bg-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    ...colorScheme,
  }

  const handleClick = () => {
    if (onClick) onClick(item)
  }

  const baseClasses = `bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-all cursor-pointer`

  switch (template) {
    case "media":
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="p-3">
            <div className="flex items-start gap-3">
              {item.imageSrc && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageSrc || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-semibold text-sm truncate", colors.contentText)}>{item.title}</h3>
                {item.subtitle && <p className={cn("text-xs mt-1", colors.contentText)}>{item.subtitle}</p>}
                {item.description && (
                  <p className={cn("text-xs mt-2 line-clamp-2", colors.contentText)}>{item.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )

    case "status":
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={cn("font-semibold text-sm", colors.contentText)}>{item.title}</h3>
                {item.subtitle && <p className={cn("text-xs mt-1", colors.contentText)}>{item.subtitle}</p>}
              </div>
              {item.status && (
                <Badge className={cn("text-xs", item.statusColor || "bg-[var(--bg-secondary)] text-gray-700")}>
                  {item.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )

    case "detailed":
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className={cn("font-semibold text-base", colors.contentText)}>{item.title}</h3>
                {item.actions && item.actions.length > 0 && (
                  <div className="flex gap-2">
                    {item.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={action.variant === 'primary' ? 'default' : action.variant || 'outline'}
                        onClick={(e) => {
                          e.stopPropagation()
                          action.onClick()
                        }}
                      >
                        {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {item.subtitle && <p className={cn("text-sm", colors.contentText)}>{item.subtitle}</p>}

              {item.description && <p className={cn("text-sm", colors.contentText)}>{item.description}</p>}

              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )

    default: // simple
      return (
        <div className={baseClasses} onClick={handleClick}>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={cn("font-medium text-sm", colors.contentText)}>{item.title}</h3>
                {item.subtitle && <p className={cn("text-xs mt-1", colors.contentText)}>{item.subtitle}</p>}
              </div>
              {(() => {
                const firstAction = item.actions?.[0]
                return firstAction ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      firstAction.onClick()
                    }}
                  >
                    {firstAction.icon && React.createElement(firstAction.icon, { className: "w-4 h-4" })}
                  </Button>
                ) : null
              })()}
            </div>
          </div>
        </div>
      )
  }
}

export function ListCard({
  items,
  itemTemplate = "simple",
  searchable = false,
  filterable = false,
  onItemClick,
  colorScheme,
  ...props
}: ListCardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchable ||
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilters =
      !filterable ||
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => item.status === filter || Object.values(item.metadata || {}).includes(filter))

    return matchesSearch && matchesFilters
  })

  return (
    <BaseCard colorScheme={colorScheme} {...props}>
      <div className="space-y-4">
        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="space-y-2">
          {filteredItems.map((item) => (
            <ListItemComponent
              key={item.id}
              item={item}
              template={itemTemplate}
              onClick={onItemClick}
              colorScheme={colorScheme}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--text-muted)]">No items found</p>
          </div>
        )}
      </div>
    </BaseCard>
  )
}
