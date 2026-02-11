"use client"

import * as React from "react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"
import { MaterialIcon } from "@/components/ui/material-icon"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/primitives"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-[var(--ds-surface-primary)] group/calendar p-[var(--ds-space-sm)] sm:p-[var(--ds-space-md)] [--cell-size:2rem] sm:[--cell-size:2.5rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-default)] text-sm sm:text-base",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-[var(--ds-text-muted)] flex-1 select-none rounded-[var(--ds-radius-sm)] text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[var(--ds-text-muted)] select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-[var(--ds-surface-tertiary)] rounded-l-[var(--ds-radius-md)]",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-[var(--ds-surface-tertiary)] rounded-r-[var(--ds-radius-md)]", defaultClassNames.range_end),
        today: cn(
          "bg-[var(--ds-surface-tertiary)] text-[var(--ds-text-primary)] rounded-[var(--ds-radius-md)] data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[var(--ds-text-muted)] aria-selected:text-[var(--ds-text-muted)]",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-[var(--ds-text-muted)] opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <MaterialIcon 
                icon="chevron_left" 
                className={cn("size-4 text-[var(--ds-text-primary)]", className)} 
                size="small"
                {...props} 
              />
            )
          }

          if (orientation === "right") {
            return (
              <MaterialIcon 
                icon="chevron_right" 
                className={cn("size-4 text-[var(--ds-text-primary)]", className)} 
                size="small"
                {...props}
              />
            )
          }

          return (
            <MaterialIcon 
              icon="expand_more" 
              className={cn("size-4 text-[var(--ds-text-primary)]", className)} 
              size="small"
              {...props} 
            />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-[var(--ds-interactive-primary)] data-[selected-single=true]:text-[var(--ds-text-inverse)] data-[range-middle=true]:bg-[var(--ds-surface-tertiary)] data-[range-middle=true]:text-[var(--ds-text-primary)] data-[range-start=true]:bg-[var(--ds-interactive-primary)] data-[range-start=true]:text-[var(--ds-text-inverse)] data-[range-end=true]:bg-[var(--ds-interactive-primary)] data-[range-end=true]:text-[var(--ds-text-inverse)] group-data-[focused=true]/day:border-[var(--ds-focus-ring)] group-data-[focused=true]/day:ring-[var(--ds-focus-ring)]/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-[var(--ds-radius-md)] data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-[var(--ds-radius-md)] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70 hover:bg-[var(--ds-surface-secondary)] transition-colors duration-fast",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

/**
 * Healthcare-specific calendar optimized for medical appointments, medication schedules,
 * and health tracking. Includes visual indicators for different types of health events.
 */
const HealthCalendar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Calendar> & {
    /**
     * Health events to display on specific dates
     */
    healthEvents?: Record<string, Array<{
      id: string
      type: 'appointment' | 'medication' | 'test' | 'milestone' | 'webinar'
      title: string
      time?: string
    }>>
    /**
     * Whether to highlight today with health-specific styling
     */
    highlightToday?: boolean
  }
>(({ className, healthEvents = {}, highlightToday = true, ...props }, ref) => {
  const hasHealthEvents = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    return healthEvents[dateKey] && healthEvents[dateKey].length > 0
  }

  const getHealthEventIndicator = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    const events = healthEvents[dateKey] || []
    
    if (events.length === 0) return null

    // Show the most important event type
    const priorities = ['appointment', 'test', 'medication', 'milestone', 'webinar']
    const topEvent = events.sort((a, b) => 
      priorities.indexOf(a.type) - priorities.indexOf(b.type)
    )[0]

    const getEventColor = (type: string) => {
      switch (type) {
        case 'appointment': return 'bg-[var(--ds-blue-600)]'
        case 'medication': return 'bg-[var(--ds-green-600)]'
        case 'test': return 'bg-[var(--ds-red-600)]'
        case 'milestone': return 'bg-[var(--ds-purple-600)]'
        case 'webinar': return 'bg-[var(--ds-orange-600)]'
        default: return 'bg-[var(--ds-gray-400)]'
      }
    }

    return (
      <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${getEventColor(topEvent.type)}`} />
    )
  }

  return (
    <div ref={ref} className="relative">
      <Calendar
        className={cn(
          "border-[var(--ds-border-default)] shadow-[var(--ds-shadow-default)]",
          className
        )}
        components={{
          DayButton: ({ day, modifiers, ...dayProps }) => (
            <Button
              variant="ghost"
              size="icon"
              data-day={day.date.toLocaleDateString()}
              className={cn(
                "relative flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none",
                modifiers.selected && "bg-[var(--ds-interactive-primary)] text-[var(--ds-text-inverse)]",
                modifiers.today && highlightToday && "bg-[var(--app-primary)] text-[var(--ds-text-inverse)] font-medium",
                hasHealthEvents(day.date) && !modifiers.selected && "bg-[var(--ds-surface-secondary)] font-medium"
              )}
              {...dayProps}
            >
              {day.date.getDate()}
              {getHealthEventIndicator(day.date)}
            </Button>
          )
        }}
        {...props}
      />
    </div>
  )
})
HealthCalendar.displayName = "HealthCalendar"

export { Calendar, CalendarDayButton, HealthCalendar }
