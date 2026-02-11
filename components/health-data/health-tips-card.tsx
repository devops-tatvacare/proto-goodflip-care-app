"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { MaterialIcon } from '@/components/ui/material-icon'
import { useHealthTips } from '@/lib/hooks/use-health-tips'
import { Button } from '@/components/ui/button'
// Health articles functionality removed (Strapi integration removed)
import { HorizontalScroll } from '@/components/ui/horizontal-scroll'

interface HealthTipsCardProps {
  limit?: number
  showCategory?: boolean
  onArticleClick?: (articleId: number) => void
  onViewAll?: () => void
}

export function HealthTipsCard({ 
  limit = 3,
  showCategory = true,
  onArticleClick,
  onViewAll
}: HealthTipsCardProps) {
  const { tips, loading, error, refetch } = useHealthTips(limit)

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      nutrition: 'bg-green-100 text-green-800 border-green-200',
      exercise: 'bg-blue-100 text-blue-800 border-blue-200',
      medication: 'bg-purple-100 text-purple-800 border-purple-200',
      wellness: 'bg-teal-100 text-teal-800 border-teal-200',
      general: 'bg-gray-100 text-gray-800 border-[var(--ds-border-default)]'
    }
    return colors[category] || colors.general
  }

  const getCategoryGradient = (category: string): string => {
    const gradients: Record<string, string> = {
      nutrition: 'bg-[var(--ds-surface-primary)] border border-gray-100',
      exercise: 'bg-[var(--ds-surface-primary)] border border-gray-100', 
      medication: 'bg-[var(--ds-surface-primary)] border border-gray-100',
      wellness: 'bg-[var(--ds-surface-primary)] border border-gray-100',
      general: 'bg-[var(--ds-surface-primary)] border border-gray-100'
    }
    return gradients[category] || gradients.general
  }

  const getCategoryIcon = (category: string): { icon: string; color: string } => {
    const icons: Record<string, { icon: string; color: string }> = {
      nutrition: { icon: 'restaurant', color: 'var(--metric-vitamins-green)' },
      exercise: { icon: 'fitness_center', color: 'var(--chart-blue)' },
      medication: { icon: 'medication', color: 'var(--metric-sleep)' },
      wellness: { icon: 'self_improvement', color: 'var(--metric-activity)' },
      general: { icon: 'lightbulb', color: 'var(--metric-nutrition-fat)' }
    }
    return icons[category] || icons.general
  }

  const getCategoryImage = (category: string, tipId: number, tipTitle: string): string => {
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

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-[var(--ds-border-default)]'
    }
    return colors[priority] || colors.low
  }

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
        <CardHeader className="px-4 pt-4 pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-gray-900">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <MaterialIcon icon="lightbulb" variant="round" size={12} color="white" />
            </div>
            Health Tips from Strapi
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-4 pb-4">
          <div className="flex items-center justify-center py-8">
            <Icon name="loader" className="w-6 h-6 animate-spin text-[var(--app-primary)]" />
            <span className="ml-2 text-[var(--ds-text-secondary)]">Loading health tips...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <CardHeader className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                <MaterialIcon icon="tips_and_updates" variant="round" size={12} color="white" />
              </div>
              Health Tips For You
            </CardTitle>
            <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">Personalized tips for your health journey</p>
          </div>
          <div className="flex items-center gap-1">
            {error && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                className="text-xs text-[var(--ds-text-secondary)] hover:text-gray-700"
              >
                <Icon name="refresh" className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            )}
            {onViewAll && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full transition-colors h-7 w-7 self-center"
                onClick={onViewAll}
              >
                <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
              </Button>
            )}
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-2">
            <Icon name="alertCircle" className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-amber-600">{error}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-4 pt-4 pb-4">
        {tips.length === 0 ? (
          <div className="text-center py-8">
            <MaterialIcon icon="lightbulb" variant="outlined" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-[var(--ds-text-secondary)] mb-2">No health tips available</p>
            <p className="text-sm text-gray-400">Check your Strapi backend connection</p>
          </div>
        ) : (
          <HorizontalScroll>
            {tips.map((tip) => {
              // Article matching removed (Strapi integration removed)
              
              return (
                <div 
                  key={tip.id} 
                  className="flex-shrink-0 w-48"
                >
                  <div className="h-full bg-[var(--ds-surface-primary)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                    {/* Image Header */}
                    <div 
                      className="h-16 bg-cover bg-center relative"
                      style={{ 
                        backgroundImage: `url(${getCategoryImage(tip.category, tip.id, tip.title)})`,
                      }}
                    >
                      {/* Subtle overlay for better visual separation */}
                      <div className="absolute inset-0 bg-black/10" />
                      
                      {/* Category icon in corner */}
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 bg-[var(--ds-surface-primary)]/90 rounded-full flex items-center justify-center">
                          <MaterialIcon 
                            icon={getCategoryIcon(tip.category).icon} 
                            variant="round"
                            size={14}
                            color={getCategoryIcon(tip.category).color}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-3 flex flex-col flex-1">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-1.5 py-0 h-4"
                          style={{
                            backgroundColor: "var(--chip-bg-primary)",
                            color: "var(--chip-text-primary)",
                            borderColor: "var(--chip-border-primary)"
                          }}
                        >
                          {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="mb-3 flex-1">
                        <h4 className="font-semibold text-xs mb-1 line-clamp-2 leading-tight" style={{ color: "var(--card-header-text)" }}>
                          {tip.title}
                        </h4>
                        <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed line-clamp-2">
                          {tip.description}
                        </p>
                      </div>

                      {/* Article functionality removed (Strapi integration removed) */}
                    </div>
                  </div>
                </div>
              )
            })}
          </HorizontalScroll>
        )}
      </CardContent>
    </Card>
  )
}