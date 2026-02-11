"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { motion } from 'framer-motion'
import { WelcomeHandsAnimation } from "@/components/ui/welcome-hands-animation"

interface WelcomeHookScreenProps {
  onGetStarted: () => void
}

type AnimationStage = 'hands' | 'merge' | 'content'

export function WelcomeHookScreen({ onGetStarted }: WelcomeHookScreenProps) {
  const [animationStage, setAnimationStage] = useState<AnimationStage>('hands')
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'info'>('welcome')
  
  const benefits = [
    "Reduces appetite and food cravings",
    "Helps achieve sustainable weight loss"
  ]

  const handleHandsComplete = () => {
    setAnimationStage('merge')
    // Immediately show content with synchronized timing
    setTimeout(() => {
      setAnimationStage('content')
    }, 600)
  }

  const handleNextClick = () => {
    if (currentScreen === 'welcome') {
      setCurrentScreen('info')
    } else {
      onGetStarted()
    }
  }

  // Show hands animation initially
  if (animationStage === 'hands') {
    return <WelcomeHandsAnimation onAnimationComplete={handleHandsComplete} />
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto relative" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--app-login-gradient)' }}
      />

      {/* Background image with synchronized fade-in */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: animationStage === 'merge' ? 0.15 : (animationStage === 'content' ? 0.15 : 0)
        }}
        transition={{ 
          duration: 0.6,
          delay: 0,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          backgroundImage: 'url(/humansai.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <motion.div 
        className="relative flex flex-col h-full p-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ 
          opacity: animationStage === 'content' ? 1 : 0,
          y: animationStage === 'content' ? 0 : -50
        }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex-1 flex flex-col justify-center py-4">
          <motion.div 
            className="text-center mb-6"
            initial={{ y: -40, opacity: 0 }}
            animate={{ 
              y: animationStage === 'content' ? 0 : -40, 
              opacity: animationStage === 'content' ? 1 : 0 
            }}
            transition={{ duration: 0.6, delay: 0.075 }}
          >
            <motion.div 
              className="mb-4"
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ 
                scale: animationStage === 'content' ? 1 : 0.8, 
                opacity: animationStage === 'content' ? 1 : 0,
                y: animationStage === 'content' ? 0 : -20
              }}
              transition={{ duration: 0.45, delay: 0.04 }}
            >
              <div 
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
                style={{ backgroundColor: 'var(--app-primary)' }}
              >
                <img 
                  src="/images/goodflip-care-logo.png" 
                  alt="GoodFlip Care" 
                  className="h-8 w-8 object-contain" 
                />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold mb-3" 
              style={{ color: "var(--text-primary)" }}
              initial={{ y: -30, opacity: 0 }}
              animate={{ 
                y: animationStage === 'content' ? 0 : -30, 
                opacity: animationStage === 'content' ? 1 : 0 
              }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {currentScreen === 'welcome' ? (
                <>Welcome to your<br />Semaglutide Journey</>
              ) : (
                <>What is Semaglutide?</>
              )}
            </motion.h1>
            
            {currentScreen === 'welcome' && (
              <motion.div
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ y: -25, opacity: 0 }}
                animate={{ 
                  y: animationStage === 'content' ? 0 : -25, 
                  opacity: animationStage === 'content' ? 1 : 0 
                }}
                transition={{ duration: 0.525, delay: 0.225 }}
              >
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Powered by</span>
                <img 
                  src="/images/zydus-logo.png" 
                  alt="Zydus" 
                  className="h-6 object-contain"
                />
              </motion.div>
            )}
            {currentScreen === 'info' && (
              <motion.p 
                className="text-sm mb-4 px-4" 
                style={{ color: "var(--text-secondary)" }}
                initial={{ y: -25, opacity: 0 }}
                animate={{ 
                  y: 1, 
                  opacity: 1
                }}
                transition={{ duration: 0.525, delay: 0.1 }}
              >
                A GLP-1 receptor agonist medication that helps manage weight and blood sugar levels
              </motion.p>
            )}
          </motion.div>

          {currentScreen === 'info' && (
            <motion.div
              className="mb-6"
              initial={{ y: -50, opacity: 0 }}
              animate={{ 
                y: 1, 
                opacity: 1
              }}
              transition={{ duration: 0.675, delay: 0.2 }}
            >
              <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                How does it help you?
              </h3>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-[var(--ds-surface-primary)]/60 border border-white/50"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1
                    }}
                    transition={{ duration: 0.45, delay: 0.3 + index * 0.075 }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--status-success)' }}
                    >
                      <Icon name="checkCircle" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div 
          className="pb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ 
            y: animationStage === 'content' ? 0 : -30, 
            opacity: animationStage === 'content' ? 1 : 0 
          }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={handleNextClick}
            className="w-full h-12 text-base font-semibold rounded-xl"
            style={{
              backgroundColor: 'var(--app-primary)',
              color: 'var(--ds-text-inverse)',
              border: 'none'
            }}
          >
            {currentScreen === 'welcome' ? 'Next' : 'Continue'}
          </Button>
          
          {currentScreen === 'welcome' && (
            <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Join thousands transforming their health journey
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}