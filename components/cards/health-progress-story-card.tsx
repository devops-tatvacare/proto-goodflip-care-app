"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from '@/components/ui/icon'

interface HealthProgressStoryCardProps {
  className?: string
  onNavigateToDetail?: () => void
}

// Memoized progress bar component to prevent re-renders
const ProgressBar = ({ metric, delay = 0 }: { metric: any, delay?: number }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
          {metric.label}
        </span>
        <span className="text-sm font-bold" style={{ color: metric.color }}>
          {metric.value}% {metric.trend}
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ backgroundColor: "var(--primary-alpha-10)" }}>
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: metric.color }}
          initial={{ width: 0 }}
          animate={{ width: `${metric.progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay }}
        />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        {metric.description}
      </p>
    </div>
  )
}

// Unified card component for both milestones and achievements
const UnifiedCard = ({ item, type }: { item: any, type: 'milestone' | 'achievement' }) => {
  // Icon mapping for achievements
  const getAchievementIcon = (text: string) => {
    if (text.includes('adherence') || text.includes('medication')) return Activity
    if (text.includes('glucose') || text.includes('blood')) return Heart
    if (text.includes('weight') || text.includes('kg')) return TrendingDown
    return Check
  }

  const getTargetIcon = (iconName: string) => {
    switch(iconName) {
      case '🎯': return Award
      case '📈': return TrendingUp
      case '💪': return Activity
      default: return BookOpen
    }
  }

  if (type === 'achievement') {
    const IconComponent = getAchievementIcon(item)
    return (
      <div 
        className="flex items-center gap-3 p-2 rounded-lg border border-[var(--ds-border-default)] hover:border-blue-300 hover:shadow-sm transition-all duration-200"
        style={{ 
          backgroundColor: "var(--surface-glass)",
          backdropFilter: "blur(4px)",
          boxShadow: "0 1px 3px var(--black-alpha-10)"
        }}
      >
        <IconComponent className="w-4 h-4 flex-shrink-0 text-[var(--status-success)]" />
        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
          {item}
        </span>
      </div>
    )
  }

  // Milestone card remains full-featured
  const IconComponent = getTargetIcon(item.icon)
  return (
    <div 
      className="flex-shrink-0 p-4 rounded-xl border border-[var(--ds-border-default)] hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{ 
        backgroundColor: "var(--surface-glass)",
        backdropFilter: "blur(8px)",
        width: '280px',
        boxShadow: "0 2px 8px var(--black-alpha-10)"
      }}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 flex-shrink-0" style={{ color: "var(--app-primary)" }} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>
            {item.title}
          </h4>
          <p className="text-xs leading-relaxed mb-2 text-[var(--text-secondary)]">
            {item.content}
          </p>
          {item.progress && (
            <div className="text-xs font-medium px-2 py-1 rounded-full" 
                 style={{ 
                   color: "var(--app-primary)",
                   backgroundColor: "var(--primary-alpha-10)"
                 }}>
              {item.progress}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HealthProgressStoryCard({ className, onNavigateToDetail }: HealthProgressStoryCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showMilestones, setShowMilestones] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Static data - no need to recalculate
  const storyData = useMemo(() => ({
    currentProgress: {
      weightLoss: { value: 12, description: "5.2kg lost", color: "var(--status-success)" },
      bloodSugar: { value: 15, description: "A1C: 6.9%", color: "var(--app-primary)" },
      adherence: { value: 92, description: "138/150 doses", color: "var(--app-secondary)" }
    },
    weeklyWins: [
      "Perfect medication adherence (7/7 days)",
      "Morning glucose average: 118 mg/dL", 
      "Lost 0.7kg - consistent progress!"
    ]
  }), [])

  // Memoized progress metrics to prevent recalculation
  const progressMetrics = useMemo(() => [
    {
      label: "Weight Loss",
      value: storyData.currentProgress.weightLoss.value,
      trend: "↓",
      progress: (storyData.currentProgress.weightLoss.value / 15) * 100,
      color: storyData.currentProgress.weightLoss.color,
      description: storyData.currentProgress.weightLoss.description
    },
    {
      label: "Blood Sugar Control",
      value: storyData.currentProgress.bloodSugar.value,
      trend: "↓",
      progress: (storyData.currentProgress.bloodSugar.value / 20) * 100,
      color: storyData.currentProgress.bloodSugar.color,
      description: storyData.currentProgress.bloodSugar.description
    },
    {
      label: "Treatment Compliance",
      value: storyData.currentProgress.adherence.value,
      trend: "✓",
      progress: storyData.currentProgress.adherence.value,
      color: storyData.currentProgress.adherence.color,
      description: storyData.currentProgress.adherence.description
    }
  ], [storyData])

  // Combined milestone-based messaging (stories + next milestone)
  const milestones = useMemo(() => [
    {
      icon: "🎯",
      title: "Current Target",
      content: "15% weight loss goal - you're 80% there with only 2.3kg to go. Excellent progress since March!",
      progress: "80% complete",
      progressLabel: "Weight loss target",
      category: "next milestone"
    },
    {
      icon: "📈",
      title: "Transformation Journey", 
      content: `Remarkable ${storyData.currentProgress.weightLoss.value}% weight reduction achieved through consistent dedication to your health plan.`,
      category: "weight management"
    },
    {
      icon: "💪",
      title: "Clinical Excellence",
      content: `A1C improved to ${storyData.currentProgress.bloodSugar.description.split(': ')[1]} with ${storyData.currentProgress.adherence.value}% treatment compliance. Outstanding results!`,
      category: "clinical success"
    }
  ], [storyData])

  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev)
  }, [])

  const toggleMilestones = useCallback(() => {
    setShowMilestones(prev => !prev)
  }, [])

  return (
    <div className={className}>
      <div
        className="rounded-lg border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{
          background: "var(--overlay-bg)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header - Simplified, no dots */}
        <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--primary-alpha-15)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                <Icon name="bookOpen" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
              </div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Your Health Journey
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

        {/* 1. Progress Overview - Start directly with progress bars */}
        <div className="px-4 pt-3 pb-3">
          <div className="space-y-3">
            {progressMetrics.map((metric, index) => (
              <ProgressBar 
                key={metric.label}
                metric={metric}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>

        {/* 2. Health Milestones - Collapsible */}
        <div className="px-4 py-3">
          <button
            onClick={toggleMilestones}
            className="w-full p-3 rounded-md hover:opacity-80 transition-opacity text-center"
            style={{ backgroundColor: "var(--primary-alpha-8)", backdropFilter: "blur(4px)" }}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="trendingUp" className="w-4 h-4" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Health Milestones
              </span>
              <motion.div
                animate={{ rotate: showMilestones ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon name="chevronDown" className="w-3 h-3 text-[var(--text-secondary)]" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {showMilestones && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 relative">
                  <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {milestones.map((milestone, index) => (
                      <UnifiedCard 
                        key={index}
                        item={milestone}
                        type="milestone"
                      />
                    ))}
                  </div>
                  
                  {/* Right scroll indicator */}
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: "var(--primary-alpha-10)",
                        backdropFilter: "blur(4px)"
                      }}
                    >
                      <span className="text-[var(--ds-text-secondary)] text-sm">→</span>
                    </div>
                  </div>
                  
                  {/* Fade overlay on right */}
                  <div 
                    className="absolute right-0 top-0 bottom-2 w-12 pointer-events-none"
                    style={{
                      background: "linear-gradient(to left, rgba(255,255,255,0.8), transparent)"
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Weekly Achievements - Expandable */}
        <div className="px-4 pb-3">
          <button
            onClick={toggleDetails}
            className="w-full p-3 rounded-md hover:opacity-80 transition-opacity text-center"
            style={{ backgroundColor: "var(--primary-alpha-8)", backdropFilter: "blur(4px)" }}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="check" className="w-4 h-4" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Key Wins This Week
              </span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon name="chevronDown" className="w-3 h-3 text-[var(--text-secondary)]" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {storyData.weeklyWins.map((win, index) => (
                    <UnifiedCard 
                      key={index}
                      item={win}
                      type="achievement"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Static */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1 justify-center">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-info)" }} />
            <p className="text-xs text-[var(--text-secondary)]">
              Your personal health story
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
