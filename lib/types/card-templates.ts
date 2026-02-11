import type { LucideIcon } from "@/lib/icons"
import type { ReactNode } from "react"

export interface CardColorScheme {
  headerBg?: string
  headerText?: string
  cardBg?: string
  contentText?: string
  primaryButton?: string
  secondaryButton?: string
  accent?: string
  border?: string
}

export interface CardHeaderConfig {
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconSrc?: string // External image source
  iconColor?: string
  showNavigation?: boolean
  onNavigate?: () => void
  actions?: CardAction[]
}

export interface CardAction {
  icon: LucideIcon
  label?: string
  onClick: () => void
  variant?: "primary" | "secondary" | "ghost"
}

export interface BaseCardProps {
  id?: string
  className?: string
  colorScheme?: CardColorScheme
  header?: CardHeaderConfig
  children?: ReactNode
}

export interface ContentCardProps extends BaseCardProps {
  content?: {
    text?: string
    description?: string
    imageSrc?: string
    imageAlt?: string
    imagePosition?: "top" | "left" | "right" | "background"
  }
}

export interface ActionCardProps extends BaseCardProps {
  content?: {
    text?: string
    description?: string
    imageSrc?: string
  }
  actions?: {
    primary?: {
      label: string
      onClick: () => void
      icon?: LucideIcon
    }
    secondary?: {
      label: string
      onClick: () => void
      icon?: LucideIcon
    }
  }
}

export interface InsightCardProps extends BaseCardProps {
  insight: {
    value: number | string
    unit?: string
    description?: string
    trend?: "up" | "down" | "stable"
    chartData?: number[]
    hasData?: boolean
  }
  controls?: {
    showGoal?: boolean
    showAddButton?: boolean
    goalValue?: number
    onSetGoal?: () => void
    onAdd?: () => void
  }
}

export interface CarouselCardProps extends BaseCardProps {
  items: CarouselItem[]
  itemsPerView?: number
  showNavigation?: boolean
  onViewAll?: () => void
}

export interface CarouselItem {
  id: string
  title: string
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
  price?: string
  originalPrice?: string
  discount?: string
  rating?: number
  tags?: string[]
  onClick?: () => void
  actions?: CardAction[]
}

export interface ChartCardProps extends BaseCardProps {
  chartType: "symptom" | "trend" | "bar" | "line"
  chartData: any
  chartConfig?: {
    height?: number
    showGrid?: boolean
    showLegend?: boolean
    interactive?: boolean
  }
  onDataPointClick?: (data: any) => void
}

export interface DetailCardProps extends BaseCardProps {
  sections: DetailSection[]
  expandable?: boolean
  defaultExpanded?: boolean
}

export interface DetailSection {
  id: string
  title: string
  content: ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface ListCardProps extends BaseCardProps {
  items: ListItem[]
  itemTemplate?: "simple" | "detailed" | "media" | "status"
  searchable?: boolean
  filterable?: boolean
  onItemClick?: (item: ListItem) => void
}

export interface ListItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  imageSrc?: string
  status?: string
  statusColor?: string
  metadata?: Record<string, any>
  actions?: CardAction[]
}

export interface StatusCardProps extends BaseCardProps {
  status: {
    label: string
    value: string | number
    color: string
    trend?: "up" | "down" | "stable"
    description?: string
  }
  indicators?: StatusIndicator[]
}

export interface StatusIndicator {
  label: string
  value: string
  color: string
  icon?: LucideIcon
}

export interface InteractiveCardProps extends BaseCardProps {
  formType?: "input" | "select" | "multiselect" | "upload"
  fields?: FormField[]
  onSubmit?: (data: any) => void
}

export interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
}
