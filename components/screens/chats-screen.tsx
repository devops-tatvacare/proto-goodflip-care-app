"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { Input } from "@/components/ui/input"
import { ScreenHeader } from "@/components/ui/screen-header"
import { MaterialIcon } from "@/components/ui/material-icon"

interface Chat {
  id: string
  specialist: {
    name: string
    role: string
    icon: string
    avatarColor: string
    isOnline: boolean
  }
  lastMessage: {
    content: string
    timestamp: string
    isFromUser: boolean
  }
  unreadCount: number
  appointments?: Array<{
    id: string
    doctorName: string
    date: string
    time: string
    duration: number
    type: "video" | "phone"
    status: "scheduled" | "active" | "completed" | "cancelled"
  }>
}

interface ChatsScreenProps {
  onChatSelect: (chat: Chat) => void
  onBack?: () => void
}

export function ChatsScreen({ onChatSelect, onBack }: ChatsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const chats: Chat[] = [
    {
      id: "1",
      specialist: {
        name: "Dr Sarah Wilson",
        role: "Endocrinologist",
        icon: "person",
        avatarColor: "#2E9B8C",
        isOnline: true,
      },
      lastMessage: {
        content: "Perfect! We can go over everything in detail during our scheduled consultation.",
        timestamp: "2 min ago",
        isFromUser: false,
      },
      unreadCount: 0,
      appointments: [
        {
          id: "1",
          doctorName: "Dr Sarah Wilson",
          date: new Date().toISOString().split("T")[0], // Today
          time: "15:30", // 3:30 PM
          duration: 30,
          type: "video",
          status: "scheduled",
        },
      ],
    },
    {
      id: "2",
      specialist: {
        name: "Maria Rodriguez",
        role: "Nutritionist",
        icon: "person",
        avatarColor: "#8B4982",
        isOnline: false,
      },
      lastMessage: {
        content: "I'll prepare a new meal plan for you by tomorrow.",
        timestamp: "1 hour ago",
        isFromUser: false,
      },
      unreadCount: 2,
    },
    {
      id: "3",
      specialist: {
        name: "James Thompson",
        role: "Care Specialist",
        icon: "person",
        avatarColor: "#C6804A",
        isOnline: true,
      },
      lastMessage: {
        content: "Thank you for updating your symptoms log.",
        timestamp: "3 hours ago",
        isFromUser: false,
      },
      unreadCount: 0,
    },
    {
      id: "4",
      specialist: {
        name: "Lisa Chen",
        role: "Exercise Coach",
        icon: "person",
        avatarColor: "#3B82F6",
        isOnline: false,
      },
      lastMessage: {
        content: "How did the morning walk routine work for you?",
        timestamp: "Yesterday",
        isFromUser: false,
      },
      unreadCount: 1,
    },
  ]

  const filteredChats = chats.filter(
    (chat) =>
      chat.specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.specialist.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getUpcomingAppointment = (chat: Chat) => {
    if (!chat.appointments) return null

    const today = new Date().toISOString().split("T")[0]
    return chat.appointments.find((apt) => apt.date === today && apt.status === "scheduled")
  }

  const getTimeUntilAppointment = (appointment: any) => {
    const now = new Date()
    const [appointmentHours, minutes] = appointment.time.split(":").map(Number)
    const appointmentTime = new Date()
    appointmentTime.setHours(appointmentHours, minutes, 0, 0)

    const diffMs = appointmentTime.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins <= 0) return "Starting soon"
    if (diffMins < 60) return `${diffMins} min`

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
      {/* Clean Header - WhatsApp/Telegram style */}
      <div className="bg-[var(--ds-surface-primary)] border-b border-gray-100 px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
          <button 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MaterialIcon icon="search" variant="round" size={24} color="#6B7280" />
          </button>
        </div>
      </div>

      {/* Unified Chat List with integrated search */}
      <div className="flex-1 overflow-y-auto bg-[var(--ds-surface-primary)]">
        {/* Search when needed - integrated into list */}
        {(isSearchVisible || searchQuery.length > 0) && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MaterialIcon icon="search" variant="round" size={16} color="#9CA3AF" />
              </div>
              <Input
                placeholder="Search specialists and messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-lg text-gray-900 placeholder:text-[var(--ds-text-secondary)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Clean Chat List */}
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const upcomingAppointment = getUpcomingAppointment(chat)

            return (
              <div
                key={chat.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--ds-surface-secondary)] cursor-pointer active:bg-gray-100 transition-colors duration-150"
                onClick={() => onChatSelect(chat)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${chat.specialist.avatarColor}20` }}
                  >
                    <MaterialIcon 
                      icon="person" 
                      variant="round" 
                      size={20} 
                      color={chat.specialist.avatarColor}
                    />
                  </div>
                  {chat.specialist.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--ds-status-success)] border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Chat Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.specialist.name}</h3>
                    <span className="text-xs text-[var(--ds-text-secondary)] ml-2 flex-shrink-0">{chat.lastMessage.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--ds-text-secondary)] truncate">{chat.lastMessage.content}</p>
                      {upcomingAppointment && (
                        <div className="flex items-center gap-1 mt-1">
                          <MaterialIcon icon="videocam" size={12} color="#10B981" />
                          <span className="text-xs text-green-600 font-medium">
                            Video call at {upcomingAppointment.time}
                          </span>
                        </div>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-blue-600 text-[var(--ds-text-inverse)] text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ml-2 flex-shrink-0">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <MaterialIcon icon="chat_bubble_outline" size={48} color="#D1D5DB" />
            <p className="text-[var(--ds-text-secondary)] mt-4 text-sm">No conversations yet</p>
            <p className="text-gray-400 text-xs mt-1">Your care team messages will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
