"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { HealthArticle } from '@/lib/strapi/health-articles-api'
import ReactMarkdown from 'react-markdown'

interface HealthArticleReaderProps {
  article: HealthArticle
  onBack: () => void
  onBookmark?: (articleId: number) => void
  onLike?: (articleId: number) => void
  onShare?: (article: HealthArticle) => void
  isBookmarked?: boolean
  isLiked?: boolean
}

export function HealthArticleReader({
  article,
  onBack,
  onBookmark,
  onLike,
  onShare,
  isBookmarked = false,
  isLiked = false
}: HealthArticleReaderProps) {
  const [readProgress, setReadProgress] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setReadProgress(Math.min(100, Math.max(0, progress)))
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    // Initial calculation
    handleScroll()
    
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      nutrition: 'bg-green-600 text-[var(--ds-text-inverse)]',
      exercise: 'bg-blue-600 text-[var(--ds-text-inverse)]',
      medication: 'bg-purple-600 text-[var(--ds-text-inverse)]',
      wellness: 'bg-teal-600 text-[var(--ds-text-inverse)]',
      'mental-health': 'bg-indigo-600 text-[var(--ds-text-inverse)]',
      general: 'bg-gray-600 text-[var(--ds-text-inverse)]'
    }
    return colors[category] || colors.general
  }

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-gray-100 text-[var(--ds-text-secondary)] border-[var(--ds-border-default)]'
    }
    return colors[priority] || colors.low
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get relevant local image based on article content
  const getArticleImage = (article: any) => {
    const title = article.title.toLowerCase()
    const tags = article.tags.map((tag: string) => tag.toLowerCase())
    const category = article.category.toLowerCase()
    
    // Check for specific keywords in title and tags with new Downloads images
    if (title.includes('dehydrat') || tags.some(tag => tag.includes('dehydrat'))) {
      return '/images/dehydration.jpg'
    }
    if (title.includes('hydrat') || tags.some(tag => tag.includes('hydrat')) || title.includes('water')) {
      return '/images/hydration.jpg'
    }
    if (title.includes('medication') || title.includes('semaglutide') || title.includes('timely') || tags.some(tag => tag.includes('medication'))) {
      return '/images/timely-medication.jpg'
    }
    if (title.includes('snack') || tags.some(tag => tag.includes('snack'))) {
      return '/images/healthy-snacks.jpg'
    }
    if (title.includes('meal planning') || title.includes('planning') || tags.some(tag => tag.includes('planning'))) {
      return '/images/meal-planning.jpg'
    }
    if (title.includes('portion') || title.includes('control') || tags.some(tag => tag.includes('portion'))) {
      return '/images/portion-control.jpg'
    }
    if (title.includes('indoor') || title.includes('exercise') || title.includes('workout') || tags.some(tag => tag.includes('exercise'))) {
      return '/images/indoor-exercise.jpg'
    }
    if (title.includes('sleep') || title.includes('managing sleep') || tags.some(tag => tag.includes('sleep'))) {
      return '/images/managing-sleep.jpg'
    }
    if (title.includes('goals') || title.includes('realistic') || tags.some(tag => tag.includes('goals'))) {
      return '/images/setting-realistic-goals.jpg'
    }
    if (title.includes('track') || title.includes('progress') || title.includes('monitoring') || tags.some(tag => tag.includes('progress'))) {
      return '/images/track-your-progress.jpg'
    }
    if (title.includes('nutrition') || title.includes('diet') || title.includes('food') || tags.some(tag => tag.includes('nutrition'))) {
      return '/images/meal-planning.jpg'
    }
    if (title.includes('yoga') || tags.some(tag => tag.includes('yoga'))) {
      return '/images/gentle-yoga-card.png'
    }
    if (title.includes('stress') || title.includes('mental') || tags.some(tag => tag.includes('stress'))) {
      return '/images/stress-management-card.png'
    }
    if (title.includes('liver') || title.includes('hepat') || tags.some(tag => tag.includes('liver'))) {
      return '/images/liver-health-card.png'
    }
    if (title.includes('heal') || title.includes('recovery') || tags.some(tag => tag.includes('heal'))) {
      return '/images/foods-heal-liver-card.png'
    }
    
    // Category-based fallback with new images
    if (category.includes('nutrition')) return '/images/meal-planning.jpg'
    if (category.includes('exercise')) return '/images/indoor-exercise.jpg'
    if (category.includes('medication')) return '/images/timely-medication.jpg'
    if (category.includes('wellness')) return '/images/managing-sleep.jpg'
    
    // Default fallback
    return '/images/track-your-progress.jpg'
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Fixed Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${readProgress}%`,
            background: 'var(--app-primary)'
          }}
        />
      </div>

      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-[var(--ds-surface-primary)]/95 backdrop-blur-sm border-b border-[var(--ds-border-default)] z-40 pt-1">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-[var(--ds-text-secondary)] hover:text-gray-900 h-8 px-2"
          >
            <Icon name="arrowLeft" className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="flex items-center gap-1">
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark(article.id)}
                className={`h-8 px-2 text-xs ${isBookmarked ? 'text-[var(--app-primary)]' : 'text-[var(--ds-text-secondary)]'}`}
              >
                <Icon name="bookmark" className={`w-4 h-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                {article.bookmarks}
              </Button>
            )}
            
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(article.id)}
                className={`h-8 px-2 text-xs ${isLiked ? 'text-[var(--ds-status-error)]' : 'text-[var(--ds-text-secondary)]'}`}
              >
                <Icon name="heart" className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {article.likes}
              </Button>
            )}
            
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(article)}
                className="h-8 px-2 text-[var(--ds-text-secondary)] hover:text-gray-700"
              >
                <Icon name="share" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 max-w-3xl mx-auto">
        {/* Header Image or Video */}
        <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
          {article.isVideo && article.videoEmbedUrl ? (
            <div className="relative aspect-video bg-gray-100">
              <iframe 
                width="100%" 
                height="100%" 
                src={article.videoEmbedUrl} 
                title={article.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <img
              src={article.featuredImage || getArticleImage(article)}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          )}
        </div>

        {/* Article Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(article.category)}>
              {article.category.replace('-', ' ')}
            </Badge>
            {article.isPremium && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">
                Premium
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={`text-xs ${getPriorityColor(article.priority)}`}
            >
              {article.priority}
            </Badge>
          </div>

          <h1 className="text-xl font-bold text-[var(--card-header-text)] mb-2 leading-tight">
            {article.title}
          </h1>

          <p className="text-sm text-[var(--ds-text-secondary)] mb-3 leading-relaxed">
            {article.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-[var(--ds-text-secondary)] border-b border-[var(--ds-border-default)] pb-3">
            {article.author && (
              <div className="flex items-center gap-1">
                <Icon name="person" className="w-3 h-3" />
                <span>{article.author.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Icon name="calendar" className="w-3 h-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Icon name="clock" className="w-3 h-3" />
              <span>{article.readTime}m</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Icon name="eye" className="w-3 h-3" />
              <span>{article.views}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="shadow-sm border-[var(--ds-border-default)] mb-4">
          <CardContent className="p-4">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold text-[var(--card-header-text)] mb-3 mt-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-[var(--card-header-text)] mb-2 mt-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold text-[var(--card-header-text)] mb-2 mt-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-3 space-y-1 ml-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-sm text-gray-700 mb-3 space-y-1 ml-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[var(--card-header-text)]">
                      {children}
                    </strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 border-[var(--app-primary)] pl-3 my-3 italic text-sm text-[var(--ds-text-secondary)] bg-gray-50 py-2 rounded-r-md">
                      {children}
                    </blockquote>
                  )
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 6).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-gray-50 text-[var(--ds-text-secondary)] border-[var(--ds-border-default)] hover:bg-gray-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <Card className="bg-gradient-to-r from-gray-50 to-white border-[var(--ds-border-default)]">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-[var(--ds-text-secondary)] mb-3">Was this helpful?</p>
            <div className="flex justify-center gap-2">
              {onLike && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLike(article.id)}
                  className={`h-8 px-3 text-xs ${
                    isLiked 
                      ? 'text-red-600 border-red-200 bg-red-50' 
                      : 'text-[var(--ds-text-secondary)] border-[var(--ds-border-default)]'
                  }`}
                >
                  <Icon name="heart" className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
              )}
              {onBookmark && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBookmark(article.id)}
                  className={`h-8 px-3 text-xs ${
                    isBookmarked 
                      ? 'text-[var(--app-primary)] border-[var(--app-primary)] bg-[var(--icon-bg-primary)]' 
                      : 'text-[var(--ds-text-secondary)] border-[var(--ds-border-default)]'
                  }`}
                >
                  <Icon name="bookmark" className={`w-3 h-3 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
              )}
            </div>
            <p className="text-xs text-[var(--ds-text-secondary)] mt-3">
              Content powered by Strapi CMS
            </p>
          </CardContent>
        </Card>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
        </div>
      </div>
    </div>
  )
}