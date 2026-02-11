"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'

interface SettingsOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  // Handle drag end for pull-to-dismiss
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    // Close if dragged down more than threshold or with sufficient velocity
    if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
      onClose()
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="absolute inset-0 z-[200] flex items-end"
          onClick={handleBackdropClick}
          ref={constraintsRef}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay Panel */}
          <motion.div
            className="relative w-full bg-[var(--ds-surface-primary)] rounded-t-3xl shadow-2xl"
            style={getOverlayStyles('secondary')}
            initial={{ y: "100%" }}
            animate={{ y: isDragging ? undefined : 0 }}
            exit={{ y: "100%" }}
            transition={getOverlayAnimation()}
            drag="y"
            dragConstraints={dragConfig.dragConstraints}
            dragElastic={dragConfig.dragElastic}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            whileDrag={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)" 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Compact Header - No back button, slide-down dismissal only */}
            <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            </div>

            {/* Compact Content Container */}
            <div className="px-4 pb-6 pt-3 overflow-y-auto" style={{ maxHeight: "calc(75vh - 100px)" }}>
              
              {/* Notifications Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3">Notifications</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Icon name="notifications" className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Manage app alerts</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                      <div className="w-5 h-5 bg-[var(--ds-surface-primary)] rounded-full shadow-sm absolute top-0.5 right-0.5"></div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Sound & Vibration</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Notification sounds</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Privacy & Security Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3">Privacy & Security</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <Icon name="shield" className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Privacy Controls</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Data sharing preferences</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Biometric Lock</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Face ID & Touch ID</p>
                    </div>
                    <div 
                      className="w-12 h-6 rounded-full relative"
                      style={{ backgroundColor: "var(--app-primary)" }}
                    >
                      <div className="w-5 h-5 bg-[var(--ds-surface-primary)] rounded-full shadow-sm absolute top-0.5 right-0.5"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Appearance Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3">Appearance</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Icon name="bedtime" className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Switch to dark theme</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                      <div className="w-5 h-5 bg-[var(--ds-surface-primary)] rounded-full shadow-sm absolute top-0.5 left-0.5"></div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Icon name="eye" className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Display</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Text size & accessibility</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* General Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3">General</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Language & Region</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">English (US)</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <Icon name="smartphone" className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">App Version</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">v3.8.23</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Support Section */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3">Support</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <Icon name="help" className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Help Center</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">FAQs and guides</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--ds-surface-secondary)] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                      <Icon name="chat" className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Contact Support</h4>
                      <p className="text-sm text-[var(--ds-text-secondary)]">Get help from our team</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
