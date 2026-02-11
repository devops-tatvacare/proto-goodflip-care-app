"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'

interface WalletCardProps {
  onWalletClick: () => void
}

export function WalletCard({ onWalletClick }: WalletCardProps) {
  return (
    <Card
      className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 text-[var(--ds-text-inverse)] rounded-xl overflow-hidden relative min-h-[140px]"
      style={{
        background: `linear-gradient(to right, var(--app-primary-light), var(--app-primary), var(--app-primary-hover))`,
      }}
    >
      {/* Floating Static Bubbles Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-2 left-4 w-2 h-2 rounded-full opacity-30"
          style={{ background: `linear-gradient(to right, var(--app-primary-light), var(--app-primary))` }}
        ></div>
        <div
          className="absolute top-6 right-8 w-3 h-3 rounded-full opacity-25"
          style={{ background: `linear-gradient(to right, var(--app-primary), var(--app-primary-light))` }}
        ></div>
        <div
          className="absolute bottom-8 left-8 w-4 h-4 rounded-full opacity-35"
          style={{ background: `linear-gradient(to right, var(--app-primary), var(--app-primary-hover))` }}
        ></div>
        <div
          className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full opacity-20"
          style={{ background: `linear-gradient(to right, var(--app-primary-hover), var(--app-primary))` }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-6 h-6 rounded-full opacity-25"
          style={{ background: `linear-gradient(to right, var(--app-primary-light), var(--app-primary))` }}
        ></div>
        <div
          className="absolute top-3 right-1/4 w-3.5 h-3.5 rounded-full opacity-30"
          style={{ background: `linear-gradient(to right, var(--app-primary), var(--app-primary-hover))` }}
        ></div>
        <div
          className="absolute bottom-6 left-1/4 w-2 h-2 rounded-full opacity-35"
          style={{ background: `linear-gradient(to right, var(--app-primary), var(--app-primary-light))` }}
        ></div>
        <div
          className="absolute top-1/3 right-6 w-5 h-5 rounded-full opacity-20"
          style={{ background: `linear-gradient(to right, var(--app-primary-hover), var(--app-primary))` }}
        ></div>
      </div>

      <CardContent className="pt-4 pb-6 relative z-10">
        {/* Header */}
        <div className="pb-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2.5 text-[var(--ds-text-inverse)]">
              <div className="w-5 h-5 rounded-md bg-[var(--ds-surface-primary)]/20 flex items-center justify-center">
                <Icon name="wallet" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
              </div>
              My Wallet
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--ds-surface-primary)]/10 rounded-full transition-colors h-8 w-8 text-[var(--ds-text-inverse)]"
              onClick={onWalletClick}
            >
              <Icon name="chevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 p-6 border-2 border-dashed border-white/30 rounded-lg bg-[var(--ds-surface-primary)]/5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-3">
              <Icon name="coins" className="w-8 h-8" />
              <span>2,450 Coins</span>
            </div>
            <p className="text-[var(--ds-text-inverse)]/90 text-sm leading-relaxed">
              Available balance for consultations, medications, and health services
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
