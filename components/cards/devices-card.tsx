"use client"

import { Icon } from '@/components/ui/icon'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Device {
  id: string
  name: string
  type: "blood-pressure" | "glucose"
  connected: boolean
}

interface DevicesCardProps {
  devices?: Device[]
  onDeviceView?: (deviceId: string) => void
}

export function DevicesCard({ devices = [], onDeviceView }: DevicesCardProps) {
  const defaultDevices: Device[] = [
    {
      id: "bp-monitor",
      name: "Blood Pressure Monitor",
      type: "blood-pressure",
      connected: true,
    },
    {
      id: "glucose-monitor",
      name: "Glucose Monitor",
      type: "glucose",
      connected: true,
    },
  ]

  const displayDevices = devices.length > 0 ? devices : defaultDevices

  const getIcon = (type: string) => {
    switch (type) {
      case "blood-pressure":
        return (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
               style={{ backgroundColor: "var(--icon-bg-primary)" }}>
            <Icon name="heart" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
          </div>
        )
      case "glucose":
        return (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md"
               style={{ backgroundColor: "var(--icon-bg-primary)" }}>
            <Icon name="waterDrop" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
          </div>
        )
      default:
        return <Icon name="heart" className="w-4 h-4 text-[var(--ds-text-secondary)]" />
    }
  }

  const handleDeviceView = (deviceId: string) => {
    if (onDeviceView) {
      onDeviceView(deviceId)
    }
  }

  return (
    <Card className="bg-[var(--ds-surface-primary)] border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h3 className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
            <Icon name="heart" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
          </div>
          Your Devices
        </h3>
      </div>
      <CardContent className="px-4 pt-0 pb-3">

        {/* Device Items */}
        <div className="space-y-1">
          {displayDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-2 hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {getIcon(device.type)}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{device.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${device.connected ? "bg-[var(--ds-status-success)]" : "bg-[var(--ds-status-error)]"}`} />
                    <span className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">{device.connected ? "Connected" : "Disconnected"}</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
                onClick={() => handleDeviceView(device.id)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
