"use client"

import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { ChartDataPoint, TimePeriod } from "@/lib/sample-data"

interface RechartsMetricChartProps {
  data: ChartDataPoint[]
  timePeriod: TimePeriod
  color?: string
  maxValue?: number
  unit?: string
  onBarClick?: (index: number) => void
  clickedBarIndex?: number | null
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: any }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-900 text-[var(--ds-text-inverse)] text-xs px-2 py-1.5 rounded shadow-lg">
        <div className="font-medium">{data.formattedLabel || label}</div>
        <div className="text-gray-300">{payload[0].value} {data.unit}</div>
      </div>
    )
  }
  return null
}

export function RechartsMetricChart({ 
  data, 
  timePeriod, 
  color = "#3b82f6", 
  maxValue,
  unit = "",
  onBarClick,
  clickedBarIndex
}: RechartsMetricChartProps) {
  
  // Helper function to resolve CSS variable colors to hex values
  const resolveColor = (cssColor: string): string => {
    // If it's a CSS variable, map it to actual hex color
    const colorMap: { [key: string]: string } = {
      'var(--metric-water)': '#3b82f6',
      'var(--metric-blood-primary)': '#dc2626',
      'var(--metric-blood-secondary)': '#ef4444',
      'var(--metric-nutrition-fat)': '#f59e0b',
      'var(--metric-nutrition-diet)': '#fb923c',
      'var(--metric-hormones)': '#ec4899',
      'var(--metric-hormones-secondary)': '#be185d',
      'var(--metric-sleep)': '#8b5cf6',
      'var(--metric-muscle)': '#7c3aed',
      'var(--metric-vitamins-green)': '#10b981',
      'var(--metric-vitamins-yellow)': '#fbbf24',
      'var(--metric-minerals)': '#6b7280',
      'var(--metric-body-composition)': '#059669',
      'var(--metric-cardiovascular)': '#06b6d4',
      'var(--metric-activity)': '#14b8a6',
      'var(--metric-nutrition-carbs)': '#16a34a',
      'var(--metric-blood-pressure)': '#7c2d12',
      'var(--metric-lab-panel)': '#2563eb',
      'var(--chart-blue)': '#3b82f6',
      'var(--chart-red)': '#ef4444',
      'var(--chart-orange)': '#fb923c',
      'var(--chart-yellow)': '#fcd34d',
      'var(--chart-purple)': '#8b5cf6',
      'var(--chart-pink)': '#ec4899',
      'var(--app-primary)': '#2E9B8C',
      'var(--app-secondary)': '#8B4982',
      'var(--app-tertiary)': '#C6804A'
    }
    
    return colorMap[cssColor] || cssColor
  }
  
  const resolvedColor = resolveColor(color)
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map((point, index) => {
      // Format labels based on time period
      let formattedLabel = point.label || point.timestamp
      
      if (timePeriod === 'daily') {
        formattedLabel = new Date(point.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric'
        })
      } else if (timePeriod === 'weekly') {
        formattedLabel = new Date(point.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      } else if (timePeriod === 'monthly') {
        formattedLabel = new Date(point.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      } else if (timePeriod === 'yearly') {
        formattedLabel = new Date(point.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        })
      }
      
      return {
        ...point,
        value: point.value,
        formattedLabel,
        displayLabel: point.label || point.timestamp,
        unit,
        index,
        isClicked: clickedBarIndex === index
      }
    })
  }, [data, timePeriod, unit, clickedBarIndex])

  const yAxisMax = useMemo(() => {
    if (maxValue) return maxValue
    if (chartData.length === 0) return 100
    
    const dataMax = Math.max(...chartData.map(d => d.value))
    return Math.ceil(dataMax * 1.1) // Add 10% padding
  }, [chartData, maxValue])

  const handleBarClick = (data: any, index: number) => {
    onBarClick?.(index)
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-sm text-[var(--ds-text-secondary)] font-semibold">No Data</div>
          <div className="text-xs text-[var(--ds-text-secondary)]">
            Period: {timePeriod} | Data points: {data?.length || 0}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        barCategoryGap="15%"
      >
        <XAxis 
          dataKey="displayLabel"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: 'var(--gray-500)' }}
          interval={0}
          angle={0}
          textAnchor="middle"
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: 'var(--gray-500)' }}
          domain={[0, yAxisMax]}
          tickCount={4}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          radius={[2, 2, 0, 0]}
          onClick={handleBarClick}
          cursor="pointer"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.isClicked ? resolvedColor : `${resolvedColor}CC`}
              stroke={entry.isClicked ? resolvedColor : 'transparent'}
              strokeWidth={entry.isClicked ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}