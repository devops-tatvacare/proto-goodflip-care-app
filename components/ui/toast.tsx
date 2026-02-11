"use client"

import { useEffect, useState } from "react"
import { Icon } from '@/components/ui/icon'
import type { Toast as ToastType } from "@/lib/hooks/use-toast"

interface ToastProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Fade in animation
    const showTimer = setTimeout(() => setIsVisible(true), 50)

    // Auto dismiss
    if (toast.duration && toast.duration > 0) {
      const dismissTimer = setTimeout(() => {
        handleDismiss()
      }, toast.duration)

      return () => {
        clearTimeout(showTimer)
        clearTimeout(dismissTimer)
      }
    }

    return () => clearTimeout(showTimer)
  }, [toast.duration])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onDismiss(toast.id)
    }, 300) // Wait for fade out animation
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <Icon name="checkCircle" className="w-5 h-5 text-[var(--ds-text-inverse)]" />
      case "error":
        return <Icon name="alertCircle" className="w-5 h-5 text-[var(--ds-text-inverse)]" />
      case "warning":
        return <Icon name="alertTriangle" className="w-5 h-5 text-[var(--ds-text-inverse)]" />
      default:
        return <Icon name="info" className="w-5 h-5 text-[var(--ds-text-inverse)]" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-gradient-to-r from-[var(--status-success)] to-green-600"
      case "error":
        return "bg-gradient-to-r from-[var(--status-error)] to-red-600"
      case "warning":
        return "bg-gradient-to-r from-[var(--status-warning)] to-yellow-600"
      default:
        return "bg-gradient-to-r from-[var(--app-primary)] to-teal-600"
    }
  }

  return (
    <div
      className={`
        ${getBgColor()} 
        rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm pointer-events-auto
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          {toast.title && <h4 className="text-sm font-semibold text-[var(--ds-text-inverse)] leading-tight">{toast.title}</h4>}
          {toast.description && <p className="text-sm text-[var(--ds-text-inverse)]/90 leading-tight mt-0.5">{toast.description}</p>}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-[var(--ds-surface-primary)]/20 rounded-full transition-colors duration-200"
        >
          <Icon name="close" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
        </button>
      </div>
    </div>
  )
}
