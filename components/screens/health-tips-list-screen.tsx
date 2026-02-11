"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/ui/icon'
import { useHealthTips } from '@/lib/hooks/use-health-tips'
// Health articles functionality removed (Strapi integration removed)

interface HealthTipsListScreenProps {
  onBack: () => void
  onArticleClick?: (articleId: number) => void
}

type ContentType = 'all' | 'video' | 'article'
type Category = 'all' | 'health' | 'fitness' | 'food' | 'wellness' | 'medication'

export function HealthTipsListScreen({ onBack, onArticleClick }: HealthTipsListScreenProps) {
  const { tips, loading, error } = useHealthTips() // Get all tips without limit
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<ContentType>('all')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')

  // Add type field to tips for filtering
  const allContent = useMemo(() => {
    const tipsWithType = tips.map(tip => ({ ...tip, type: 'article' }))
    return tipsWithType
  }, [tips])

  // Filter content based on search and filters
  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())

      // Type filter
      const matchesType = selectedType === 'all' || item.type === selectedType

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        item.category === selectedCategory ||
        (selectedCategory === 'health' && item.category === 'general') ||
        (selectedCategory === 'food' && item.category === 'nutrition') ||
        (selectedCategory === 'fitness' && item.category === 'exercise')

      return matchesSearch && matchesType && matchesCategory
    })
  }, [allContent, searchQuery, selectedType, selectedCategory])

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      nutrition: '🥗',
      food: '🥗',
      exercise: '🏃‍♂️',
      fitness: '🏃‍♂️',
      medication: '💊',
      wellness: '🧘‍♀️',
      health: '❤️',
      general: '💡'
    }
    return icons[category] || icons.general
  }

  const getCategoryImage = (category: string, tipId: any, tipTitle: string): string => {
    const title = tipTitle.toLowerCase()
    
    // Use specific images for certain tips with new Downloads images
    if (title.includes('medication') || title.includes('pill') || title.includes('timely') || title.includes('time')) {
      return '/images/timely-medication.jpg'
    }
    if (title.includes('dehydrat') || title.includes('thirst')) {
      return '/images/dehydration.jpg'
    }
    if (title.includes('hydrated') || title.includes('water') || title.includes('drink')) {
      return '/images/hydration.jpg'
    }
    if (title.includes('snack') || title.includes('healthy snack')) {
      return '/images/healthy-snacks.jpg'
    }
    if (title.includes('meal planning') || title.includes('plan') || title.includes('meal prep')) {
      return '/images/meal-planning.jpg'
    }
    if (title.includes('portion') || title.includes('control') || title.includes('serving')) {
      return '/images/portion-control.jpg'
    }
    if (title.includes('indoor') || title.includes('home workout') || title.includes('indoor exercise')) {
      return '/images/indoor-exercise.jpg'
    }
    if (title.includes('sleep') || title.includes('managing sleep') || title.includes('bedtime')) {
      return '/images/managing-sleep.jpg'
    }
    if (title.includes('goals') || title.includes('realistic') || title.includes('setting goals')) {
      return '/images/setting-realistic-goals.jpg'
    }
    if (title.includes('track') || title.includes('progress') || title.includes('monitoring')) {
      return '/images/track-your-progress.jpg'
    }
    if (title.includes('balanced') || title.includes('meal') || title.includes('nutrition') || title.includes('diet')) {
      return '/images/meal-planning.jpg'
    }
    if (title.includes('exercise') || title.includes('yoga') || title.includes('workout') || title.includes('physical')) {
      return '/images/indoor-exercise.jpg'
    }
    if (title.includes('stress') || title.includes('mental') || title.includes('anxiety') || title.includes('relax')) {
      return '/images/stress-management-card.png'
    }
    if (title.includes('liver') || title.includes('hepat')) {
      return '/images/liver-health-card.png'
    }
    if (title.includes('food') || title.includes('heal')) {
      return '/images/foods-heal-liver-card.png'
    }
    
    // Category-based fallback with new images
    const categoryImages: Record<string, string> = {
      nutrition: '/images/meal-planning.jpg',
      exercise: '/images/indoor-exercise.jpg',
      medication: '/images/timely-medication.jpg',
      wellness: '/images/managing-sleep.jpg',
      general: '/images/track-your-progress.jpg'
    }
    
    return categoryImages[category] || '/images/track-your-progress.jpg'
  }

  // Article functionality removed (Strapi integration removed)
  const findCorrespondingArticle = (tip: any) => {
    return null
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header with Hero Section - Matching Prescription Refill Style */}
      <div className="flex-shrink-0 relative">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between py-4 px-4">
          {/* Back Button - Circular */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
          >
            <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          
          {/* Title Section */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[var(--card-header-text)]">
              Health Tips For You
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Personalized content for your journey</p>
          </div>
          
          {/* Right spacer for balance */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search health tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 bg-[var(--ds-surface-primary)] border-[var(--ds-border-default)] rounded-xl shadow-sm focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[var(--ds-text-secondary)]"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 pb-3 space-y-2">
          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[var(--ds-text-secondary)] font-medium self-center mr-1">Type:</span>
            <Button
              size="sm"
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedType === 'all' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'video' ? 'default' : 'outline'}
              onClick={() => setSelectedType('video')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedType === 'video' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              <Icon name="playCircle" className="w-3 h-3 mr-1" />
              Videos
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'article' ? 'default' : 'outline'}
              onClick={() => setSelectedType('article')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedType === 'article' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              <Icon name="fileText" className="w-3 h-3 mr-1" />
              Articles
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[var(--ds-text-secondary)] font-medium self-center mr-1">Category:</span>
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedCategory === 'all' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'health' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('health')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedCategory === 'health' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              ❤️ Health
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'fitness' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('fitness')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedCategory === 'fitness' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              🏃‍♂️ Fitness
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'food' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('food')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedCategory === 'food' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              🥗 Food
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'wellness' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('wellness')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedCategory === 'wellness' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              🧘‍♀️ Wellness
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'medication' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('medication')}
              className={`h-7 px-3 text-xs font-medium rounded-full flex-shrink-0 ${
                selectedCategory === 'medication' 
                  ? 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]' 
                  : 'border-gray-300 text-[var(--ds-text-secondary)] hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]'
              }`}
            >
              💊 Medication
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--app-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[var(--ds-text-secondary)]">Loading health tips...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lightbulb" className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-[var(--ds-text-secondary)] mb-2">Unable to load health tips</p>
              <p className="text-sm text-amber-600">{error}</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="search" className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-[var(--ds-text-secondary)]">No tips found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredContent.map((item) => {
                const fullArticle = item.type === 'article' ? findCorrespondingArticle(item) : null
                
                return (
                  <Card 
                    key={item.id} 
                    className="shadow-lg border-0 bg-[var(--ds-surface-primary)]/95 backdrop-blur hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image/Thumbnail */}
                        <div 
                          className="w-24 h-24 rounded-lg bg-cover bg-center flex-shrink-0 relative overflow-hidden"
                          style={{ 
                            backgroundImage: `url(${getCategoryImage(item.category, item.id, item.title)})`,
                          }}
                        >
                          {/* Category icon in corner */}
                          <div className="absolute top-1 left-1">
                            <div className="w-5 h-5 bg-[var(--ds-surface-primary)]/90 rounded-full flex items-center justify-center">
                              <span className="text-xs" role="img" aria-label="category icon">
                                {getCategoryIcon(item.category)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="mb-2 flex gap-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0.5 h-5"
                              style={{
                                backgroundColor: "var(--chip-bg-primary)",
                                color: "var(--chip-text-primary)",
                                borderColor: "var(--chip-border-primary)"
                              }}
                            >
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </Badge>
                          </div>

                          {/* Title and Content */}
                          <div className="mb-3">
                            <h3 className="font-semibold text-sm mb-1 text-[var(--card-header-text)] leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed line-clamp-2">
                              {item.content}
                            </p>
                          </div>

                          {/* Action button */}
                          {fullArticle && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onArticleClick?.(fullArticle.id)}
                              className="h-7 px-3 text-xs font-medium border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--ds-surface-primary)] hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] rounded-md transition-all duration-200"
                            >
                              <Icon name="bookOpen" className="w-3 h-3 mr-1" />
                              Read Article
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}