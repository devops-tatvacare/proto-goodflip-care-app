"use client"

import { useOnboarding } from "@/lib/hooks/use-onboarding"
import { PhoneNumberStep } from "@/components/onboarding/steps/phone-number-step"
import { OtpStep } from "@/components/onboarding/steps/otp-step"
import { UserTypeStep } from "@/components/onboarding/steps/user-type-step"
import { PatientNameStep } from "@/components/onboarding/steps/patient-name-step"
import { GenderStep } from "@/components/onboarding/steps/gender-step"
import { DateOfBirthStep } from "@/components/onboarding/steps/date-of-birth-step"
import { DoctorDetailsStep } from "@/components/onboarding/steps/doctor-details-step"
import { DocumentUploadStep } from "@/components/onboarding/steps/document-upload-step"
import { UploadSuccessStep } from "@/components/onboarding/steps/upload-success-step"
import { CompletionStep } from "@/components/onboarding/steps/completion-step"

interface OnboardingScreenProps {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const {
    currentStep,
    data,
    isLoading,
    error,
    updateData,
    nextStep,
    prevStep,
    setLoading,
    setError,
  } = useOnboarding()

  const handlePhoneNumberNext = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      nextStep()
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpNext = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      nextStep()
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentUploadNext = async () => {
    setLoading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      nextStep()
    } catch (err) {
      setError("Failed to upload documents. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCompletion = async () => {
    setLoading(true)
    try {
      // Simulate account setup
      await new Promise(resolve => setTimeout(resolve, 1500))
      onComplete()
    } catch (err) {
      setError("Failed to complete setup. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhoneNumberStep
            value={data.phoneNumber}
            onChange={(value) => updateData({ phoneNumber: value })}
            onNext={handlePhoneNumberNext}
            isLoading={isLoading}
            error={error}
          />
        )
      case 2:
        return (
          <OtpStep
            phoneNumber={data.phoneNumber}
            value={data.otp}
            onChange={(value) => updateData({ otp: value })}
            onNext={handleOtpNext}
            onBack={prevStep}
            isLoading={isLoading}
            error={error}
          />
        )
      case 3:
        return (
          <UserTypeStep
            value={data.userType}
            onChange={(value) => updateData({ userType: value })}
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
          />
        )
      case 4:
        return (
          <PatientNameStep
            value={data.patientName}
            onChange={(value) => updateData({ patientName: value })}
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
            error={error}
            userType={data.userType}
          />
        )
      case 5:
        return (
          <GenderStep
            value={data.gender}
            onChange={(value) => updateData({ gender: value })}
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
            userType={data.userType}
          />
        )
      case 6:
        return (
          <DateOfBirthStep
            value={data.dateOfBirth}
            onChange={(value) => updateData({ dateOfBirth: value })}
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
            error={error}
            userType={data.userType}
          />
        )
      case 7:
        return (
          <DoctorDetailsStep
            value={data.doctorDetails}
            onChange={(value) => updateData({ doctorDetails: value })}
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
            error={error}
          />
        )
      case 8:
        return (
          <DocumentUploadStep
            value={data.documents}
            onChange={(value) => updateData({ documents: value })}
            onNext={handleDocumentUploadNext}
            onBack={prevStep}
            isLoading={isLoading}
            error={error}
          />
        )
      case 9:
        return (
          <UploadSuccessStep
            onNext={nextStep}
            isLoading={isLoading}
          />
        )
      case 10:
        return (
          <CompletionStep
            onComplete={handleCompletion}
            patientName={data.patientName}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return <div className="h-full">{renderStep()}</div>
}
