"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'
import { motion } from 'framer-motion'

interface GeneratingPlansScreenProps {
  onComplete: () => void
}

export function GeneratingPlansScreen({ onComplete }: GeneratingPlansScreenProps) {
  // Auto-complete after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--app-login-gradient)' }}>
      <motion.div 
        className="flex-1 overflow-y-auto p-3 flex items-center justify-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--app-primary-light, #e3f2fd)" }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Icon name="brain" className="w-8 h-8" style={{ color: "var(--app-primary)" }} />
                </motion.div>
              </div>
              
              <motion.h2 
                className="text-xl font-bold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Generating Your Plans
              </motion.h2>
              
              <motion.p 
                className="text-[var(--ds-text-secondary)] text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                AI is creating your personalized diet and exercise plans
              </motion.p>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--app-primary)" }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                ))}
              </div>
              
              {/* Progress indicators */}
              <motion.div 
                className="mt-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="flex items-center justify-between text-xs text-[var(--ds-text-secondary)]">
                  <span>Analyzing your responses...</span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-16 h-1 bg-green-200 rounded-full ml-2"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--ds-text-secondary)]">
                  <span>Creating nutrition plan...</span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="w-16 h-1 bg-blue-200 rounded-full ml-2"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--ds-text-secondary)]">
                  <span>Building exercise program...</span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="w-16 h-1 bg-purple-200 rounded-full ml-2"
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}