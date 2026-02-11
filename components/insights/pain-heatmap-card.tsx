"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'

interface PainPoint {
  x: number
  y: number
  intensity: number
  area: string
  frequency: number
}

interface PainHeatmapCardProps {
  onDrillDown?: () => void
}

export function PainHeatmapCard({ onDrillDown }: PainHeatmapCardProps) {
  const [viewMode, setViewMode] = useState<"front" | "back">("front")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "3months">("week")
  const [showTooltip, setShowTooltip] = useState<{ x: number, y: number, data: PainPoint } | null>(null)

  // Sample pain data with coordinates relative to body silhouette
  const painData: Record<"front" | "back", PainPoint[]> = {
    front: [
      { x: 50, y: 15, intensity: 8, area: "Head", frequency: 12 },
      { x: 45, y: 18, intensity: 6, area: "Head (L)", frequency: 8 },
      { x: 50, y: 35, intensity: 5, area: "Shoulders", frequency: 5 },
      { x: 48, y: 45, intensity: 3, area: "Chest", frequency: 2 },
    ],
    back: [
      { x: 50, y: 18, intensity: 6, area: "Neck", frequency: 10 },
      { x: 50, y: 45, intensity: 9, area: "Lower Back", frequency: 15 },
      { x: 48, y: 40, intensity: 7, area: "Mid Back", frequency: 8 },
    ]
  }

  const currentPainScore = 8.5
  const totalEpisodes = viewMode === "front" 
    ? painData.front.reduce((sum, p) => sum + p.frequency, 0)
    : painData.back.reduce((sum, p) => sum + p.frequency, 0)

  const topAreas = [...painData.front, ...painData.back]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3)

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setViewMode(prev => prev === "front" ? "back" : "front")

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 7) return "rgba(239, 68, 68, 0.7)" // Red
    if (intensity >= 4) return "rgba(251, 146, 60, 0.7)" // Orange
    return "rgba(250, 204, 21, 0.7)" // Yellow
  }

  const getIntensitySize = (intensity: number) => {
    return 20 + (intensity * 4)
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <Icon name="glucose" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--card-header-text)]">
              Pain Pattern Insights
            </h3>
          </div>
          <button 
            onClick={onDrillDown}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="chevronRight" className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Control Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Icon name="rotate" className="w-4 h-4 text-[var(--ds-text-secondary)] group-hover:text-[var(--app-primary)]" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Icon name="zoom" className="w-4 h-4 text-[var(--ds-text-secondary)] group-hover:text-[var(--app-primary)]" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Icon name="zoomOut" className="w-4 h-4 text-[var(--ds-text-secondary)] group-hover:text-[var(--app-primary)]" />
            </button>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="text-xs px-2 py-1 rounded-lg border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] text-[var(--text-secondary)]"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="3months">3 Months</option>
          </select>
        </div>

        {/* Main Body View with Heatmap */}
        <div className="flex gap-4">
          {/* Body Silhouette with Heatmap */}
          <div className="flex-1">
            <div 
              className="relative bg-gray-50 rounded-lg p-4 overflow-hidden"
              style={{ height: "200px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  className="relative w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, rotateY: viewMode === "back" ? -180 : 0 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {/* Body Outline */}
                  <svg 
                    viewBox="0 0 100 160" 
                    className="w-full h-full max-w-[100px]"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                  >
                    {/* Simple body silhouette */}
                    <path
                      d={viewMode === "front" 
                        ? "M50 10 C45 10 42 15 42 20 C42 25 45 28 45 35 L35 45 C30 48 30 52 33 55 L37 52 L40 65 L38 90 L35 130 L38 155 L45 155 L47 130 L50 110 L53 130 L55 155 L62 155 L65 130 L62 90 L60 65 L63 52 L67 55 C70 52 70 48 65 45 L55 35 C55 28 58 25 58 20 C58 15 55 10 50 10"
                        : "M50 10 C45 10 42 15 42 20 C42 25 45 28 45 35 L38 45 C33 48 33 52 36 55 L39 52 L40 65 L38 90 L35 130 L38 155 L45 155 L47 130 L50 110 L53 130 L55 155 L62 155 L65 130 L62 90 L60 65 L61 52 L64 55 C67 52 67 48 62 45 L55 35 C55 28 58 25 58 20 C58 15 55 10 50 10"
                      }
                      fill="rgba(229, 231, 235, 0.8)"
                      stroke="rgba(156, 163, 175, 0.5)"
                      strokeWidth="1"
                    />
                    
                    {/* Head indicator */}
                    <circle cx="50" cy="18" r="8" fill="white" opacity="0.9" />
                    {viewMode === "front" && <circle cx="47" cy="17" r="1" fill="var(--gray-400)" />}
                    {viewMode === "front" && <circle cx="53" cy="17" r="1" fill="var(--gray-400)" />}
                  </svg>

                  {/* Pain Heat Points Overlay */}
                  {painData[viewMode].map((point, index) => (
                    <motion.div
                      key={`${viewMode}-${index}`}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setShowTooltip({ x: point.x, y: point.y, data: point })}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <div
                        className="rounded-full animate-pulse"
                        style={{
                          width: `${getIntensitySize(point.intensity)}px`,
                          height: `${getIntensitySize(point.intensity)}px`,
                          backgroundColor: getIntensityColor(point.intensity),
                          filter: "blur(4px)",
                        }}
                      />
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          width: `${getIntensitySize(point.intensity) * 0.6}px`,
                          height: `${getIntensitySize(point.intensity) * 0.6}px`,
                          backgroundColor: getIntensityColor(point.intensity),
                        }}
                      />
                    </motion.div>
                  ))}

                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-10 bg-[var(--ds-surface-primary)] rounded-lg shadow-lg p-2 text-xs"
                        style={{
                          left: `${showTooltip.x}%`,
                          top: `${showTooltip.y - 15}%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="font-semibold">{showTooltip.data.area}</div>
                        <div className="text-[var(--ds-text-secondary)]">Intensity: {showTooltip.data.intensity}/10</div>
                        <div className="text-[var(--ds-text-secondary)]">{showTooltip.data.frequency} episodes</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>

              {/* View Label */}
              <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full"
                   style={{ 
                     backgroundColor: "rgba(39, 116, 174, 0.1)",
                     color: "var(--app-primary)"
                   }}>
                {viewMode === "front" ? "Front" : "Back"}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="w-[140px] space-y-3">
            {/* Pain Score */}
            <div className="p-2 rounded-lg bg-gray-50">
              <div className="text-xs text-[var(--ds-text-secondary)] mb-1">Pain Score</div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold" style={{ color: "var(--app-primary)" }}>
                  {currentPainScore}
                </span>
                <span className="text-xs text-[var(--ds-text-secondary)]">/10</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getIntensityColor(currentPainScore) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPainScore * 10}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Most Affected */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-[var(--ds-text-secondary)]">Most Affected:</div>
              {topAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">• {area.area}</span>
                  <span className="font-medium text-[var(--text-secondary)]">
                    {area.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Insights */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg"
             style={{ backgroundColor: "rgba(39, 116, 174, 0.05)" }}>
          <div className="flex items-center gap-2">
            <Icon name="trendingUp" className="w-3 h-3" style={{ color: "var(--app-primary)" }} />
            <span className="text-xs text-[var(--text-secondary)]">
              Patterns: Morning ↑40% | Stress-related ↑25%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDrillDown}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "var(--app-primary)",
              color: "var(--ds-text-inverse)"
            }}
          >
            🔍 Drill Down
          </button>
          <button
            className="px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--ds-surface-secondary)]"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)"
            }}
          >
            📊 Analytics
          </button>
          <button
            className="px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--ds-surface-secondary)]"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)"
            }}
          >
            💊 Meds
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
