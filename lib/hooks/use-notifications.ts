"use client"

import { useState } from "react"
import { INITIAL_NOTIFICATIONS } from "@/lib/constants/notifications"

export function useNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    readNotifications,
    markAsRead,
    markAllAsRead,
  }
}
