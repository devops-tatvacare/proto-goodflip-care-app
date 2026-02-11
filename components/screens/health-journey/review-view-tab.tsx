"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from '@/components/ui/icon'

export function ReviewViewTab() {
  const [showOverlay, setShowOverlay] = useState(false)
  const programData = {
    title: "Semaglutide Support Program - 90 Day Intensive",
    currentDay: 67,
    totalDays: 90,
    nextMilestone: {
      day: 75,
      title: "Mid-Program Assessment"
    },
    phases: [
      {
        name: "Initiation",
        days: "1-21",
        status: "complete" as const,
        tasks: [
          { name: "Dose titration and tolerance", completed: true },
          { name: "Side effect management", completed: true },
          { name: "Baseline measurements", completed: true }
        ]
      },
      {
        name: "Optimization", 
        days: "22-60",
        status: "complete" as const,
        tasks: [
          { name: "Therapeutic dose achieved", completed: true },
          { name: "Lifestyle integration", completed: true },
          { name: "Initial weight loss targets", completed: true }
        ]
      },
      {
        name: "Maintenance",
        days: "61-90", 
        status: "current" as const,
        tasks: [
          { name: "Long-term adherence strategies", completed: false, current: true },
          { name: "Advanced coaching sessions", completed: false, scheduled: true },
          { name: "Program completion assessment", completed: false }
        ]
      }
    ]
  }

  const journeyMilestones = [
    { icon: (props: any) => <Icon name="calendar" {...props} />, title: "Week 1", description: "Program Start", status: "completed" },
    { icon: (props: any) => <Icon name="link" {...props} />, title: "CGM Link", description: "Device Integration", status: "completed" },
    { icon: (props: any) => <Icon name="vaccines" {...props} />, title: "1st Shot", description: "First Injection", status: "completed" },
    { icon: (props: any) => <Icon name="barChart" {...props} />, title: "Glucose", description: "Range Achievement", status: "completed" },
    { icon: (props: any) => <Icon name="clock" {...props} />, title: "Now", description: "Current Progress", status: "current" },
    { icon: (props: any) => <Icon name="goal" {...props} />, title: "Goal", description: "Weight Target", status: "upcoming" },
    { icon: (props: any) => <Icon name="award" {...props} />, title: "Final", description: "Program Complete", status: "upcoming" }
  ]

  const programProgressPercentage = (programData.currentDay / programData.totalDays) * 100

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }


  const PhaseCard = ({ phase, index }: { phase: any, index: number }) => (
    <motion.div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: phase.status === 'current' ? "rgba(39, 116, 174, 0.05)" : "rgba(255, 255, 255, 0.6)",
        borderColor: phase.status === 'current' ? "var(--app-primary)" : "var(--border-color)",
        backdropFilter: "blur(4px)"
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              backgroundColor: phase.status === 'complete' 
                ? "var(--status-success)" 
                : phase.status === 'current' 
                ? "var(--app-primary)" 
                : "var(--text-muted)",
              color: "var(--ds-text-inverse)"
            }}
          >
            {phase.status === 'complete' ? '✓' : index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Phase {index + 1}: {phase.name}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Days {phase.days}
            </p>
          </div>
        </div>
        <div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: phase.status === 'complete' 
              ? "rgba(34, 197, 94, 0.1)" 
              : phase.status === 'current' 
              ? "rgba(39, 116, 174, 0.1)" 
              : "rgba(156, 163, 175, 0.1)",
            color: phase.status === 'complete' 
              ? "var(--status-success)" 
              : phase.status === 'current' 
              ? "var(--app-primary)" 
              : "var(--text-muted)"
          }}
        >
          {phase.status === 'complete' ? 'Complete' : phase.status === 'current' ? 'Current' : 'Upcoming'}
        </div>
      </div>

      <div className="space-y-2">
        {phase.tasks.map((task: any, taskIndex: number) => (
          <motion.div
            key={taskIndex}
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 + taskIndex * 0.05, duration: 0.2 }}
          >
            {task.completed ? (
              <Icon name="checkCircle" className="w-4 h-4" style={{ color: "var(--status-success)" }} />
            ) : task.current ? (
              <Icon name="clock" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            ) : task.scheduled ? (
              <Icon name="calendar" className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            ) : (
              <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "var(--text-muted)" }} />
            )}
            <span 
              style={{ 
                color: task.completed ? "var(--text-primary)" : task.current ? "var(--app-primary)" : "var(--text-secondary)" 
              }}
            >
              {task.name}
            </span>
            {task.current && (
              <span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "var(--app-primary)", color: "var(--ds-text-inverse)" }}>
                Active
              </span>
            )}
            {task.scheduled && (
              <span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(39, 116, 174, 0.1)", color: "var(--app-primary)" }}>
                Scheduled
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )


  return (
    <div className="relative h-full">
      <motion.div
        className="p-4 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

      {/* Program Overview Header */}
      <motion.div variants={itemVariants} className="space-y-3">
        {/* Header with Info */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Semaglutide Program
          </h2>
          <button
            onClick={() => setShowOverlay(true)}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <Icon name="info" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
          </button>
        </div>

          {/* Milestone Collection Card - Compact */}
          <motion.div 
            className="rounded-lg border shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              borderColor: "var(--border-color)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Card Header */}
            <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: "rgba(39, 116, 174, 0.15)" }}>
              <div className="flex items-center gap-1.5">
                <Icon name="trophy" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Milestones
                </h3>
                <span className="ml-auto text-xs" style={{ color: "var(--text-secondary)" }}>
                  {journeyMilestones.filter(m => m.status === 'completed').length}/7
                </span>
              </div>
            </div>

            {/* Card Body - Compact */}
            <div className="p-3 space-y-3">
              {/* Earned Badges - Horizontal Compact */}
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <span>🏅</span>
                  <span>Earned</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {journeyMilestones.filter(m => m.status === 'completed').map((milestone, index) => {
                    const IconComponent = milestone.icon
                    return (
                      <motion.div 
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 rounded border"
                        style={{ 
                          backgroundColor: "rgba(255, 215, 0, 0.08)",
                          borderColor: "rgba(255, 215, 0, 0.3)"
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          delay: 0.6 + index * 0.05,
                          type: "spring",
                          stiffness: 300
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-xs">🏅</span>
                        <IconComponent className="w-3 h-3" style={{ color: "#B8860B" }} />
                        <span className="text-xs font-medium" style={{ color: "#B8860B" }}>
                          {milestone.title}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Active Journey - Compact Bar */}
              {journeyMilestones.filter(m => m.status === 'current').map((milestone, index) => {
                const IconComponent = milestone.icon
                return (
                  <motion.div 
                    key={index}
                    className="p-2 rounded border"
                    style={{ 
                      backgroundColor: "rgba(34, 197, 94, 0.05)",
                      borderColor: "var(--status-success)"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-3.5 h-3.5 animate-pulse" style={{ color: "var(--status-success)" }} />
                        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                          Current Progress
                        </span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--app-primary)" }}>
                        Day {programData.currentDay}/90
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full overflow-hidden" 
                         style={{ backgroundColor: "rgba(156, 163, 175, 0.2)" }}>
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{ backgroundColor: "var(--status-success)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${programProgressPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs" style={{ color: "var(--status-success)" }}>
                        {Math.round(programProgressPercentage)}%
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {90 - programData.currentDay} days left
                      </span>
                    </div>
                  </motion.div>
                )
              })}

              {/* Locked - Ultra Compact */}
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <span>🔒</span>
                  <span>Upcoming</span>
                </div>
                <div className="flex gap-1.5">
                  {journeyMilestones.filter(m => m.status === 'upcoming').map((milestone, index) => {
                    const IconComponent = milestone.icon
                    return (
                      <motion.div 
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 rounded border opacity-50"
                        style={{ 
                          backgroundColor: "rgba(156, 163, 175, 0.05)",
                          borderColor: "rgba(156, 163, 175, 0.2)",
                          borderStyle: "dashed"
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1.1 + index * 0.05 }}
                      >
                        <span className="text-xs">🔒</span>
                        <IconComponent className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {milestone.title}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

      </motion.div>

      {/* Program Phases */}
      <motion.div variants={itemVariants}>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Program Phases
        </h3>
        <div className="space-y-4">
          {programData.phases.map((phase, index) => (
            <PhaseCard key={index} phase={phase} index={index} />
          ))}
        </div>
      </motion.div>




      {/* Journey Summary Stats */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(6px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Icon name="calendar" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          Journey Summary
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--app-primary)" }}>
              {programData.currentDay}
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Days Completed
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--status-success)" }}>
              7kg
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Weight Lost
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}>
            <div className="text-xl font-bold" style={{ color: "#F59E0B" }}>
              4/6
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Achievements
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Milestone */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(39, 116, 174, 0.05)",
          backdropFilter: "blur(6px)",
          borderColor: "var(--app-primary)",
          borderWidth: "1px"
        }}
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--app-primary)" }}
          >
            <Icon name="target" className="w-5 h-5 text-[var(--ds-text-inverse)]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Next Milestone: Target Weight Achievement
            </h4>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Only 3kg away from your 75kg goal • Estimated completion: 3-4 weeks
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: "var(--app-primary)" }}>
              23 days left
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>

      {/* Bottom Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay-backdrop"
              className="absolute inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverlay(false)}
            />
            
            {/* Overlay Content */}
            <motion.div
              key="overlay-content"
              className="absolute bottom-0 left-0 right-0 z-50 max-h-[60%] overflow-y-auto rounded-t-2xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)"
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Program Details
                  </h2>
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <Icon name="close" className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
                  </button>
                </div>

                {/* Program Info */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "rgba(39, 116, 174, 0.05)" }}>
                    <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      Semaglutide Support Program - 90 Day Intensive
                    </h3>
                    <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                      A comprehensive program designed to help you achieve your health goals through personalized coaching, medical supervision, and continuous support.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <div>• Weekly injection guidance</div>
                      <div>• 24/7 medical support</div>
                      <div>• Personalized meal planning</div>
                      <div>• Progress tracking tools</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border" style={{ borderColor: "var(--border-color)" }}>
                    <h4 className="font-semibold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>
                      Program Benefits
                    </h4>
                    <ul className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <li>• Clinically proven weight management</li>
                      <li>• Improved metabolic health markers</li>
                      <li>• Personalized dosing schedule</li>
                      <li>• Expert guidance throughout journey</li>
                    </ul>
                  </div>

                  <button
                    className="w-full py-2 rounded-lg text-sm font-medium"
                    style={{ 
                      backgroundColor: "var(--app-primary)",
                      color: "var(--ds-text-inverse)"
                    }}
                    onClick={() => setShowOverlay(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
