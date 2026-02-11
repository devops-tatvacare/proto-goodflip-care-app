"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"

interface MedicationListOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MedicationListOverlay({ 
  isOpen, 
  onClose
}: MedicationListOverlayProps) {
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

  const medications = [
    {
      id: 1,
      name: "Semaglutide 1",
      dosage: "0.25 mg",
      frequency: "Weekly",
      nextDose: "Tomorrow",
      supply: "4 weeks remaining",
      status: "active",
      description: "Initial dose for weight management"
    },
    {
      id: 2,
      name: "Semaglutide 2",
      dosage: "0.5 mg",
      frequency: "Weekly",
      nextDose: "In 3 days",
      supply: "8 weeks remaining",
      status: "active",
      description: "Maintenance dose"
    },
    {
      id: 3,
      name: "Semaglutide 3",
      dosage: "1.0 mg",
      frequency: "Weekly",
      nextDose: "Next week",
      supply: "12 weeks remaining",
      status: "expired",
      description: "Target therapeutic dose"
    },
    {
      id: 4,
      name: "Semaglutide 4",
      dosage: "2.0 mg",
      frequency: "Weekly",
      nextDose: "On hold",
      supply: "Not started",
      status: "expired",
      description: "Maximum dose option"
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'var(--app-primary)'
      case 'expired':
        return 'var(--slate-400)'
      case 'scheduled':
        return 'var(--app-secondary)'
      case 'upcoming':
        return 'var(--app-tertiary)'
      case 'pending':
        return 'var(--slate-400)'
      default:
        return '#64748b'
    }
  }

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'active':
        return 'rgba(var(--app-primary-rgb), 0.1)'
      case 'expired':
        return 'rgba(148, 163, 184, 0.1)'
      case 'scheduled':
        return 'rgba(var(--app-secondary-rgb), 0.1)'
      case 'upcoming':
        return 'rgba(var(--app-tertiary-rgb), 0.1)'
      case 'pending':
        return 'rgba(148, 163, 184, 0.1)'
      default:
        return 'rgba(100, 116, 139, 0.1)'
    }
  }

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
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay Panel */}
          <motion.div
            className="relative w-full bg-[var(--ds-surface-primary)] rounded-t-3xl shadow-2xl flex flex-col"
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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header - Centered */}
            <div className="px-6 pb-3 border-b border-gray-100 text-center">
              <h2 className="text-lg font-bold text-gray-900">Patient Support Programs</h2>
              <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Other programs you are enrolled in</p>
            </div>

            {/* Content Container - 2x2 Grid */}
            <div className="flex-1 px-6 py-4 overflow-y-auto" style={{ maxHeight: "400px", WebkitOverflowScrolling: "touch" }}>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {medications.map((med) => (
                  <button
                    key={med.id}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md bg-[var(--ds-surface-primary)] hover:scale-105"
                    style={{
                      borderColor: 'rgba(var(--app-primary-rgb), 0.2)',
                      minHeight: '120px'
                    }}
                    onClick={() => console.log(`Selected: ${med.name}`)}
                  >
                    {/* Zydus Logo */}
                    <img 
                      src="/images/zydus-logo.png" 
                      alt="Zydus" 
                      className="h-8 w-auto object-contain mb-2 opacity-80"
                    />
                    
                    {/* Program Name */}
                    <h3 className="font-semibold text-gray-900 text-sm text-center">{med.name}</h3>
                    
                    {/* Status Badge */}
                    <div 
                      className="mt-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ 
                        backgroundColor: `${getStatusColor(med.status)}15`,
                        color: getStatusColor(med.status)
                      }}
                    >
                      {med.status}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer Info */}
              <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--banner-bg-start)' }}>
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Your Programs</h4>
                  <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                    You are enrolled in 4 programs. Tap on any active program to switch to that experience.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}