"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export interface ActionSectionProps {
  title: string
  subtitle?: string
  description?: string
  icon?: string | React.ReactNode
  variant: 'primary' | 'secondary' | 'tertiary'
  children: React.ReactNode
  className?: string
}

const variantStyles = {
  primary: {
    header: 'text-blue-600',
    background: 'bg-blue-100',
    divider: 'from-blue-400 to-blue-600',
    container: 'bg-[var(--ds-surface-primary)]/90 border-blue-100/50'
  },
  secondary: {
    header: 'text-green-600', 
    background: 'bg-green-100',
    divider: 'from-green-400 to-green-600',
    container: 'bg-[var(--ds-surface-primary)]/90 border-green-100/50'
  },
  tertiary: {
    header: 'text-purple-600',
    background: 'bg-purple-100', 
    divider: 'from-purple-400 to-purple-600',
    container: 'bg-[var(--ds-surface-primary)]/90 border-purple-100/50'
  }
}

export function ActionSection({
  title,
  subtitle,
  description,
  icon,
  variant = 'primary',
  children,
  className
}: ActionSectionProps) {
  const variantStyle = variantStyles[variant]
  
  return (
    <div className={cn(
      'backdrop-blur-sm rounded-2xl border shadow-lg transition-all duration-500',
      variantStyle.container,
      className
    )}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="text-center">
          <div className={cn('inline-flex items-center gap-2 mb-3', variantStyle.header)}>
            {icon && (
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                variantStyle.background
              )}>
                {icon}
              </div>
            )}
            <h3 className="text-lg font-bold tracking-wide">{title}</h3>
          </div>
          
          <div className={cn(
            'w-12 h-0.5 bg-gradient-to-r mx-auto rounded-full mb-2',
            variantStyle.divider
          )} />
          
          {subtitle && (
            <p className="text-xs text-[var(--ds-text-secondary)] font-medium">
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className="text-xs text-[var(--ds-text-secondary)] mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  )
}