"use client"

import type React from "react"
import { Icon } from '@/components/ui/icon'

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  children?: React.ReactNode
  icon?: "water" | "steps" | "sleep"
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 3,
  color = "var(--chart-blue)",
  backgroundColor = "var(--gray-200)",
  children,
  icon,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((value / max) * 100, 100)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getIconComponent = () => {
    switch (icon) {
      case "water":
        return <Icon name="waterDrop" className="w-6 h-6" style={{ color }} />
      case "steps":
        return <Icon name="footprints" className="w-6 h-6" style={{ color }} />
      case "sleep":
        return <Icon name="bedtime" className="w-6 h-6" style={{ color }} />
      default:
        return null
    }
  }

  return (
    <div className={"relative inline-flex items-center justify-center " + (className || "")}> 
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            transformOrigin: "center",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{icon ? getIconComponent() : children}</div>
    </div>
  )
}
