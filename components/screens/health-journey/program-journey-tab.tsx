"use client"

import { motion } from "framer-motion"
import { Icon } from '@/components/ui/icon'

export function ProgramJourneyTab() {
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
    ],
    metrics: {
      injectionCycles: { completed: 67, total: 90 },
      missedDoses: 4,
      coachCheckins: { completed: 8, total: 10 },
      educationalModules: { completed: 12, total: 15 }
    },
    learningProgress: [
      { name: "Injection Technique", completed: true },
      { name: "Nutrition Planning", completed: true },
      { name: "Exercise Integration", completed: true },
      { name: "Advanced Meal Planning", completed: false, current: true },
      { name: "Long-term Maintenance", completed: false },
      { name: "Complication Prevention", completed: false }
    ],
    achievements: [
      { name: "Perfect Week Warrior", count: 3, icon: "🥇" },
      { name: "Exercise Champion", icon: "🏃" },
      { name: "Learning Enthusiast", icon: "📚" },
      { name: "Goal Achievement Pro", icon: "🎯" }
    ]
  }

  const progressPercentage = (programData.currentDay / programData.totalDays) * 100

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
            <p className="text-xs text-[var(--text-secondary)]">
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
              <Icon name="checkCircle" className="w-4 h-4 text-[var(--status-success)]" />
            ) : task.current ? (
              <Icon name="clock" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            ) : task.scheduled ? (
              <Icon name="calendar" className="w-4 h-4 text-[var(--text-secondary)]" />
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

  const MetricCard = ({ label, value, total, unit, index }: { label: string, value: number, total?: number, unit?: string, index: number }) => (
    <motion.div
      className="text-center p-3 rounded-lg"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(4px)" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.2 }}
    >
      <div className="text-2xl font-bold mb-1" style={{ color: "var(--app-primary)" }}>
        {total ? `${value}/${total}` : value}{unit}
      </div>
      <div className="text-xs text-[var(--text-secondary)]">
        {label}
      </div>
      {total && (
        <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: "rgba(39, 116, 174, 0.1)" }}>
          <motion.div
            className="h-1 rounded-full"
            style={{ backgroundColor: "var(--app-primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(value / total) * 100}%` }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
          />
        </div>
      )}
    </motion.div>
  )

  return (
    <motion.div
      className="p-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Program Header */}
      <motion.div
        className="rounded-xl border shadow-sm p-6"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            {programData.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icon name="clock" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            <span className="text-sm text-[var(--text-secondary)]">
              Day {programData.currentDay} of {programData.totalDays} ({Math.round(progressPercentage)}% Complete)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 rounded-full mb-4" style={{ backgroundColor: "rgba(39, 116, 174, 0.1)" }}>
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: "var(--app-primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Icon name="target" className="w-4 h-4" style={{ color: "var(--app-secondary)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Next Milestone: Day {programData.nextMilestone.day} - {programData.nextMilestone.title}
          </span>
        </div>
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

      {/* Program Metrics */}
      <motion.div variants={itemVariants}>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Program Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Injection Cycles"
            value={programData.metrics.injectionCycles.completed}
            total={programData.metrics.injectionCycles.total}
            index={0}
          />
          <MetricCard
            label="Missed Doses"
            value={programData.metrics.missedDoses}
            unit=" (5.9%)"
            index={1}
          />
          <MetricCard
            label="Coach Check-ins"
            value={programData.metrics.coachCheckins.completed}
            total={programData.metrics.coachCheckins.total}
            index={2}
          />
          <MetricCard
            label="Learning Modules"
            value={programData.metrics.educationalModules.completed}
            total={programData.metrics.educationalModules.total}
            index={3}
          />
        </div>
      </motion.div>

      {/* Learning Progress */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(6px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Learning Progress
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {programData.learningProgress.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.05, duration: 0.2 }}
            >
              {item.completed ? (
                <Icon name="checkCircle" className="w-4 h-4 text-[var(--status-success)]" />
              ) : item.current ? (
                <Icon name="clock" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
              ) : (
                <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "var(--text-muted)" }} />
              )}
              <span
                className="text-sm"
                style={{
                  color: item.completed ? "var(--text-primary)" : item.current ? "var(--app-primary)" : "var(--text-secondary)"
                }}
              >
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Program Achievements */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(6px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Program Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {programData.achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "rgba(39, 116, 174, 0.05)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-lg">{achievement.icon}</span>
              <div>
                <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  {achievement.name}
                </div>
                {achievement.count && (
                  <div className="text-xs" style={{ color: "var(--app-primary)" }}>
                    {achievement.count}x earned
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
