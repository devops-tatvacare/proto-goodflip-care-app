import { useReducer, useCallback } from 'react'
import type { OnboardingState, OnboardingAction, OnboardingData } from '@/lib/types/onboarding'
import { INITIAL_ONBOARDING_DATA } from '@/lib/constants/onboarding-data'

const initialState: OnboardingState = {
  currentStep: 1,
  data: INITIAL_ONBOARDING_DATA,
  isLoading: false,
  error: null,
}

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
        error: null,
      }
    case 'UPDATE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 8),
        error: null,
      }
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
        error: null,
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }, [])

  const updateData = useCallback((data: Partial<OnboardingData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    ...state,
    setStep,
    updateData,
    setLoading,
    setError,
    nextStep,
    prevStep,
    reset,
  }
}
