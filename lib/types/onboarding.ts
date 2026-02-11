export interface OnboardingData {
  phoneNumber: string
  otp: string
  userType: 'patient' | 'caregiver' | null
  patientName: string
  gender: 'male' | 'female' | 'other' | null
  dateOfBirth: string
  doctorDetails: {
    name: string
    hospitalName: string
    contactNumber: string
  }
  documents: {
    prescription?: File
    purchaseInvoice?: File
  }
}

export interface OnboardingStep {
  id: number
  title: string
  description: string
  component: string
  isCompleted: boolean
  isActive: boolean
}

export interface OnboardingState {
  currentStep: number
  data: OnboardingData
  isLoading: boolean
  error: string | null
}

export type OnboardingAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: Partial<OnboardingData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' }
