"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface HealthDiaryExportOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type ExportStep = "date-range" | "data-types"
type DateRangeOption = "last-30" | "custom"

const DATA_TYPES = [
  { id: "symptoms", label: "Symptoms", description: "Daily symptom tracking" },
  { id: "activities", label: "Activities", description: "Physical activities & exercises" },
  { id: "labs", label: "Labs Biomarkers", description: "Lab test results" },
  { id: "rx", label: "Rx Prescribed", description: "Medications & prescriptions" },
  { id: "vitals", label: "Vitals Information", description: "Blood pressure, heart rate, etc." },
]

export function HealthDiaryExportOverlay({ isOpen, onClose }: HealthDiaryExportOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [currentStep, setCurrentStep] = useState<ExportStep>("date-range")
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOption>("last-30")
  const [customDateFrom, setCustomDateFrom] = useState("")
  const [customDateTo, setCustomDateTo] = useState("")
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([])
  const constraintsRef = useRef<HTMLDivElement>(null)

  const dragConfig = getDragConfig()

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep("date-range")
        setDateRangeOption("last-30")
        setSelectedDataTypes([])
        setCustomDateFrom("")
        setCustomDateTo("")
      }, 300)
    }
  }, [isOpen])

  // Handle drag end for pull-to-dismiss
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
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

  const handleNext = () => {
    if (currentStep === "date-range") {
      setCurrentStep("data-types")
    }
  }

  const handleBack = () => {
    if (currentStep === "data-types") {
      setCurrentStep("date-range")
    }
  }

  const toggleDataType = (id: string) => {
    setSelectedDataTypes(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleGeneratePDF = () => {
    console.log("Generating PDF with:", {
      dateRange: dateRangeOption,
      customDates: dateRangeOption === "custom" ? { from: customDateFrom, to: customDateTo } : null,
      dataTypes: selectedDataTypes
    })
    // Add PDF generation logic here
    onClose()
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const thirtyDaysAgo = format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStep === "data-types" && (
                    <button
                      onClick={handleBack}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">Export Health Diary</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-sm text-[var(--ds-text-secondary)] hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div className="px-6 py-4" style={{ height: "calc(65vh - 100px)", overflowY: "auto" }}>
              {currentStep === "date-range" ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Date Range</h3>
                  
                  {/* Last 30 Days Option */}
                  <button
                    onClick={() => setDateRangeOption("last-30")}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      dateRangeOption === "last-30" 
                        ? "border-[var(--app-primary)] bg-blue-50" 
                        : "border-[var(--ds-border-default)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          dateRangeOption === "last-30" 
                            ? "border-[var(--app-primary)] bg-[var(--app-primary)]" 
                            : "border-gray-300"
                        }`}>
                          {dateRangeOption === "last-30" && (
                            <Icon name="check" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Last 30 Days</p>
                          <p className="text-xs text-[var(--ds-text-secondary)]">{thirtyDaysAgo} to {today}</p>
                        </div>
                      </div>
                      <Icon name="calendar" className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  {/* Custom Range Option */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      dateRangeOption === "custom" 
                        ? "border-[var(--app-primary)] bg-blue-50" 
                        : "border-[var(--ds-border-default)]"
                    }`}
                  >
                    <button
                      onClick={() => setDateRangeOption("custom")}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            dateRangeOption === "custom" 
                              ? "border-[var(--app-primary)] bg-[var(--app-primary)]" 
                              : "border-gray-300"
                          }`}>
                            {dateRangeOption === "custom" && (
                              <Icon name="check" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Custom Range</p>
                            <p className="text-xs text-[var(--ds-text-secondary)]">Select specific dates</p>
                          </div>
                        </div>
                      </div>
                    </button>

                    {dateRangeOption === "custom" && (
                      <div className="space-y-3 mt-3 pt-3 border-t border-[var(--ds-border-default)]">
                        <div>
                          <label className="text-xs font-medium text-[var(--ds-text-secondary)] mb-1 block">From</label>
                          <input
                            type="date"
                            value={customDateFrom}
                            onChange={(e) => setCustomDateFrom(e.target.value)}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[var(--ds-text-secondary)] mb-1 block">To</label>
                          <input
                            type="date"
                            value={customDateTo}
                            onChange={(e) => setCustomDateTo(e.target.value)}
                            min={customDateFrom}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Data Types</h3>
                  <p className="text-xs text-[var(--ds-text-secondary)] -mt-2">Choose the data you want to export</p>
                  
                  <div className="space-y-2">
                    {DATA_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => toggleDataType(type.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          selectedDataTypes.includes(type.id)
                            ? "border-[var(--app-primary)] bg-blue-50"
                            : "border-[var(--ds-border-default)] hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedDataTypes.includes(type.id)
                              ? "border-[var(--app-primary)] bg-[var(--app-primary)]"
                              : "border-gray-300"
                          }`}>
                            {selectedDataTypes.includes(type.id) && (
                              <Icon name="check" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                            )}
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-medium text-gray-900">{type.label}</p>
                            <p className="text-xs text-[var(--ds-text-secondary)]">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="px-6 py-4 border-t border-gray-100">
              {currentStep === "date-range" ? (
                <Button
                  onClick={handleNext}
                  disabled={dateRangeOption === "custom" && (!customDateFrom || !customDateTo)}
                  className="w-full h-12 text-[var(--ds-text-inverse)] font-semibold rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--app-primary)" }}
                >
                  Next
                  <Icon name="chevronRight" className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleGeneratePDF}
                  disabled={selectedDataTypes.length === 0}
                  className="w-full h-12 text-[var(--ds-text-inverse)] font-semibold rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--app-primary)" }}
                >
                  <Icon name="fileDown" className="w-4 h-4" />
                  Generate PDF
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}