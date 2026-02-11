"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { HorizontalScroll } from "@/components/ui/horizontal-scroll"

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

export function TestScreen() {

  // Mock data for "Learn Something New" content
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

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % contentCards.length)
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + contentCards.length) % contentCards.length)
  }

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

  // Function to get placeholder image following Strapi patterns
  const getPlaceholderImage = (category: string, id: string, title: string): string => {
    // Use specific images for certain content types like Strapi health tips
    if (title.toLowerCase().includes('mediterranean') || title.toLowerCase().includes('meal prep')) {
      return '/images/eathealthy.jpg'
    }
    if (title.toLowerCase().includes('stretches') || title.toLowerCase().includes('exercise')) {
      return '/images/exercise.jpg'
    }
    if (title.toLowerCase().includes('diabetes') || title.toLowerCase().includes('success')) {
      return '/images/success-story.jpg'
    }
    if (title.toLowerCase().includes('lab results') || title.toLowerCase().includes('wellness')) {
      return '/images/lab-results.jpg'
    }
    if (title.toLowerCase().includes('sleep') || title.toLowerCase().includes('habits')) {
      return '/images/sleep-wellness.jpg'
    }
    
    // Fallback to placeholder with category-specific seed
    return '/images/track-your-progress.jpg'
  }

  // Function to get session placeholder images
  const getSessionPlaceholderImage = (category: string, id: string, title: string): string => {
    if (title.toLowerCase().includes('fitness') || title.toLowerCase().includes('training')) {
      return '/images/fitness-training.jpg'
    }
    if (title.toLowerCase().includes('semaglutide') || title.toLowerCase().includes('webinar')) {
      return '/images/webinar-session.jpg'
    }
    if (title.toLowerCase().includes('expert') || title.toLowerCase().includes('qna')) {
      return '/images/doctor-consultation.jpg'
    }
    if (title.toLowerCase().includes('nutrition') || title.toLowerCase().includes('workshop')) {
      return '/images/nutrition-workshop.jpg'
    }
    if (title.toLowerCase().includes('mental') || title.toLowerCase().includes('wellness')) {
      return '/images/mental-wellness.jpg'
    }
    
    return '/images/setting-realistic-goals.jpg'
  }

  // Session data
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

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'fitness': return <Icon name="fitnessCenter" className="w-4 h-4" />
      case 'webinar': return <Icon name="video" className="w-4 h-4" />
      case 'qna': return <Icon name="chat" className="w-4 h-4" />
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

  return (
    <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
        <h1 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Learn Something New
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Curated content from our health experts
        </p>
      </div>

      {/* Horizontal Carousel Section */}
      <div className="px-4 py-4">
        <div className="relative">
          {/* Carousel Container */}
          <HorizontalScroll>
            {contentCards.map((card) => (
              <div key={card.id} className="w-64 flex-shrink-0">
                  <div 
                    className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    {/* Card Header with Thumbnail */}
                    <div className="relative h-24 bg-cover bg-center overflow-hidden"
                         style={{ 
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
                    <div className="p-3">
                      {/* Category and Type Badge */}
                      <div className="flex items-center gap-1 mb-2">
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
                      <p className="text-xs font-medium mb-2" 
                         style={{ color: "var(--app-primary)" }}>
                        {card.author}
                      </p>

                      {/* Description */}
                      <p className="text-xs leading-relaxed mb-2 line-clamp-2 text-[var(--text-secondary)]">
                        {card.description}
                      </p>

                      {/* Metrics */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {card.duration && (
                            <div className="flex items-center gap-1">
                              <Icon name="clock" className="w-3 h-3 text-[var(--text-muted)]" />
                              <span className="text-[var(--text-muted)]">{card.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Icon name="eye" className="w-3 h-3 text-[var(--text-muted)]" />
                            <span className="text-[var(--text-muted)]">{card.views > 1000 ? `${(card.views/1000).toFixed(1)}k` : card.views}</span>
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
          </HorizontalScroll>
        </div>
      </div>

      {/* Join a Session Section */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Join a Session
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Live sessions with healthcare experts
        </p>
      </div>

      {/* Sessions Carousel */}
      <div className="px-4 py-4">
        <div className="relative">
          {/* Sessions Container */}
          <HorizontalScroll>
            {sessionCards.map((session) => (
              <div key={session.id} className="w-64 flex-shrink-0">
                  <div 
                    className="bg-[var(--ds-surface-primary)] rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    {/* Session Header with Image */}
                    <div className="relative h-24 bg-cover bg-center overflow-hidden"
                         style={{ 
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
                    <div className="p-3">
                      {/* Session Type Badge */}
                      <div className="flex items-center gap-1 mb-2">
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
                      <p className="text-xs font-medium mb-2" 
                         style={{ color: "var(--app-primary)" }}>
                        {session.instructor}
                      </p>

                      {/* Session Details */}
                      <div className="flex items-center gap-2 mb-2 text-xs text-[var(--text-secondary)]">
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
                      <p className="text-xs leading-relaxed mb-2 line-clamp-2 text-[var(--text-secondary)]">
                        {session.description}
                      </p>

                      {/* Participants and Action */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Icon name="group" className="w-3 h-3 text-[var(--text-muted)]" />
                          <span className="text-[var(--text-muted)]">
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
          </HorizontalScroll>
        </div>
      </div>

      {/* Upcoming Sessions Button */}
      <div className="px-4 pb-4">
        <button 
          className="w-full py-3 rounded-lg font-medium text-[var(--ds-text-inverse)] transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--app-primary)" }}
        >
          Upcoming Sessions
        </button>
      </div>

      {/* Rest of screen content placeholder */}
      <div className="flex-1 px-4 pb-6">
        <div className="h-20 rounded-lg border-2 border-dashed flex items-center justify-center"
             style={{ borderColor: "var(--border-color)" }}>
          <p className="text-sm text-[var(--text-muted)]">
            Additional sections...
          </p>
        </div>
      </div>
    </div>
  )
}
