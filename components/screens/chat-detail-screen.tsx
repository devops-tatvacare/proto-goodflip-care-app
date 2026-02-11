"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Icon } from '@/components/ui/icon'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScreenHeader } from "@/components/ui/screen-header"
import { MaterialIcon } from "@/components/ui/material-icon"

interface Message {
  id: string
  content: string
  isFromUser: boolean
  timestamp: string
}

interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
  duration: number
  type: "video" | "phone"
  status: "scheduled" | "active" | "completed" | "cancelled"
}

interface Chat {
  id: string
  specialist: {
    name: string
    role: string
    avatar?: string
    isOnline: boolean
  }
  lastMessage: {
    content: string
    timestamp: string
    isFromUser: boolean
  }
  unreadCount: number
  appointments?: Appointment[]
}

interface ChatDetailScreenProps {
  chat: Chat
  onBack: () => void
}

export function ChatDetailScreen({ chat, onBack }: ChatDetailScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How are you feeling today?",
      isFromUser: false,
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      content: "I'm doing much better, thank you for asking. The new medication seems to be helping.",
      isFromUser: true,
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      content:
        "That's wonderful to hear! Keep taking the medication as prescribed and let me know if you experience any side effects.",
      isFromUser: false,
      timestamp: "10:35 AM",
    },
    {
      id: "4",
      content: "Will do. I have some questions about my diet plan that I'd like to discuss during our video call.",
      isFromUser: true,
      timestamp: "10:37 AM",
    },
    {
      id: "5",
      content: "Perfect! We can go over everything in detail during our scheduled consultation today at 3:30 PM.",
      isFromUser: false,
      timestamp: "10:40 AM",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        isFromUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate specialist response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for your message. I'll get back to you shortly.",
          isFromUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, response])
      }, 2000)
    }
  }

  const getUpcomingAppointment = () => {
    if (!chat.appointments) return null

    const today = new Date().toISOString().split("T")[0]
    return chat.appointments.find((apt) => apt.date === today && apt.status === "scheduled")
  }

  const isAppointmentActive = (appointment: Appointment) => {
    const now = new Date()
    const [appointmentHours, appointmentMinutes] = appointment.time.split(":").map(Number)
    const appointmentStart = new Date()
    appointmentStart.setHours(appointmentHours, appointmentMinutes, 0, 0)

    const appointmentEnd = new Date(appointmentStart)
    appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration)

    return now >= appointmentStart && now <= appointmentEnd
  }

  const getTimeUntilAppointment = (appointment: Appointment) => {
    const now = new Date()
    const [appointmentHours, appointmentMinutes] = appointment.time.split(":").map(Number)
    const appointmentTime = new Date()
    appointmentTime.setHours(appointmentHours, appointmentMinutes, 0, 0)

    const diffMs = appointmentTime.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins <= 0) return null
    if (diffMins < 60) return `${diffMins} minutes`

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // You can add file upload logic here
      console.log("Selected file:", file.name)
    }
  }

  const upcomingAppointment = getUpcomingAppointment()
  const isVideoCallActive = upcomingAppointment ? isAppointmentActive(upcomingAppointment) : false
  const timeUntilAppointment = upcomingAppointment ? getTimeUntilAppointment(upcomingAppointment) : null

  const handleJoinVideoCall = () => {
    if (isVideoCallActive) {
      // Implement video call joining logic
      alert("Joining video consultation...")
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--app-login-gradient)' }}>
      {/* Header with curated plans style */}
      <div className="flex items-center justify-between py-4 px-4">
        {/* Back Button - Circular */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ backgroundColor: "var(--overlay-bg)", backdropFilter: "blur(8px)" }}
        >
          <MaterialIcon icon="arrow_back" size="medium" color="var(--text-primary)" />
        </button>
        
        {/* Title Section with Specialist Info */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-[var(--card-header-text)]">
            {chat.specialist.name}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-sm text-[var(--ds-text-secondary)]">{chat.specialist.role}</p>
            {chat.specialist.isOnline && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[var(--status-success)] rounded-full"></div>
                  <p className="text-sm text-[var(--status-success)] font-medium">Online</p>
                </div>
              </>
            )}
            {!chat.specialist.isOnline && (
              <>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-[var(--ds-text-secondary)]">Offline</p>
              </>
            )}
          </div>
        </div>
        
        {/* Right Element - Avatar */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
             style={{ backgroundColor: "var(--overlay-bg)", backdropFilter: "blur(8px)" }}>
          <div className="relative">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${chat.specialist.avatarColor || 'var(--accent-primary)'}20` }}
            >
              <MaterialIcon 
                icon="person" 
                variant="round" 
                size={14} 
                color={chat.specialist.avatarColor || 'var(--accent-primary)'}
              />
            </div>
            {chat.specialist.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[var(--status-success)] border border-white rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Notification */}
      {upcomingAppointment && (
        <div className="px-4 py-3 border-b border-[var(--border-color)] flex-shrink-0" style={{ 
          backgroundColor: 'var(--surface-elevated)',
          backdropFilter: 'blur(12px)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon icon="videocam" size="small" color="var(--accent-primary)" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Upcoming Video Consultation</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MaterialIcon icon="schedule" size="small" color="var(--text-secondary)" />
              <span className="text-sm text-[var(--text-secondary)]">
                Today at {upcomingAppointment.time}
                {timeUntilAppointment && ` (in ${timeUntilAppointment})`}
                {isVideoCallActive && " - Active Now"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ 
        background: 'var(--overlay-bg-light)',
        backdropFilter: 'blur(12px)'
      }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                message.isFromUser
                  ? "text-[var(--ds-text-inverse)]"
                  : "bg-[var(--ds-surface-primary)] text-[var(--text-primary)] border border-[var(--border-color)]"
              }`}
              style={message.isFromUser ? { backgroundColor: 'var(--accent-primary)' } : {}}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-1 ${message.isFromUser ? "text-[var(--ds-text-inverse)]/80" : "text-[var(--text-muted)]"}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Call Button */}
      {upcomingAppointment && (
        <div className="px-4 py-3 border-t border-[var(--border-color)] flex-shrink-0" style={{ 
          backgroundColor: 'var(--surface-elevated)',
          backdropFilter: 'blur(12px)'
        }}>
          <Button
            onClick={handleJoinVideoCall}
            disabled={!isVideoCallActive}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${
              isVideoCallActive
                ? "text-[var(--ds-text-inverse)] shadow-md"
                : "bg-gray-200 text-[var(--ds-text-secondary)] cursor-not-allowed"
            }`}
            style={isVideoCallActive ? { backgroundColor: 'var(--status-success)' } : {}}
          >
            <MaterialIcon icon="videocam" size="small" />
            {isVideoCallActive ? "Join Video Call" : `Video Call Available at ${upcomingAppointment.time}`}
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-[var(--border-color)] p-4 flex-shrink-0" style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)'
      }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              size="sm"
              variant="outline"
              className="bg-[var(--ds-surface-primary)] border-[var(--border-color)] hover:bg-[var(--ds-surface-secondary)] rounded-full w-10 h-10 p-0 shadow-sm"
            >
              <MaterialIcon icon="attach_file" size="small" color="var(--text-secondary)" />
            </Button>
          </div>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-[var(--ds-surface-primary)] border-[var(--border-color)] rounded-full px-4 shadow-sm focus:shadow-md transition-all text-[var(--text-primary)]"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="text-[var(--ds-text-inverse)] rounded-full w-10 h-10 p-0 shadow-md"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <MaterialIcon icon="send" size="small" />
          </Button>
        </div>
        {selectedFile && (
          <div className="mt-3 p-3 bg-[var(--ds-surface-primary)] rounded-xl border border-[var(--border-color)] shadow-sm flex items-center justify-between">
            <span className="text-sm text-[var(--text-primary)] font-medium">{selectedFile.name}</span>
            <Button
              onClick={() => setSelectedFile(null)}
              size="sm"
              variant="ghost"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-6 h-6 p-0 rounded-full"
            >
              <MaterialIcon icon="close" size="small" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
