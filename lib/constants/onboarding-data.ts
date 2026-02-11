import type { OnboardingStep } from '@/lib/types/onboarding'

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Phone Number',
    description: 'Enter your phone number for verification',
    component: 'PhoneNumberStep',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    title: 'OTP Verification',
    description: 'Verify your phone number with OTP',
    component: 'OtpStep',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    title: 'User Type',
    description: 'Select if you are a patient or caregiver',
    component: 'UserTypeStep',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 4,
    title: 'Patient Name',
    description: 'Enter the patient name',
    component: 'PatientNameStep',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 5,
    title: 'Gender',
    description: 'Select gender',
    component: 'GenderStep',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 6,
    title: 'Date of Birth',
    description: 'Enter date of birth',
    component: 'DateOfBirthStep',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 7,
    title: 'Doctor Details',
    description: 'Enter your doctor information',
    component: 'DoctorDetailsStep',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 8,
    title: 'Document Upload',
    description: 'Upload required documents',
    component: 'DocumentUploadStep',
    isCompleted: false,
    isActive: false,
  },
]

export const INITIAL_ONBOARDING_DATA = {
  phoneNumber: '',
  otp: '',
  userType: null,
  patientName: '',
  gender: null,
  dateOfBirth: '',
  doctorDetails: {
    name: '',
    hospitalName: '',
    contactNumber: '',
  },
  documents: {},
}
