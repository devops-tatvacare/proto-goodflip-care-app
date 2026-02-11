"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { MaterialIcon } from "@/components/ui/material-icon"
import { FocusTrap } from "@/components/primitives/FocusTrap"
import { VisuallyHidden } from "@/components/primitives/VisuallyHidden"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-[var(--ds-radius-md)] bg-[var(--ds-surface-primary)] text-[var(--ds-text-primary)] border border-[var(--ds-border-default)]",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-[var(--ds-shadow-elevated)] border-[var(--ds-border-default)]">
        <FocusTrap trapped={true} loop={true} restoreFocus={true}>
          <Command className="[&_[cmdk-group-heading]]:px-[var(--ds-space-sm)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--ds-text-muted)] [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-[var(--ds-space-sm)] [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-[var(--ds-space-sm)] [&_[cmdk-item]]:py-[var(--ds-space-md)] [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            {children}
          </Command>
        </FocusTrap>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-[var(--ds-border-default)] px-[var(--ds-space-md)]" cmdk-input-wrapper="">
    <MaterialIcon 
      icon="search" 
      className="mr-[var(--ds-space-sm)] shrink-0 text-[var(--ds-text-muted)]" 
      size="small" 
    />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-[var(--ds-radius-sm)] bg-transparent py-[var(--ds-space-md)] text-sm outline-none placeholder:text-[var(--ds-text-muted)] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--ds-focus-ring)] focus:ring-offset-2",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-[var(--ds-space-sm)]", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-[var(--ds-space-xl)] text-center text-sm text-[var(--ds-text-muted)]"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-[var(--ds-space-xs)] text-[var(--ds-text-primary)] [&_[cmdk-group-heading]]:px-[var(--ds-space-sm)] [&_[cmdk-group-heading]]:py-[var(--ds-space-sm)] [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--ds-text-muted)]",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-[var(--ds-space-xs)] h-px bg-[var(--ds-border-default)]", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-[var(--ds-space-sm)] select-none items-center rounded-[var(--ds-radius-sm)] px-[var(--ds-space-sm)] py-[var(--ds-space-sm)] text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-[var(--ds-surface-tertiary)] data-[selected=true]:text-[var(--ds-text-primary)] data-[disabled=true]:opacity-50 hover:bg-[var(--ds-surface-secondary)] focus:bg-[var(--ds-surface-tertiary)] focus:outline-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-[var(--ds-text-muted)] bg-[var(--ds-surface-tertiary)] px-[var(--ds-space-xs)] py-1 rounded-[var(--ds-radius-xs)] font-mono",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

/**
 * Healthcare-specific search command optimized for patient support programs
 * Includes search for medications, symptoms, appointments, and health records
 */
const HealthCommand = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    /**
     * Whether to show recent searches
     */
    showRecentSearches?: boolean
    /**
     * Whether to show search suggestions
     */
    showSuggestions?: boolean
    /**
     * Placeholder text for healthcare context
     */
    healthPlaceholder?: string
  }
>(({ className, showRecentSearches = true, showSuggestions = true, healthPlaceholder = "Search medications, symptoms, appointments...", children, ...props }, ref) => (
  <Command
    ref={ref}
    className={cn(
      "min-h-[200px] max-h-[400px] sm:max-h-[500px] w-full border-[var(--ds-border-default)] shadow-[var(--ds-shadow-elevated)] text-sm sm:text-base",
      className
    )}
    {...props}
  >
    <CommandInput placeholder={healthPlaceholder} />
    <CommandList>
      <CommandEmpty>
        <div className="flex flex-col items-center gap-[var(--ds-space-md)] text-center">
          <MaterialIcon icon="search_off" size="large" className="text-[var(--ds-text-muted)]" />
          <div>
            <p className="text-sm text-[var(--ds-text-primary)]">No results found</p>
            <p className="text-xs text-[var(--ds-text-muted)] mt-1">Try searching for medications, symptoms, or appointments</p>
          </div>
        </div>
      </CommandEmpty>
      {children}
    </CommandList>
  </Command>
))
HealthCommand.displayName = "HealthCommand"

/**
 * Pre-configured healthcare search item with proper ARIA labels
 * and visual indicators for different content types
 */
const HealthCommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    /**
     * Type of healthcare content
     */
    type?: 'medication' | 'symptom' | 'appointment' | 'record' | 'doctor' | 'test'
    /**
     * Optional description text
     */
    description?: string
  }
>(({ className, type, description, children, ...props }, ref) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return 'medication'
      case 'symptom': return 'sick'
      case 'appointment': return 'event'
      case 'record': return 'folder_shared'
      case 'doctor': return 'person'
      case 'test': return 'biotech'
      default: return 'search'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'text-[var(--ds-blue-600)]'
      case 'symptom': return 'text-[var(--ds-red-600)]'
      case 'appointment': return 'text-[var(--ds-green-600)]'
      case 'record': return 'text-[var(--ds-purple-600)]'
      case 'doctor': return 'text-[var(--ds-orange-600)]'
      case 'test': return 'text-[var(--ds-yellow-600)]'
      default: return 'text-[var(--ds-text-muted)]'
    }
  }

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "flex items-start sm:items-center gap-[var(--ds-space-sm)] sm:gap-[var(--ds-space-md)] py-[var(--ds-space-md)] px-[var(--ds-space-sm)] sm:px-[var(--ds-space-md)]",
        className
      )}
      {...props}
    >
      {type && (
        <MaterialIcon 
          icon={getTypeIcon(type)} 
          size="small" 
          className={getTypeColor(type)}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm sm:text-base font-medium text-[var(--ds-text-primary)]">
          {children}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--ds-text-muted)] mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </CommandItem>
  )
})
HealthCommandItem.displayName = "HealthCommandItem"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  HealthCommand,
  HealthCommandItem,
}
