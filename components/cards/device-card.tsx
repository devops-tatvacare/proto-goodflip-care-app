"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'
import { ConnectionIndicator } from "@/components/ui/connection-indicator"
import { TrendIcon } from "@/components/ui/trend-icon"
import { getBatteryColor } from "@/lib/utils/status"
import type { Device } from "@/lib/constants/devices"

interface DeviceCardProps {
  device: Device
  onClick?: () => void
  compact?: boolean
}

export function DeviceCard({ device, onClick, compact = false }: DeviceCardProps) {
  const IconComponent = device.icon

  return (
    <Card
      className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl cursor-pointer hover:bg-[var(--ds-surface-secondary)] transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${device.bgColor}`}>
            <IconComponent className={`w-5 h-5 ${device.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-800 truncate">{device.name}</h3>
              <ConnectionIndicator isConnected={device.isConnected} />
            </div>

            <p className="text-sm text-[var(--ds-text-secondary)] mb-1">
              {device.brand} {device.model}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--ds-text-secondary)]">{device.lastSync}</span>
              {device.batteryLevel && (
                <div className="flex items-center gap-1">
                  <Icon name="battery" className={`w-3 h-3 ${getBatteryColor(device.batteryLevel)}`} />
                  <span className="text-xs text-[var(--ds-text-secondary)]">{device.batteryLevel}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!compact && device.stats && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {device.stats.slice(0, 3).map((stat, index) => (
              <div key={index} className="text-center flex-1">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-semibold text-gray-800">{stat.value}</span>
                  <span className="text-xs text-[var(--ds-text-secondary)]">{stat.unit}</span>
                  <TrendIcon trend={stat.trend} />
                </div>
                <span className="text-xs text-[var(--ds-text-secondary)]">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
