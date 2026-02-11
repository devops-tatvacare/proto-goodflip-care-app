"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from '@/components/ui/icon'
import { useState, useRef, useEffect } from "react"

interface PlanReadyScreenProps {
  plan: any
  verificationStatus: "pending" | "verified"
  onBack: () => void
  onViewDetails: () => void
  onRetakeQuestionnaire: () => void
  onRequestHCPReview: () => void
}

export function PlanReadyScreen({
  plan,
  verificationStatus,
  onBack,
  onViewDetails,
  onRetakeQuestionnaire,
  onRequestHCPReview,
}: PlanReadyScreenProps) {
  const [requestStatus, setRequestStatus] = useState<"idle" | "requesting" | "requested">("idle")
  const [isTimelineView, setIsTimelineView] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleRequestHCPReview = async () => {
    setRequestStatus("requesting")
    try {
      await onRequestHCPReview()
      setRequestStatus("requested")
    } catch (error) {
      setRequestStatus("idle")
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const handleDownloadPDF = () => {
    setShowPdfModal(true)
    setShowDropdown(false)
  }

  const handleShare = async () => {
    setShowDropdown(false)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "30-Day Personalized Plan",
          text: "Check out my personalized health plan!",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    }
  }

  const handleToggleTimeline = () => {
    setIsTimelineView(!isTimelineView)
  }

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
            Your Plan is Ready!
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mt-1">30-day personalized journey</p>
        </div>
        
        {/* 3-dot menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
          >
            <Icon name="moreVertical" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-lg shadow-lg z-50">
              <div className="py-1">
                {/* Download PDF */}
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--ds-surface-secondary)] transition-colors flex items-center gap-3"
                  onClick={handleDownloadPDF}
                >
                  <Icon name="download" className="w-4 h-4" />
                  Download PDF
                </button>

                {/* Share */}
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--ds-surface-secondary)] transition-colors flex items-center gap-3"
                  onClick={handleShare}
                >
                  <Icon name="share" className="w-4 h-4" />
                  Share
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                {/* Timeline Toggle */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-[var(--ds-surface-secondary)] transition-colors">
                  <span className="text-sm font-medium">Timeline</span>
                  <button
                    onClick={handleToggleTimeline}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isTimelineView ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[var(--ds-surface-primary)] shadow-lg transition-transform ${
                        isTimelineView ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--ds-surface-primary)] rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Download Plan PDF</h3>
            <p className="text-sm text-[var(--ds-text-secondary)] mb-6">
              Your personalized 30-day plan will be downloaded as a PDF document.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  // Simulate PDF download
                  console.log("Downloading PDF...")
                  setShowPdfModal(false)
                }}
                className="flex-1"
              >
                <Icon name="download" className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setShowPdfModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Hero Image Section - Now in scrollable area */}
          <div className="flex justify-center pb-3">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
                style={{ backgroundColor: "var(--icon-bg-primary)" }}
              >
                <Icon name="checkCircle" className="w-10 h-10" style={{ color: "var(--app-primary)" }} />
              </div>
            </div>
          </div>

        {/* Success Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Plan Generated Successfully!</h2>
          <p className="text-sm text-[var(--ds-text-secondary)]">Your personalized 30-day plan is ready to help you achieve your goals</p>
        </div>

        {/* Conditional Content Based on Timeline View */}
        {isTimelineView ? (
          /* Timeline View */
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Timeline Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-[var(--ds-text-inverse)] text-sm font-bold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Week 1: Foundation</p>
                    <p className="text-sm text-[var(--ds-text-secondary)]">Establish eating patterns and light exercise</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-[var(--ds-text-inverse)] text-sm font-bold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Week 2: Building Momentum</p>
                    <p className="text-sm text-[var(--ds-text-secondary)]">Increase activity and refine meal planning</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-[var(--ds-text-inverse)] text-sm font-bold flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Week 3: Optimization</p>
                    <p className="text-sm text-[var(--ds-text-secondary)]">Fine-tune routines and track progress</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-[var(--ds-text-inverse)] text-sm font-bold flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Week 4: Mastery</p>
                    <p className="text-sm text-[var(--ds-text-secondary)]">Solidify habits and plan for continuation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Calendar/Detailed View */
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">30-Day Personalized Plan</h3>
                <Badge
                  className={`text-xs px-2 py-1 ${
                    verificationStatus === "verified"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  }`}
                >
                  {verificationStatus === "verified" ? "HCP Verified" : "Pending HCP Review"}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Diet Plan Preview */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--icon-bg-primary)" }}
                  >
                    <Icon name="restaurant" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Diet Plan</h4>
                    <p className="text-sm text-[var(--ds-text-secondary)]">
                      Personalized meal plans with calorie tracking, portion control, and Semaglutide-friendly foods
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Breakfast
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Lunch
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Dinner
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Snacks
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Exercise Plan Preview */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--icon-bg-primary)" }}
                  >
                    <Icon name="fitnessCenter" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Exercise Plan</h4>
                    <p className="text-sm text-[var(--ds-text-secondary)]">
                      Customized workout routines adapted to your fitness level and schedule
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Cardio
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Strength
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Flexibility
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Recovery
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* HCP Review Section */}
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--icon-bg-primary)" }}
              >
                <Icon name="shield" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Healthcare Professional Review</h4>
                  {verificationStatus === "verified" && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1 font-medium whitespace-nowrap">
                      Verified
                    </Badge>
                  )}
                </div>

                {verificationStatus === "verified" ? (
                  <p className="text-sm text-[var(--ds-text-secondary)]">
                    Your plan has been reviewed and approved by a healthcare professional.
                  </p>
                ) : requestStatus === "requested" ? (
                  <>
                    <p className="text-sm text-[var(--ds-text-secondary)] mb-3">
                      Your request for healthcare professional review has been submitted successfully.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--ds-interactive-primary)] rounded-full animate-pulse"></div>
                        <p className="text-sm text-blue-800 font-medium">
                          Review in progress - You'll be notified once completed
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm text-[var(--ds-text-secondary)] mb-3">
                      Get your personalized plan reviewed by a healthcare professional for additional safety and
                      effectiveness.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRequestHCPReview}
                      disabled={requestStatus === "requesting"}
                      className="text-sm bg-transparent"
                    >
                      {requestStatus === "requesting" ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Requesting...
                        </>
                      ) : (
                        <>
                          <Icon name="shield" className="w-4 h-4 mr-2" />
                          Request HCP Review
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={onViewDetails}
            className="w-full font-semibold py-3"
            style={{ backgroundColor: "var(--app-primary)" }}
          >
            <Icon name="eye" className="w-4 h-4 mr-2" />
            View Plan Details
          </Button>

          <Button variant="outline" onClick={onRetakeQuestionnaire} className="w-full font-medium py-3 bg-transparent">
            <Icon name="refresh" className="w-4 h-4 mr-2" />
            Retake Questionnaire
          </Button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--ds-interactive-primary)] flex-shrink-0 mt-0.5">
              <span className="text-[var(--ds-text-inverse)] text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Getting Started</h4>
              <p className="text-sm text-blue-800">
                Your plan includes daily recommendations, progress tracking, and the ability to mark items as completed
                or skipped. Start tomorrow or whenever you're ready!
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
