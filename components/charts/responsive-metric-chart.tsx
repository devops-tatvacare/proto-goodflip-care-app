"use client"

import { useMemo } from "react"
import { ChartDataPoint, TimePeriod } from "@/lib/sample-data"

interface ResponsiveMetricChartProps {
  data: ChartDataPoint[]
  timePeriod: TimePeriod
  color?: string
  maxValue?: number
  unit?: string
  onBarClick?: (index: number) => void
  clickedBarIndex?: number | null
}

export function ResponsiveMetricChart({ 
  data, 
  timePeriod, 
  color = "var(--app-primary)", 
  maxValue,
  unit = "",
  onBarClick,
  clickedBarIndex
}: ResponsiveMetricChartProps) {
  
  const chartConfig = useMemo(() => {
    // Ensure we have valid data
    if (!data || data.length === 0) {
      return {
        maxValue: 100,
        showAllLabels: true,
        labelFrequency: 1,
        barWidth: 'auto',
        barGap: '2px'
      }
    }

    const dataMax = Math.max(...data.map(d => d.value))
    const chartMax = maxValue || Math.max(dataMax * 1.1, 1) // Ensure minimum of 1
    
    // Calculate optimal bar width and gap based on container and data length
    const calculateBarDimensions = (dataLength: number) => {
      // Assume container width is roughly 300-400px (account for padding)
      const containerWidth = 320
      const totalGapSpace = (dataLength - 1) * 2 // 2px gap between bars
      const availableBarSpace = containerWidth - totalGapSpace
      const calculatedBarWidth = Math.max(availableBarSpace / dataLength, 4) // Minimum 4px width
      
      return {
        barWidth: `${Math.min(calculatedBarWidth, 40)}px`, // Max 40px width
        barGap: '2px'
      }
    }
    
    // Configure based on time period with better width calculations
    switch (timePeriod) {
      case 'daily':
        const dailyDimensions = calculateBarDimensions(data.length)
        return {
          maxValue: chartMax,
          showAllLabels: data.length <= 12,
          labelFrequency: data.length <= 8 ? 1 : 2,
          barWidth: dailyDimensions.barWidth,
          barGap: dailyDimensions.barGap,
          maxBars: 24
        }
      
      case 'weekly':
        const weeklyDimensions = calculateBarDimensions(7)
        return {
          maxValue: chartMax,
          showAllLabels: true,
          labelFrequency: 1,
          barWidth: weeklyDimensions.barWidth,
          barGap: weeklyDimensions.barGap,
          maxBars: 7
        }
      
      case 'monthly':
        const monthlyDimensions = calculateBarDimensions(data.length)
        return {
          maxValue: chartMax,
          showAllLabels: false,
          labelFrequency: Math.ceil(data.length / 6),
          barWidth: monthlyDimensions.barWidth,
          barGap: monthlyDimensions.barGap,
          maxBars: 31
        }
      
      case 'yearly':
        const yearlyDimensions = calculateBarDimensions(12)
        return {
          maxValue: chartMax,
          showAllLabels: true,
          labelFrequency: 1,
          barWidth: yearlyDimensions.barWidth,
          barGap: yearlyDimensions.barGap,
          maxBars: 12
        }
      
      default:
        const defaultDimensions = calculateBarDimensions(data.length)
        return {
          maxValue: chartMax,
          showAllLabels: true,
          labelFrequency: 1,
          barWidth: defaultDimensions.barWidth,
          barGap: defaultDimensions.barGap,
          maxBars: data.length
        }
    }
  }, [data, timePeriod, maxValue])

  // Show debug info if no data
  if (!data || data.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-red-600 font-semibold">No Data</div>
          <div className="text-xs text-[var(--ds-text-secondary)]">
            Period: {timePeriod} | Data points: {data?.length || 0}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[0.25, 0.5, 0.75].map((ratio) => (
          <div
            key={ratio}
            className="absolute w-full border-t border-[var(--ds-border-default)]/50"
            style={{ bottom: `${ratio * 100}%` }}
          />
        ))}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[8px] text-gray-400">
        <span>
          {chartConfig.maxValue >= 1000 ? `${Math.round(chartConfig.maxValue/1000)}k` : Math.round(chartConfig.maxValue)}
          {unit && <span className="text-[7px]"> {unit}</span>}
        </span>
        <span>
          {chartConfig.maxValue >= 1000 ? `${Math.round(chartConfig.maxValue * 0.5/1000)}k` : Math.round(chartConfig.maxValue * 0.5)}
        </span>
        <span>0</span>
      </div>

      {/* Chart bars container with improved spacing */}
      <div className="ml-7 h-full">
        <div className="h-full flex items-end justify-start overflow-x-hidden" style={{ gap: chartConfig.barGap }}>
          {data.map((point, index) => {
            const barHeight = Math.max((point.value / chartConfig.maxValue) * 100, 5)
            const isClicked = clickedBarIndex === index
            
            // Determine if we should show the label for this bar
            const showLabel = chartConfig.showAllLabels || index % chartConfig.labelFrequency === 0
            
            // Format date for clicked tooltip
            const formatDateForTooltip = () => {
              if (timePeriod === 'daily') {
                return point.label || new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' })
              } else if (timePeriod === 'weekly') {
                return point.label || new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              } else if (timePeriod === 'monthly') {
                return point.label || new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              } else {
                return point.label || new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              }
            }
            
            return (
              <div 
                key={`${point.timestamp}-${index}`} 
                className="flex flex-col items-center justify-end relative"
                style={{
                  width: chartConfig.barWidth,
                  minWidth: chartConfig.barWidth
                }}
              >
                {/* Clicked bar tooltip - shows above bar when clicked */}
                {isClicked && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-[var(--ds-text-inverse)] text-[10px] px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-20">
                    <div className="font-medium">{formatDateForTooltip()}</div>
                    <div className="text-gray-300">{point.value} {unit}</div>
                  </div>
                )}

                {/* Bar with click interaction */}
                <div 
                  className="w-full flex flex-col justify-end group cursor-pointer" 
                  style={{ height: 'calc(100% - 16px)' }}
                  onClick={() => onBarClick?.(index)}
                >
                  <div className="relative">
                    {/* Hover tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-[var(--ds-text-inverse)] text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {point.value} {unit}
                    </div>
                    <div
                      className={`w-full rounded-t-sm border transition-all duration-200 ${
                        isClicked ? 'ring-2 ring-offset-1' : 'hover:opacity-100'
                      }`}
                      style={{
                        height: `${barHeight}%`,
                        minHeight: '8px',
                        backgroundColor: color || 'var(--chart-blue)',
                        borderColor: color || 'var(--chart-blue)',
                        opacity: isClicked ? 1 : 0.8,
                        
                      }}
                    />
                  </div>
                </div>
                
                {/* X-axis Label */}
                <div 
                  className="text-[8px] text-[var(--ds-text-secondary)] text-center mt-0.5 leading-none h-3 font-medium"
                  style={{
                    opacity: showLabel ? 1 : 0,
                    visibility: showLabel ? 'visible' : 'hidden'
                  }}
                >
                  {point.label || point.timestamp}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
