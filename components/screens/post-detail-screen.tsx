"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { SocialPost } from "./social-screen"

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

interface PostDetailScreenProps {
  post: SocialPost
  onBack: () => void
}

export function PostDetailScreen({ post, onBack }: PostDetailScreenProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likes, setLikes] = useState(post.likes)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([
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
    },
    {
      id: "c5",
      author: "Robert Martinez",
      username: "@robertm",
      avatar: "RM",
      avatarColor: "bg-[var(--ds-status-error)]",
      timeAgo: "6h ago",
      content: "Could you share your meal plan? I'm new to this and looking for guidance on what works.",
      likes: 3,
      isLiked: false
    }
  ])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
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

  const toggleCommentLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
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

  return (
    <ScreenLayout>
      <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" 
             style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}>
          <button onClick={onBack} className="p-1">
            <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Post
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Post Section */}
          <div className="bg-[var(--ds-surface-primary)] border-b" style={{ borderColor: "var(--border-color)" }}>
            <div className="px-4 py-4">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-sm ${post.avatarColor}`}>
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div>
                    <span className="font-semibold text-base block" style={{ color: "var(--text-primary)" }}>
                      {post.author}
                    </span>
                    {!post.isSponsored && post.username && (
                      <span className="text-sm block text-[var(--text-muted)]">
                        {post.username}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {post.isSponsored ? "Sponsored" : post.timeAgo}
                </div>
              </div>

              {/* Sponsored Image */}
              {post.isSponsored && post.sponsoredImage && (
                <div className="mb-4 -mx-4">
                  <div className="w-full h-48 bg-cover bg-center" 
                       style={{ backgroundImage: `url(${post.sponsoredImage})` }} />
                </div>
              )}

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
                  {post.content}
                </p>
              </div>

              {/* CTA for Sponsored */}
              {post.isSponsored && post.ctaButton && (
                <div className="mb-4">
                  <button 
                    className="w-full py-3 rounded-lg font-medium text-[var(--ds-text-inverse)] text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--app-primary)" }}
                  >
                    {post.ctaButton}
                  </button>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleLike}
                    className="flex items-center gap-2 group transition-colors"
                  >
                    <Icon name="heart" className={`w-5 h-5 transition-all ${
                        isLiked 
                          ? 'text-[var(--ds-status-error)] fill-current' 
                          : 'group-hover:text-[var(--ds-status-error)]'
                      }`} 
                      style={!isLiked ? { color: "var(--text-muted)" } : {}}
                    />
                    <span className={`text-sm font-medium ${
                      isLiked ? 'text-[var(--ds-status-error)]' : ''
                    }`} style={!isLiked ? { color: "var(--text-muted)" } : {}}>
                      {likes}
                    </span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <Icon name="forum" className="w-5 h-5 text-[var(--text-muted)]" />
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}
                    </span>
                  </div>
                </div>
                
                <button className="p-2">
                  <Icon name="moreHorizontal" className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-[var(--ds-surface-primary)] px-4 py-4 pb-20">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
            </h3>
            
            {comments.map((comment) => (
              <div key={comment.id} className="mb-6">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-sm ${comment.avatarColor}`}>
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
                    <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                      {comment.content}
                    </p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleCommentLike(comment.id)}
                        className="flex items-center gap-1 group transition-colors"
                      >
                        <Icon name="heart" className={`w-4 h-4 transition-all ${
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
                  <div className="ml-12 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-xs ${reply.avatarColor}`}>
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
                          <p className="text-sm mb-2 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                            {reply.content}
                          </p>
                          
                          {/* Reply Actions */}
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleCommentLike(reply.id, true, comment.id)}
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
        </div>

        {/* Comment Input - Sticky at bottom of screen */}
        <div className="flex-shrink-0 px-4 py-3 border-t bg-[var(--ds-surface-primary)]" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-sm">
                YO
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 rounded-full border text-sm"
                  style={{ 
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-secondary)"
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className={`p-3 rounded-full transition-colors ${
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
      </div>
    </ScreenLayout>
  )
}
