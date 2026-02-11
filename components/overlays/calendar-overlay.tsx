"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { MaterialIcon } from "@/components/ui/material-icon"
import { Icon } from '@/components/ui/icon'

interface CalendarOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface CalendarEvent {
  id: string
  title: string
  type: 'webinar' | 'milestone' | 'injection' | 'lab' | 'appointment'
  time: string
  description?: string
  icon: string
}

const eventTypeConfig = {
  webinar: {
    color: 'text-[var(--ds-interactive-primary)]',
    bgColor: 'bg-[var(--ds-surface-tertiary)]',
    borderColor: 'border-[var(--ds-border-default)]',
    icon: 'videocam'
  },
  milestone: {
    color: 'text-[var(--ds-status-success)]', 
    bgColor: 'bg-[var(--ds-surface-tertiary)]',
    borderColor: 'border-[var(--ds-border-default)]',
    icon: 'emoji_events'
  },
  injection: {
    color: 'text-[var(--ds-brand-secondary)]',
    bgColor: 'bg-[var(--ds-surface-tertiary)]', 
    borderColor: 'border-[var(--ds-border-default)]',
    icon: 'medication'
  },
  lab: {
    color: 'text-[var(--ds-status-warning)]',
    bgColor: 'bg-[var(--ds-surface-tertiary)]',
    borderColor: 'border-[var(--ds-border-default)]', 
    icon: 'biotech'
  },
  appointment: {
    color: 'text-[var(--app-primary)]',
    bgColor: 'bg-[var(--ds-surface-tertiary)]',
    borderColor: 'border-[var(--ds-border-default)]',
    icon: 'person'
  }
}

// Mock events data
const mockEvents: Record<string, CalendarEvent[]> = {
  '2025-08-28': [
    {
      id: '1',
      title: 'Diabetes Management Webinar',
      type: 'webinar',
      time: '2:00 PM',
      description: 'Learn advanced techniques for managing blood sugar',
      icon: 'videocam'
    },
    {
      id: '2', 
      title: 'Weekly Injection - Semaglutide',
      type: 'injection',
      time: '10:00 AM',
      description: 'Weekly diabetes medication injection',
      icon: 'medication'
    }
  ],
  '2025-08-29': [
    {
      id: '3',
      title: 'Free CGM Milestone',
      type: 'milestone', 
      time: '9:00 AM',
      description: 'Claim your free Continuous Glucose Monitor',
      icon: 'emoji_events'
    }
  ],
  '2025-08-30': [
    {
      id: '4',
      title: 'Lab Visit - Blood Work',
      type: 'lab',
      time: '8:00 AM', 
      description: 'Quarterly blood work and HbA1c test',
      icon: 'biotech'
    },
    {
      id: '5',
      title: 'Nutritionist Appointment',
      type: 'appointment',
      time: '3:00 PM',
      description: 'Monthly consultation with Dr. Sarah Wilson',
      icon: 'person'
    }
  ]
}

export function CalendarOverlay({ isOpen, onClose }: CalendarOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return mockEvents[formatDateKey(date)] || []
  }

  const hasEvents = (date: Date | null) => {
    if (!date) return false
    return getEventsForDate(date).length > 0
  }

  const isSameDate = (date1: Date | null, date2: Date) => {
    if (!date1) return false
    return date1.toDateString() === date2.toDateString()
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    return isSameDate(date, new Date())
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="absolute inset-0 z-[150] flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
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
            onDragEnd={(_, info) => {
              setIsDragging(false)
              if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
                onClose()
              }
            }}
            whileDrag={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 text-center">Calendar</h2>
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 120px)", WebkitOverflowScrolling: "touch" }}>
              <div className="px-4 py-4 space-y-4">
                {/* Calendar Section */}
                <div className="bg-gray-50 rounded-xl border shadow-sm border-[var(--border-color)]">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon name="chevronLeft" className="w-4 h-4" />
                    </button>
                    
                    <h3 className="font-semibold text-base text-[var(--text-primary)]">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon name="chevronRight" className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="text-center text-xs font-medium py-2 text-[var(--text-secondary)]">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentDate).map((date, index) => (
                        <button
                          key={index}
                          onClick={() => date && setSelectedDate(date)}
                          disabled={!date}
                          className={`
                            h-8 w-full rounded-md text-sm relative transition-colors
                            ${!date ? 'invisible' : ''}
                            ${isSameDate(date, selectedDate) ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)]' : ''}
                            ${isToday(date) && !isSameDate(date, selectedDate) ? 'bg-[var(--app-primary)]/10 text-[var(--app-primary)] font-medium' : ''}
                            ${!isSameDate(date, selectedDate) && !isToday(date) ? 'hover:bg-gray-100' : ''}
                          `}
                          style={{ 
                            color: !isSameDate(date, selectedDate) && !isToday(date) ? 'var(--text-primary)' : undefined 
                          }}
                        >
                          {date?.getDate()}
                          {hasEvents(date) && (
                            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-60" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Events Section */}
                <div className="bg-gray-50 rounded-xl border shadow-sm flex flex-col min-h-[200px] border-[var(--border-color)]">
                  <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-semibold text-base text-[var(--text-primary)]">
                      Events for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2">
                    {selectedDateEvents.length === 0 ? (
                      <div className="p-4 text-center">
                        <div className="text-gray-400 mb-2">
                          <MaterialIcon icon="event_available" size="large" />
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          No events scheduled for this day
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedDateEvents.map(event => {
                          const config = eventTypeConfig[event.type]
                          return (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor} hover:shadow-sm transition-shadow`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center mt-0.5`}>
                                  <MaterialIcon icon={event.icon} size="small" color={config.color.replace('text-', '#')} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm text-[var(--text-primary)]">
                                      {event.title}
                                    </h4>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                                      backgroundColor: config.bgColor, 
                                      color: config.color 
                                    }}>
                                      {event.time}
                                    </span>
                                  </div>
                                  {event.description && (
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {event.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}