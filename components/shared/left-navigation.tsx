"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icon } from '@/components/ui/icon'

interface LeftNavigationProps {
  isOpen: boolean
  onClose: () => void
  onDeviceManagement?: () => void
  onRecords?: () => void
  onProfile?: () => void
}

export function LeftNavigation({ isOpen, onClose, onDeviceManagement, onRecords, onProfile }: LeftNavigationProps) {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute left-0 right-0 top-11 bottom-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute left-0 top-11 bottom-0 w-64 bg-[var(--ds-surface-primary)] shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-[var(--ds-border-default)]">
                <AvatarFallback className="bg-[var(--app-primary)] text-[var(--ds-text-inverse)] font-medium">K</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Kumar</h3>
                <p className="text-sm text-[var(--text-secondary)]">Welcome back!</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Icon name="close" className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors">
              <Icon name="creditCard" className="w-5 h-5 text-[var(--app-primary)]" />
              <span className="font-medium text-[var(--text-primary)]">Wallet</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors">
              <ShoppingBag className="w-5 h-5 text-[var(--app-primary)]" />
              <span className="font-medium text-[var(--text-primary)]">Orders</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors"
              onClick={onDeviceManagement}
            >
              <Icon name="heartMonitor" className="w-5 h-5 text-[var(--app-primary)]" />
              <span className="font-medium text-[var(--text-primary)]">Your Devices</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors"
              onClick={onRecords}
            >
              <Icon name="fileText" className="w-5 h-5 text-[var(--app-primary)]" />
              <span className="font-medium text-[var(--text-primary)]">Medical Records</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--ds-surface-secondary)] rounded-lg transition-colors"
              onClick={onProfile}
            >
              <Icon name="person" className="w-5 h-5 text-[var(--app-primary)]" />
              <span className="font-medium text-[var(--text-primary)]">Profile</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
