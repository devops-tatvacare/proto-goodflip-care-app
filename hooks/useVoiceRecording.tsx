"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit'

interface VoiceRecordingHook {
  isRecording: boolean
  audioData: number[]
  transcript: string
  isTranscribing: boolean
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
}

export const useVoiceRecording = (): VoiceRecordingHook => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<number[]>([])
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart
          } else {
            interimTranscript += transcriptPart
          }
        }

        setTranscript(finalTranscript || interimTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        const err: string = event?.error || 'unknown'
        // Ignore benign errors triggered by intentional stop or silence
        if (err === 'aborted' || err === 'no-speech') {
          // Do not surface or log; these are expected in normal flows
          return
        }
        console.error('Speech recognition error:', err)
        setError(`Speech recognition error: ${err}`)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Convert to visualization data (50 bars)
    const barCount = 50
    const barWidth = Math.floor(bufferLength / barCount)
    const newAudioData: number[] = []

    for (let i = 0; i < barCount; i++) {
      let sum = 0
      const start = i * barWidth
      const end = Math.min(start + barWidth, bufferLength)

      for (let j = start; j < end; j++) {
        sum += dataArray[j]
      }

      const average = sum / (end - start)
      // Normalize and scale for better visualization
      const normalizedValue = (average / 255) * 100
      newAudioData.push(Math.max(8, normalizedValue))
    }

    setAudioData(newAudioData)

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)
    }
  }, [isRecording])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setTranscript('')
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      streamRef.current = stream

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      // Set up Web Audio API for visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      
      source.connect(analyser)
      analyserRef.current = analyser

      // Start recording
      mediaRecorder.start(100) // Capture every 100ms
      setIsRecording(true)

      // Start audio analysis
      analyzeAudio()

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Microphone access denied or not available')
    }
  }, [analyzeAudio])

  const stopRecording = useCallback(() => {
    setIsTranscribing(true)

    // Stop MediaRecorder
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    setIsRecording(false)
    setAudioData([])

    // Simulate processing time
    setTimeout(() => {
      setIsTranscribing(false)
    }, 1500)
  }, [isRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return {
    isRecording,
    audioData,
    transcript,
    isTranscribing,
    startRecording,
    stopRecording,
    error
  }
}
