"use client"

import { useMemo } from "react"
import { MetricConfig } from "@/components/insights/metric-template-view"
import { generateChartData } from "@/lib/vitals-metric-configs"

interface CorrelationChartProps {
  primaryMetric: MetricConfig
  secondaryMetric: MetricConfig
  days: number
}

export function CorrelationChart({ primaryMetric, secondaryMetric, days }: CorrelationChartProps) {
  const chartData = useMemo(() => {
    const primaryData = generateChartData(primaryMetric, days)
    const secondaryData = generateChartData(secondaryMetric, days)
    
    // Combine data points for correlation
    return primaryData.map((primary, index) => ({
      date: primary.date,
      label: primary.label,
      primary: primary.value,
      secondary: secondaryData[index]?.value || 0,
      primaryName: primaryMetric.name,
      secondaryName: secondaryMetric.name
    }))
  }, [primaryMetric, secondaryMetric, days])

  // Determine chart type based on metric units
  const shouldUseScatterPlot = useMemo(() => {
    // Use scatter plot for percentage-based comparisons (Body Fat % vs BMI, etc.)
    const primaryIsPercentage = primaryMetric.unit === '%'
    const secondaryIsPercentage = secondaryMetric.unit === '%'
    const bothNumeric = !isNaN(parseFloat(primaryMetric.currentValue.toString())) && !isNaN(parseFloat(secondaryMetric.currentValue.toString()))
    
    return (primaryIsPercentage || secondaryIsPercentage) && bothNumeric
  }, [primaryMetric, secondaryMetric])

  // Calculate scales and ranges
  const primaryValues = chartData.map(d => d.primary)
  const secondaryValues = chartData.map(d => d.secondary)
  
  const primaryMin = Math.min(...primaryValues)
  const primaryMax = Math.max(...primaryValues)
  const secondaryMin = Math.min(...secondaryValues)
  const secondaryMax = Math.max(...secondaryValues)

  const chartWidth = 320
  const chartHeight = 200
  const padding = { top: 15, right: 35, bottom: 30, left: 35 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  if (shouldUseScatterPlot) {
    // Scatter plot for correlation analysis
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between px-2 py-1">
          <h4 className="text-[10px] font-medium text-gray-700">Correlation</h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryMetric.color }}></div>
              <span className="text-[9px] text-[var(--ds-text-secondary)]">{primaryMetric.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryMetric.color }}></div>
              <span className="text-[9px] text-[var(--ds-text-secondary)]">{secondaryMetric.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-0 px-2">
          <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <g key={`grid-${ratio}`}>
                {/* Vertical grid lines */}
                <line
                  x1={padding.left + ratio * plotWidth}
                  y1={padding.top}
                  x2={padding.left + ratio * plotWidth}
                  y2={padding.top + plotHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                {/* Horizontal grid lines */}
                <line
                  x1={padding.left}
                  y1={padding.top + ratio * plotHeight}
                  x2={padding.left + plotWidth}
                  y2={padding.top + ratio * plotHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              </g>
            ))}

            {/* Data points */}
            {chartData.map((point, index) => {
              const x = padding.left + ((point.primary - primaryMin) / (primaryMax - primaryMin)) * plotWidth
              const y = padding.top + plotHeight - ((point.secondary - secondaryMin) / (secondaryMax - secondaryMin)) * plotHeight
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={primaryMetric.color}
                  fillOpacity="0.7"
                  stroke={secondaryMetric.color}
                  strokeWidth="1.5"
                  className="hover:r-4 transition-all cursor-pointer"
                >
                  <title>{`${point.primaryName}: ${point.primary.toFixed(1)} ${primaryMetric.unit}, ${point.secondaryName}: ${point.secondary.toFixed(1)} ${secondaryMetric.unit}`}</title>
                </circle>
              )
            })}

            {/* Axes labels */}
            <text
              x={padding.left + plotWidth / 2}
              y={chartHeight - 8}
              textAnchor="middle"
              className="text-[9px] fill-gray-500"
            >
              {primaryMetric.name}
            </text>
            
            <text
              x={12}
              y={padding.top + plotHeight / 2}
              textAnchor="middle"
              className="text-[9px] fill-gray-500"
              transform={`rotate(-90, 12, ${padding.top + plotHeight / 2})`}
            >
              {secondaryMetric.name}
            </text>

            {/* Scale labels */}
            <text x={padding.left} y={chartHeight - 18} className="text-[8px] fill-gray-400" textAnchor="start">
              {primaryMin.toFixed(0)}
            </text>
            <text x={padding.left + plotWidth} y={chartHeight - 18} className="text-[8px] fill-gray-400" textAnchor="end">
              {primaryMax.toFixed(0)}
            </text>
            <text x={padding.left - 3} y={padding.top + plotHeight + 3} className="text-[8px] fill-gray-400" textAnchor="end">
              {secondaryMin.toFixed(0)}
            </text>
            <text x={padding.left - 3} y={padding.top + 3} className="text-[8px] fill-gray-400" textAnchor="end">
              {secondaryMax.toFixed(0)}
            </text>
          </svg>
        </div>
      </div>
    )
  }

  // Dual-axis line chart for time series comparison
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-1">
        <h4 className="text-[10px] font-medium text-gray-700">Trends</h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryMetric.color }}></div>
            <span className="text-[9px] text-[var(--ds-text-secondary)]">{primaryMetric.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryMetric.color }}></div>
            <span className="text-[9px] text-[var(--ds-text-secondary)]">{secondaryMetric.name}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 px-2">
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={`grid-${ratio}`}
              x1={padding.left}
              y1={padding.top + ratio * plotHeight}
              x2={padding.left + plotWidth}
              y2={padding.top + ratio * plotHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {/* Primary metric line */}
          <polyline
            fill="none"
            stroke={primaryMetric.color}
            strokeWidth="2"
            points={chartData.map((point, index) => {
              const x = padding.left + (index / (chartData.length - 1)) * plotWidth
              const y = padding.top + plotHeight - ((point.primary - primaryMin) / (primaryMax - primaryMin)) * plotHeight
              return `${x},${y}`
            }).join(' ')}
          />

          {/* Secondary metric line */}
          <polyline
            fill="none"
            stroke={secondaryMetric.color}
            strokeWidth="2"
            strokeDasharray="4,4"
            points={chartData.map((point, index) => {
              const x = padding.left + (index / (chartData.length - 1)) * plotWidth
              const y = padding.top + plotHeight - ((point.secondary - secondaryMin) / (secondaryMax - secondaryMin)) * plotHeight
              return `${x},${y}`
            }).join(' ')}
          />

          {/* Data points */}
          {chartData.map((point, index) => {
            const x = padding.left + (index / (chartData.length - 1)) * plotWidth
            const primaryY = padding.top + plotHeight - ((point.primary - primaryMin) / (primaryMax - primaryMin)) * plotHeight
            const secondaryY = padding.top + plotHeight - ((point.secondary - secondaryMin) / (secondaryMax - secondaryMin)) * plotHeight
            
            return (
              <g key={index}>
                <circle cx={x} cy={primaryY} r="3" fill={primaryMetric.color} />
                <circle cx={x} cy={secondaryY} r="3" fill={secondaryMetric.color} />
              </g>
            )
          })}

          {/* X-axis labels */}
          {chartData.map((point, index) => {
            if (index % Math.ceil(chartData.length / 4) === 0) {
              const x = padding.left + (index / (chartData.length - 1)) * plotWidth
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  className="text-[8px] fill-gray-500"
                >
                  {point.label}
                </text>
              )
            }
            return null
          })}

          {/* Y-axis labels */}
          <text x={padding.left - 3} y={padding.top + 3} className="text-[8px] fill-gray-400" textAnchor="end">
            {primaryMax.toFixed(0)}
          </text>
          <text x={padding.left - 3} y={padding.top + plotHeight} className="text-[8px] fill-gray-400" textAnchor="end">
            {primaryMin.toFixed(0)}
          </text>
          <text x={padding.left + plotWidth + 3} y={padding.top + 3} className="text-[8px] fill-gray-400" textAnchor="start">
            {secondaryMax.toFixed(0)}
          </text>
          <text x={padding.left + plotWidth + 3} y={padding.top + plotHeight} className="text-[8px] fill-gray-400" textAnchor="start">
            {secondaryMin.toFixed(0)}
          </text>
        </svg>
      </div>
    </div>
  )
}