"use client"

import { BaseCard } from "./base-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HorizontalScroll } from "@/components/ui/horizontal-scroll"
import type { CarouselCardProps, CarouselItem } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

function CarouselItemComponent({
  item,
  colorScheme,
}: {
  item: CarouselItem
  colorScheme?: any
}) {
  const colors = {
    primaryButton: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]",
    contentText: "text-[var(--text-secondary)]",
    mutedText: "text-[var(--text-muted)]",
    successText: "text-[var(--status-success)]",
    ...colorScheme,
  }

  return (
    <div className="flex-shrink-0 w-44 text-center">
      {item.imageSrc && (
        <div className={cn("rounded-xl overflow-hidden mb-3 h-20", "bg-[var(--bg-secondary)]")}>
          <img
            src={item.imageSrc || "/placeholder.svg"}
            alt={item.imageAlt || item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2">
        <h3 className={cn("font-semibold text-sm", colors.contentText)}>{item.title}</h3>

        {item.subtitle && <p className={cn("text-xs", colors.contentText)}>{item.subtitle}</p>}

        {item.tags && (
          <div className="flex flex-wrap gap-1 justify-center">
            {item.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {(item.price || item.rating) && (
          <div className="flex items-center justify-center gap-2">
            {item.price && (
              <div className="flex items-center gap-1">
                <span className={cn("text-lg font-bold", colors.successText)}>₹{item.price}</span>
                {item.originalPrice && (
                  <span className={cn("text-sm line-through", colors.mutedText)}>₹{item.originalPrice}</span>
                )}
              </div>
            )}
            {item.rating && <span className={cn("text-xs", colors.mutedText)}>⭐ {item.rating}</span>}
          </div>
        )}

        {item.discount && (
          <Badge variant="destructive" className="text-xs font-bold">
            {item.discount}
          </Badge>
        )}

        {item.onClick && (
          <Button size="sm" onClick={item.onClick} className="w-full font-medium text-xs">
            {item.actions?.[0]?.icon && item.actions[0].icon({ className: "w-3 h-3 mr-1" })}
            {item.actions?.[0]?.label || "Select"}
          </Button>
        )}
      </div>
    </div>
  )
}

export function CarouselCard({ items, itemsPerView = 4, onViewAll, colorScheme, ...props }: CarouselCardProps) {
  return (
    <BaseCard colorScheme={colorScheme} {...props}>
      <div className="space-y-4">
        <HorizontalScroll>
          {items.slice(0, itemsPerView).map((item) => (
            <CarouselItemComponent key={item.id} item={item} colorScheme={colorScheme} />
          ))}
        </HorizontalScroll>

        {onViewAll && (
          <div className="text-center">
            <Button variant="outline" onClick={onViewAll} className="text-sm">
              View All
            </Button>
          </div>
        )}
      </div>
    </BaseCard>
  )
}
