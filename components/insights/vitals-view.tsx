"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from '@/components/ui/icon'
import { vitalsCategories, VitalsCategory, VitalsMetric } from "@/lib/vitals-data"
import { ResponsiveMetricChart } from "@/components/charts/responsive-metric-chart"

type TimeRange = "daily" | "weekly" | "monthly" | "yearly"

interface VitalsViewProps {
  onBack?: () => void
}

export function VitalsView({ onBack }: VitalsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<VitalsCategory>(vitalsCategories[0])
  const [selectedMetric, setSelectedMetric] = useState<VitalsMetric>(vitalsCategories[0].metrics[0])
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("weekly")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleCategorySelect = (category: VitalsCategory) => {
    if (selectedCategory.id === category.id) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedCategory(category)
      setSelectedMetric(category.metrics[0]) // Select first metric of the new category
      setIsDropdownOpen(false)
      setIsTransitioning(false)
    }, 150)
  }

  const handleMetricSelect = (metric: VitalsMetric) => {
    setSelectedMetric(metric)
    setIsDropdownOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <Icon name="trendingUp" className="w-3 h-3 text-[var(--ds-status-error)]" />
      case 'low': return <Icon name="trendingDown" className="w-3 h-3 text-yellow-500" />
      default: return <Icon name="minus" className="w-3 h-3 text-[var(--ds-status-success)]" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'from-green-500 to-emerald-500'
      case 'high': return 'from-red-500 to-rose-500'
      case 'low': return 'from-yellow-500 to-orange-500'
      case 'critical': return 'from-red-600 to-red-700'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  // Get chart data for selected metric (using category's chart data as base)
  const chartData = selectedCategory.chartData[selectedTimeRange]

  // Convert tailwind text color to hex for chart
  const getChartColor = (textColor: string) => {
    const colorMap: { [key: string]: string } = {
      'text-blue-600': '#2563eb',
      'text-red-600': '#dc2626', 
      'text-green-600': '#16a34a',
      'text-purple-600': '#9333ea'
    }
    return colorMap[textColor] || '#6366f1'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Category Circles - Enhanced with better visual feedback */}
      <div className="flex-shrink-0 px-4 py-4 bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-100">
        <div 
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth',
            paddingTop: '6px',
            paddingBottom: '6px',
            marginTop: '-6px',
            marginBottom: '-6px'
          }}
        >
          {vitalsCategories.map((category) => {
            const isSelected = selectedCategory.id === category.id
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`flex flex-col items-center gap-2 min-w-[72px] transition-all duration-300 group ${
                  isSelected ? 'scale-110' : 'scale-100 hover:scale-105'
                }`}
              >
                <div
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'shadow-xl ring-4 ring-opacity-30' 
                      : 'shadow-lg hover:shadow-xl group-hover:ring-2 ring-opacity-20'
                  }`}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-hover) 100%)'
                      : category.bgColor === 'bg-blue-50' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
                      : category.bgColor === 'bg-red-50' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
                      : category.bgColor === 'bg-green-50' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)'
                      : category.bgColor === 'bg-purple-50' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.05) 100%)'
                  }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent"></div>
                  )}
                  <span 
                    className={`material-symbols-outlined text-xl transition-all duration-300 ${
                      isSelected ? 'text-[var(--ds-text-inverse)]' : `${category.color} group-hover:scale-110`
                    }`}
                  >
                    {category.materialIcon}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`text-[11px] font-semibold block transition-colors duration-300 ${
                    isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {category.title}
                  </span>
                  <span className="text-[9px] text-[var(--ds-text-secondary)] mt-0.5 block">
                    {category.metrics.length} metrics
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Category Detail View */}
      <div className={`flex-1 overflow-hidden px-4 transition-all duration-300 ${
        isTransitioning ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'
      }`}>
        {/* Category Header with Description */}
        <div className="mb-4 pt-2">
          <div className="flex items-start gap-3 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${getChartColor(selectedCategory.color)}20 0%, ${getChartColor(selectedCategory.color)}10 100%)`
              }}
            >
              <span className={`material-symbols-outlined text-sm ${selectedCategory.color}`}>
                {selectedCategory.materialIcon}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedCategory.title}</h2>
              <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">{selectedCategory.description}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Metric Dropdown Selector */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
            Select Metric
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[var(--ds-surface-primary)] border-2 border-[var(--ds-border-default)] rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(selectedMetric.status)}`} />
                <div className="text-left">
                  <div className="font-semibold">{selectedMetric.name}</div>
                  <div className="text-xs text-[var(--ds-text-secondary)] mt-0.5">
                    {selectedMetric.currentValue} {selectedMetric.unit}
                  </div>
                </div>
              </div>
              <Icon name="chevronDown" className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  {selectedCategory.metrics.map((metric, index) => (
                    <button
                      key={metric.id}
                      onClick={() => handleMetricSelect(metric)}
                      className={`w-full px-3 py-3 text-left text-sm rounded-lg transition-all duration-150 ${
                        selectedMetric.id === metric.id 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-200' 
                          : 'text-gray-900 hover:bg-[var(--ds-surface-secondary)]'
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(metric.status)} shadow-sm`} />
                          <div>
                            <div className="font-semibold">{metric.name}</div>
                            <div className="text-xs text-[var(--ds-text-secondary)] mt-1">
                              <span className="font-medium">{metric.currentValue} {metric.unit}</span>
                              {metric.range && (
                                <span className="ml-2 text-gray-400">Range: {metric.range}</span>
                              )}
                              {metric.goal && (
                                <span className="ml-2 text-gray-400">Goal: {metric.goal}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(metric.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metric.status === 'normal' ? 'bg-green-100 text-green-700' :
                            metric.status === 'high' ? 'bg-red-100 text-red-700' :
                            metric.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Current Value Display */}
        <div className="bg-gradient-to-r from-white to-gray-50/50 rounded-xl p-5 mb-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {selectedMetric.currentValue}
                </span>
                <span className="text-lg font-medium text-[var(--ds-text-secondary)]">{selectedMetric.unit}</span>
                {getStatusIcon(selectedMetric.status)}
              </div>
              <div className="space-y-1">
                {selectedMetric.range && (
                  <div className="text-sm text-[var(--ds-text-secondary)]">
                    <span className="font-medium">Normal range:</span> {selectedMetric.range}
                  </div>
                )}
                {selectedMetric.goal && (
                  <div className="text-sm text-[var(--ds-text-secondary)]">
                    <span className="font-medium">Goal:</span> {selectedMetric.goal}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-3 py-2 rounded-full text-sm font-semibold shadow-sm bg-gradient-to-r ${getStatusColor(selectedMetric.status)} text-[var(--ds-text-inverse)]`}>
                {selectedMetric.status.charAt(0).toUpperCase() + selectedMetric.status.slice(1)}
              </div>
              <div className="text-xs text-[var(--ds-text-secondary)] text-right">
                Last updated<br />2 hours ago
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Time Range Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Trends Analysis</h3>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(selectedMetric.status)}`} />
          </div>
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-[var(--ds-border-default)]">
            {(["daily", "weekly", "monthly", "yearly"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  selectedTimeRange === range
                    ? "bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm ring-1 ring-gray-200"
                    : "text-[var(--ds-text-secondary)] hover:text-gray-900 hover:bg-[var(--ds-surface-secondary)]"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Chart */}
        <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
          <div className="relative h-44">
            <ResponsiveMetricChart
              data={chartData}
              timePeriod={selectedTimeRange}
              color={getChartColor(selectedCategory.color)}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--ds-text-secondary)]">
            <span>Data from {selectedCategory.title.toLowerCase()}</span>
            <span>{chartData.length} data points</span>
          </div>
        </div>
      </div>
    </div>
  )
}
