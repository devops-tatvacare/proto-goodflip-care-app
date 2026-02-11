"use client"

import { motion } from "framer-motion"
import { Icon } from '@/components/ui/icon'

interface HealthJourney2CardProps {
  className?: string
  onNavigateToDetail?: () => void
}

export function HealthJourney2Card({ className, onNavigateToDetail }: HealthJourney2CardProps) {
  // Program data
  const programData = {
    currentDay: 30,
    totalDays: 120,
    programName: "SLIMVIDA Weight Management",
    phase: "Momentum Building",
    phaseDescription: "Active weight loss phase",
    progressPercentage: Math.round((30 / 120) * 100),
    
    achievements: [
      { text: "5.2kg weight loss", achieved: true },
      { text: "92% medication adherence", achieved: true },
      { text: "A1C improved to 6.9%", achieved: true }
    ],
    
    nextGoals: [
      { text: "Reach 7kg by Day 45", deadline: "15 days" },
      { text: "A1C retest scheduled", deadline: "3 weeks" }
    ],
    
    daysRemaining: 120 - 30
  }

  return (
    <div className={className}>
      <div
        className="rounded-lg border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{
          background: "var(--overlay-bg)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--primary-alpha-15)"
        }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--primary-alpha-15)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                <Icon name="calendar" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
              </div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Program Status
              </h3>
            </div>
            {onNavigateToDetail && (
              <motion.button
                onClick={onNavigateToDetail}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name="chevronRight" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress Section - Layout like reference */}
        <div className="px-4 pt-4 pb-4">
          <div className="flex items-center gap-6 mb-4">
            {/* Progress Ring - Left Side */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  stroke="var(--primary-alpha-10)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="32" cy="32" r="28"
                  stroke="var(--app-primary)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: programData.progressPercentage / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    pathLength: programData.progressPercentage / 100,
                    strokeDasharray: "1 1",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={{ color: "var(--app-primary)" }}>
                  {programData.progressPercentage}%
                </span>
              </div>
            </div>

            {/* Day Counter - Right Side */}
            <div className="flex-1">
              <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {programData.currentDay} / {programData.totalDays} Days
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {programData.daysRemaining} days left
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Goals - Reference Layout */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--status-success)" }}>
                  <Icon name="checkCircle" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Achieved</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-2 bg-blue-600 flex-shrink-0" />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>5.2 kg weight loss</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-sm bg-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[var(--ds-surface-primary)] rounded-sm" />
                    </div>
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>92% medication adherence</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-2 bg-blue-600 flex-shrink-0" />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>A1C improved to 6.9%</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--app-primary)" }}>
                  <Icon name="target" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Next</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-2 bg-blue-600 flex-shrink-0" />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>Reach 7 kg by Day 45</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-2 bg-blue-600 flex-shrink-0" />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>A1C retest scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}