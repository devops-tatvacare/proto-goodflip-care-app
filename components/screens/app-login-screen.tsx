"use client"

import { useState } from "react"
import { MobileHomeScreen } from "./mobile-home-screen"
import { SplashScreen } from "./splash-screen"
import { PhoneNumberScreen } from "./phone-number-screen"
import { OtpScreen } from "./otp-screen"
import { WelcomeHookScreen } from "./welcome-hook-screen"
import { TrustAuthorityScreen } from "./trust-authority-screen"
import { HealthAssessmentOptionScreen } from "./health-assessment-option-screen"
import { QuestionnaireScreen } from "./questionnaire-screen"
import { GeneratingPlansScreen } from "./generating-plans-screen"
import { AssessmentCompleteScreen } from "./assessment-complete-screen"
import { PlanDetailsScreen } from "./plan-details-screen"

type AppLoginStep = "home" | "splash" | "phone" | "otp" | "welcome" | "trust" | "assessment-option" | "health-assessment" | "generating-plans" | "assessment-complete" | "plan-details" | "complete"

interface AppLoginScreenProps {
  onComplete: () => void
  onSkipToHealthAssistant?: (source: string) => void
}

export function AppLoginScreen({ onComplete, onSkipToHealthAssistant }: AppLoginScreenProps) {
  const [currentStep, setCurrentStep] = useState<AppLoginStep>("home")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAppIconClick = () => {
    setCurrentStep("splash")
  }

  const handleSplashComplete = () => {
    setCurrentStep("phone")
  }

  const handlePhoneNext = async () => {
    setIsLoading(true)
    setError("")
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep("otp")
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpNext = async () => {
    setIsLoading(true)
    setError("")
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep("welcome")
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpBack = () => {
    setCurrentStep("phone")
    setOtp("")
    setError("")
  }

  const handleWelcomeGetStarted = () => {
    setCurrentStep("trust")
  }

  const handleTrustNext = () => {
    setCurrentStep("assessment-option")
  }

  const handleTakeAssessment = () => {
    setCurrentStep("health-assessment")
  }

  const handleSkipAssessment = () => {
    console.log('🎯 APP-LOGIN: handleSkipAssessment called')
    if (onSkipToHealthAssistant) {
      console.log('🎯 APP-LOGIN: Calling onSkipToHealthAssistant with app-login-skip')
      onSkipToHealthAssistant('app-login-skip')
      console.log('🎯 APP-LOGIN: onSkipToHealthAssistant called successfully')
    } else {
      console.log('🎯 APP-LOGIN: Calling onComplete instead')
      onComplete()
    }
    console.log('🎯 APP-LOGIN: handleSkipAssessment completed')
  }

  const handleAssessmentSubmit = (data: any) => {
    // Handle assessment data submission
    console.log("Assessment data:", data)
    setCurrentStep("generating-plans")
  }

  const handleGeneratingComplete = () => {
    setCurrentStep("assessment-complete")
  }

  const handleSeePlans = () => {
    setCurrentStep("plan-details")
  }

  const handleTakeToApp = () => {
    if (onSkipToHealthAssistant) {
      onSkipToHealthAssistant('app-login-skip')
    } else {
      onComplete()
    }
  }

  const handlePlanDetailsBack = () => {
    setCurrentStep("assessment-complete")
  }

  const handleAssessmentBack = () => {
    setCurrentStep("assessment-option")
  }

  const renderStep = () => {
    switch (currentStep) {
      case "home":
        return <MobileHomeScreen onAppIconClick={handleAppIconClick} />
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />
      case "phone":
        return (
          <PhoneNumberScreen
            value={phoneNumber}
            onChange={setPhoneNumber}
            onNext={handlePhoneNext}
            isLoading={isLoading}
            error={error}
          />
        )
      case "otp":
        return (
          <OtpScreen
            phoneNumber={phoneNumber}
            value={otp}
            onChange={setOtp}
            onNext={handleOtpNext}
            onBack={handleOtpBack}
            isLoading={isLoading}
            error={error}
          />
        )
      case "welcome":
        return <WelcomeHookScreen onGetStarted={handleWelcomeGetStarted} />
      case "trust":
        return <TrustAuthorityScreen onNext={handleTrustNext} />
      case "assessment-option":
        return (
          <HealthAssessmentOptionScreen
            onTakeAssessment={handleTakeAssessment}
            onSkip={handleSkipAssessment}
          />
        )
      case "health-assessment":
        return (
          <QuestionnaireScreen
            onBack={handleAssessmentBack}
            onSubmit={handleAssessmentSubmit}
          />
        )
      case "generating-plans":
        return (
          <GeneratingPlansScreen
            onComplete={handleGeneratingComplete}
          />
        )
      case "assessment-complete":
        return (
          <AssessmentCompleteScreen
            onSeePlans={handleSeePlans}
            onTakeToApp={handleTakeToApp}
          />
        )
      case "plan-details":
        return (
          <PlanDetailsScreen
            onBack={handlePlanDetailsBack}
          />
        )
      default:
        return <MobileHomeScreen onAppIconClick={handleAppIconClick} />
    }
  }

  return (
    <div className="h-full">
      {renderStep()}
    </div>
  )
}
