"use client"

import { Icon } from '@/components/ui/icon'
import { Input } from "@/components/ui/input"

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: string[]
  selectedFilters: string[]
  onFilterToggle: (filter: string) => void
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterToggle,
}: SearchFilterBarProps) {
  return (
    <div className="p-4 bg-[var(--ds-surface-primary)] border-b border-[var(--ds-border-subtle)]">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterToggle(filter)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFilters.includes(filter)
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-[var(--ds-surface-secondary)] text-[var(--ds-text-secondary)] hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
