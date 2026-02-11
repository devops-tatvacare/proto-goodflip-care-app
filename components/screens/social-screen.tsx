"use client"

import { useState, useEffect } from "react"
import { Icon } from '@/components/ui/icon'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { HorizontalScroll } from "@/components/ui/horizontal-scroll"
import { useFAB } from "@/contexts/fab-context"
import { MiniChatOverlay } from "@/components/overlays/mini-chat-overlay"
import { PromptSelectionOverlay } from "@/components/overlays/prompt-selection-overlay"
import { KairaPrompt } from "@/lib/constants/kaira-prompts"
import { EducationHubScreen } from "./education-hub-screen"
import { PostDetailScreen } from "./post-detail-screen"
import { CommentsOverlay } from "@/components/overlays/comments-overlay"

interface SocialScreenProps {
  onBack?: () => void // Optional since this is now a main menu
}

export interface SocialPost {
  id: string
  author: string
  username: string
  avatar: string
  avatarColor: string
  timeAgo: string
  content: string
  likes: number
  comments: number
  isLiked: boolean
  hasImage: boolean
  postType?: string
  weekNumber?: number
  totalWeeks?: number
  metrics?: {
    weight?: string | null
    hba1c?: string | null
    bp?: string | null
  }
  helpedCount?: number
  isTrending?: boolean
  isSponsored?: boolean
  sponsoredImage?: string
  ctaButton?: string
}

interface SuccessStory {
  id: string
  title: string
  author: string
  avatar: string
  weightLoss: string
  timeframe: string
  story: string
  likes: number
  isLiked: boolean
}

interface ExpertContent {
  id: string
  title: string
  expert: string
  specialty: string
  type: 'video' | 'article' | 'webinar'
  duration?: string
  views: number
  rating: number
  status: 'upcoming' | 'completed'
  scheduledDate?: string
  completedDate?: string
}

interface Testimonial {
  id: string
  name: string
  avatar: string
  condition: string
  result: string
  quote: string
  verified: boolean
}

interface ContentCard {
  id: string
  title: string
  type: 'video' | 'article' | 'success_story'
  category: 'food' | 'exercise' | 'success' | 'wellness' | 'tips'
  author: string
  duration?: string
  views: number
  thumbnail: string
  description: string
}

interface SessionCard {
  id: string
  title: string
  type: 'fitness' | 'webinar' | 'qna' | 'workshop' | 'consultation'
  category: 'fitness' | 'education' | 'expert' | 'group' | 'personal'
  instructor: string
  date: string
  time: string
  duration: string
  participants: number
  maxParticipants: number
  status: 'upcoming' | 'live' | 'full'
  description: string
}

