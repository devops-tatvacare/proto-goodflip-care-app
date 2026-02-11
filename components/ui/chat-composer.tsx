"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from '@/components/ui/icon';
import WaveformCanvas from './WaveformCanvas';
import Hourglass from './Hourglass';
import { SIZING } from "@/lib/design-tokens";
import { CHAT_UI } from "@/lib/chat-config";

export type ComposerMode = 'idle' | 'recording' | 'recording-active' | 'transcribing-send' | 'transcribing-stop';

interface ChatComposerProps {
  mode: ComposerMode;
  value: string;
  onChange: (v: string) => void;
  onEnterSend: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSendRecording?: () => void; // New prop for send button during recording
  onSend: () => void;
  onPickGallery: () => void;
  analyser?: AnalyserNode | null;
  isSpeaking?: boolean;
  disabled?: boolean;
  placeholder?: string;
  recordingTime?: number;
  audioData?: number[];
  shouldShowWaveform?: boolean;
  shouldShowLiveText?: boolean;
  interimTranscript?: string;
  isLiveTranscribing?: boolean;
}

export default function ChatComposer({
  mode,
  value,
  onChange,
  onEnterSend,
  onStartRecording,
  onStopRecording,
  onSendRecording,
  onSend,
  onPickGallery,
  analyser = null,
  isSpeaking = false,
  disabled = false,
  placeholder = CHAT_UI.PLACEHOLDER,
  recordingTime = 0,
  audioData = [],
  shouldShowWaveform = true,
  shouldShowLiveText = false,
  interimTranscript = '',
  isLiveTranscribing = false,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRecording = mode === 'recording' || mode === 'recording-active';
  const isTranscribing =
    (typeof mode === 'string' && mode.includes('transcribing')) ||
    mode === 'transcribing-send' ||
    mode === 'transcribing-stop';

  // Auto-resize logic (token-based, no hardcoded px)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Helper: convert rem tokens (e.g., '2.5rem') to px
    const remToPx = (rem: string) => {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const remValue = parseFloat(rem);
      return remValue * rootFontSize;
    };

    const minHeightPx = remToPx(SIZING.input.minHeight); // token: minimum input height
    const maxHeightPx = remToPx(SIZING.input.maxHeight); // token: maximum input height

    // Reset height to measure scrollHeight accurately
    textarea.style.height = 'auto';

    const newHeight = Math.max(minHeightPx, Math.min(textarea.scrollHeight, maxHeightPx));
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeightPx ? 'auto' : 'hidden';
  }, [value]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    if (mode === 'recording-active') {
      return (
        <>
          {/* Stop Button */}
          <motion.button
            onClick={onStopRecording}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors rounded-full w-10 h-10 flex-shrink-0"
            aria-label="Stop recording"
          >
            <Icon name="stop" className="w-5 h-5" />
          </motion.button>

          {/* Center Area: Show waveform for Whisper or live text for Web Speech */}
          <div className="flex-1 h-10 flex items-center justify-center mx-2">
            {shouldShowWaveform ? (
              <WaveformCanvas 
                analyser={analyser}
                isRecording={isRecording}
                isSpeaking={isSpeaking}
              />
            ) : shouldShowLiveText ? (
              <div className="flex-1 px-2 min-h-0">
                <div className="max-h-16 overflow-y-auto text-left">
                  <div className="text-sm text-gray-700 leading-tight whitespace-pre-wrap break-words py-1">
                    {isLiveTranscribing ? (
                      interimTranscript || "🎤 Listening..."
                    ) : (
                      <span className="text-gray-500 italic">Ready to transcribe</span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Send Button */}
          <motion.button
            onClick={onSendRecording || onStopRecording}
            className="bg-[var(--app-primary)] text-white hover:bg-[var(--app-primary-hover)] flex items-center justify-center transition-colors rounded-full w-10 h-10 flex-shrink-0"
            aria-label="Send recording"
          >
            <Icon name="arrowUp" className="w-5 h-5" />
          </motion.button>
        </>
      );
    }

    if (isTranscribing) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-10 flex-1 flex items-center justify-center ds-text-sm ds-text-muted gap-2"
          aria-live="polite"
        >
          <span>Transcribing…</span>
          <Hourglass />
        </motion.div>
      );
    }

    return (
      <>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent border-none resize-none ds-text-sm focus:outline-none focus:ring-0 placeholder:ds-text-muted disabled:opacity-50 leading-6 py-2 break-words"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !disabled) {
              e.preventDefault();
              onEnterSend();
            }
          }}
          aria-label="Chat input"
        />
        <div className="flex items-center">
          {value.trim() !== '' ? (
            <motion.button
              key="send"
              onClick={onSend}
              disabled={disabled}
              className="bg-[var(--app-primary)] text-white hover:bg-[var(--app-primary-hover)] disabled:opacity-50 flex items-center justify-center transition-colors rounded-full w-10 h-10 flex-shrink-0"
              aria-label="Send message"
            >
              <Icon name="arrowUp" className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-1">
              <motion.button 
                key="mic"
                onClick={onStartRecording} 
                disabled={disabled}
                className="ds-text-muted hover:ds-bg-muted disabled:opacity-50 flex items-center justify-center transition-colors rounded-full w-10 h-10"
                aria-label="Start voice recording"
              >
                <Icon name="mic" className="w-5 h-5" />
              </motion.button>
              <motion.button 
                key="gallery"
                onClick={onPickGallery} 
                disabled={disabled}
                className="ds-text-muted hover:ds-bg-muted disabled:opacity-50 flex items-center justify-center transition-colors rounded-full w-10 h-10"
                aria-label="Attach from gallery"
              >
                <Icon name="imageUpload" className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ds-bg-muted border ds-border transition-all duration-fast ease-smooth focus-within:ring-2 focus-within:ring-ring focus-within:border-ring flex items-center gap-2 ds-p-sm ds-rounded-lg min-h-10 max-h-24`}
    >
      {renderContent()}
    </div>
  );
}
