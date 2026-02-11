"use client"

import React from "react"
import { BaseCard } from "@/components/cards/base-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CardVariant } from "@/lib/types/common"
import type { 
  ActionCardProps,
  ContentCardProps,
  InsightCardProps,
  CarouselCardProps,
  ChartCardProps,
  DetailCardProps,
  ListCardProps,
  StatusCardProps,
  InteractiveCardProps
} from "@/lib/types/card-templates"

// Union type for all card variants
type UniversalCardVariant = 
  | "action"
  | "content"
  | "insight"
  | "carousel"
  | "chart"
  | "detail"
  | "list"
  | "status"
  | "interactive"
  | "default"

// Base props that all cards share
interface BaseUniversalCardProps {
  cardType?: UniversalCardVariant
  variant?: CardVariant["type"]
  padding?: CardVariant["padding"]
  className?: string
}

// Combined props type using discriminated unions
type UniversalCardProps = BaseUniversalCardProps & (
  | ({ cardType: "action" } & ActionCardProps)
  | ({ cardType: "content" } & ContentCardProps)
  | ({ cardType: "insight" } & InsightCardProps)
  | ({ cardType: "carousel" } & CarouselCardProps)
  | ({ cardType: "chart" } & ChartCardProps)
  | ({ cardType: "detail" } & DetailCardProps)
  | ({ cardType: "list" } & ListCardProps)
  | ({ cardType: "status" } & StatusCardProps)
  | ({ cardType: "interactive" } & InteractiveCardProps)
  | ({ cardType?: "default"; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>)
)

export function UniversalCard(props: UniversalCardProps) {
  const {
    cardType = "default",
    variant = "default",
    padding = "md",
    className,
    ...restProps
  } = props

  // For default cards, use the simple rendering
  if (cardType === "default") {
    const { children, ...divProps } = restProps as { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
    
    const baseClasses = "app-card"
    
    const variantClasses = {
      default: "",
      elevated: "shadow-[var(--shadow-md)]",
      outlined: "border border-[var(--border-light)]",
      filled: "bg-[var(--bg-tertiary)]",
    }
    
    const paddingClasses = {
      sm: "p-[var(--space-2)]",
      md: "p-[var(--space-3)]",
      lg: "p-[var(--space-4)]",
    }
    
    return (
      <div className={cn(baseClasses, variantClasses[variant], paddingClasses[padding], className)} {...divProps}>
        {children}
      </div>
    )
  }

  // For specialized cards, delegate to the appropriate renderer
  switch (cardType) {
    case "action":
      return <ActionCardRenderer {...(restProps as ActionCardProps)} className={className} />
    case "content":
      return <ContentCardRenderer {...(restProps as ContentCardProps)} className={className} />
    case "insight":
      return <InsightCardRenderer {...(restProps as InsightCardProps)} className={className} />
    case "carousel":
      return <CarouselCardRenderer {...(restProps as CarouselCardProps)} className={className} />
    case "chart":
      return <ChartCardRenderer {...(restProps as ChartCardProps)} className={className} />
    case "detail":
      return <DetailCardRenderer {...(restProps as DetailCardProps)} className={className} />
    case "list":
      return <ListCardRenderer {...(restProps as ListCardProps)} className={className} />
    case "status":
      return <StatusCardRenderer {...(restProps as StatusCardProps)} className={className} />
    case "interactive":
      return <InteractiveCardRenderer {...(restProps as InteractiveCardProps)} className={className} />
    default:
      return null
  }
}

// Card-specific renderers that maintain exact functionality
function ActionCardRenderer({ content, actions, colorScheme, ...props }: ActionCardProps) {
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

function ContentCardRenderer({ content, colorScheme, ...props }: ContentCardProps) {
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

// Placeholder renderers for other card types - to be implemented as needed
function InsightCardRenderer(props: InsightCardProps) {
  return <BaseCard {...props}><div>Insight Card - Implementation needed</div></BaseCard>
}

function CarouselCardRenderer(props: CarouselCardProps) {
  return <BaseCard {...props}><div>Carousel Card - Implementation needed</div></BaseCard>
}

function ChartCardRenderer({
  chartType,
  chartData,
  chartConfig = {},
  onDataPointClick,
  colorScheme,
  ...props
}: ChartCardProps) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    accent: "text-[var(--app-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    ...colorScheme,
  }

  const defaultConfig = {
    height: 240,
    showGrid: true,
    showLegend: false,
    interactive: true,
    ...chartConfig,
  }

  const renderChart = () => {
    switch (chartType) {
      case "symptom":
        return (
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="relative" style={{ height: `${defaultConfig.height}px` }}>
              <div className="flex items-center justify-center h-full text-[var(--ds-text-secondary)]">
                Chart Component ({chartType})
              </div>
            </div>
          </div>
        )

      case "trend":
      case "line":
        return (
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="relative" style={{ height: `${defaultConfig.height}px` }}>
              <div className="flex items-center justify-center h-full text-[var(--ds-text-secondary)]">
                Chart Component ({chartType})
              </div>
            </div>
          </div>
        )

      case "bar":
        return (
          <div className="bg-green-50 rounded-xl p-4">
            <div className="relative" style={{ height: `${defaultConfig.height}px` }}>
              <div className="flex items-center justify-center h-full text-[var(--ds-text-secondary)]">
                Chart Component ({chartType})
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="relative" style={{ height: `${defaultConfig.height}px` }}>
              <div className="flex items-center justify-center h-full text-[var(--ds-text-secondary)]">
                Unsupported Chart Type: {chartType}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <div className="space-y-4">
        {renderChart()}
        {defaultConfig.showLegend && (
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[var(--ds-interactive-primary)] rounded"></div>
              <span>Data Series</span>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  )
}

function DetailCardRenderer(props: DetailCardProps) {
  return <BaseCard {...props}><div>Detail Card - Implementation needed</div></BaseCard>
}

function ListCardRenderer({
  items,
  itemTemplate = "simple",
  searchable = false,
  filterable = false,
  onItemClick,
  colorScheme,
  ...props
}: ListCardProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])

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

  const renderListItem = (item: any) => {
    const colors = {
      contentText: "text-[var(--text-secondary)]",
      mutedText: "text-[var(--text-muted)]",
      borderColor: "border-[var(--border-color)]",
      bgPrimary: "bg-[var(--bg-primary)]",
      bgSecondary: "bg-[var(--bg-secondary)]",
      ...colorScheme,
    }

    const handleClick = () => {
      if (onItemClick) onItemClick(item)
    }

    const baseClasses = `bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-all cursor-pointer`

    switch (itemTemplate) {
      case "media":
        return (
          <div key={item.id} className={baseClasses} onClick={handleClick}>
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
          <div key={item.id} className={baseClasses} onClick={handleClick}>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={cn("font-semibold text-sm", colors.contentText)}>{item.title}</h3>
                  {item.subtitle && <p className={cn("text-xs mt-1", colors.contentText)}>{item.subtitle}</p>}
                </div>
                {item.status && (
                  <div className={cn("inline-block px-2 py-1 text-xs rounded", item.statusColor || "bg-[var(--bg-secondary)] text-gray-700")}>
                    {item.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "detailed":
        return (
          <div key={item.id} className={baseClasses} onClick={handleClick}>
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
                          variant={action.variant || "outline"}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick()
                          }}
                        >
                          {action.icon && React.createElement(action.icon, { className: "w-3 h-3 mr-1" })}
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
                      <div key={key} className="inline-block px-2 py-1 bg-[var(--bg-secondary)] text-xs rounded">
                        {key}: {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default: // simple
        return (
          <div key={item.id} className={baseClasses} onClick={handleClick}>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={cn("font-medium text-sm", colors.contentText)}>{item.title}</h3>
                  {item.subtitle && <p className={cn("text-xs mt-1", colors.contentText)}>{item.subtitle}</p>}
                </div>
                {item.actions && item.actions.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      item.actions[0].onClick()
                    }}
                  >
                    {item.actions[0].icon && React.createElement(item.actions[0].icon, { className: "w-4 h-4" })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <BaseCard colorScheme={colorScheme} {...props}>
      <div className="space-y-4">
        {searchable && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4">
              🔍
            </div>
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
          {filteredItems.map(renderListItem)}
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

function StatusCardRenderer({ status, indicators = [], colorScheme, ...props }: StatusCardProps) {
  const colors = {
    contentText: "text-[var(--text-secondary)]",
    accent: "text-[var(--app-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    ...colorScheme,
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <div className="space-y-4">
        {/* Main Status */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={cn("text-3xl font-bold", status.color)}>{status.value}</span>
            {status.trend && (
              <div className={cn("text-sm", 
                status.trend === "up" && "text-[var(--ds-status-success)]", 
                status.trend === "down" && "text-[var(--ds-status-error)]",
                status.trend === "stable" && "text-[var(--ds-text-secondary)]"
              )}>
                {status.trend === "up" && "↗"}
                {status.trend === "down" && "↘"}
                {status.trend === "stable" && "→"}
              </div>
            )}
          </div>
          <div className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium", status.color)}>{status.label}</div>
          {status.description && <p className={cn("text-sm mt-2", colors.contentText)}>{status.description}</p>}
        </div>

        {/* Status Indicators */}
        {indicators.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {indicators.map((indicator, index) => (
              <div key={index} className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {indicator.icon && React.createElement(indicator.icon, { className: cn("w-4 h-4", indicator.color) })}
                  <span className={cn("text-sm font-bold", indicator.color)}>{indicator.value}</span>
                </div>
                <p className={cn("text-xs", colors.contentText)}>{indicator.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseCard>
  )
}

function InteractiveCardRenderer({
  formType = "input",
  fields = [],
  onSubmit,
  colorScheme,
  ...props
}: InteractiveCardProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const colors = {
    primaryButton: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]",
    contentText: "text-[var(--text-secondary)]",
    errorText: "text-[var(--status-error)]",
    borderColor: "border-[var(--border-color)]",
    ...colorScheme,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const updateField = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className={cn("text-sm font-medium", colors.contentText)}>
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-1">*</span>}
            </label>
            <input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
            />
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className={cn("text-sm font-medium", colors.contentText)}>
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-1">*</span>}
            </label>
            <select
              id={field.id}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
            >
              <option value="">{field.placeholder || "Select an option"}</option>
              {field.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className={cn("text-sm font-medium", colors.contentText)}>
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-1">*</span>}
            </label>
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] min-h-[80px]"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(renderField)}

        {onSubmit && (
          <Button type="submit" className="w-full font-medium">
            Submit
          </Button>
        )}
      </form>
    </BaseCard>
  )
}