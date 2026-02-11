"use client"

import type React from "react"

import { Icon } from '@/components/ui/icon'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function BaseModal({ isOpen, onClose, title, children, actions, className }: BaseModalProps) {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-[var(--ds-surface-inverse)]/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className={"bg-[var(--ds-surface-primary)] rounded-lg p-4 w-full max-w-xs max-h-[75vh] overflow-y-auto shadow-xl border border-[var(--ds-border-subtle)] " + (className || "") }>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-6 h-6 hover:bg-[var(--ds-surface-secondary)] rounded-full flex items-center justify-center transition-colors"
          >
            <Icon name="close" className="w-3.5 h-3.5 text-[var(--ds-text-secondary)]" />
          </button>
        </div>

        <div className="mb-3">{children}</div>

        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  )
}
