"use client"

import { useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MaterialIcon } from '@/components/ui/material-icon'

interface TodaysProgressCardProps {
  className?: string
  onMetricClick?: (metricType: string) => void
}

interface DailyMetric {
  id: string
  type: 'water' | 'steps' | 'sleep' | 'calories'
  current: number
  goal: number
  unit: string
  icon: string
  iconVariant: 'filled' | 'outlined' | 'round'
  color: string
  bgColor: string
}

export function TodaysProgressCard({ className, onMetricClick }: TodaysProgressCardProps) {
  const [metrics] = useState<DailyMetric[]>([
    {
      id: 'water',
      type: 'water',
      current: 6,
      goal: 8,
      unit: 'glasses',
      icon: 'water_full',
      iconVariant: 'round',
      color: 'var(--chart-blue)',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'steps',
      type: 'steps',
      current: 8432,
      goal: 10000,
      unit: 'steps',
      icon: 'directions_walk',
      iconVariant: 'round',
      color: 'var(--metric-vitamins-green)',
      bgColor: 'bg-green-50'
    },
    {
      id: 'sleep',
      type: 'sleep',
      current: 7.5,
      goal: 8,
      unit: 'hours',
      icon: 'bed',
      iconVariant: 'round',
      color: 'var(--metric-sleep)',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'calories',
      type: 'calories',
      current: 1650,
      goal: 2000,
      unit: 'cal',
      icon: 'restaurant',
      iconVariant: 'round',
      color: 'var(--metric-nutrition-fat)',
      bgColor: 'bg-amber-50'
    }
  ])

  const formatValue = (value: number, type: string) => {
    if (type === 'steps' || type === 'calories') {
      return value.toLocaleString()
    }
    if (type === 'sleep' && value % 1 !== 0) {
      return value.toFixed(1)
    }
    return value.toString()
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <MaterialIcon icon="trending_up" variant="round" size={12} color="white" />
            </div>
            Today's Progress
          </CardTitle>
          <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">Track your daily wellness goals</p>
        </div>
      </div>
      
      <CardContent className="p-0 px-4 pt-4 pb-4">
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const progress = getProgressPercentage(metric.current, metric.goal)
            
            return (
              <button 
                key={metric.id} 
                className="text-center hover:bg-[var(--ds-surface-secondary)] rounded-lg p-1 transition-colors duration-200"
                onClick={() => onMetricClick?.(metric.type)}
              >
                {/* Circular Progress */}
                <div className="relative mb-3 flex justify-center">
                  <div className="relative">
                    {/* Background circle */}
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                      <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                        <MaterialIcon 
                          icon={metric.icon} 
                          variant={metric.iconVariant}
                          size={20}
                          color={metric.color}
                        />
                      </div>
                    </div>
                    
                    {/* Progress ring */}
                    <svg className="absolute top-0 left-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={metric.color}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                        className="transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Metric Details */}
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[var(--card-header-text)]">
                    {formatValue(metric.current, metric.type)}
                  </div>
                  <div className="text-[10px] text-[var(--ds-text-secondary)]">
                    of {formatValue(metric.goal, metric.type)}
                  </div>
                  <div className="text-[10px] font-medium" style={{ color: metric.color }}>
                    {Math.round(progress)}%
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        
      </CardContent>
    </Card>
  )
}