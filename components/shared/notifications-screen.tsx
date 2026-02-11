"use client"

import { ScreenHeader } from "@/components/ui/screen-header"
import { NotificationItem } from "@/components/ui/notification-item"
import { Icon } from '@/components/ui/icon'

interface NotificationsScreenProps {
  isOpen: boolean
  onClose: () => void
  unreadNotifications: any[]
  readNotifications: any[]
  unreadCount: number
  onMarkRead: (id: number) => void
  onMarkAllRead: () => void
  onNotificationClick: (notification: any) => void
}

export function NotificationsScreen({
  isOpen,
  onClose,
  unreadNotifications,
  readNotifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
}: NotificationsScreenProps) {
  if (!isOpen) return null

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
      title: "Hydration Check",
      message: "It's been 3 hours since your last water log. Stay hydrated!",
      type: "water_reminder",
      isRead: false,
      timestamp: "2 hours ago",
      icon: (props: any) => <Icon name="waterDrop" {...props} />,
      color: "text-[var(--accent-primary)]",
      bgColor: "bg-[var(--bg-secondary)]",
    },
  ]

  // Combine water reminders with existing unread notifications
  const combinedUnreadNotifications = [...waterReminders, ...unreadNotifications]

  const handleBackClick = () => {
    console.log("Notifications back button clicked")
    onClose()
  }

  const handleMarkAllRead = () => {
    console.log("Mark all read clicked")
    onMarkAllRead()
  }

  return (
    <div className="absolute inset-0 bg-[var(--bg-primary)] z-50 flex flex-col">
      <ScreenHeader
        title="Notifications"
        onBack={handleBackClick}
        rightElement={
          combinedUnreadNotifications.length > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80 font-medium transition-colors"
            >
              Mark All Read
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto">
        {combinedUnreadNotifications.length > 0 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Unread ({combinedUnreadNotifications.length})
            </h2>
            <div className="space-y-3">
              {combinedUnreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onClick={onNotificationClick}
                />
              ))}
            </div>
          </div>
        )}

        {readNotifications.length > 0 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Read ({readNotifications.length})</h2>
            <div className="space-y-3">
              {readNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onClick={onNotificationClick}
                />
              ))}
            </div>
          </div>
        )}

        {combinedUnreadNotifications.length === 0 && readNotifications.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Icon name="notifications" className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">No Notifications</h3>
              <p className="text-sm text-[var(--text-muted)]">You're all caught up!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
