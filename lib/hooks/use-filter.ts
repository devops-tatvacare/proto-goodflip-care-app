"use client"

import { useState } from "react"

export function useFilter<T>(data: T[], searchFields: (keyof T)[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      searchFields.some((field) => String(item[field]).toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => {
        const categoryMatch = (item as any).category === filter
        const roleMatch = (item as any).role === filter
        const tagsMatch = (item as any).tags && (item as any).tags.includes(filter)
        return categoryMatch || roleMatch || tagsMatch
      })

    return matchesSearch && matchesFilters
  })

  const getUniqueFilters = (filterField: keyof T) => {
    const filters = new Set<string>()
    data.forEach((item) => {
      const value = item[filterField]
      if (Array.isArray(value)) {
        value.forEach((tag: string) => filters.add(tag))
      } else if (value) {
        filters.add(String(value))
      }
    })
    return Array.from(filters)
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedFilters,
    filteredData,
    getUniqueFilters,
    toggleFilter,
  }
}