export function SocialScreen({ onBack }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState<"stories" | "experts">("stories")
  const [isTransitioningMode, setIsTransitioningMode] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDistance, setDragDistance] = useState(0)
  const [showEducationHub, setShowEducationHub] = useState(false)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [showPostDetail, setShowPostDetail] = useState(false)
  const [showCommentsOverlay, setShowCommentsOverlay] = useState(false)
  
  // FAB related states
  const { 
    setActions, 
    setCurrentContext,
    setIsPromptSelectionOpen,
    isPromptSelectionOpen,
    setAskKairaVisible 
  } = useFAB()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<KairaPrompt | undefined>()
  const [chatPrompts, setChatPrompts] = useState<KairaPrompt[]>([])
  
  // Expert filtering states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [specialistFilter, setSpecialistFilter] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [showCompletedContent, setShowCompletedContent] = useState(true)
  const [showUpcomingContent, setShowUpcomingContent] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Tab change handler with smooth transition
  const handleTabChange = (tab: "stories" | "experts") => {
    if (activeTab === tab) return
    
    setIsTransitioningMode(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsTransitioningMode(false)
    }, 250)
  }
  
  // Get prompts based on active tab
  const getSocialPrompts = (tab: string): KairaPrompt[] => {
    switch (tab) {
      case 'stories':
        return [
          { id: 'trending', text: "What's trending in the community?", icon: 'trending_up' },
          { id: 'success-stories', text: "Analyze success story patterns", icon: 'star' },
          { id: 'similar-journeys', text: "Find people with similar journeys", icon: 'people' },
          { id: 'best-outcomes', text: "Show best weight loss outcomes", icon: 'emoji_events' }
        ]
      case 'experts':
        return [
          { id: 'upcoming-sessions', text: "What sessions are coming up?", icon: 'event' },
          { id: 'session-transcripts', text: "Analyze past session transcripts", icon: 'description' },
          { id: 'content-recommendations', text: "Recommend content for my condition", icon: 'recommend' },
          { id: 'key-insights', text: "Key insights from recent webinars", icon: 'lightbulb' }
        ]
      default:
        return []
    }
  }
  
  const getPromptSelectionTitle = (tab: string): string => {
    switch (tab) {
      case 'stories':
        return 'Community & Success Stories'
      case 'experts':
        return 'Expert Content'
      default:
        return 'Ask Kaira'
    }
  }
  
  // Handle prompt selection
  const handlePromptSelect = (prompt: KairaPrompt) => {
    setSelectedPrompt(prompt)
    setIsPromptSelectionOpen(false)
    
    // Set other prompts for follow-up questions
    const allPrompts = getSocialPrompts(activeTab)
    setChatPrompts(allPrompts.filter(p => p.id !== prompt.id))
    
    // Open chat overlay
    setIsChatOpen(true)
    
    // Hide FAB when chat opens
    setAskKairaVisible(false)
  }
  
  // Handle chat close
  const handleChatClose = () => {
    setIsChatOpen(false)
    setSelectedPrompt(undefined)
    setChatPrompts([])
    
    // Show FAB again when chat closes
    setAskKairaVisible(true)
  }
  
  // Drag to dismiss handlers for create post modal
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    setDragDistance(0)
    
    // Add global event listeners for mouse events
    if ('clientX' in e) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }
  }

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const distance = Math.max(0, e.clientY - 200) // Start from approximate modal top
    setDragDistance(distance)
  }

  const handleGlobalMouseUp = () => {
    handleDragEnd()
    document.removeEventListener('mousemove', handleGlobalMouseMove)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const clientY = e.touches[0].clientY
    const distance = Math.max(0, clientY - 200) // Start from approximate modal top
    setDragDistance(distance)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    // If dragged down more than 100px, close the modal
    if (dragDistance > 100) {
      setShowCreatePost(false)
      setNewPostContent("")
    }
    
    setIsDragging(false)
    setDragDistance(0)
  }
  
  // Update FAB actions based on active tab
  useEffect(() => {
    const getTabActions = () => {
      const regularActions = []
      
      switch (activeTab) {
        case 'stories':
          regularActions.push(
            { 
              id: 'create-post', 
              label: 'Create Post', 
              icon: 'edit', 
              onClick: () => setShowCreatePost(true) 
            },
            { 
              id: 'search-stories', 
              label: 'Search Stories', 
              icon: 'search', 
              onClick: () => console.log('Search stories') 
            }
          )
          break
        case 'experts':
          regularActions.push(
            { 
              id: 'upcoming-sessions', 
              label: 'Upcoming Sessions', 
              icon: 'calendar_today', 
              onClick: () => console.log('Show upcoming sessions') 
            },
            { 
              id: 'start-thread', 
              label: 'Start Thread', 
              icon: 'forum', 
              onClick: () => console.log('Start discussion thread') 
            }
          )
          break
      }
      
      // Always include Ask Kaira as a special action
      return [
        ...regularActions,
        {
          id: 'ask-kaira',
          label: 'Ask Kaira',
          icon: 'stethoscope',
          onClick: () => setIsPromptSelectionOpen(true),
          isSpecial: true
        }
      ]
    }
    
    // Set all actions including Ask Kaira
    setActions(getTabActions())
    
    // Update context
    setCurrentContext(`social-${activeTab}`)
  }, [activeTab, setActions, setCurrentContext])

  // Mock data for Semaglutide community
  // Social Feed Posts (Stories Tab) - Including Sponsored Posts
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
    {
      id: "1",
      author: "Sarah Miller",
      username: "@sarah_miller",
      avatar: "SM",
      avatarColor: "bg-purple-500",
      timeAgo: "2h ago",
      content: "Started at 95kg, feeling sluggish. Semaglutide helped control my appetite while I built healthy habits. Now at 77kg, running 5Ks! 💪\n\n#HealthJourney #Semaglutide",
      likes: 342,
      comments: 45,
      isLiked: true,
      hasImage: false,
      postType: "success",
      weekNumber: 24,
      totalWeeks: 52,
      metrics: {
        weight: "-18kg",
        hba1c: null,
        bp: "120/80"
      },
      helpedCount: 28,
      isTrending: false
    },
    {
      id: "sponsored-1",
      author: "FitLife Labs",
      username: "",
      avatar: "FL",
      avatarColor: "bg-gradient-to-br from-green-400 to-blue-500",
      timeAgo: "Sponsored",
      content: "Transform your GLP-1 journey with our clinically-proven meal replacement shakes. Specially formulated to work with Semaglutide - reduce nausea, maintain nutrition, and accelerate results.\n\n✓ 25g Protein ✓ Low Sugar ✓ Essential Vitamins",
      likes: 89,
      comments: 12,
      isLiked: false,
      hasImage: false,
      isSponsored: true,
      sponsoredImage: "/images/eathealthy.jpg",
      ctaButton: "Get 20% Off Your First Order"
    },
    {
      id: "2",
      author: "James Wilson", 
      username: "@jwilson",
      avatar: "JW",
      avatarColor: "bg-[var(--ds-interactive-primary)]",
      timeAgo: "5h ago",
      content: "Type 2 diabetes was my wake-up call. Combined Semaglutide with diet changes. HbA1c: 9.2% → 5.8%, lost 25kg! 🎯\n\nMy doctor says I've reversed my diabetes progression!",
      likes: 256,
      comments: 32,
      isLiked: false,
      hasImage: false,
      postType: "milestone",
      weekNumber: 32,
      totalWeeks: 52,
      metrics: {
        weight: "-25kg",
        hba1c: "-3.4%",
        bp: "Normal"
      },
      helpedCount: 45,
      isTrending: false
    },
    {
      id: "3",
      author: "Maria Garcia",
      username: "@mariagarcia",
      avatar: "MG",
      avatarColor: "bg-pink-500",
      timeAgo: "8h ago",
      content: "Post-pregnancy weight was stubborn. Semaglutide helped break the plateau. Have energy for my toddler now! 🌟\n\nThis community's support is invaluable ❤️",
      likes: 189,
      comments: 28,
      isLiked: true,
      hasImage: false,
      postType: "support",
      weekNumber: 16,
      totalWeeks: 26,
      metrics: {
        weight: "-12kg",
        hba1c: null,
        bp: null
      },
      helpedCount: 15,
      isTrending: false
    },
    {
      id: "sponsored-2",
      author: "HealthTrack Pro",
      username: "",
      avatar: "HT",
      avatarColor: "bg-gradient-to-br from-purple-400 to-pink-500",
      timeAgo: "Sponsored",
      content: "Smart scale designed for GLP-1 users. Track muscle mass retention during weight loss. Sync with your health app and share progress with your doctor.\n\n📊 Body Composition Analysis\n📱 App Integration\n👨‍⚕️ Healthcare Provider Portal",
      likes: 156,
      comments: 8,
      isLiked: false,
      hasImage: false,
      isSponsored: true,
      sponsoredImage: "/images/track-your-progress.jpg",
      ctaButton: "Learn More About Smart Tracking"
    },
    {
      id: "4",
      author: "David Chen",
      username: "@davidc",
      avatar: "DC",
      avatarColor: "bg-[var(--ds-status-success)]",
      timeAgo: "1d ago",
      content: "Week 12: Down 15kg! 📉\n\nMy routine:\n✅ Morning walks\n✅ Meal prep Sundays\n✅ Track everything\n✅ Weekly support group\n\nKeep going everyone! 💪",
      likes: 423,
      comments: 67,
      isLiked: false,
      hasImage: false,
      postType: "tip",
      weekNumber: 12,
      totalWeeks: 52,
      metrics: {
        weight: "-15kg",
        hba1c: null,
        bp: null
      },
      helpedCount: 67,
      isTrending: false
    },
    {
      id: "5",
      author: "Lisa Thompson",
      username: "@lisa_t",
      avatar: "LT",
      avatarColor: "bg-orange-500",
      timeAgo: "1d ago",
      content: "Tough week with side effects 😔 But community tips helped:\n• Small meals\n• Ginger tea\n• Stay hydrated\n• Walk after meals\n\nFeeling better! We're in this together 🤝",
      likes: 567,
      comments: 89,
      isLiked: true,
      hasImage: false,
      postType: "question",
      weekNumber: 8,
      totalWeeks: 26,
      metrics: {
        weight: "-8kg",
        hba1c: null,
        bp: null
      },
      helpedCount: 89,
      isTrending: false
    },
    {
      id: "6",
      author: "Robert Martinez",
      username: "@robertm",
      avatar: "RM",
      avatarColor: "bg-indigo-500",
      timeAgo: "2d ago",
      content: "Lab results 🎉\n\nHbA1c: 9.8% → 6.2%\nCholesterol: 280 → 185\nBP: Normal\n\n6 months Semaglutide + lifestyle = transformed!",
      likes: 892,
      comments: 124,
      isLiked: false,
      hasImage: false,
      postType: "success",
      weekNumber: 26,
      totalWeeks: 52,
      metrics: {
        weight: "-30kg",
        hba1c: "-3.6%",
        bp: "Normal"
      },
      helpedCount: 124,
      isTrending: false
    }
  ])

  const expertContent: ExpertContent[] = [
    {
      id: "1",
      title: "Semaglutide Nutrition: What to Eat for Best Results",
      expert: "Dr. Maria Santos",
      specialty: "Endocrinologist",
      type: "video",
      duration: "15:30",
      views: 12400,
      rating: 4.8,
      status: "completed",
      completedDate: "2024-01-15"
    },
    {
      id: "2",
      title: "Managing Side Effects: A Complete Guide",
      expert: "Dr. James Wilson",
      specialty: "Diabetes Specialist",  
      type: "article",
      views: 8900,
      rating: 4.9,
      status: "completed",
      completedDate: "2024-01-20"
    },
    {
      id: "3",
      title: "Exercise & Semaglutide: Maximizing Your Results",
      expert: "Lisa Thompson",
      specialty: "Clinical Nutritionist",
      type: "webinar",
      duration: "45:00", 
      views: 5600,
      rating: 4.7,
      status: "upcoming",
      scheduledDate: "2024-02-15"
    },
    {
      id: "4",
      title: "Advanced Dosing Strategies for Optimal Outcomes",
      expert: "Dr. Sarah Chen",
      specialty: "Diabetes Specialist",
      type: "webinar",
      duration: "60:00",
      views: 0,
      rating: 5.0,
      status: "upcoming",
      scheduledDate: "2024-02-22"
    },
    {
      id: "5",
      title: "Understanding GLP-1 Receptor Biology",
      expert: "Dr. Michael Torres",
      specialty: "Endocrinologist",
      type: "article",
      views: 3200,
      rating: 4.6,
      status: "completed",
      completedDate: "2024-01-10"
    },
    {
      id: "6",
      title: "Patient Success Stories & Case Studies",
      expert: "Dr. Maria Santos",
      specialty: "Endocrinologist",
      type: "video",
      duration: "25:00",
      views: 7800,
      rating: 4.9,
      status: "completed",
      completedDate: "2024-01-25"
    },
    {
      id: "7",
      title: "Q&A: Common Questions About Semaglutide",
      expert: "Dr. Jennifer Walsh",
      specialty: "Clinical Pharmacist",
      type: "webinar",
      duration: "40:00",
      views: 0,
      rating: 0,
      status: "upcoming",
      scheduledDate: "2024-02-28"
    }
  ]

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "David K.",
      avatar: "👨‍💻", 
      condition: "Type 2 Diabetes + Obesity",
      result: "Weight: -22kg",
      quote: "Semaglutide gave me my life back. I can play with my kids again and my diabetes is under control.",
      verified: true
    },
    {
      id: "2",
      name: "Amanda P.",
      avatar: "👩‍🏫",
      condition: "Pre-diabetes + Weight Management", 
      result: "Weight: -15kg",
      quote: "The appetite control was exactly what I needed. Combined with lifestyle changes, I'm healthier than ever.",
      verified: true
    },
    {
      id: "3",
      name: "Robert C.",
      avatar: "👨‍🍳",
      condition: "Obesity + High Blood Pressure",
      result: "Weight: -28kg",
      quote: "6 months on Semaglutide and I'm off blood pressure medication. My doctor is amazed at the progress.",
      verified: true
    }
  ]

  const motivationalQuotes = [
    { text: "Every injection is a step towards a healthier you", author: "Dr. Sarah Chen" },
    { text: "Progress, not perfection, is the goal", author: "Wellness Coach Maria" },
    { text: "Your health journey is unique - celebrate every milestone", author: "Patient Success Team" },
    { text: "Consistency with Semaglutide creates lasting change", author: "Dr. Michael Torres" }
  ]

  // New content data for experts tab
  const contentCards: ContentCard[] = [
    {
      id: "1",
      title: "Heart-Healthy Mediterranean Meal Prep",
      type: "video",
      category: "food",
      author: "Dr. Sarah Martinez, Cardiologist",
      duration: "12:30",
      views: 8420,
      thumbnail: "",
      description: "Learn how to prepare nutritious Mediterranean meals that support heart health and taste amazing."
    },
    {
      id: "2", 
      title: "5-Minute Morning Stretches for Joint Health",
      type: "video",
      category: "exercise",
      author: "Lisa Chen, Physical Therapist",
      duration: "5:15",
      views: 12300,
      thumbnail: "",
      description: "Simple morning stretches to improve flexibility and reduce joint stiffness throughout the day."
    },
    {
      id: "3",
      title: "From Diagnosis to Recovery: My Journey with Diabetes",
      type: "success_story",
      category: "success",
      author: "Michael Rodriguez",
      views: 5670,
      thumbnail: "",
      description: "How I transformed my health after my Type 2 diabetes diagnosis through lifestyle changes and support."
    },
    {
      id: "4",
      title: "Understanding Your Lab Results",
      type: "article",
      category: "wellness",
      author: "Dr. Jennifer Walsh, Endocrinologist",
      views: 9800,
      thumbnail: "",
      description: "A complete guide to understanding what your blood work results mean for your health journey."
    },
    {
      id: "5",
      title: "Building Healthy Sleep Habits",
      type: "article",
      category: "tips",
      author: "Dr. Alan Kim, Sleep Specialist",
      views: 6540,
      thumbnail: "",
      description: "Evidence-based strategies to improve sleep quality and support your overall health and recovery."
    }
  ]

  const sessionCards: SessionCard[] = [
    {
      id: "1",
      title: "Morning Fitness Training for Diabetes Management",
      type: "fitness",
      category: "fitness",
      instructor: "Sarah Johnson, Certified Trainer",
      date: "2024-08-28",
      time: "07:00",
      duration: "45 min",
      participants: 12,
      maxParticipants: 20,
      status: "upcoming",
      description: "Low-impact exercises designed specifically for people managing diabetes and weight loss."
    },
    {
      id: "2",
      title: "Understanding Semaglutide: Expert Webinar",
      type: "webinar",
      category: "education",
      instructor: "Dr. Michael Chen, Endocrinologist",
      date: "2024-08-29",
      time: "19:00",
      duration: "60 min",
      participants: 85,
      maxParticipants: 100,
      status: "upcoming",
      description: "Comprehensive guide to Semaglutide therapy, side effects, and optimizing results."
    },
    {
      id: "3",
      title: "Doctor-Led Q&A: Managing Side Effects",
      type: "qna",
      category: "expert",
      instructor: "Dr. Lisa Rodriguez, GLP-1 Specialist",
      date: "2024-08-30",
      time: "18:30",
      duration: "90 min",
      participants: 45,
      maxParticipants: 50,
      status: "upcoming",
      description: "Live Q&A session addressing common concerns and side effect management strategies."
    },
    {
      id: "4",
      title: "Nutrition Workshop: Meal Planning with GLP-1",
      type: "workshop",
      category: "group",
      instructor: "Maria Santos, Clinical Nutritionist",
      date: "2024-09-02",
      time: "16:00",
      duration: "120 min",
      participants: 28,
      maxParticipants: 30,
      status: "upcoming",
      description: "Interactive workshop on creating sustainable meal plans while on GLP-1 therapy."
    },
    {
      id: "5",
      title: "Mental Wellness & Weight Loss Journey",
      type: "consultation",
      category: "personal",
      instructor: "Dr. Amanda Kim, Psychologist",
      date: "2024-09-03",
      time: "14:00",
      duration: "30 min",
      participants: 8,
      maxParticipants: 15,
      status: "upcoming",
      description: "Group session focused on mental health support during weight loss journey."
    }
  ]

  // Helper functions for post types
  const getPostTypeConfig = (type: string) => {
    switch (type) {
      case 'success':
        return { 
          icon: (props: any) => <Icon name="trophy" {...props} />, 
          label: 'SUCCESS STORY', 
          color: 'var(--status-success)',
          bgColor: 'rgba(34, 197, 94, 0.1)'
        }
      case 'milestone':
        return { 
          icon: (props: any) => <Icon name="trendingUp" {...props} />, 
          label: 'MILESTONE', 
          color: 'var(--app-primary)',
          bgColor: 'rgba(59, 130, 246, 0.1)'
        }
      case 'support':
        return { 
          icon: (props: any) => <Icon name="handshake" {...props} />, 
          label: 'SUPPORT', 
          color: 'var(--app-tertiary)',
          bgColor: 'rgba(168, 85, 247, 0.1)'
        }
      case 'tip':
        return { 
          icon: (props: any) => <Icon name="sparkles" {...props} />, 
          label: 'TIP', 
          color: 'var(--app-secondary)',
          bgColor: 'rgba(251, 191, 36, 0.1)'
        }
      case 'question':
        return { 
          icon: (props: any) => <Icon name="help" {...props} />, 
          label: 'QUESTION', 
          color: 'var(--chip-text-primary)',
          bgColor: 'var(--chip-bg-primary)'
        }
      default:
        return { 
          icon: (props: any) => <Icon name="forum" {...props} />, 
          label: 'POST', 
          color: 'var(--text-secondary)',
          bgColor: 'var(--bg-secondary)'
        }
    }
  }

  // Helper functions
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Icon name="restaurant" className="w-4 h-4" />
      case 'exercise': return <Icon name="fitnessCenter" className="w-4 h-4" />
      case 'success': return <Icon name="trophy" className="w-4 h-4" />
      case 'wellness': return <Icon name="heart" className="w-4 h-4" />
      case 'tips': return <Icon name="heart" className="w-4 h-4" />
      default: return <Icon name="heart" className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return 'var(--app-tertiary)'
      case 'exercise': return 'var(--app-primary)'
      case 'success': return 'var(--app-secondary)'
      case 'wellness': return 'var(--app-primary)'
      case 'tips': return 'var(--app-tertiary)'
      default: return 'var(--app-primary)'
    }
  }

  const getPlaceholderImage = (category: string, id: string, title: string): string => {
    // Available images from actual /public/images/ folder
    const availableImages = [
      '/images/eathealthy.jpg',
      '/images/dehydration.jpg',
      '/images/healthy-snacks.jpg',
      '/images/hydration.jpg',
      '/images/indoor-exercise.jpg',
      '/images/managing-sleep.jpg',
      '/images/meal-planning.jpg',
      '/images/medical-consultation.png',
      '/images/milestone.jpg',
      '/images/pillsontime.jpg',
      '/images/portion-control.jpg',
      '/images/setting-realistic-goals.jpg',
      '/images/telemedicine-consultation.png',
      '/images/timely-medication.jpg',
      '/images/track-your-progress.jpg'
    ]
    
    if (title.toLowerCase().includes('mediterranean') || title.toLowerCase().includes('meal prep') || title.toLowerCase().includes('heart-healthy')) {
      return '/images/eathealthy.jpg'
    }
    if (title.toLowerCase().includes('stretches') || title.toLowerCase().includes('exercise') || title.toLowerCase().includes('morning')) {
      return '/images/indoor-exercise.jpg'
    }
    if (title.toLowerCase().includes('diabetes') || title.toLowerCase().includes('success') || title.toLowerCase().includes('journey')) {
      return '/images/milestone.jpg'
    }
    if (title.toLowerCase().includes('lab results') || title.toLowerCase().includes('understanding') || title.toLowerCase().includes('wellness')) {
      return '/images/medical-consultation.png'
    }
    if (title.toLowerCase().includes('sleep') || title.toLowerCase().includes('habits') || title.toLowerCase().includes('building')) {
      return '/images/managing-sleep.jpg'
    }
    
    // Use hash-based consistent selection for remaining content
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const index = Math.abs(hash) % availableImages.length
    return availableImages[index]
  }

  const getSessionPlaceholderImage = (category: string, id: string, title: string): string => {
    // Available images from actual /public/images/ folder
    const availableImages = [
      '/images/eathealthy.jpg',
      '/images/dehydration.jpg',
      '/images/healthy-snacks.jpg',
      '/images/hydration.jpg',
      '/images/indoor-exercise.jpg',
      '/images/managing-sleep.jpg',
      '/images/meal-planning.jpg',
      '/images/medical-consultation.png',
      '/images/milestone.jpg',
      '/images/pillsontime.jpg',
      '/images/portion-control.jpg',
      '/images/setting-realistic-goals.jpg',
      '/images/telemedicine-consultation.png',
      '/images/timely-medication.jpg',
      '/images/track-your-progress.jpg'
    ]
    
    if (title.toLowerCase().includes('fitness') || title.toLowerCase().includes('training') || title.toLowerCase().includes('morning')) {
      return '/images/indoor-exercise.jpg'
    }
    if (title.toLowerCase().includes('semaglutide') || title.toLowerCase().includes('webinar') || title.toLowerCase().includes('understanding')) {
      return '/images/telemedicine-consultation.png'
    }
    if (title.toLowerCase().includes('expert') || title.toLowerCase().includes('qna') || title.toLowerCase().includes('doctor')) {
      return '/images/medical-consultation.png'
    }
    if (title.toLowerCase().includes('nutrition') || title.toLowerCase().includes('workshop') || title.toLowerCase().includes('meal')) {
      return '/images/meal-planning.jpg'
    }
    if (title.toLowerCase().includes('mental') || title.toLowerCase().includes('wellness') || title.toLowerCase().includes('weight loss')) {
      return '/images/managing-sleep.jpg'
    }
    
    // Use hash-based consistent selection for remaining content
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const index = Math.abs(hash) % availableImages.length
    return availableImages[index]
  }

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'fitness': return <Icon name="fitnessCenter" className="w-4 h-4" />
      case 'webinar': return <Icon name="video" className="w-4 h-4" />
      case 'qna': return <Icon name="forum" className="w-4 h-4" />
      case 'workshop': return <Icon name="group" className="w-4 h-4" />
      case 'consultation': return <Icon name="heart" className="w-4 h-4" />
      default: return <Icon name="calendar" className="w-4 h-4" />
    }
  }

  const getSessionColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'var(--app-primary)'
      case 'education': return 'var(--app-secondary)'
      case 'expert': return 'var(--app-tertiary)'
      case 'group': return 'var(--app-primary)'
      case 'personal': return 'var(--app-secondary)'
      default: return 'var(--app-primary)'
    }
  }

  const formatSessionDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatSessionTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Filter functions for expert content
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const filteredExpertContent = expertContent.filter(content => {
    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(content.type)) {
      return false
    }
    
    // Specialist name filter
    if (specialistFilter && !content.expert.toLowerCase().includes(specialistFilter.toLowerCase())) {
      return false
    }
    
    // Rating filter
    if (content.rating < minRating) {
      return false
    }
    
    // Status filter
    if (!showCompletedContent && content.status === 'completed') {
      return false
    }
    if (!showUpcomingContent && content.status === 'upcoming') {
      return false
    }
    
    return true
  })

  // Organize content by status
  const upcomingContent = filteredExpertContent.filter(c => c.status === 'upcoming').sort((a, b) => 
    new Date(a.scheduledDate || '').getTime() - new Date(b.scheduledDate || '').getTime()
  )
  const completedContent = filteredExpertContent.filter(c => c.status === 'completed').sort((a, b) => 
    new Date(b.completedDate || '').getTime() - new Date(a.completedDate || '').getTime()
  )

  // Handle post click to open full detail
  const handlePostClick = (post: SocialPost) => {
    setSelectedPost(post)
    setShowPostDetail(true)
  }

  // Handle comment button click to open comments overlay
  const handleCommentsClick = (e: React.MouseEvent, post: SocialPost) => {
    e.stopPropagation() // Prevent post click
    setSelectedPost(post)
    setShowCommentsOverlay(true)
  }

  // Show Education Hub if selected
  if (showEducationHub) {
    return <EducationHubScreen onBack={() => setShowEducationHub(false)} />
  }

  // Show Post Detail if selected
  if (showPostDetail && selectedPost) {
    return <PostDetailScreen 
      post={selectedPost} 
      onBack={() => {
        setShowPostDetail(false)
        setSelectedPost(null)
      }} 
    />
  }

  return (
    <ScreenLayout>
      <div className={`flex flex-col h-full transition-opacity duration-500 ${isTransitioningMode ? 'opacity-0' : 'opacity-100'} relative`} 
           style={{ background: "var(--app-login-gradient)" }}>
        
        {/* Subtle background pattern overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-32 right-16 w-24 h-24 bg-gradient-to-br from-green-200/20 to-transparent rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
        </div>

        {/* Tab Navigation - Same styling as Health Assistant */}
        <div className="flex items-center justify-center py-2 relative z-20">
          <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 rounded-full shadow-lg shadow-black/10 p-1.5">
            <div className="flex items-center gap-1">
              {/* Stories Tab */}
              <button
                onClick={() => handleTabChange('stories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'stories' 
                    ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                    : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
                }`}
                style={activeTab === 'stories' ? {
                  background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
                } : {}}
              >
                <Icon name="handshake" className="w-4 h-4" />
                Stories
              </button>
              
              {/* Experts Tab */}
              <button
                onClick={() => handleTabChange('experts')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'experts' 
                    ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                    : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
                }`}
                style={activeTab === 'experts' ? {
                  background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
                } : {}}
              >
                <Icon name="personCheck" className="w-4 h-4" />
                Experts
              </button>
              
            </div>
          </div>
        </div>


        {/* Tab Content */}
        <div className={`flex-1 overflow-y-auto px-0 pb-20 relative z-10 transition-all duration-500 ${
          isTransitioningMode ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
        }`}>

          {activeTab === 'stories' && (
            <div className="relative">
              {/* Success Stories Section */}
              <div className="py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
                <h2 className="text-lg font-semibold mb-3 px-4" style={{ color: "var(--text-primary)" }}>
                  Success Stories
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pl-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className={`flex-shrink-0 w-64 ${index === testimonials.length - 1 ? 'pr-4' : ''}`}>
                      <div 
                        className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
                        style={{ borderColor: "var(--border-color)", height: "240px" }}
                      >
                        {/* Success Story Header */}
                        <div className="p-4 pb-0 flex-shrink-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" 
                                 style={{ 
                                   backgroundColor: "var(--chip-bg-primary)",
                                   color: "var(--chip-text-primary)" 
                                 }}>
                              {testimonial.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                  {testimonial.name}
                                </span>
                                {testimonial.verified && (
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs"
                                       style={{ 
                                         backgroundColor: "var(--status-success)",
                                         color: "var(--ds-text-inverse)" 
                                       }}>
                                    <Icon name="award" className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                {testimonial.condition}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quote - Flexible middle section */}
                        <div className="px-4 flex-1 flex items-center">
                          <blockquote className="text-sm leading-relaxed italic" 
                                      style={{ color: "var(--text-primary)" }}>
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                        
                        {/* Results Metrics - Footer */}
                        <div className="p-4 pt-0 flex-shrink-0">
                          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
                            <div className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                              Weight Loss
                            </div>
                            <div className="text-lg font-bold text-[var(--status-success)]">
                              {testimonial.result.split(': ')[1]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Community Posts Feed */}
              <div>
                {socialPosts.map((post) => {
                  const postTypeConfig = getPostTypeConfig(post.postType || 'default')
                  const PostTypeIcon = postTypeConfig.icon
                  const progressPercentage = post.weekNumber && post.totalWeeks ? Math.round((post.weekNumber / post.totalWeeks) * 100) : 0
                  
                  return (
                    <div 
                      key={post.id} 
                      className="border-b cursor-pointer transition-colors hover:bg-[var(--ds-surface-secondary)]" 
                      style={{ borderColor: "var(--border-color)" }}
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="px-4 py-3">
                        {/* Post Header */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-sm ${post.avatarColor}`}>
                            {post.avatar}
                          </div>
                          <div className="flex-1">
                            <div>
                              <span className="font-semibold text-sm block" style={{ color: "var(--text-primary)" }}>
                                {post.author}
                              </span>
                              {!post.isSponsored && post.username && (
                                <span className="text-xs block" style={{ color: "var(--text-muted)" }}>
                                  {post.username}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {post.isSponsored ? "Sponsored" : post.timeAgo}
                          </div>
                        </div>
                        
                        {/* Sponsored Image - after header, before content */}
                        {post.isSponsored && post.sponsoredImage && (
                          <div className="mb-3 -mx-4">
                            <div className="w-full h-48 bg-cover bg-center" 
                                 style={{ backgroundImage: `url(${post.sponsoredImage})` }} />
                          </div>
                        )}
                        
                        {/* Post Content */}
                        <div className="ml-0 mb-3">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
                            {post.content}
                          </p>
                        </div>
                        
                        
                        {/* Call to Action for Sponsored */}
                        {post.isSponsored && post.ctaButton && (
                          <div className="ml-0 mb-3">
                            <button 
                              className="w-full py-2.5 rounded-lg font-medium text-[var(--ds-text-inverse)] text-sm transition-opacity hover:opacity-90"
                              style={{ backgroundColor: "var(--app-primary)" }}
                            >
                              {post.ctaButton}
                            </button>
                          </div>
                        )}
                        
                        {/* Post Actions */}
                        <div className="flex items-center gap-6 ml-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation() // Prevent post click
                              const updatedPosts = socialPosts.map(p => 
                                p.id === post.id 
                                  ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
                                  : p
                              )
                              setSocialPosts(updatedPosts)
                            }}
                            className="flex items-center gap-2 group transition-colors"
                          >
                            <Icon name="heart" className={`w-4 h-4 transition-all ${
                                post.isLiked 
                                  ? 'text-[var(--ds-status-error)] fill-current' 
                                  : 'group-hover:text-[var(--ds-status-error)]'
                              }`} 
                              style={!post.isLiked ? { color: "var(--text-muted)" } : {}}
                            />
                            <span className={`text-xs font-medium ${
                              post.isLiked ? 'text-[var(--ds-status-error)]' : ''
                            }`} style={!post.isLiked ? { color: "var(--text-muted)" } : {}}>
                              {post.likes}
                            </span>
                          </button>
                          
                          <button 
                            onClick={(e) => handleCommentsClick(e, post)}
                            className="flex items-center gap-2 group transition-colors"
                          >
                            <Icon name="forum" className="w-4 h-4 group-hover:text-[var(--ds-interactive-primary)]" 
                              style={{ color: "var(--text-muted)" }}
                            />
                            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                              {post.comments}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'experts' && (
            <div className="space-y-4">
              {/* Learn Something New Section */}
              <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      Learn Something New
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Curated content from our health experts
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEducationHub(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ 
                      backgroundColor: "var(--chip-bg-primary)",
                      color: "var(--app-primary)"
                    }}
                  >
                    See All
                  </button>
                </div>
              </div>

              {/* Content Carousel - Edge to edge */}
              <div>
                <div className="flex gap-3 overflow-x-auto pl-4 pb-2 scrollbar-hide">
                  {contentCards.map((card, index) => (
                    <div key={card.id} className={`w-64 flex-shrink-0 ${index === 0 ? '' : ''} ${index === contentCards.length - 1 ? 'pr-4' : ''}`}>
                      <div 
                        className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200 h-full"
                        style={{ borderColor: "var(--border-color)", height: "280px" }}
                      >
                        {/* Card Header with Thumbnail */}
                        <div className="relative bg-cover bg-center overflow-hidden"
                             style={{ 
                               height: "72px",
                               backgroundImage: `url(${getPlaceholderImage(card.category, card.id, card.title)})`,
                             }}>
                          {/* Subtle overlay for better visual separation */}
                          <div className="absolute inset-0 bg-black/20" />
                          
                          {/* Play button overlay for videos */}
                          {card.type === 'video' && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-8 h-8 bg-[var(--ds-surface-primary)]/90 rounded-full flex items-center justify-center">
                                <Icon name="play" className="w-4 h-4 text-gray-700 ml-0.5" />
                              </div>
                            </div>
                          )}
                          
                          {/* Category icon in corner */}
                          <div className="absolute top-2 left-2">
                            <div className="w-5 h-5 bg-[var(--ds-surface-primary)]/90 rounded-full flex items-center justify-center">
                              {getCategoryIcon(card.category)}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3 flex flex-col h-full" style={{ height: "calc(280px - 72px)" }}>
                          {/* Category and Type Badge */}
                          <div className="flex items-center gap-1 mb-1.5">
                            <div className="px-2 py-0.5 rounded text-xs font-medium"
                                 style={{ 
                                   backgroundColor: "var(--chip-bg-primary)",
                                   color: "var(--chip-text-primary)"
                                 }}>
                              {card.type.replace('_', ' ')}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-semibold mb-1 leading-tight line-clamp-2" 
                              style={{ color: "var(--text-primary)" }}>
                            {card.title}
                          </h3>

                          {/* Author */}
                          <p className="text-xs font-medium mb-1.5" 
                             style={{ color: "var(--app-primary)" }}>
                            {card.author}
                          </p>

                          {/* Description */}
                          <p className="text-xs leading-relaxed mb-2 line-clamp-2 flex-grow" 
                             style={{ color: "var(--text-secondary)" }}>
                            {card.description}
                          </p>

                          {/* Metrics - pushed to bottom */}
                          <div className="flex items-center justify-between text-xs mt-auto">
                            <div className="flex items-center gap-2">
                              {card.duration && (
                                <div className="flex items-center gap-1">
                                  <Icon name="clock" className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                                  <span style={{ color: "var(--text-muted)" }}>{card.duration}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Icon name="eye" className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                                <span style={{ color: "var(--text-muted)" }}>{card.views > 1000 ? `${(card.views/1000).toFixed(1)}k` : card.views}</span>
                              </div>
                            </div>
                            <button 
                              className="px-2 py-1 rounded text-xs font-medium text-[var(--ds-text-inverse)] transition-opacity hover:opacity-90"
                              style={{ backgroundColor: getCategoryColor(card.category) }}
                            >
                              {card.type === 'video' ? 'Watch' : card.type === 'article' ? 'Read' : 'View'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Join a Session Section */}
              <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      Join a Session
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Live sessions with healthcare experts
                    </p>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ 
                      backgroundColor: "var(--chip-bg-primary)",
                      color: "var(--app-primary)"
                    }}
                  >
                    See All
                  </button>
                </div>
              </div>

              {/* Sessions Carousel - Edge to edge */}
              <div>
                <div className="flex gap-3 overflow-x-auto pl-4 pb-2 scrollbar-hide">
                  {sessionCards.map((session, index) => (
                    <div key={session.id} className={`w-64 flex-shrink-0 ${index === 0 ? '' : ''} ${index === sessionCards.length - 1 ? 'pr-4' : ''}`}>
                      <div 
                        className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200 h-full"
                        style={{ borderColor: "var(--border-color)", height: "280px" }}
                      >
                        {/* Session Header with Image */}
                        <div className="relative bg-cover bg-center overflow-hidden"
                             style={{ 
                               height: "72px",
                               backgroundImage: `url(${getSessionPlaceholderImage(session.category, session.id, session.title)})`,
                             }}>
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/30" />
                          
                          {/* Live indicator for upcoming sessions */}
                          {session.status === 'upcoming' && (
                            <div className="absolute top-2 right-2">
                              <div className="px-2 py-1 bg-[var(--ds-status-error)] text-[var(--ds-text-inverse)] text-xs font-medium rounded-full flex items-center gap-1">
                                <div className="w-2 h-2 bg-[var(--ds-surface-primary)] rounded-full animate-pulse" />
                                UPCOMING
                              </div>
                            </div>
                          )}
                          
                          {/* Session type icon in corner */}
                          <div className="absolute top-2 left-2">
                            <div className="w-5 h-5 bg-[var(--ds-surface-primary)]/90 rounded-full flex items-center justify-center">
                              {getSessionIcon(session.type)}
                            </div>
                          </div>
                        </div>

                        {/* Session Content */}
                        <div className="p-3 flex flex-col h-full" style={{ height: "calc(280px - 72px)" }}>
                          {/* Session Type Badge */}
                          <div className="flex items-center gap-1 mb-1.5">
                            <div className="px-2 py-0.5 rounded text-xs font-medium"
                                 style={{ 
                                   backgroundColor: "var(--chip-bg-primary)",
                                   color: "var(--chip-text-primary)"
                                 }}>
                              {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                            </div>
                            {session.participants >= session.maxParticipants && (
                              <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                FULL
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-semibold mb-1 leading-tight line-clamp-2" 
                              style={{ color: "var(--text-primary)" }}>
                            {session.title}
                          </h3>

                          {/* Instructor */}
                          <p className="text-xs font-medium mb-1.5" 
                             style={{ color: "var(--app-primary)" }}>
                            {session.instructor}
                          </p>

                          {/* Session Details */}
                          <div className="flex items-center gap-2 mb-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                            <div className="flex items-center gap-1">
                              <Icon name="calendar" className="w-3 h-3" />
                              <span>{formatSessionDate(session.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="clock" className="w-3 h-3" />
                              <span>{formatSessionTime(session.time)}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs leading-relaxed mb-2 line-clamp-2 flex-grow" 
                             style={{ color: "var(--text-secondary)" }}>
                            {session.description}
                          </p>

                          {/* Participants and Action - pushed to bottom */}
                          <div className="flex items-center justify-between text-xs mt-auto">
                            <div className="flex items-center gap-1">
                              <Icon name="group" className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                              <span style={{ color: "var(--text-muted)" }}>
                                {session.participants}/{session.maxParticipants}
                              </span>
                            </div>
                            <button 
                              className="px-2 py-1 rounded text-xs font-medium text-[var(--ds-text-inverse)] transition-opacity hover:opacity-90"
                              style={{ 
                                backgroundColor: session.participants >= session.maxParticipants 
                                  ? "var(--text-secondary)" 
                                  : getSessionColor(session.category) 
                              }}
                              disabled={session.participants >= session.maxParticipants}
                            >
                              {session.participants >= session.maxParticipants ? 'Full' : 'Join'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}



        </div>
      </div>
      
      {/* Prompt Selection Overlay */}
      <PromptSelectionOverlay
        isOpen={isPromptSelectionOpen}
        onClose={() => setIsPromptSelectionOpen(false)}
        prompts={getSocialPrompts(activeTab)}
        onSelectPrompt={handlePromptSelect}
        title={getPromptSelectionTitle(activeTab)}
      />
      
      {/* Mini Chat Overlay */}
      <MiniChatOverlay 
        isOpen={isChatOpen}
        onClose={handleChatClose}
        initialPrompt={selectedPrompt}
        otherPrompts={chatPrompts}
        metricContext={`Social - ${activeTab === 'stories' ? 'Community Stories' : 'Expert Content'}`}
      />

      {/* Comments Overlay */}
      <CommentsOverlay
        isOpen={showCommentsOverlay}
        onClose={() => {
          setShowCommentsOverlay(false)
          setSelectedPost(null)
        }}
        post={selectedPost}
      />
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => {
              setShowCreatePost(false)
              setNewPostContent("")
            }}
          />
          
          {/* Create Post Overlay */}
          <div 
            className="absolute left-0 right-0 bottom-0 bg-[var(--ds-surface-primary)] rounded-t-2xl shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out" 
            style={{ 
              height: "65%",
              transform: isDragging ? `translateY(${dragDistance}px)` : 'translateY(0px)'
            }}
          >
            {/* Drag Handle - Interactive */}
            <div 
              className="flex-shrink-0 flex items-center justify-center py-3 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></div>
            </div>
            
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-center px-4 pb-4 border-b border-[var(--ds-border-default)]">
              <span className="font-semibold text-gray-900">Create Post</span>
              <button
                onClick={() => {
                  if (newPostContent.trim()) {
                    const newPost = {
                      id: Date.now().toString(),
                      author: "You",
                      username: "@you",
                      avatar: "YO",
                      avatarColor: "bg-gradient-to-r from-blue-500 to-purple-500",
                      timeAgo: "now",
                      content: newPostContent,
                      likes: 0,
                      comments: 0,
                      isLiked: false,
                      hasImage: false,
                      postType: "support",
                      weekNumber: 1,
                      totalWeeks: 52,
                      metrics: {
                        weight: null,
                        hba1c: null,
                        bp: null
                      },
                      helpedCount: 0,
                      isTrending: false
                    }
                    setSocialPosts([newPost, ...socialPosts])
                    setShowCreatePost(false)
                    setNewPostContent("")
                  }
                }}
                className={`absolute right-4 px-4 py-1.5 rounded-full text-sm font-medium text-[var(--ds-text-inverse)] transition-all ${
                  newPostContent.trim() ? 'bg-[var(--ds-interactive-primary)] hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!newPostContent.trim()}
              >
                Post
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-[var(--ds-text-inverse)] font-medium text-sm flex-shrink-0">
                  YO
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your journey, ask questions, or encourage others..."
                    className="w-full min-h-[120px] text-sm resize-none focus:outline-none text-gray-900 placeholder-gray-500"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            {/* Post Options Footer */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-[var(--ds-border-default)] bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                    <Icon name="camera" className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                    <Icon name="image" className="w-4 h-4" />
                    <span>Gallery</span>
                  </button>
                </div>
                <span className="text-xs text-[var(--ds-text-secondary)]">
                  {newPostContent.length}/500
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </ScreenLayout>
  )
}


// Enhanced Expert Card Component with Status
function ExpertCard({ content }: { content: ExpertContent }) {
  const typeConfig = {
    video: { icon: (props: any) => <Icon name="video" {...props} />, label: 'Video' },
    article: { icon: (props: any) => <Icon name="bookOpen" {...props} />, label: 'Article' },
    webinar: { icon: (props: any) => <Icon name="play" {...props} />, label: 'Webinar' }
  }
  
  const IconComponent = typeConfig[content.type].icon
  const isUpcoming = content.status === 'upcoming'
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  return (
    <div className={`bg-[var(--ds-surface-primary)] rounded-lg border mx-4 mb-3 hover:shadow-sm transition-shadow duration-200 ${
      isUpcoming ? 'ring-1 ring-blue-200' : ''
    }`} 
         style={{ borderColor: isUpcoming ? "var(--app-primary)" : "var(--border-color)" }}>
      <div className="p-3">
        {/* Header with type, status, and rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" 
                 style={{ backgroundColor: "var(--chip-bg-primary)" }}>
              <IconComponent className="w-3.5 h-3.5" style={{ color: "var(--chip-text-primary)" }} />
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded" 
                  style={{ 
                    backgroundColor: "var(--bg-secondary)", 
                    color: "var(--text-secondary)" 
                  }}>
              {typeConfig[content.type].label}
            </span>
            {isUpcoming && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" 
                    style={{ 
                      backgroundColor: "var(--app-primary)", 
                      color: "var(--ds-text-inverse)" 
                    }}>
                Upcoming
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {content.rating > 0 ? (
              <>
                <Icon name="star" className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {content.rating}
                </span>
              </>
            ) : (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                New
              </span>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-snug" 
            style={{ color: "var(--text-primary)" }}>
          {content.title}
        </h3>
        
        {/* Expert info */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-medium" style={{ color: "var(--app-primary)" }}>
            {content.expert}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>•</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {content.specialty}
          </span>
        </div>
        
        {/* Date and status info */}
        {isUpcoming && content.scheduledDate && (
          <div className="flex items-center gap-1 mb-2 text-xs" style={{ color: "var(--app-primary)" }}>
            <Icon name="calendar" className="w-3 h-3" />
            <span>Scheduled: {formatDate(content.scheduledDate)}</span>
          </div>
        )}
        
        {/* Metrics */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {content.duration && (
              <div className="flex items-center gap-1">
                <Icon name="clock" className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                <span style={{ color: "var(--text-muted)" }}>{content.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Icon name="eye" className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-muted)" }}>
                {content.views > 0 ? content.views.toLocaleString() : 'TBD'}
              </span>
            </div>
          </div>
          <button 
            className={`text-xs font-medium px-3 py-1 rounded hover:opacity-80 transition-opacity ${
              isUpcoming ? 'opacity-75' : ''
            }`}
            style={{ 
              backgroundColor: isUpcoming ? "var(--text-secondary)" : "var(--app-primary)", 
              color: "var(--ds-text-inverse)" 
            }}
          >
            {isUpcoming 
              ? (content.type === 'webinar' ? 'Register' : 'Notify Me')
              : (content.type === 'video' ? 'Watch' : content.type === 'article' ? 'Read' : 'Join')
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// Compact Review Card Component  
function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-[var(--ds-surface-primary)] rounded-lg border mx-4 mb-3 hover:shadow-sm transition-shadow duration-200" 
         style={{ borderColor: "var(--border-color)" }}>
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Compact avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" 
               style={{ 
                 backgroundColor: "var(--chip-bg-primary)",
                 color: "var(--chip-text-primary)" 
               }}>
            {testimonial.name.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Name and verification */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                {testimonial.name}
              </span>
              {testimonial.verified && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                     style={{ 
                       backgroundColor: "var(--status-success)",
                       color: "var(--ds-text-inverse)" 
                     }}>
                  <Icon name="award" className="w-2.5 h-2.5" />
                  <span className="text-xs">Verified</span>
                </div>
              )}
            </div>
            
            {/* Condition and result in compact format */}
            <div className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
              <div className="mb-1">{testimonial.condition}</div>
              <div className="font-medium text-[var(--status-success)]">
                {testimonial.result}
              </div>
            </div>
            
            {/* Compact quote */}
            <blockquote className="text-xs leading-relaxed italic" 
                        style={{ 
                          color: "var(--text-primary)",
                          borderLeft: `2px solid var(--app-primary)`,
                          paddingLeft: "8px",
                          backgroundColor: "var(--bg-secondary)",
                          padding: "6px 8px",
                          borderRadius: "4px"
                        }}>
              "{testimonial.quote}"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact Motivation Card Component
function MotivationCard({ quote }: { quote: { text: string; author: string } }) {
  return (
    <div className="bg-[var(--ds-surface-primary)] rounded-lg border mx-4 mb-3 hover:shadow-sm transition-shadow duration-200" 
         style={{ borderColor: "var(--border-color)" }}>
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Compact sparkle icon */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
               style={{ 
                 backgroundColor: "var(--chip-bg-primary)",
                 color: "var(--chip-text-primary)" 
               }}>
            <Icon name="sparkles" className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Compact quote */}
            <blockquote className="text-sm leading-relaxed mb-2 italic" 
                        style={{ 
                          color: "var(--text-primary)",
                          borderLeft: `2px solid var(--app-primary)`,
                          paddingLeft: "8px"
                        }}>
              "{quote.text}"
            </blockquote>
            
            {/* Author */}
            <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              — {quote.author}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
