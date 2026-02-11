"use client"

import type React from "react"
import { ContentContainer } from "@/components/ui/content-container"
import { ScreenHeader } from "@/components/ui/screen-header"
import { SearchFilterBar } from "@/components/ui/search-filter-bar"

// Screen template variants
export type ScreenTemplate = 
  | "default"
  | "dashboard" 
  | "list"
  | "detail"
  | "form"

interface ScreenLayoutProps {
  children: React.ReactNode
  template?: ScreenTemplate
  title?: string
  subtitle?: string
  onBack?: () => void
  actions?: React.ReactNode
  rightElement?: React.ReactNode
  className?: string
  contentSpacing?: "none" | "sm" | "md" | "lg"
  contentPadding?: "none" | "sm" | "md" | "lg"
  
  // List template specific props
  searchQuery?: string
  onSearchChange?: (query: string) => void
  filters?: string[]
  selectedFilters?: string[]
  onFilterToggle?: (filter: string) => void
  
  // Dashboard template specific props
  headerStats?: React.ReactNode
  
  // Form template specific props
  formActions?: React.ReactNode
}

export function ScreenLayout({
  children,
  template = "default",
  title,
  subtitle,
  onBack,
  actions,
  rightElement,
  className,
  contentSpacing = "md",
  contentPadding = "md",
  
  // List template props
  searchQuery,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterToggle,
  
  // Dashboard template props
  headerStats,
  
  // Form template props
  formActions,
}: ScreenLayoutProps) {
  
  const renderTemplateSpecific = () => {
    switch (template) {
      case "list":
        if (searchQuery !== undefined && onSearchChange && filters && selectedFilters && onFilterToggle) {
          return (
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterToggle={onFilterToggle}
            />
          )
        }
        return null
        
      case "dashboard":
        return headerStats ? (
          <div className="px-4 py-2 bg-[var(--bg-secondary)]">
            {headerStats}
          </div>
        ) : null
        
      case "form":
        return null // Form actions are rendered at bottom
        
      default:
        return null
    }
  }
  
  const getContentSpacingForTemplate = () => {
    switch (template) {
      case "dashboard":
        return "sm"
      case "list":
        return "none"
      case "form":
        return "lg"
      default:
        return contentSpacing
    }
  }
  
  const getContentPaddingForTemplate = () => {
    switch (template) {
      case "list":
        return "none"
      default:
        return contentPadding
    }
  }

  return (
    <div className="flex flex-col h-full">
      {(title || onBack || actions || rightElement) && (
        <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} rightElement={actions || rightElement} />
      )}

      {renderTemplateSpecific()}

      <ContentContainer 
        className={className} 
        spacing={getContentSpacingForTemplate()} 
        padding={getContentPaddingForTemplate()}
      >
        {template === "list" ? (
          <div className="p-4 space-y-4">{children}</div>
        ) : (
          children
        )}
      </ContentContainer>
      
      {template === "form" && formActions && (
        <div className="px-4 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
          {formActions}
        </div>
      )}
    </div>
  )
}
