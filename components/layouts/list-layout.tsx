import type React from "react"
import { SearchFilterBar } from "@/components/ui/search-filter-bar"

interface ListLayoutProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: string[]
  selectedFilters: string[]
  onFilterToggle: (filter: string) => void
  children: React.ReactNode
}

export function ListLayout({
  searchQuery,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterToggle,
  children,
}: ListLayoutProps) {
  return (
    <>
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterToggle={onFilterToggle}
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
    </>
  )
}
