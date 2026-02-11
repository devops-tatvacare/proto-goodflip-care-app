"use client"

import { motion } from "framer-motion"
import { Icon } from '@/components/ui/icon'

export function HealthDataTab() {
  const journeyData = {
    program: {
      title: "Health Flow - 90 Day Journey",
      currentDay: 67,
      totalDays: 90,
      startWeight: 85,
      currentWeight: 78,
      targetWeight: 75
    },
    timelineMarkers: [
      { week: 2, day: 14, label: "W2", weight: 84, status: "past" },
      { week: 4, day: 28, label: "W4", weight: 82, status: "past" },
      { week: 6, day: 42, label: "W6", weight: 80.5, status: "past" },
      { week: 8, day: 56, label: "W8", weight: 79, status: "past" },
      { week: 10, day: 70, label: "W10", weight: 78, status: "current" },
      { week: 12, day: 84, label: "W12", weight: 76, status: "future" },
      { week: 14, day: 98, label: "W14", weight: 75, status: "future" },
      { week: 16, day: 112, label: "W16", weight: 74, status: "future" },
      { week: 18, day: 126, label: "W18", weight: 73, status: "future" },
      { week: 20, day: 140, label: "W20", weight: 72, status: "future" },
      { week: 22, day: 154, label: "W22", weight: 71, status: "future" },
      { week: 24, day: 168, label: "W24", weight: 70, status: "future" }
    ],
    improvementStreams: [
      {
        icon: (props: any) => <Icon name="vaccines" {...props} />,
        title: "Injection",
        percentage: 94,
        progress: 94,
        color: "var(--app-primary)",
        highlight: "Perfect weeks: 7/10"
      },
      {
        icon: (props: any) => <Icon name="scale" {...props} />,
        title: "Weight",
        percentage: 87,
        progress: 87,
        color: "var(--status-success)",
        highlight: "Progress: 7kg/10kg"
      },
      {
        icon: (props: any) => <Icon name="glucose" {...props} />,
        title: "Glucose",
        percentage: 91,
        progress: 91,
        color: "var(--app-secondary)",
        highlight: "Time in range: 89%"
      },
      {
        icon: (props: any) => <Icon name="mood" {...props} />,
        title: "Symptoms",
        percentage: 83,
        progress: 83,
        color: "#8B5CF6",
        highlight: "Side effects: -60%"
      }
    ]
  }

  const progressPercentage = (journeyData.program.currentDay / journeyData.program.totalDays) * 100

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

  const StreamCard = ({ stream, index }: { stream: any, index: number }) => {
    const IconComponent = stream.icon
    return (
      <motion.div
        className="space-y-2 py-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
      >
        {/* Line 1: Icon, Title, Percentage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {stream.title}
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--app-primary)" }}>
            {stream.percentage}%
          </span>
        </div>

        {/* Line 2: Progress Bar */}
        <div className="relative h-1.5 rounded-full" style={{ backgroundColor: "rgba(156, 163, 175, 0.2)" }}>
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: "var(--app-primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${stream.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.9 + index * 0.1 }}
          />
        </div>

        {/* Line 3: Highlight Chip */}
        <div className="flex">
          <span 
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: "rgba(39, 116, 174, 0.1)",
              color: "var(--app-primary)"
            }}
          >
            {stream.highlight}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="p-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Health Flow - No Card, Direct on Background */}
      <motion.div
        className="space-y-4"
        variants={itemVariants}
      >
        {/* Title */}
        <div className="flex items-center gap-2 px-2">
          <Icon name="waterDrop" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {journeyData.program.title}
          </h2>
        </div>

        {/* River Flow Timeline - Horizontally Scrollable */}
        <div className="space-y-3 px-2">
          {/* Start and End Weight Labels */}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Start</div>
              <div className="text-lg font-bold" style={{ color: "var(--app-primary)" }}>
                {journeyData.program.startWeight}kg
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Now</div>
              <div className="text-lg font-bold text-[var(--status-success)]">
                {journeyData.program.currentWeight}kg
              </div>
            </div>
          </div>

          {/* Scrollable River Flow */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="relative min-w-max px-4">
                {/* River Flow Line */}
                <div className="relative h-1 rounded-full mb-4" style={{ backgroundColor: "rgba(39, 116, 174, 0.2)", width: "800px" }}>
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ backgroundColor: "var(--app-primary)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(journeyData.program.currentDay / 168) * 100}%` }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                  />
                </div>

                {/* Timeline Markers */}
                <div className="flex items-center justify-between" style={{ width: "800px" }}>
                  {journeyData.timelineMarkers.map((marker, index) => (
                    <motion.div
                      key={marker.day}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    >
                      {/* Marker Dot */}
                      <div
                        className={`w-3 h-3 rounded-full border-2 mb-1 ${
                          marker.status === "current" ? "animate-pulse" : ""
                        }`}
                        style={{
                          backgroundColor: marker.status === "current" 
                            ? "var(--status-success)" 
                            : marker.status === "past" 
                            ? "var(--app-primary)" 
                            : "rgba(156, 163, 175, 0.3)",
                          borderColor: marker.status === "current" 
                            ? "var(--status-success)" 
                            : marker.status === "past" 
                            ? "var(--app-primary)" 
                            : "var(--border-color)"
                        }}
                      >
                        {marker.status === "current" && (
                          <div
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: "white", margin: "4px" }}
                          />
                        )}
                      </div>
                      {/* Week Label */}
                      <div className="text-xs text-[var(--text-secondary)]">
                        {marker.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </motion.div>

      {/* Improvement Streams - Tightened */}
      <motion.div variants={itemVariants}>
        <div 
          className="rounded-xl border shadow-sm p-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderColor: "var(--border-color)"
          }}
        >
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Icon name="barChart" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
            Streams
          </h3>
          <div className="space-y-3">
            {journeyData.improvementStreams.map((stream, index) => (
              <StreamCard key={stream.title} stream={stream} index={index} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Have More Questions FAQ Card */}
      <motion.div variants={itemVariants}>
        <div 
          className="rounded-xl border shadow-sm p-4 text-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderColor: "var(--border-color)"
          }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(39, 116, 174, 0.1)" }}>
              <Icon name="help" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
            </div>
          </div>
          <h3 className="font-semibold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>
            Have More Questions?
          </h3>
          <p className="text-xs mb-3 text-[var(--text-secondary)]">
            Ask your AI Health Assistant about your health
          </p>
          <button 
            className="text-[var(--ds-text-inverse)] font-medium px-4 h-10 text-sm rounded-lg transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: "var(--app-primary)"
            }}
          >
            Ask AI Assistant
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}