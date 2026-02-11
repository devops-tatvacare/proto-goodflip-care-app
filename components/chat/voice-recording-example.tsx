"use client"

import React, { useState } from 'react'
import { ChatContainer } from './chat-container'
import { useVoiceRecordingUnified } from '@/hooks/use-voice-recording-unified'
import type { ChatMessage } from '@/hooks/use-chat-state'

/**
 * Example component showing how to integrate the voice recording functionality
 * with the ChatContainer and handle transcription callbacks
 */
export function VoiceRecordingExample() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  
  // Use the voice recording hook with transcription callback
  const [voiceState, voiceActions] = useVoiceRecordingUnified({
    onTranscriptionComplete: (transcript) => {
      // When transcription is complete, populate the input field
      setInputValue(transcript)
      // Optionally, auto-send the message
      // handleSendMessage(transcript)
    }
  })

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText,
      isUser: true,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${messageText}"`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleStartRecording = async () => {
    // Switch to recording-active mode for the new UI
    voiceActions.setMode('recording-active')
    await voiceActions.startRecording()
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatContainer
        messages={messages}
        inputValue={inputValue}
        composerMode={voiceState.mode}
        audioData={voiceState.audioData}
        recordingTime={voiceState.recordingTime}
        onInputChange={setInputValue}
        onSendMessage={() => handleSendMessage()}
        onStartRecording={handleStartRecording}
        onStopRecording={voiceActions.stopRecording}
        onPickGallery={() => console.log('Gallery picker not implemented')}
        onSuggestionClick={(suggestion) => console.log('Suggestion clicked:', suggestion)}
      />
      
      {/* Show error if any */}
      {voiceState.error && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 p-3 rounded-lg">
          {voiceState.error}
          <button 
            onClick={voiceActions.clearError}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}