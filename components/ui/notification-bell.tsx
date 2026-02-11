"use client"

import { Icon } from '@/components/ui/icon'

interface NotificationBellProps {
  unreadCount: number
  onClick: () => void
}

export function NotificationBell({ unreadCount, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 bg-white hover:bg-gray-50 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
    >
      <Icon name="notifications" className="w-4 h-4 text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--ds-status-error)] text-[var(--ds-text-inverse)] text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  )
}
