"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScreenHeader } from "@/components/ui/screen-header"
import { Icon } from '@/components/ui/icon'

interface BookConsultationScreenProps {
  onBack: () => void
  specialistName?: string
}

export function BookConsultationScreen({ onBack, specialistName }: BookConsultationScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleContinue = () => {
    setIsProcessing(true)
    // Simulate booking process
    setTimeout(() => {
      setIsProcessing(false)
      // Here you would typically navigate to payment or confirmation
      console.log("Booking consultation...")
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScreenHeader title="Book Consultation" onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section with Team Photo */}
        <div className="bg-gradient-to-b from-purple-200 to-purple-300 px-4 pt-6 pb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center leading-tight">
            Consult with our team of nutrition specialists
          </h1>

          <div className="flex flex-col gap-3">
            <Badge className="bg-purple-600 text-[var(--ds-text-inverse)] text-sm font-medium py-2 px-4 rounded-full self-center">
              Combined Exp. of 20+ years
            </Badge>
            <Badge className="bg-purple-600 text-[var(--ds-text-inverse)] text-sm font-medium py-2 px-4 rounded-full self-center">
              20,000+ consultations completed
            </Badge>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="bg-purple-200 mx-4 rounded-2xl p-4 mb-6 -mt-4">
          <p className="text-gray-800 text-base leading-relaxed">
            Our expert guidance will not only support your treatment plan but also optimize your overall well-being.
            Take control of your health and unlock the potential for a stronger, healthier future.
          </p>
        </div>

        <div className="px-4 space-y-6">
          {/* How will this consultation help you? */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How will this consultation help you?</h2>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-4">Here are some benefits you can expect:</p>

            <div className="space-y-3">
              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-800">Enhanced treatment support</span>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">🥗</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-800">Boosted immune system</span>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">🍊</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-800">Increased energy and vitality</span>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">🥦</div>
              </div>
            </div>
          </div>

          {/* How it works? */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How it works?</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--ds-text-inverse)] text-2xl font-bold">1</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Book a Consultation</h3>
                  <p className="text-[var(--ds-text-secondary)] text-sm">Pay for your consultation through the app</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--ds-text-inverse)] text-2xl font-bold">2</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Schedule a Meeting</h3>
                  <p className="text-[var(--ds-text-secondary)] text-sm">
                    Our care specialist will reach out to you to finalize the meeting time based on your availability
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--ds-text-inverse)] text-2xl font-bold">3</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Meet with the Expert</h3>
                  <p className="text-[var(--ds-text-secondary)] text-sm">
                    Attend your scheduled consultation with our trusted nutrition/physiologist expert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing for fixed footer */}
        <div className="h-32"></div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="bg-[var(--ds-surface-primary)] border-t border-[var(--ds-border-default)] p-4 space-y-3">
        {/* Wallet Discount */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
            <Icon name="check" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
          </div>
          <span className="text-orange-800 font-medium text-sm">Get ₹750 off using your wallet</span>
          <Icon name="wallet" className="w-5 h-5 text-orange-600 ml-auto" />
        </div>

        {/* Pricing and Continue Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ds-text-secondary)] mb-1">Total Payable</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">₹250</span>
              <span className="text-lg text-gray-400 line-through">₹1,000</span>
            </div>
          </div>

          <Button
            className="px-8 py-3 text-lg font-semibold bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]"
            onClick={handleContinue}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
