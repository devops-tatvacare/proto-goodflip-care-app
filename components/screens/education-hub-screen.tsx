"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { MaterialIcon } from "@/components/ui/material-icon"

interface EducationHubScreenProps {
  onBack: () => void
}

interface EducationContent {
  id: string
  title: string
  category: string
  format: 'video' | 'article' | 'shorts' | 'podcast'
  duration?: string
  readTime?: string
  author: string
  authorRole?: string
  views: number
  rating: number
  thumbnail: string
  description?: string
  tags?: string[]
  isNew?: boolean
  isPremium?: boolean
}

export function EducationHubScreen({ onBack }: EducationHubScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  // Categories with medical icons
  const categories = [
    { id: 'all', label: 'All', icon: (props: any) => <Icon name="sparkles" {...props} />, color: 'var(--app-primary)' },
    { id: 'drug-info', label: 'Drug Info', icon: (props: any) => <Icon name="medication" {...props} />, color: 'var(--app-tertiary)' },
    { id: 'side-effects', label: 'Side Effects', icon: (props: any) => <Icon name="alertCircle" {...props} />, color: 'var(--status-warning)' },
    { id: 'nutrition', label: 'Nutrition', icon: (props: any) => <Icon name="restaurant" {...props} />, color: 'var(--status-success)' },
    { id: 'exercise', label: 'Exercise', icon: (props: any) => <Icon name="heartMonitor" {...props} />, color: 'var(--app-primary)' },
    { id: 'mental-health', label: 'Mental Health', icon: (props: any) => <Icon name="brain" {...props} />, color: 'var(--app-secondary)' },
    { id: 'lab-results', label: 'Lab Results', icon: (props: any) => <Icon name="microscope" {...props} />, color: 'var(--app-tertiary)' },
    { id: 'doctor-talks', label: 'Doctor Talks', icon: (props: any) => <Icon name="stethoscope" {...props} />, color: 'var(--app-primary)' },
    { id: 'best-practices', label: 'Best Practices', icon: (props: any) => <Icon name="shield" {...props} />, color: 'var(--status-success)' }
  ]

  // Format filters
  const formats = [
    { id: 'all', label: 'All Formats', icon: (props: any) => <Icon name="bookmarked" {...props} /> },
    { id: 'video', label: 'Videos', icon: (props: any) => <Icon name="video" {...props} /> },
    { id: 'article', label: 'Articles', icon: (props: any) => <Icon name="fileText" {...props} /> },
    { id: 'shorts', label: 'Shorts', icon: (props: any) => <Icon name="playCircle" {...props} /> },
    { id: 'podcast', label: 'Podcasts', icon: (props: any) => <Icon name="handshake" {...props} /> }
  ]

  // Mock education content data
  const allContent: EducationContent[] = [
    // Drug Information
    {
      id: '1',
      title: 'Understanding Semaglutide: Complete Guide',
      category: 'drug-info',
      format: 'video',
      duration: '18:45',
      author: 'Dr. Sarah Chen',
      authorRole: 'Endocrinologist',
      views: 24500,
      rating: 4.9,
      thumbnail: '/images/semaglutide-guide.jpg',
      tags: ['GLP-1', 'Mechanism', 'Dosing'],
      isNew: true
    },
    {
      id: '2',
      title: 'How GLP-1 Agonists Work in Your Body',
      category: 'drug-info',
      format: 'article',
      readTime: '8 min',
      author: 'Dr. Michael Torres',
      authorRole: 'Pharmacist',
      views: 18200,
      rating: 4.8,
      thumbnail: '/images/glp1-mechanism.jpg',
      tags: ['Science', 'Biology']
    },
    {
      id: '3',
      title: 'Injection Technique: Quick Tips',
      category: 'drug-info',
      format: 'shorts',
      duration: '0:45',
      author: 'Nurse Maria',
      authorRole: 'RN',
      views: 45000,
      rating: 4.7,
      thumbnail: '/images/injection-tips.jpg',
      isNew: true
    },

    // Side Effects Management
    {
      id: '4',
      title: 'Managing Nausea: Expert Strategies',
      category: 'side-effects',
      format: 'video',
      duration: '12:30',
      author: 'Dr. Lisa Rodriguez',
      authorRole: 'GI Specialist',
      views: 35600,
      rating: 4.9,
      thumbnail: '/images/nausea-management.jpg',
      tags: ['Nausea', 'Tips', 'Relief']
    },
    {
      id: '5',
      title: 'Common Side Effects: What to Expect',
      category: 'side-effects',
      format: 'article',
      readTime: '10 min',
      author: 'Dr. James Wilson',
      authorRole: 'Primary Care',
      views: 28900,
      rating: 4.8,
      thumbnail: '/images/side-effects.jpg'
    },
    {
      id: '6',
      title: 'When to Call Your Doctor',
      category: 'side-effects',
      format: 'shorts',
      duration: '1:00',
      author: 'Dr. Amanda Kim',
      authorRole: 'Emergency Medicine',
      views: 52000,
      rating: 5.0,
      thumbnail: '/images/emergency-signs.jpg',
      tags: ['Safety', 'Important']
    },

    // Nutrition
    {
      id: '7',
      title: 'Meal Planning on Semaglutide',
      category: 'nutrition',
      format: 'video',
      duration: '22:15',
      author: 'Lisa Chen',
      authorRole: 'Clinical Nutritionist',
      views: 42000,
      rating: 4.9,
      thumbnail: '/images/meal-planning.jpg',
      isPremium: true
    },
    {
      id: '8',
      title: 'High-Protein Recipes for GLP-1 Users',
      category: 'nutrition',
      format: 'article',
      readTime: '15 min',
      author: 'Chef Marcus',
      authorRole: 'Nutrition Chef',
      views: 31000,
      rating: 4.8,
      thumbnail: '/images/protein-recipes.jpg',
      tags: ['Recipes', 'Protein']
    },
    {
      id: '9',
      title: 'Quick Snack Ideas',
      category: 'nutrition',
      format: 'shorts',
      duration: '0:30',
      author: 'Maria Santos',
      authorRole: 'Dietitian',
      views: 68000,
      rating: 4.7,
      thumbnail: '/images/snacks.jpg'
    },

    // Exercise
    {
      id: '10',
      title: 'Strength Training During Weight Loss',
      category: 'exercise',
      format: 'video',
      duration: '25:00',
      author: 'Jake Thompson',
      authorRole: 'Personal Trainer',
      views: 29000,
      rating: 4.8,
      thumbnail: '/images/strength-training.jpg',
      tags: ['Muscle', 'Workout']
    },
    {
      id: '11',
      title: 'Walking Program for Beginners',
      category: 'exercise',
      format: 'article',
      readTime: '12 min',
      author: 'Dr. Rachel Green',
      authorRole: 'Sports Medicine',
      views: 22000,
      rating: 4.7,
      thumbnail: '/images/walking.jpg'
    },

    // Mental Health
    {
      id: '12',
      title: 'Body Image During Weight Loss Journey',
      category: 'mental-health',
      format: 'podcast',
      duration: '35:00',
      author: 'Dr. Patricia Lee',
      authorRole: 'Psychologist',
      views: 18000,
      rating: 4.9,
      thumbnail: '/images/body-image.jpg',
      isPremium: true
    },
    {
      id: '13',
      title: 'Dealing with Weight Loss Plateaus',
      category: 'mental-health',
      format: 'article',
      readTime: '8 min',
      author: 'Dr. Mark Johnson',
      authorRole: 'Behavioral Health',
      views: 25000,
      rating: 4.8,
      thumbnail: '/images/plateau.jpg'
    },

    // Lab Results
    {
      id: '14',
      title: 'Understanding Your A1C Results',
      category: 'lab-results',
      format: 'video',
      duration: '15:20',
      author: 'Dr. Jennifer Walsh',
      authorRole: 'Endocrinologist',
      views: 33000,
      rating: 4.9,
      thumbnail: '/images/a1c-results.jpg',
      tags: ['Diabetes', 'Tests']
    },
    {
      id: '15',
      title: 'Cholesterol Changes on GLP-1',
      category: 'lab-results',
      format: 'article',
      readTime: '10 min',
      author: 'Dr. Robert Chen',
      authorRole: 'Cardiologist',
      views: 19000,
      rating: 4.7,
      thumbnail: '/images/cholesterol.jpg'
    },

    // Doctor Talks
    {
      id: '16',
      title: 'Q&A: Your Semaglutide Questions Answered',
      category: 'doctor-talks',
      format: 'video',
      duration: '45:00',
      author: 'Panel Discussion',
      authorRole: 'Multiple Experts',
      views: 51000,
      rating: 4.9,
      thumbnail: '/images/doctor-qa.jpg',
      isNew: true
    },
    {
      id: '17',
      title: 'Latest Research Updates',
      category: 'doctor-talks',
      format: 'podcast',
      duration: '28:00',
      author: 'Dr. Elizabeth Turner',
      authorRole: 'Researcher',
      views: 15000,
      rating: 4.8,
      thumbnail: '/images/research.jpg'
    },

    // Best Practices
    {
      id: '18',
      title: 'Creating Sustainable Habits',
      category: 'best-practices',
      format: 'video',
      duration: '20:00',
      author: 'Dr. Tom Anderson',
      authorRole: 'Behavioral Medicine',
      views: 38000,
      rating: 4.9,
      thumbnail: '/images/habits.jpg',
      tags: ['Lifestyle', 'Long-term']
    },
    {
      id: '19',
      title: 'Travel Tips for GLP-1 Users',
      category: 'best-practices',
      format: 'article',
      readTime: '7 min',
      author: 'Nurse Practitioner Amy',
      authorRole: 'NP',
      views: 21000,
      rating: 4.7,
      thumbnail: '/images/travel.jpg'
    }
  ]

  // Filter content
  const filteredContent = allContent.filter(content => {
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory
    const matchesFormat = selectedFormat === 'all' || content.format === selectedFormat
    const matchesSearch = searchQuery === '' || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesFormat && matchesSearch
  })

  // Group content by category for display
  const groupedContent = filteredContent.reduce((acc, content) => {
    if (!acc[content.category]) {
      acc[content.category] = []
    }
    acc[content.category].push(content)
    return acc
  }, {} as Record<string, EducationContent[]>)

  // Get format icon
  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'video': return <Icon name="video" className="w-3 h-3" />
      case 'article': return <Icon name="bookOpen" className="w-3 h-3" />
      case 'shorts': return <Icon name="playCircle" className="w-3 h-3" />
      case 'podcast': return <Icon name="handshake" className="w-3 h-3" />
      default: return <Icon name="fileText" className="w-3 h-3" />
    }
  }

  // Get placeholder image based on category and content ID for consistency
  const getPlaceholderImage = (category: string, id: string, title: string): string => {
    // Available images from /public/images/ (actual existing images)
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
      '/images/track-your-progress.jpg',
      '/images/foods-heal-liver-card.png',
      '/images/gentle-yoga-card.png',
      '/images/liver-health-card.png',
      '/images/stress-management-card.png'
    ]

    // Consistent mapping based on category using existing images
    const categoryImageMap: Record<string, string[]> = {
      'drug-info': ['/images/pillsontime.jpg', '/images/timely-medication.jpg', '/images/medical-consultation.png', '/images/telemedicine-consultation.png'],
      'side-effects': ['/images/medical-consultation.png', '/images/managing-sleep.jpg', '/images/stress-management-card.png', '/images/dehydration.jpg'],
      'nutrition': ['/images/eathealthy.jpg', '/images/healthy-snacks.jpg', '/images/meal-planning.jpg', '/images/portion-control.jpg', '/images/foods-heal-liver-card.png'],
      'exercise': ['/images/indoor-exercise.jpg', '/images/gentle-yoga-card.png', '/images/setting-realistic-goals.jpg', '/images/milestone.jpg'],
      'mental-health': ['/images/managing-sleep.jpg', '/images/stress-management-card.png', '/images/medical-consultation.png', '/images/setting-realistic-goals.jpg'],
      'lab-results': ['/images/track-your-progress.jpg', '/images/milestone.jpg', '/images/medical-consultation.png', '/images/telemedicine-consultation.png'],
      'doctor-talks': ['/images/medical-consultation.png', '/images/telemedicine-consultation.png', '/images/pillsontime.jpg', '/images/timely-medication.jpg'],
      'best-practices': ['/images/track-your-progress.jpg', '/images/setting-realistic-goals.jpg', '/images/milestone.jpg', '/images/eathealthy.jpg', '/images/liver-health-card.png']
    }

    // Get images for category or default to all images
    const categoryImages = categoryImageMap[category] || availableImages
    
    // Use content ID to ensure same content always gets same image
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const index = Math.abs(hash) % categoryImages.length
    return categoryImages[index]
  }

  return (
    <ScreenLayout>
      <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
        {/* Clean Header - WhatsApp/Telegram style */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" 
             style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}>
          <button onClick={onBack} className="p-1">
            <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Education Hub
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Learn from healthcare experts
            </p>
          </div>
          <button 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MaterialIcon icon="search" variant="round" size={24} color="#6B7280" />
          </button>
        </div>

        {/* Integrated Search Bar - Shows when search icon is clicked */}
        {(isSearchVisible || searchQuery.length > 0) && (
          <div className="px-4 py-3 bg-gray-50 border-b" style={{ borderColor: "var(--border-color)" }}>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MaterialIcon icon="search" variant="round" size={16} color="#9CA3AF" />
              </div>
              <input
                type="text"
                placeholder="Search topics, experts, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ 
                  color: "var(--text-primary)",
                  backgroundColor: "white"
                }}
              />
            </div>
          </div>
        )}

        {/* Category Pills - Horizontal Scroll with Filter Button */}
        <div className="px-4 py-2 border-b sticky top-0 bg-[var(--ds-surface-primary)] z-10" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id 
                      ? 'text-[var(--ds-text-inverse)]' 
                      : 'bg-[var(--ds-surface-primary)] border'
                  }`}
                  style={selectedCategory === category.id ? {
                    backgroundColor: category.color
                  } : {
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)"
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {category.label}
                </button>
              )
            })}
            
            {/* Filter Button - Sticky at end */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                showFilters ? 'bg-gray-100' : 'bg-[var(--ds-surface-primary)]'
              }`}
              style={{ 
                borderColor: "var(--border-color)",
                color: "var(--text-secondary)",
                minWidth: 'fit-content'
              }}
            >
              <Icon name="filter" className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel - Expandable */}
        {showFilters && (
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
            <div className="mb-2">
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Content Type</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formats.map(format => {
                const Icon = format.icon
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      selectedFormat === format.id 
                        ? 'bg-gray-900 text-[var(--ds-text-inverse)]' 
                        : ''
                    }`}
                    style={selectedFormat !== format.id ? {
                      backgroundColor: "var(--chip-bg-primary)",
                      color: "var(--chip-text-primary)"
                    } : {}}
                  >
                    <Icon className="w-3 h-3" />
                    {format.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {Object.entries(groupedContent).map(([category, contents]) => {
            const categoryInfo = categories.find(c => c.id === category)
            if (!categoryInfo || contents.length === 0) return null
            const CategoryIcon = categoryInfo.icon

            return (
              <div key={category} className="mb-6">
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "var(--app-primary)" }}>
                    <CategoryIcon className="w-3.5 h-3.5 text-[var(--ds-text-inverse)]" />
                  </div>
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {categoryInfo.label}
                  </h2>
                </div>

                {/* Content Cards - Horizontal Scroll */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                  {contents.map((content, index) => (
                    <div key={content.id} 
                         className={`w-64 flex-shrink-0 bg-[var(--ds-surface-primary)] rounded-lg border overflow-hidden hover:shadow-sm transition-shadow ${index === contents.length - 1 ? 'mr-4' : ''}`}
                         style={{ borderColor: "var(--border-color)" }}>
                      {/* Thumbnail */}
                      <div className="relative h-32 bg-cover bg-center"
                           style={{ backgroundImage: `url(${getPlaceholderImage(content.category, content.id, content.title)})` }}>
                        {/* Format Badge */}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-[var(--ds-text-inverse)] rounded flex items-center gap-1">
                          {getFormatIcon(content.format)}
                          <span className="text-xs">
                            {content.duration || content.readTime}
                          </span>
                        </div>
                        
                        {/* New/Premium Badge */}
                        {content.isNew && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[var(--ds-status-success)] text-[var(--ds-text-inverse)] text-xs rounded">
                            NEW
                          </div>
                        )}
                        {content.isPremium && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500 text-[var(--ds-text-inverse)] text-xs rounded">
                            PRO
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-semibold line-clamp-2 mb-1 leading-tight" 
                            style={{ color: "var(--text-primary)" }}>
                          {content.title}
                        </h3>
                        
                        <p className="text-xs mb-2 text-[var(--text-secondary)]">
                          {content.author}
                        </p>

                        {/* Metrics */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                              <Icon name="eye" className="w-3 h-3 text-[var(--text-muted)]" />
                              <span className="text-[var(--text-muted)]">
                                {content.views > 1000 ? `${(content.views/1000).toFixed(0)}k` : content.views}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Icon name="star" className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-[var(--text-muted)]">
                                {content.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* See More Button */}
                {contents.length > 4 && (
                  <button className="mt-2 w-full py-2 rounded-lg border flex items-center justify-center gap-1 text-xs font-medium"
                          style={{ 
                            borderColor: "var(--border-color)",
                            color: "var(--app-primary)"
                          }}>
                    View All {contents.length} Items
                    <Icon name="chevronRight" className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </ScreenLayout>
  )
}
