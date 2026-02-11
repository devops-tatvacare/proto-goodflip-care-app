"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { HorizontalScroll } from "@/components/ui/horizontal-scroll"

interface UnifiedStoreCardProps {
  onNavigate: () => void
}

const STORE_CATEGORIES = [
  {
    id: "lab-tests",
    name: "Lab Tests",
    icon: (props: any) => <Icon name="science" {...props} />,
    color: "text-[var(--app-primary)]",
    bgColor: "bg-[var(--bg-secondary)]",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: (props: any) => <Icon name="medication" {...props} />,
    color: "text-[var(--app-primary)]",
    bgColor: "bg-[var(--bg-secondary)]",
  },
  {
    id: "care-plans",
    name: "Care Plans",
    icon: (props: any) => <Icon name="calendar" {...props} />,
    color: "text-[var(--app-primary)]",
    bgColor: "bg-[var(--bg-secondary)]",
  },
  {
    id: "care-products",
    name: "Care Products",
    icon: (props: any) => <Icon name="shoppingCart" {...props} />,
    color: "text-[var(--app-primary)]",
    bgColor: "bg-[var(--bg-secondary)]",
  },
  {
    id: "nutraceuticals",
    name: "Nutraceuticals",
    icon: (props: any) => <Icon name="leaf" {...props} />,
    color: "text-[var(--app-primary)]",
    bgColor: "bg-[var(--bg-secondary)]",
  },
]

export function UnifiedStoreCard({ onNavigate }: UnifiedStoreCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <Icon name="shoppingCart" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
            </div>
            Health Store
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full transition-colors h-8 w-8"
            onClick={onNavigate}
          >
            <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
      <CardContent className="px-4 pt-0 pb-3">
        <p className="text-sm text-[var(--ds-text-secondary)] mb-2">Everything you need for your health journey</p>
        <HorizontalScroll>
          {STORE_CATEGORIES.map((category) => {
            const IconComponent = category.icon
            return (
              <div key={category.id} className="flex-shrink-0 w-32 text-center">
                <div className={`${category.bgColor} p-3 rounded-xl mb-2 border border-gray-100`}>
                  <IconComponent className={`w-6 h-6 ${category.color} mx-auto mb-1.5`} />
                  <h3 className="font-semibold text-sm text-gray-800">{category.name}</h3>
                </div>
              </div>
            )
          })}
        </HorizontalScroll>
      </CardContent>
    </Card>
  )
}
