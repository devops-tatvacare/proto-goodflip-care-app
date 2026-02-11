"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { NotificationItem } from "@/components/ui/notification-item"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'

interface NotificationsOverlayProps {
  isOpen: boolean
  onClose: () => void
  unreadNotifications: any[]
  readNotifications: any[]
  unreadCount: number
  onMarkRead: (id: number) => void
  onMarkAllRead: () => void
  onNotificationClick: (notification: any) => void
}

export function NotificationsOverlay({
  isOpen,
  onClose,
  unreadNotifications,
  readNotifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
}: NotificationsOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  // Add water reminder notifications to unread notifications
  const waterReminders = [
    {
      id: "water-1",
      title: "Water Reminder",
      message: "Time to drink water! You're due for your 2 PM hydration break.",
      type: "water_reminder",
      isRead: false,
      timestamp: "5 minutes ago",
      icon: (props: any) => <Icon name="waterDrop" {...props} />,
      color: "text-[var(--accent-primary)]",
      bgColor: "bg-[var(--bg-secondary)]",
    },
    {
      id: "water-2",
      title: "Daily Water Goal",
      message: "You're 300ml away from reaching your daily water goal of 2000ml!",
      type: "water_reminder",
      isRead: false,
      timestamp: "1 hour ago",
      icon: (props: any) => <Icon name="waterDrop" {...props} />,
      color: "text-[var(--accent-primary)]",
      bgColor: "bg-[var(--bg-secondary)]",
    },
    {
      id: "water-3",
      title: "Great Job!",
      message: "You've reached 75% of your daily water intake goal. Keep it up!",
      type: "water_reminder",
      isRead: false,
      timestamp: "3 hours ago",
      icon: (props: any) => <Icon name="waterDrop" {...props} />,
      color: "text-[var(--accent-primary)]",
      bgColor: "bg-[var(--bg-secondary)]",
    },
  ]

  const allUnreadNotifications = [...unreadNotifications, ...waterReminders]

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

            {/* Compact Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Icon name="notifications" className="w-5 h-5"
                  style={{ color: "var(--app-primary)" }}
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                </div>
              </div>
              
              {/* Compact mark all button */}
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Icon name="checkAll" className="w-3 h-3 text-[var(--ds-text-secondary)]" />
                  <span className="text-xs font-medium text-gray-700">All</span>
                </button>
              )}
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 px-4 pb-6 pt-3 overflow-y-auto" style={{ maxHeight: "calc(100% - 120px)", WebkitOverflowScrolling: "touch" }}>
              {allUnreadNotifications.length === 0 && readNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Icon name="notifications" className="w-12 h-12 mb-3"
                    style={{ color: "var(--app-primary)" }}
                  />
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No notifications</h3>
                  <p className="text-xs text-[var(--ds-text-secondary)] text-center">
                    You'll see health updates and reminders here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Unread Notifications */}
                  {allUnreadNotifications.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-2">
                        New ({allUnreadNotifications.length})
                      </h3>
                      <div className="space-y-2">
                        {allUnreadNotifications.map((notification, index) => (
                          <div key={`${notification.id}-${index}`} className="relative">
                            <NotificationItem
                              notification={notification}
                              onMarkRead={onMarkRead}
                              onClick={() => onNotificationClick(notification)}
                            />
                            {/* Unread indicator */}
                            <div 
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
                              style={{ backgroundColor: "var(--app-primary)" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Read Notifications */}
                  {readNotifications.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-2 mt-6">
                        Earlier
                      </h3>
                      <div className="space-y-2">
                        {readNotifications.map((notification, index) => (
                          <NotificationItem
                            key={`${notification.id}-read-${index}`}
                            notification={notification}
                            onMarkRead={onMarkRead}
                            onClick={() => onNotificationClick(notification)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}