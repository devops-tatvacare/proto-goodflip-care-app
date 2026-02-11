"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatSessionSummary {
  id: string
  created_at?: string
  last_created_at?: string
  last_message?: string
  message_count?: number
}

interface ChatHistoryOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSelectChat?: (chatId: string) => void
  onNewChat?: () => void
}

export function ChatHistoryOverlay({
  isOpen,
  onClose,
  onSelectChat,
  onNewChat,
}: ChatHistoryOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load sessions when opened
  useEffect(() => {
    if (!isOpen) return
    setLoadError(null)
    fetch('/api/chat/session')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load sessions'))) 
      .then(data => setSessions(data.sessions || []))
      .catch((err: any) => {
        console.error('Failed to load chat sessions:', err)
        setLoadError('Unable to load chat history')
        setSessions([])
      })
  }, [isOpen])

  const chatSessions = sessions.map((s) => {
    const lastTs = s.last_created_at || s.created_at || new Date().toISOString()
    const ts = new Date(lastTs)
    const title = s.last_message?.slice(0, 40) || `Chat on ${ts.toLocaleDateString()}`
    const msgCount = s.message_count || 0
    const rel = timeAgo(ts)
    return {
      id: s.id,
      title,
      lastMessage: s.last_message || 'No messages yet',
      timestamp: rel,
      messageCount: msgCount,
      date: ts,
    }
  })

  function timeAgo(date: Date) {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000)
    if (diff < 60) return 'just now'
    const min = Math.floor(diff / 60)
    if (min < 60) return `${min} min ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr} hours ago`
    const d = Math.floor(hr / 24)
    if (d === 1) return 'Yesterday'
    return `${d} days ago`
  }

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
      onClose()
    }
  }

  const handleChatSelect = (chatId: string) => {
    onSelectChat?.(chatId)
    onClose()
  }

  const handleNewChat = () => {
    onNewChat?.()
    onClose()
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    // In production, this would delete the chat from storage
    console.log("Delete chat:", chatId)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="absolute inset-0 z-[175] flex items-end"
          onClick={onClose}
          ref={constraintsRef}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Overlay Panel */}
          <motion.div
            className="relative w-full bg-[var(--ds-surface-primary)] rounded-t-3xl shadow-2xl flex flex-col"
            style={{ maxHeight: '70%' }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
              {/* Drag Handle */}
              <div className="flex justify-center pt-2 pb-4">
                <div className="w-12 h-1 bg-[var(--text-tertiary)] rounded-full opacity-30" />
              </div>

              {/* Header */}
              <div className="px-4 pb-4 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="chat" className="w-5 h-5 text-[var(--accent-primary)]" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Chat History
                    </h2>
                  </div>
                  <Button
                    onClick={handleNewChat}
                    size="sm"
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
                  >
                    New Chat
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Icon name="browse" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Chat Sessions List */}
              <div className="h-[50vh] px-4 py-2 overflow-y-auto">
                {loadError && (
                  <div className="mb-3 p-2 text-xs rounded bg-red-50 text-red-700 border border-red-200">
                    {loadError}. You can start a new chat below.
                  </div>
                )}
                {filteredSessions.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSessions.map((session) => (
                      <motion.div
                        key={session.id}
                        whileTap={{ scale: isDragging ? 1 : 0.98 }}
                        className="p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-colors cursor-pointer group"
                        onClick={() => handleChatSelect(session.id)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-[var(--text-primary)] flex-1">
                            {session.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--text-tertiary)]">
                              {session.timestamp}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleDeleteChat(e, session.id)}
                            >
                              <Icon name="delete" className="w-3 h-3 text-[var(--text-tertiary)]" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                            <Icon name="clock" className="w-3 h-3" />
                            <span>{session.messageCount} messages</span>
                          </div>
                          <Icon name="chevronRight" className="w-4 h-4 text-[var(--text-tertiary)]" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Icon name="chat" className="w-12 h-12 text-[var(--text-tertiary)] mb-3 opacity-50" />
                    <p className="text-[var(--text-secondary)] mb-1">
                      No chats found
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      Start a new conversation to begin
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
