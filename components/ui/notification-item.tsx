"use client"

interface NotificationItemProps {
  notification: {
    id: number
    title: string
    message: string
    timestamp: string
    isRead: boolean
    icon: any
    color: string
    bgColor: string
  }
  onMarkRead: (id: number) => void
  onClick: (notification: any) => void
}

export function NotificationItem({ notification, onMarkRead, onClick }: NotificationItemProps) {
  const IconComponent = notification.icon

  return (
    <div
      onClick={() => onClick(notification)}
      className={`border rounded-xl p-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors ${
        notification.isRead
          ? "bg-[var(--bg-secondary)] border-[var(--border-color)] opacity-75"
          : "bg-[var(--bg-primary)] border-[var(--border-color)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${notification.bgColor}`}>
          <IconComponent className={`w-5 h-5 ${notification.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-[var(--text-primary)] text-sm">{notification.title}</h3>
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkRead(notification.id)
                }}
                className="text-xs text-[var(--app-primary)] hover:text-[var(--app-primary-hover)] font-medium"
              >
                Mark Read
              </button>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{notification.message}</p>
          <p className="text-xs text-[var(--text-muted)]">{notification.timestamp}</p>
        </div>
      </div>
    </div>
  )
}
