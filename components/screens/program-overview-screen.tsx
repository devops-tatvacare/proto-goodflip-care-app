"use client"

import { Icon } from '@/components/ui/icon'
import { Button } from "@/components/ui/button"

interface ProgramOverviewScreenProps {
  onBack: () => void
}

export function ProgramOverviewScreen({ onBack }: ProgramOverviewScreenProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header Only */}
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
            Care Program Overview
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Know about your benefits</p>
        </div>
        
        {/* Right spacer for balance */}
        <div className="w-10 h-10"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Get our Care Program for <span className="text-green-600">free</span> with Semaglutide Purchase
            </h1>
            <p className="text-[var(--text-secondary)]">Comprehensive weight management with dedicated support</p>
          </div>
        </div>

        {/* Program Offerings */}
        <div className="bg-[var(--ds-surface-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Program Offerings</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="group" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Dedicated Coaches</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Get dedicated support from endocrinologists, nutritionists, and weight management coaches to optimize
                  your Semaglutide journey
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="vaccines" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Injection Guidance</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Step-by-step injection tutorials, proper technique training, and safety protocols for
                  self-administration
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="scale" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Weight Tracking</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Monitor your weight loss progress, glucose levels, and body composition with advanced analytics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="calendar" className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Dosage Management</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Personalized dosing schedule with gradual titration plan and automated reminders for optimal results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Benefits */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-[var(--ds-text-inverse)] shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--ds-surface-primary)]/20 rounded-xl flex items-center justify-center">
                <Icon name="award" className="w-6 h-6 text-[var(--ds-text-inverse)]" />
              </div>
              <div>
                <h3 className="font-semibold">Crafted with Endocrinology specialists</h3>
                <p className="text-purple-100 text-sm">Expert-designed weight management protocols</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--ds-surface-primary)]/20 rounded-xl flex items-center justify-center">
                <Icon name="group" className="w-6 h-6 text-[var(--ds-text-inverse)]" />
              </div>
              <div>
                <h3 className="font-semibold">Trusted by 15,000+ patients</h3>
                <p className="text-purple-100 text-sm">Proven weight loss results and patient satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-[var(--ds-surface-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">What's Included</h2>

          <div className="space-y-3">
            {[
              "24/7 access to endocrinology specialists",
              "Personalized nutrition and meal planning",
              "Weekly weight and glucose monitoring",
              "Injection technique training and support",
              "Side effect management guidance",
              "Progressive dosing schedule optimization",
              "Lifestyle modification coaching",
              "Peer support community access",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Icon name="checkCircle" className="w-5 h-5 text-[var(--ds-status-success)] flex-shrink-0" />
                <span className="text-[var(--text-secondary)]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[var(--app-primary)] to-orange-500 rounded-xl p-6 text-[var(--ds-text-inverse)] text-center shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-2">Ready to Start Your Weight Loss Journey?</h2>
          <p className="text-orange-100 mb-4">
            Join thousands of patients who have achieved their weight loss goals with our comprehensive Semaglutide
            program.
          </p>
          <Button variant="outline" className="bg-[var(--ds-surface-primary)] text-[var(--app-primary)] border-white hover:bg-orange-50">
            Get Started Today
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
