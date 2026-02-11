"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'
import { SocialPost } from "../screens/social-screen"

interface Comment {
  id: string
  author: string
  username?: string
  avatar: string
  avatarColor: string
  timeAgo: string
  content: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentsOverlayProps {
  isOpen: boolean
  onClose: () => void
  post: SocialPost | null
}

export function CommentsOverlay({ isOpen, onClose, post }: CommentsOverlayProps) {
  // Early return before hooks if post is null
  if (!post) {
    return null
  }

  const [isDragging, setIsDragging] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  // Mock comments data
  useEffect(() => {
    if (isOpen && post) {
      const mockComments: Comment[] = [
        {
          id: "c1",
          author: "Dr. Emily Parker",
          username: "@dr_emilyparker",
          avatar: "EP",
          avatarColor: "bg-[var(--ds-interactive-primary)]",
          timeAgo: "2h ago",
          content: "This is incredible progress! Keep up the amazing work. The consistency you're showing is exactly what leads to long-term success.",
          likes: 24,
          isLiked: false,
          replies: [
            {
              id: "r1",
              author: "Sarah Miller",
              username: "@sarah_miller",
              avatar: "SM", 
              avatarColor: "bg-purple-500",
              timeAgo: "1h ago",
              content: "Thank you so much Dr. Parker! Your guidance has been invaluable.",
              likes: 8,
              isLiked: true
            }
          ]
        },
        {
          id: "c2",
          author: "Mike Johnson",
          username: "@mike_j",
          avatar: "MJ",
          avatarColor: "bg-[var(--ds-status-success)]",
          timeAgo: "3h ago",
          content: "Same here! Week 16 and down 22kg. The appetite control really does work when you stick to the plan. 💪",
          likes: 15,
          isLiked: true
        },
        {
          id: "c3",
          author: "Lisa Chen",
          username: "@lisa_chen",
          avatar: "LC",
          avatarColor: "bg-pink-500",
          timeAgo: "4h ago",
          content: "What meal prep tips worked best for you? I'm struggling with planning ahead.",
          likes: 7,
          isLiked: false,
          replies: [
            {
              id: "r2",
              author: "Sarah Miller",
              username: "@sarah_miller",
              avatar: "SM",
              avatarColor: "bg-purple-500", 
              timeAgo: "3h ago",
              content: "I batch cook on Sundays - protein, veggies, and grains separately. Then mix and match during the week!",
              likes: 12,
              isLiked: false
            },
            {
              id: "r3",
              author: "David Rodriguez",
              username: "@david_r",
              avatar: "DR",
              avatarColor: "bg-orange-500",
              timeAgo: "2h ago", 
              content: "Try the glass containers with dividers - game changer for portion control!",
              likes: 5,
              isLiked: false
            }
          ]
        },
        {
          id: "c4",
          author: "Jennifer Walsh",
          username: "@jen_walsh",
          avatar: "JW",
          avatarColor: "bg-indigo-500",
          timeAgo: "5h ago",
          content: "Inspiring post! The mental health benefits of feeling this good are just as important as the physical ones. 🧠❤️",
          likes: 18,
          isLiked: true
        }
      ]
      setComments(mockComments)
    }
  }, [isOpen, post])

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

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `c${Date.now()}`,
        author: "You",
        username: "@you",
        avatar: "YO",
        avatarColor: "bg-gradient-to-r from-blue-500 to-purple-500",
        timeAgo: "now",
        content: newComment,
        likes: 0,
        isLiked: false
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const toggleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        }
        if (isReply && comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                  }
                : reply
            )
          }
        }
        return comment
      })
    )
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div 
            className="absolute inset-0 z-[100] flex items-end"
            onClick={handleBackdropClick}
            ref={constraintsRef}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
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
            <div className="flex-shrink-0 flex items-center justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex-shrink-0 px-4 pb-3 border-b" style={{ borderColor: "var(--border-color)" }}>
              <h2 className="text-lg font-semibold text-center" style={{ color: "var(--text-primary)" }}>
                Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
              </h2>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {comments.map((comment) => (
                <div key={comment.id} className="mb-4">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-xs ${comment.avatarColor}`}>
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          {comment.author}
                        </span>
                        {comment.username && (
                          <span className="text-xs text-[var(--text-muted)]">
                            {comment.username}
                          </span>
                        )}
                        <span className="text-xs text-[var(--text-muted)]">
                          · {comment.timeAgo}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: "var(--text-primary)" }}>
                        {comment.content}
                      </p>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleLike(comment.id)}
                          className="flex items-center gap-1 group transition-colors"
                        >
                          <Icon name="heart" className={`w-3 h-3 transition-all ${
                              comment.isLiked 
                                ? 'text-[var(--ds-status-error)] fill-current' 
                                : 'group-hover:text-[var(--ds-status-error)]'
                            }`} 
                            style={!comment.isLiked ? { color: "var(--text-muted)" } : {}}
                          />
                          <span className={`text-xs ${
                            comment.isLiked ? 'text-[var(--ds-status-error)]' : ''
                          }`} style={!comment.isLiked ? { color: "var(--text-muted)" } : {}}>
                            {comment.likes}
                          </span>
                        </button>
                        
                        <button className="text-xs font-medium transition-colors hover:opacity-70 text-[var(--text-muted)]">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 mt-3 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-xs ${reply.avatarColor}`}>
                            {reply.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                {reply.author}
                              </span>
                              {reply.username && (
                                <span className="text-xs text-[var(--text-muted)]">
                                  {reply.username}
                                </span>
                              )}
                              <span className="text-xs text-[var(--text-muted)]">
                                · {reply.timeAgo}
                              </span>
                            </div>
                            <p className="text-sm mb-2" style={{ color: "var(--text-primary)" }}>
                              {reply.content}
                            </p>
                            
                            {/* Reply Actions */}
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => toggleLike(reply.id, true, comment.id)}
                                className="flex items-center gap-1 group transition-colors"
                              >
                                <Icon name="heart" className={`w-3 h-3 transition-all ${
                                    reply.isLiked 
                                      ? 'text-[var(--ds-status-error)] fill-current' 
                                      : 'group-hover:text-[var(--ds-status-error)]'
                                  }`} 
                                  style={!reply.isLiked ? { color: "var(--text-muted)" } : {}}
                                />
                                <span className={`text-xs ${
                                  reply.isLiked ? 'text-[var(--ds-status-error)]' : ''
                                }`} style={!reply.isLiked ? { color: "var(--text-muted)" } : {}}>
                                  {reply.likes}
                                </span>
                              </button>
                              
                              <button className="text-xs font-medium transition-colors hover:opacity-70 text-[var(--text-muted)]">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex-shrink-0 px-4 py-3 border-t" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-xs">
                  YO
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="flex-1 px-3 py-2 rounded-full border text-sm"
                    style={{ 
                      borderColor: "var(--border-color)",
                      backgroundColor: "white"
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className={`p-2 rounded-full transition-colors ${
                      newComment.trim() 
                        ? 'text-[var(--ds-text-inverse)]' 
                        : 'cursor-not-allowed opacity-40'
                    }`}
                    style={{ 
                      backgroundColor: newComment.trim() ? "var(--app-primary)" : "var(--text-muted)"
                    }}
                  >
                    <Icon name="send" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  )
}
