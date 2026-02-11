"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from '@/components/ui/icon'

interface PainPoint {
  x: number
  y: number
  intensity: number
  area: string
  frequency: number
}

export function PainMapView() {
  const [viewMode, setViewMode] = useState<"front" | "back">("front")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "3months">("week")
  const [hoveredPoint, setHoveredPoint] = useState<PainPoint | null>(null)

  // Sample pain data with coordinates relative to body silhouette (200x240 viewBox)
  const painData: Record<"front" | "back", PainPoint[]> = {
    front: [
      { x: 50, y: 10, intensity: 8, area: "Head", frequency: 12 },
      { x: 45, y: 12, intensity: 6, area: "Head (L)", frequency: 8 },
      { x: 50, y: 20, intensity: 5, area: "Neck", frequency: 5 },
      { x: 40, y: 25, intensity: 7, area: "Left Shoulder", frequency: 10 },
      { x: 60, y: 25, intensity: 6, area: "Right Shoulder", frequency: 8 },
      { x: 50, y: 35, intensity: 4, area: "Upper Chest", frequency: 6 },
      { x: 48, y: 45, intensity: 3, area: "Chest", frequency: 2 },
      { x: 32, y: 35, intensity: 5, area: "Left Arm", frequency: 4 },
      { x: 50, y: 55, intensity: 6, area: "Abdomen", frequency: 9 },
      { x: 45, y: 65, intensity: 4, area: "Left Hip", frequency: 3 },
    ],
    back: [
      { x: 50, y: 10, intensity: 6, area: "Head", frequency: 8 },
      { x: 50, y: 20, intensity: 7, area: "Neck", frequency: 10 },
      { x: 42, y: 25, intensity: 8, area: "Left Shoulder", frequency: 12 },
      { x: 58, y: 25, intensity: 7, area: "Right Shoulder", frequency: 11 },
      { x: 50, y: 35, intensity: 9, area: "Upper Back", frequency: 15 },
      { x: 47, y: 45, intensity: 8, area: "Mid Back", frequency: 13 },
      { x: 50, y: 55, intensity: 9, area: "Lower Back", frequency: 18 },
      { x: 45, y: 60, intensity: 5, area: "Left Hip", frequency: 6 },
      { x: 55, y: 60, intensity: 6, area: "Right Hip", frequency: 7 },
    ]
  }

  const currentPainScore = 7.2
  const totalEpisodes = [...painData.front, ...painData.back]
    .reduce((sum, p) => sum + p.frequency, 0)

  const topAreas = [...painData.front, ...painData.back]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3)

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setViewMode(prev => prev === "front" ? "back" : "front")

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 7) return "var(--red-alpha-25)" // Red - reduced opacity
    if (intensity >= 4) return "var(--orange-alpha-25)" // Orange - reduced opacity
    return "var(--yellow-alpha-25)" // Yellow - reduced opacity
  }

  const getIntensitySize = (intensity: number) => {
    return 12 + (intensity * 2) // Reduced size: smaller base + smaller multiplier
  }

  return (
    <div className="h-full flex flex-col" style={{ minHeight: "400px" }}>
      {/* Control Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg bg-[var(--ds-surface-primary)]/80 hover:bg-[var(--ds-surface-primary)] transition-colors group shadow-sm"
          >
            <Icon name="rotate" className="w-4 h-4 text-[var(--ds-text-secondary)] group-hover:text-[var(--app-primary)]" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-[var(--ds-surface-primary)]/80 hover:bg-[var(--ds-surface-primary)] transition-colors group shadow-sm"
          >
            <Icon name="zoom" className="w-4 h-4 text-[var(--ds-text-secondary)] group-hover:text-[var(--app-primary)]" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-[var(--ds-surface-primary)]/80 hover:bg-[var(--ds-surface-primary)] transition-colors group shadow-sm"
          >
            <Icon name="zoomOut" className="w-4 h-4 text-[var(--ds-text-secondary)] group-hover:text-[var(--app-primary)]" />
          </button>
          <div className="ml-2 px-2 py-1 rounded-lg bg-[var(--ds-surface-primary)]/80 shadow-sm">
            <span className="text-xs font-medium text-[var(--app-primary)]">
              {viewMode === "front" ? "Front View" : "Back View"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)]/90 shadow-sm text-[var(--text-secondary)]"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Body Silhouette with Heatmap - Full Width */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-50/50 to-white rounded-xl p-8 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: "350px" }}
          >
            <div style={{ transform: `scale(${zoomLevel})` }} className="transition-transform duration-200">
              {/* Body Silhouette - Professional Quality */}
              <svg 
                viewBox="0 0 200 240" 
                className="w-full h-full"
                style={{ 
                  maxWidth: "200px",
                  filter: "drop-shadow(0 4px 8px var(--black-alpha-10))"
                }}
              >
                <defs>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: 'var(--gray-100)', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: 'var(--gray-200)', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: 'var(--gray-300)', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="bodyGradientBack" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: 'var(--gray-300)', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: 'var(--gray-200)', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: 'var(--gray-100)', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: 'var(--gray-400)', stopOpacity: 0.2}} />
                    <stop offset="50%" style={{stopColor: 'var(--gray-500)', stopOpacity: 0.4}} />
                    <stop offset="100%" style={{stopColor: 'var(--gray-400)', stopOpacity: 0.2}} />
                  </linearGradient>
                </defs>

                {viewMode === "front" ? (
                  // Front view
                  <g>
                    {/* Head */}
                    <path 
                      d="M 85 15 C 85 8, 92 5, 100 5 C 108 5, 115 8, 115 15 L 115 25 C 115 32, 108 38, 100 38 C 92 38, 85 32, 85 25 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Neck */}
                    <path 
                      d="M 94 38 C 94 38, 96 40, 100 40 C 104 40, 106 38, 106 38 L 106 47 C 106 47, 103 48, 100 48 C 97 48, 94 47, 94 47 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Shoulders and Upper Torso */}
                    <path 
                      d="M 65 55 C 70 50, 80 47, 94 47 L 106 47 C 120 47, 130 50, 135 55 C 135 65, 132 75, 128 85 L 125 95 C 120 96, 110 97, 100 97 C 90 97, 80 96, 75 95 L 72 85 C 68 75, 65 65, 65 55 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Abdomen and Waist */}
                    <path 
                      d="M 75 95 C 80 93, 90 92, 100 92 C 110 92, 120 93, 125 95 C 126 110, 125 125, 123 140 C 120 150, 115 155, 100 155 C 85 155, 80 150, 77 140 C 75 125, 74 110, 75 95 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Left Arm */}
                    <path 
                      d="M 65 55 C 60 58, 55 65, 52 75 C 50 85, 52 95, 48 105 C 45 115, 42 125, 40 130 C 38 132, 38 134, 40 135 C 45 135, 50 132, 52 125 C 54 115, 56 105, 58 95 C 60 85, 62 75, 65 65 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Right Arm */}
                    <path 
                      d="M 135 55 C 140 58, 145 65, 148 75 C 150 85, 148 95, 152 105 C 155 115, 158 125, 160 130 C 162 132, 162 134, 160 135 C 155 135, 150 132, 148 125 C 146 115, 144 105, 142 95 C 140 85, 138 75, 135 65 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Left Leg */}
                    <path 
                      d="M 85 155 C 85 155, 82 160, 82 170 C 82 185, 84 200, 85 215 C 86 225, 88 230, 90 232 C 92 233, 94 233, 96 232 C 98 230, 100 225, 101 215 C 102 200, 100 185, 100 170 C 100 160, 97 155, 97 155 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Right Leg */}
                    <path 
                      d="M 115 155 C 115 155, 118 160, 118 170 C 118 185, 116 200, 115 215 C 114 225, 112 230, 110 232 C 108 233, 106 233, 104 232 C 102 230, 100 225, 99 215 C 98 200, 100 185, 100 170 C 100 160, 103 155, 103 155 Z" 
                      fill="url(#bodyGradient)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Collar bone */}
                    <line x1="88" y1="52" x2="112" y2="52" stroke="var(--gray-400)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Waist indication */}
                    <line x1="80" y1="115" x2="120" y2="115" stroke="var(--gray-400)" strokeWidth="0.5" opacity="0.2"/>
                  </g>
                ) : (
                  // Back view
                  <g>
                    {/* Head */}
                    <path 
                      d="M 85 15 C 85 8, 92 5, 100 5 C 108 5, 115 8, 115 15 L 115 28 C 115 35, 108 38, 100 38 C 92 38, 85 35, 85 28 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Neck */}
                    <path 
                      d="M 94 38 C 94 38, 96 40, 100 40 C 104 40, 106 38, 106 38 L 106 47 C 106 47, 103 48, 100 48 C 97 48, 94 47, 94 47 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Upper Back and Shoulders */}
                    <path 
                      d="M 65 55 C 70 50, 80 47, 94 47 L 106 47 C 120 47, 130 50, 135 55 C 135 65, 132 75, 128 85 C 125 95, 122 102, 120 108 L 125 108 C 120 110, 110 112, 100 112 C 90 112, 80 110, 75 108 L 80 108 C 78 102, 75 95, 72 85 C 68 75, 65 65, 65 55 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Lower Back and Buttocks */}
                    <path 
                      d="M 80 108 C 85 110, 92 112, 100 112 C 108 112, 115 110, 120 108 C 122 120, 125 135, 123 145 C 120 155, 115 160, 100 160 C 85 160, 80 155, 77 145 C 75 135, 78 120, 80 108 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Spine */}
                    <path 
                      d="M 100 40 C 100 40, 99 50, 99 65 C 99 80, 100 95, 101 110 C 101 125, 100 140, 100 150" 
                      fill="none" 
                      stroke="url(#spineGradient)" 
                      strokeWidth="1.5"
                    />
                    
                    {/* Shoulder blades */}
                    <path 
                      d="M 85 60 C 88 65, 92 70, 95 75 C 92 70, 88 65, 85 60" 
                      fill="none" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.5" 
                      opacity="0.3"
                    />
                    <path 
                      d="M 115 60 C 112 65, 108 70, 105 75 C 108 70, 112 65, 115 60" 
                      fill="none" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.5" 
                      opacity="0.3"
                    />
                    
                    {/* Left Arm */}
                    <path 
                      d="M 65 55 C 60 58, 55 65, 52 75 C 50 85, 52 95, 48 105 C 45 115, 42 125, 40 130 C 38 132, 38 134, 40 135 C 45 135, 50 132, 52 125 C 54 115, 56 105, 58 95 C 60 85, 62 75, 65 65 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Right Arm */}
                    <path 
                      d="M 135 55 C 140 58, 145 65, 148 75 C 150 85, 148 95, 152 105 C 155 115, 158 125, 160 130 C 162 132, 162 134, 160 135 C 155 135, 150 132, 148 125 C 146 115, 144 105, 142 95 C 140 85, 138 75, 135 65 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Left Leg */}
                    <path 
                      d="M 85 160 C 85 160, 82 165, 82 175 C 82 190, 84 205, 85 220 C 86 230, 88 235, 90 237 C 92 238, 94 238, 96 237 C 98 235, 100 230, 101 220 C 102 205, 100 190, 100 175 C 100 165, 97 160, 97 160 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Right Leg */}
                    <path 
                      d="M 115 160 C 115 160, 118 165, 118 175 C 118 190, 116 205, 115 220 C 114 230, 112 235, 110 237 C 108 238, 106 238, 104 237 C 102 235, 100 230, 99 220 C 98 205, 100 190, 100 175 C 100 165, 103 160, 103 160 Z" 
                      fill="url(#bodyGradientBack)" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.8"
                    />
                    
                    {/* Lower back curve */}
                    <path 
                      d="M 85 130 C 92 128, 100 128, 115 130" 
                      fill="none" 
                      stroke="var(--gray-400)" 
                      strokeWidth="0.5" 
                      opacity="0.2"
                    />
                  </g>
                )}
              </svg>

              {/* Pain Heat Points Overlay - Positioned absolutely over the SVG */}
              <div className="absolute inset-0 pointer-events-none">
                {painData[viewMode].map((point, index) => (
                  <motion.div
                    key={`${viewMode}-${index}`}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Outer glow - reduced blur */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: `${getIntensitySize(point.intensity) * 1.5}px`,
                        height: `${getIntensitySize(point.intensity) * 1.5}px`,
                        backgroundColor: getIntensityColor(point.intensity),
                        filter: "blur(6px)", // Reduced blur
                        transform: "translate(-50%, -50%)",
                        left: "50%",
                        top: "50%",
                      }}
                    />
                    {/* Inner core - more subtle */}
                    <div
                      className="relative rounded-full"
                      style={{
                        width: `${getIntensitySize(point.intensity)}px`,
                        height: `${getIntensitySize(point.intensity)}px`,
                        backgroundColor: getIntensityColor(point.intensity),
                        opacity: 0.8, // Slightly more transparent
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hover Tooltip */}
            <AnimatePresence>
              {hoveredPoint && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-20 bg-[var(--ds-surface-primary)] rounded-lg shadow-xl p-3 pointer-events-none border border-[var(--ds-border-default)]"
                  style={{
                    left: `${hoveredPoint.x}%`,
                    top: `${hoveredPoint.y - 12}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-gray-800">{hoveredPoint.area}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--ds-text-secondary)]">Intensity:</span>
                      <span className="font-medium">{hoveredPoint.intensity}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--ds-text-secondary)]">Episodes:</span>
                      <span className="font-medium">{hoveredPoint.frequency}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats Cards Below - Vertical layout */}
      <div className="space-y-3">
        {/* Pain Score Card */}
        <div className="bg-[var(--ds-surface-primary)]/90 rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="text-xs text-[var(--ds-text-secondary)] mb-2">Overall Pain Score</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold" style={{ color: "var(--app-primary)" }}>
              {currentPainScore}
            </span>
            <span className="text-xs text-[var(--ds-text-secondary)]">/10</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                backgroundColor: currentPainScore > 7 ? "#EF4444" : currentPainScore > 4 ? "#FB923C" : "#FCD34D",
                width: `${currentPainScore * 10}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${currentPainScore * 10}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Most Affected Areas Card */}
        <div className="bg-[var(--ds-surface-primary)]/90 rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="text-xs text-[var(--ds-text-secondary)] mb-2">Most Affected Areas</div>
          <div className="space-y-1.5">
            {topAreas.slice(0, 3).map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-700 truncate">{area.area}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: getIntensityColor(area.intensity),
                        width: `${(area.frequency / 15) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--ds-text-secondary)] w-4 text-right">
                    {area.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Insights Card */}
        <div className="bg-[var(--ds-surface-primary)]/90 rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="text-xs text-[var(--ds-text-secondary)] mb-2">Pattern Insights</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--ds-text-secondary)]">Total Episodes:</span>
              <span className="font-medium">{totalEpisodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--ds-text-secondary)]">Morning Peak:</span>
              <span className="font-medium text-orange-600">+40%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--ds-text-secondary)]">Stress Related:</span>
              <span className="font-medium text-red-600">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}