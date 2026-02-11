'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface ModelInfo {
  name: string
  status: 'uninitialized' | 'loading' | 'ready' | 'failed'
  loadTime?: number
  error?: string
}

interface ModelStatus {
  health: 'healthy' | 'degraded' | 'initializing'
  initialized: boolean
  totalModels: number
  ready: number
  failed: number
  loading: number
  models: Record<string, ModelInfo>
}

export function ModelStatusIndicator() {
  const [status, setStatus] = useState<ModelStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/models/status')
        if (!response.ok) throw new Error('Failed to fetch status')
        const data = await response.json()
        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 2000) // Poll every 2 seconds
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <p className="text-red-600 text-sm">Error loading model status: {error}</p>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card className="p-4">
        <p className="text-gray-500 text-sm">Loading model status...</p>
      </Card>
    )
  }

  const getStatusColor = (modelStatus: string) => {
    switch (modelStatus) {
      case 'ready': return 'text-green-600'
      case 'loading': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (modelStatus: string) => {
    switch (modelStatus) {
      case 'ready': return '✅'
      case 'loading': return '🔄'
      case 'failed': return '❌'
      default: return '⏹️'
    }
  }

  const healthColor = {
    'healthy': 'bg-green-100 border-green-300',
    'degraded': 'bg-yellow-100 border-yellow-300',
    'initializing': 'bg-blue-100 border-blue-300'
  }[status.health]

  return (
    <Card className={`p-4 ${healthColor}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">AI Models Status</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            status.health === 'healthy' ? 'bg-green-200 text-green-800' :
            status.health === 'degraded' ? 'bg-yellow-200 text-yellow-800' :
            'bg-blue-200 text-blue-800'
          }`}>
            {status.health.toUpperCase()}
          </span>
        </div>
        
        <div className="text-xs text-gray-600">
          {status.ready}/{status.totalModels} models ready
          {status.failed > 0 && ` • ${status.failed} failed`}
          {status.loading > 0 && ` • ${status.loading} loading`}
        </div>

        <div className="space-y-1">
          {Object.entries(status.models).map(([id, model]) => (
            <div key={id} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span>{getStatusIcon(model.status)}</span>
                <span className="text-gray-700">{model.name}</span>
              </span>
              <span className={`${getStatusColor(model.status)} font-medium`}>
                {model.status.toUpperCase()}
                {model.loadTime && ` (${(model.loadTime / 1000).toFixed(1)}s)`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}