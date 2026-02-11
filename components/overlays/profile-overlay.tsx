"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icon } from '@/components/ui/icon'
import { MedicalRecordsOverlay } from "./medical-records-overlay"
import { MedicationListOverlay } from "./medication-list-overlay"

interface ProfileOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSettingsClick?: () => void
  onDeviceManagement?: () => void
  onRecords?: () => void
  onHealthDiary?: () => void
}

export function ProfileOverlay({ 
  isOpen, 
  onClose, 
  onSettingsClick,
  onDeviceManagement,
  onRecords,
  onHealthDiary
}: ProfileOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showMedicalRecords, setShowMedicalRecords] = useState(false)
  const [showMedicationList, setShowMedicationList] = useState(false)
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
    <>
      <AnimatePresence>
        {isOpen && (
        <div 
          className="absolute inset-0 z-[100] flex items-end"
          onClick={handleBackdropClick}
          ref={constraintsRef}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay Panel */}
          <motion.div
            className="relative w-full bg-[var(--ds-surface-primary)] rounded-t-3xl shadow-2xl flex flex-col"
            style={getOverlayStyles('primary')}
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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 px-6 pb-8 overflow-y-auto" style={{ maxHeight: "calc(100% - 60px)", WebkitOverflowScrolling: "touch" }}>
              {/* Header with Avatar and Settings */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-[var(--ds-border-default)]">
                    <AvatarFallback 
                      className="text-[var(--ds-text-inverse)] font-semibold text-sm overflow-hidden relative"
                      style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 50%, var(--app-secondary) 100%)' }}
                    >
                      {/* Scaled down Persona illustration */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Head */}
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--ds-surface-primary)]/90"></div>
                        {/* Body/shoulders */}
                        <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-t-full bg-[var(--ds-surface-primary)]/80"></div>
                        {/* Medical cross accent */}
                        <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-[var(--ds-surface-primary)]/60 rounded-full"></div>
                        {/* Health pulse line */}
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-end gap-0.5">
                          <div className="w-0.5 h-0.5 bg-[var(--ds-surface-primary)]/70 rounded-full"></div>
                          <div className="w-0.5 h-1 bg-[var(--ds-surface-primary)]/70 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-[var(--ds-surface-primary)]/70 rounded-full"></div>
                        </div>
                      </div>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Kumar</h2>
                    <p className="text-xs text-[var(--ds-text-secondary)]">Welcome back!</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Patient Support Programs Button */}
                  <button
                    onClick={() => setShowMedicationList(true)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Icon name="refresh" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
                  </button>
                  
                  {/* Settings Button */}
                  <button
                    onClick={onSettingsClick}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Icon name="settings" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
                  </button>
                </div>
              </div>

              {/* Clean Menu Items - Card Style */}
              <div className="space-y-2">
                {/* Wallet Card */}
                <button 
                  className="w-full overflow-hidden rounded-xl bg-gray-50 border border-[var(--ds-border-default)]"
                  onClick={() => console.log('Wallet clicked')}
                >
                  <div className="flex items-center p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                      <img 
                        src="/images/wallet.png" 
                        alt="Wallet"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                        Wallet
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        Payment methods
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium">2 cards saved</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Orders Card */}
                <button 
                  className="w-full overflow-hidden rounded-xl bg-gray-50 border border-[var(--ds-border-default)]"
                  onClick={() => console.log('Orders clicked')}
                >
                  <div className="flex items-center p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                      <img 
                        src="/images/orders.png" 
                        alt="Orders"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                        Orders
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        Track purchases
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium">1 active order</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Medical Records Card */}
                <button
                  className="w-full overflow-hidden rounded-xl bg-gray-50 border border-[var(--ds-border-default)]"
                  onClick={() => setShowMedicalRecords(true)}
                >
                  <div className="flex items-center p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                      <img 
                        src="/images/medicalrecords.png" 
                        alt="Medical Records"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                        Medical Records
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        Health data
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium">12 records</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Reminders Card - Seamless Integration */}
                <button
                  className="w-full overflow-hidden rounded-xl border border-[var(--ds-border-default)]"
                  onClick={() => console.log('Reminders clicked')}
                  style={{
                    background: 'var(--profile-bg)'
                  }}
                >
                  <div className="flex items-center p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                      <img 
                        src="/images/reminders.png" 
                        alt="Reminders"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                        Reminders
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        Set health reminders
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium">3 active reminders</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Goals Card */}
                <button
                  className="w-full overflow-hidden rounded-xl bg-gray-50 border border-[var(--ds-border-default)]"
                  onClick={() => console.log('Goals clicked')}
                >
                  <div className="flex items-center p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                      <img 
                        src="/images/goals-target.png" 
                        alt="Goals"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                        Goals
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        Track your health goals
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium">2 goals in progress</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Health Diary Card */}
                <button
                  className="w-full overflow-hidden rounded-xl bg-gray-50 border border-[var(--ds-border-default)]"
                  onClick={onHealthDiary}
                >
                  <div className="flex items-center p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                      <img 
                        src="/images/patientdiary.png" 
                        alt="Health Diary"
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                        Health Diary
                      </h3>
                      <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                        Export your health data
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium">Ready to export</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>

      {/* Medical Records Secondary Overlay */}
      <MedicalRecordsOverlay 
        isOpen={showMedicalRecords}
        onClose={() => setShowMedicalRecords(false)}
      />

      {/* Medication List Secondary Overlay */}
      <MedicationListOverlay
        isOpen={showMedicationList}
        onClose={() => setShowMedicationList(false)}
      />
    </>
  )
}