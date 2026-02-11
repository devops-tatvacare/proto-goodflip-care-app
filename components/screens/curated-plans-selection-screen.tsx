"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'

interface CuratedPlansSelectionScreenProps {
  onBack: () => void
  onGetStarted: () => void
}

export function CuratedPlansSelectionScreen({ onBack, onGetStarted }: CuratedPlansSelectionScreenProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header Only */}
      <div className="flex items-center justify-between py-4 px-4">
        {/* Back Button - Circular */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ backgroundColor: "var(--overlay-bg)", backdropFilter: "blur(8px)" }}
        >
          <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>
        
        {/* Title Section */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-[var(--card-header-text)]">
            Create Curated Plans
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Personalized health journey</p>
        </div>
        
        {/* Right spacer for balance */}
        <div className="w-10 h-10"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Hero Image Section - Now in scrollable area */}
          <div className="flex justify-center pb-3">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--icon-bg-primary)" }}
              >
                <Icon name="handshake" className="w-10 h-10" style={{ color: "var(--app-primary)" }} />
              </div>
            </div>
          </div>

          {/* Plan Option Card */}
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
            <CardContent className="p-6">
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Diet & Exercise Plans</h3>

              {/* Description */}
              <p className="text-sm text-[var(--ds-text-secondary)] mb-6 text-center leading-relaxed">
                Comprehensive 30-day personalized plans combining nutrition guidance and exercise routines specifically
                designed for your obesity management program.
              </p>

              {/* Feature List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--app-primary)" }}></div>
                  <span className="text-sm text-gray-700">Personalized meal plans and recipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--app-primary)" }}></div>
                  <span className="text-sm text-gray-700">Customized exercise routines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--app-primary)" }}></div>
                  <span className="text-sm text-gray-700">Progress tracking and adjustments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--app-primary)" }}></div>
                  <span className="text-sm text-gray-700">Healthcare professional review option</span>
                </div>
              </div>

              {/* Get Started Button */}
              <Button
                onClick={onGetStarted}
                className="w-full font-semibold py-3"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--ds-interactive-primary)] flex-shrink-0 mt-0.5">
                <span className="text-[var(--ds-text-inverse)] text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">About Your Plans</h4>
                <p className="text-sm text-blue-800">
                  Our AI analyzes your health profile, preferences, and goals to create personalized plans that complement
                  your Semaglutide treatment for optimal results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
