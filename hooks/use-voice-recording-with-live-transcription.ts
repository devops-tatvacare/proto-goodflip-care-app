import { useState, useCallback } from 'react'
import { ComposerMode } from '@/components/ui/chat-composer'

export interface VoiceRecordingState {
  mode: ComposerMode
  audioData: number[]
  transcript: string
  interimTranscript: string
  error: string | null
  isTranscribing: boolean
  recordingTime: number
  analyser: AnalyserNode | null
  isLiveTranscribing: boolean
  transcriptionEngine: 'whisper' | 'webspeech' | 'auto'
}

export interface VoiceRecordingActions {
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearTranscript: () => void
  clearError: () => void
  setMode: (mode: ComposerMode) => void
  toggleLiveTranscription: () => void
}

interface UseVoiceRecordingOptions {
  onTranscriptionComplete?: (transcript: string) => void
  enableLiveTranscription?: boolean
}

export function useVoiceRecordingWithLiveTranscription(
  options?: UseVoiceRecordingOptions
): [VoiceRecordingState, VoiceRecordingActions] {
  const [mode, setMode] = useState<ComposerMode>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const startRecording = useCallback(async () => {
    setError(null)
    setMode('recording-active')
  }, [])

  const stopRecording = useCallback(() => {
    setMode('idle')
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const toggleLiveTranscription = useCallback(() => {
    // Do nothing - functionality disabled
  }, [])

  const state: VoiceRecordingState = {
    mode,
    audioData: [],
    transcript,
    interimTranscript: '',
    error,
    isTranscribing: false,
    recordingTime: 0,
    analyser: null,
    isLiveTranscribing: false,
    transcriptionEngine: 'whisper'
  }

  const actions: VoiceRecordingActions = {
    startRecording,
    stopRecording,
    clearTranscript,
    clearError,
    setMode,
    toggleLiveTranscription
  }

  return [state, actions]
}
