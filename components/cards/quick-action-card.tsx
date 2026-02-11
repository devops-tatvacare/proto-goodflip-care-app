"use client"

import React from "react"
import { Icon } from '@/components/ui/icon'
import { Button } from "@/components/ui/button"

export interface QuickActionCardData {
  id: string
  icon?: React.ElementType
  iconColor?: string
  bgColor?: string
  title: string
  metric?: string | number
  metricLabel?: string
  image?: React.ReactElement<{ src?: string }> // For custom image/avatar components
  buttonText?: string
  onClick?: () => void
}

interface QuickActionCardProps {
  data: QuickActionCardData
}

export function QuickActionCard({ data }: QuickActionCardProps) {
  const { 
    icon: IconComponent, 
    iconColor = "var(--app-primary)",
    bgColor = "var(--surface-elevated)",
    title, 
    metric, 
    metricLabel,
    image,
    buttonText,
    onClick
  } = data

  return (
    <div
      className="relative flex flex-col rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      style={{
        minWidth: "90px",
        maxWidth: "90px",
        height: "120px",
        backgroundColor: bgColor,
        backdropFilter: "blur(10px)",
        border: "1px solid var(--overlay-border)"
      }}
      onClick={onClick}
    >
      {/* Image/Icon Section - Everything except fixed text section */}
      <div 
        className="flex items-center justify-center flex-1"
        style={{ 
          backgroundColor: image ? "transparent" : `${iconColor}10`,
        }}
      >
        {image ? (
          image.props?.src?.includes('/images/') ? (
            // External images: stretch to fill bounds
            <div className="w-full h-full overflow-hidden">
              {image}
            </div>
          ) : (
            // Custom components like KairaAvatar: keep centered and scaled
            <div className="w-full h-full flex items-center justify-center">
              <div className="scale-75">
                {image}
              </div>
            </div>
          )
        ) : IconComponent ? (
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: `${iconColor}20`,
            }}
          >
            <IconComponent 
              className="w-5 h-5" 
              style={{ color: iconColor }}
            />
          </div>
        ) : null}
      </div>

      {/* Fixed Text Section */}
      <div className="flex flex-col items-center justify-center px-2 py-2 flex-shrink-0"
           style={{ 
             height: "32px",
             backgroundColor: buttonText === "Ask Kaira" ? "transparent" : "var(--app-primary)",
             borderTop: buttonText === "Ask Kaira" ? "none" : "1px solid var(--overlay-border-light)"
           }}>
        {buttonText ? (
          buttonText === "Ask Kaira" ? (
            <div 
              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-[var(--ds-text-inverse)] px-1.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              <span className="whitespace-nowrap">Ask Kaira</span>
            </div>
          ) : (
            <Button
              size="sm"
              className="h-6 px-2.5 text-[10px] font-medium rounded-lg w-full"
              style={{
                backgroundColor: "var(--app-primary)",
                color: "var(--ds-text-inverse)"
              }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              {buttonText}
            </Button>
          )
        ) : (
          <div className="text-center w-full">
            <h4 className="text-[10px] font-semibold text-[var(--ds-text-inverse)] leading-tight line-clamp-2">
              {title}
            </h4>
            {metric !== undefined && (
              <p className="text-[9px] text-[var(--ds-text-inverse)] opacity-80 mt-0.5">
                {metric} {metricLabel}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}