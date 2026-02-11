"use client"

import React from 'react'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

export interface ActionCardProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  icon: LucideIcon
  variant: 'primary' | 'secondary' | 'tertiary'
  size: 'sm' | 'md' | 'lg'
  layout: 'vertical' | 'horizontal'
  onClick?: (id: string) => void
  disabled?: boolean
  className?: string
}

const variantStyles = {
  primary: {
    container: 'from-blue-50 to-blue-100/50 border-blue-200/50',
    icon: 'from-blue-500 to-blue-600',
    text: 'text-gray-700'
  },
  secondary: {
    container: 'from-green-50 to-green-100/50 border-green-200/50',
    icon: 'from-green-500 to-green-600', 
    text: 'text-gray-700'
  },
  tertiary: {
    container: 'from-purple-50 to-purple-100/50 border-purple-200/50',
    icon: 'from-purple-500 to-purple-600',
    text: 'text-gray-700'
  }
}

const sizeStyles = {
  sm: {
    container: 'p-3',
    icon: 'w-8 h-8',
    iconSize: 'w-4 h-4',
    title: 'text-sm',
    subtitle: 'text-xs',
    description: 'text-xs'
  },
  md: {
    container: 'p-4', 
    icon: 'w-10 h-10',
    iconSize: 'w-5 h-5',
    title: 'text-sm',
    subtitle: 'text-xs',
    description: 'text-xs'
  },
  lg: {
    container: 'p-4',
    icon: 'w-12 h-12',
    iconSize: 'w-6 h-6', 
    title: 'text-base',
    subtitle: 'text-sm',
    description: 'text-sm'
  }
}

export function ActionCard({
  id,
  title,
  subtitle,
  description,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  layout = 'vertical',
  onClick,
  disabled = false,
  className
}: ActionCardProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(id)
    }
  }

  if (layout === 'horizontal') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'group flex items-center rounded-xl bg-gradient-to-b border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
          variantStyle.container,
          sizeStyle.container,
          'w-full',
          className
        )}
      >
        <div className={cn(
          'rounded-full bg-gradient-to-br flex items-center justify-center mr-3 transition-transform duration-300',
          variantStyle.icon,
          sizeStyle.icon
        )}>
          <Icon className={cn('text-[var(--ds-text-inverse)]', sizeStyle.iconSize)} />
        </div>
        
        <div className="flex-1 text-left">
          <div className={cn('font-semibold', variantStyle.text, sizeStyle.title)}>
            {title}
          </div>
          {subtitle && (
            <div className={cn('text-[var(--ds-text-secondary)] mt-0.5', sizeStyle.subtitle)}>
              {subtitle}
            </div>
          )}
          {description && (
            <div className={cn('text-[var(--ds-text-secondary)] mt-1', sizeStyle.description)}>
              {description}
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'group flex flex-col items-center rounded-xl bg-gradient-to-b border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        variantStyle.container,
        sizeStyle.container,
        className
      )}
    >
      <div className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center mb-2 transition-transform duration-300',
        variantStyle.icon,
        sizeStyle.icon
      )}>
        <Icon className={cn('text-[var(--ds-text-inverse)]', sizeStyle.iconSize)} />
      </div>
      
      <div className="text-center">
        <div className={cn('font-semibold', variantStyle.text, sizeStyle.title)}>
          {title}
        </div>
        {subtitle && (
          <div className={cn('text-[var(--ds-text-secondary)] mt-0.5', sizeStyle.subtitle)}>
            {subtitle}
          </div>
        )}
        {description && (
          <div className={cn('text-[var(--ds-text-secondary)] mt-1', sizeStyle.description)}>
            {description}
          </div>
        )}
      </div>
    </button>
  )
}