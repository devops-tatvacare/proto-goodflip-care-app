import { useState, useCallback } from 'react'
import { ComposerMode } from '@/components/ui/chat-composer'

export interface VoiceRecordingState {
  mode: ComposerMode
  audioData: number[]
  transcript: string
  error: string | null
  isTranscribing: boolean
  recordingTime: number
  analyser: AnalyserNode | null
  interimTranscript: string
  isLiveTranscribing: boolean
  transcriptionEngine: 'whisper' | 'webspeech' | 'auto'
  shouldShowWaveform: boolean
  shouldShowLiveText: boolean
}

export interface VoiceRecordingActions {
  startRecording: () => Promise<void>
  stopRecording: (shouldAutoSend?: boolean) => void
  clearTranscript: () => void
  clearError: () => void
  setMode: (mode: ComposerMode) => void
}

export interface UseVoiceRecordingUnifiedOptions {
  onTranscriptionComplete?: (transcript: string, shouldAutoSend?: boolean) => void
}

export function useVoiceRecordingUnified(options?: UseVoiceRecordingUnifiedOptions): [VoiceRecordingState, VoiceRecordingActions] {
  const [mode, setMode] = useState<ComposerMode>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const startRecording = useCallback(async () => {
    setError(null)
    setMode('recording-active')
  }, [])

  const stopRecording = useCallback(async (shouldAutoSend: boolean = false) => {
    setMode('idle')
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const state: VoiceRecordingState = {
    mode,
    audioData: [],
    transcript,
    error,
    isTranscribing: false,
    recordingTime: 0,
    analyser: null,
    interimTranscript: '',
    isLiveTranscribing: false,
    transcriptionEngine: 'whisper',
    shouldShowWaveform: false,
    shouldShowLiveText: false
  }

  const actions: VoiceRecordingActions = {
    startRecording,
    stopRecording,
    clearTranscript,
    clearError,
    setMode
  }

  return [state, actions]
}
