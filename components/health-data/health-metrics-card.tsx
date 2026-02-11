"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { useHealthMetrics, useCreateHealthMetric } from '@/lib/hooks/use-strapi-data'
import { UniversalCard } from '@/components/ui/universal-card'
import type { HealthMetric } from '@/lib/strapi/health-api'

interface HealthMetricsCardProps {
  metricType?: string
  showAddButton?: boolean
  limit?: number
}

export function HealthMetricsCard({ 
  metricType = 'weight', 
  showAddButton = true,
  limit = 5 
}: HealthMetricsCardProps) {
  const { data: metrics, loading, error, refetch } = useHealthMetrics({ 
    type: metricType, 
    limit 
  })
  const { mutate: createMetric, loading: creating } = useCreateHealthMetric()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddMetric = async (value: string, notes?: string) => {
    const newMetric = {
      type: metricType as any,
      value: parseFloat(value),
      unit: getUnitForType(metricType),
      recordedAt: new Date().toISOString(),
      notes
    }

    const result = await createMetric(newMetric)
    if (result) {
      await refetch()
      setShowAddForm(false)
    }
  }

  const getUnitForType = (type: string): string => {
    const units: Record<string, string> = {
      weight: 'lbs',
      height: 'in',
      blood_pressure: 'mmHg',
      glucose: 'mg/dL',
      heart_rate: 'bpm',
      steps: 'steps',
      sleep: 'hours'
    }
    return units[type] || 'units'
  }

  const getIconForType = (type: string) => {
    const icons: Record<string, any> = {
      weight: TrendingUp,
      blood_pressure: Activity,
      glucose: TrendingDown,
      heart_rate: Activity,
      steps: Activity,
      sleep: Activity
    }
    return icons[type] || Activity
  }

  const getTrendColor = (current: number, previous?: number): string => {
    if (!previous) return 'text-[var(--ds-text-secondary)]'
    if (current > previous) return 'text-green-600'
    if (current < previous) return 'text-red-600'
    return 'text-[var(--ds-text-secondary)]'
  }

  if (loading) {
    return (
      <UniversalCard
        title={`${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Tracking`}
        variant="default"
      >
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </UniversalCard>
    )
  }

  if (error) {
    return (
      <UniversalCard
        title={`${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Tracking`}
        variant="default"
      >
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load metrics</p>
          <Button onClick={refetch} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </UniversalCard>
    )
  }

  const Icon = getIconForType(metricType)
  const latestMetric = metrics?.[0]
  const previousMetric = metrics?.[1]

  return (
    <UniversalCard
      title={`${metricType.charAt(0).toUpperCase() + metricType.slice(1)} Tracking`}
      icon={Icon}
      headerAction={showAddButton ? {
        label: 'Add',
        icon: (props: any) => <Icon name="plus" {...props} />,
        onClick: () => setShowAddForm(true)
      } : undefined}
      variant="default"
    >
      <div className="space-y-4">
        {/* Latest Reading */}
        {latestMetric && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {latestMetric.value} {latestMetric.unit}
                </p>
                <p className="text-sm text-[var(--ds-text-secondary)]">
                  {new Date(latestMetric.recordedAt).toLocaleDateString()}
                </p>
              </div>
              {previousMetric && (
                <div className={`text-sm font-medium ${getTrendColor(
                  Number(latestMetric.value), 
                  Number(previousMetric.value)
                )}`}>
                  {Number(latestMetric.value) > Number(previousMetric.value) ? (
                    <Icon name="trendingUp" className="w-4 h-4 inline mr-1" />
                  ) : (
                    <Icon name="trendingDown" className="w-4 h-4 inline mr-1" />
                  )}
                  {Math.abs(Number(latestMetric.value) - Number(previousMetric.value)).toFixed(1)}
                </div>
              )}
            </div>
            {latestMetric.notes && (
              <p className="text-sm text-[var(--ds-text-secondary)] mt-2">{latestMetric.notes}</p>
            )}
          </div>
        )}

        {/* Recent Readings */}
        {metrics && metrics.length > 1 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Recent Readings</h4>
            {metrics.slice(1).map((metric) => (
              <div key={metric.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="font-medium">{metric.value} {metric.unit}</span>
                  <span className="text-sm text-[var(--ds-text-secondary)] ml-2">
                    {new Date(metric.recordedAt).toLocaleDateString()}
                  </span>
                </div>
                {metric.notes && (
                  <Badge variant="outline" className="text-xs">
                    Note
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!metrics || metrics.length === 0 && (
          <div className="text-center py-8">
            <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-[var(--ds-text-secondary)] mb-4">No {metricType} data recorded yet</p>
            {showAddButton && (
              <Button onClick={() => setShowAddForm(true)} size="sm">
                <Icon name="plus" className="w-4 h-4 mr-2" />
                Add First Reading
              </Button>
            )}
          </div>
        )}

        {/* Quick Add Form */}
        {showAddForm && (
          <QuickAddForm
            metricType={metricType}
            unit={getUnitForType(metricType)}
            onSubmit={handleAddMetric}
            onCancel={() => setShowAddForm(false)}
            loading={creating}
          />
        )}
      </div>
    </UniversalCard>
  )
}

interface QuickAddFormProps {
  metricType: string
  unit: string
  onSubmit: (value: string, notes?: string) => void
  onCancel: () => void
  loading: boolean
}

function QuickAddForm({ metricType, unit, onSubmit, onCancel, loading }: QuickAddFormProps) {
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value, notes.trim() || undefined)
    }
  }

  return (
    <div className="border border-[var(--ds-border-default)] rounded-lg p-4 bg-[var(--ds-surface-primary)]">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {metricType.charAt(0).toUpperCase() + metricType.slice(1)} ({unit})
          </label>
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
            placeholder={`Enter ${metricType} value`}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
            placeholder="Add any notes..."
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            size="sm" 
            disabled={loading || !value.trim()}
            className="flex-1"
          >
            {loading ? 'Adding...' : 'Add Reading'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}