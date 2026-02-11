"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from '@/components/ui/icon'
import { HealthDataTab } from "./health-journey/health-data-tab"
import { CareTeamTab } from "./health-journey/care-team-tab"
import { ReviewViewTab } from "./health-journey/review-view-tab"

interface HealthJourneyDetailScreenProps {
  onBack: () => void
}

type TabType = 'review-view' | 'health-data' | 'care-team'

const tabs = [
  { id: 'review-view' as TabType, label: 'Program', icon: (props: any) => <Icon name="calendar" {...props} /> },
  { id: 'health-data' as TabType, label: 'Health', icon: (props: any) => <Icon name="heart" {...props} /> },
  { id: 'care-team' as TabType, label: 'Coach', icon: (props: any) => <Icon name="personCheck" {...props} /> },
]

export function HealthJourneyDetailScreen({ onBack }: HealthJourneyDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('review-view')

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'review-view':
        return <ReviewViewTab />
      case 'health-data':
        return <HealthDataTab />
      case 'care-team':
        return <CareTeamTab />
      default:
        return <ReviewViewTab />
    }
  }

  return (
    <motion.div
      className="flex flex-col h-full"
      style={{ background: "var(--app-login-gradient)" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tab Navigation with Inline Back Button */}
      <motion.div 
        className="flex items-center justify-between py-4 px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {/* Back Button - Circular */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
        >
          <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>

        {/* Tab Container */}
        <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 rounded-full shadow-lg shadow-black/10 p-1 flex-1 max-w-xs mx-3">
          <div className="flex items-center gap-0.5">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex-1 justify-center min-w-0 ${
                    isActive 
                      ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                      : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
                  } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Right Spacer for Balance */}
        <div className="w-10 h-10 flex-shrink-0" />
      </motion.div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="h-full overflow-y-auto"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}