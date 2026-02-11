"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'

interface Document {
  id: string
  name: string
  type: "discharge" | "prescription" | "lab-test"
  date: string
  status?: "normal" | "abnormal" | "pending"
}

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Cardiac Surgery Report",
    type: "discharge",
    date: "20 Jan 2024",
  },
  {
    id: "2",
    name: "Blood Test (CBC)",
    type: "lab-test",
    date: "18 Jan 2024",
    status: "normal",
  },
  {
    id: "3",
    name: "Heart Medications",
    type: "prescription",
    date: "15 Jan 2024",
  },
  {
    id: "4",
    name: "Liver Function Test",
    type: "lab-test",
    date: "12 Jan 2024",
    status: "abnormal",
  },
  {
    id: "5",
    name: "Emergency Visit",
    type: "discharge",
    date: "10 Jan 2024",
  },
  {
    id: "6",
    name: "Cholesterol Test",
    type: "lab-test",
    date: "08 Jan 2024",
    status: "normal",
  },
]

interface MedicalRecordsOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MedicalRecordsOverlay({ isOpen, onClose }: MedicalRecordsOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "lab-test" | "prescription" | "discharge">("all")
  const constraintsRef = useRef<HTMLDivElement>(null)

  const dragConfig = getDragConfig()

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const getIconForDocument = (type: Document["type"]) => {
    switch (type) {
      case "discharge":
        return <Icon name="fileText" className="w-5 h-5" />
      case "prescription":
        return <Icon name="medication" className="w-5 h-5" />
      case "lab-test":
        return <Icon name="science" className="w-5 h-5" />
      default:
        return <Icon name="fileText" className="w-5 h-5" />
    }
  }

  const getIconColor = (type: Document["type"]) => {
    switch (type) {
      case "discharge":
        return "text-blue-600 bg-blue-50"
      case "prescription":
        return "text-purple-600 bg-purple-50"
      case "lab-test":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-[var(--ds-text-secondary)] bg-gray-50"
    }
  }

  const filteredDocs = SAMPLE_DOCUMENTS.filter(doc => {
    if (activeFilter !== "all" && doc.type !== activeFilter) return false
    if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="absolute inset-0 z-[150] flex items-end"
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
          
          {/* Overlay Panel - Properly sized for mobile overlay */}
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
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header - Clean and simple */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Medical Records</h2>
              <p className="text-sm text-[var(--ds-text-secondary)] mt-1">12 documents</p>
            </div>

            {/* Search Bar */}
            <div className="px-6 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-6 pb-3">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === "all" 
                      ? "bg-blue-600 text-[var(--ds-text-inverse)]" 
                      : "bg-gray-100 text-[var(--ds-text-secondary)]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter("lab-test")}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === "lab-test" 
                      ? "bg-blue-600 text-[var(--ds-text-inverse)]" 
                      : "bg-gray-100 text-[var(--ds-text-secondary)]"
                  }`}
                >
                  Lab Tests
                </button>
                <button
                  onClick={() => setActiveFilter("prescription")}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === "prescription" 
                      ? "bg-blue-600 text-[var(--ds-text-inverse)]" 
                      : "bg-gray-100 text-[var(--ds-text-secondary)]"
                  }`}
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => setActiveFilter("discharge")}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === "discharge" 
                      ? "bg-blue-600 text-[var(--ds-text-inverse)]" 
                      : "bg-gray-100 text-[var(--ds-text-secondary)]"
                  }`}
                >
                  Discharge
                </button>
              </div>
            </div>

            {/* Documents List - Clean card design */}
            <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="space-y-3">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    className="w-full bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColor(doc.type)}`}>
                        {getIconForDocument(doc.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5">
                          {doc.date}
                        </p>
                      </div>

                      {/* Status Badge (for lab tests) */}
                      {doc.status && (
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          doc.status === "normal" 
                            ? "bg-green-100 text-green-700"
                            : doc.status === "abnormal"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {doc.status === "normal" ? "Normal" : doc.status === "abnormal" ? "Review" : "Pending"}
                        </div>
                      )}

                      {/* Download Icon */}
                      <Icon name="download" className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}

                {filteredDocs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[var(--ds-text-secondary)] text-sm">No records found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload FAB */}
            <button
              className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-blue-600"
            >
              <Icon name="upload" className="w-5 h-5 text-[var(--ds-text-inverse)]" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}