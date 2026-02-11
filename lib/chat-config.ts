export const CHAT_CONFIG = {
  // Message limits
  MAX_MESSAGE_LENGTH: 2000,
  MAX_MESSAGES_HISTORY: 100,
  
  // Auto-scroll behavior
  SCROLL_BEHAVIOR: 'smooth' as const,
  SCROLL_DELAY: 100, // ms
  
  // Voice recording
  RECORDING: {
    SAMPLE_RATE: 44100,
    CHANNELS: 1,
    BUFFER_SIZE: 4096,
    MAX_DURATION: 300000, // 5 minutes in ms
    AUDIO_FORMAT: 'audio/webm;codecs=opus',
    FFT_SIZE: 256,
    UPDATE_INTERVAL: 100, // ms
    MOCK_TRANSCRIPTION_DELAY: 1500, // ms for demo
  },
  
  // Animation timings
  ANIMATIONS: {
    MESSAGE_STAGGER: 0.05, // seconds between message animations
    TRANSITION_DELAY: 150, // ms
    COMPOSER_TRANSITION: 200, // ms
  },
  
  // UI thresholds
  THRESHOLDS: {
    TEXTAREA_MIN_HEIGHT: 24, // px
    TEXTAREA_MAX_LINES: 6,
    WAVEFORM_BARS: 56,
    AUDIO_AMPLITUDE_MIN: 0.3,
    AUDIO_AMPLITUDE_MAX: 1.0,
    ANIMATION_DELAY_MULTIPLIER: 0.03,
    ANIMATION_TOP_OFFSET: 0.6,
  },
  
  // Accessibility
  A11Y: {
    FOCUS_DELAY: 100, // ms
    ANNOUNCEMENT_DELAY: 500, // ms
    ARIA_LIVE_DELAY: 200, // ms
  },
  
  // Mock data for development
  MOCK: {
    DEFAULT_AVATAR_INITIAL: 'K',
    EMPTY_STATE_TITLE: 'Ask Kaira',
    EMPTY_STATE_SUBTITLE: "I'm here to help with your health journey. What would you like to know?",
    SAMPLE_TRANSCRIPT: "This is a mock transcript of the recorded audio.",
  },
} as const

// Validation functions
export const CHAT_VALIDATION = {
  isValidMessage: (content: string): boolean => {
    return content.trim().length > 0 && content.length <= CHAT_CONFIG.MAX_MESSAGE_LENGTH
  },
  
  isValidTranscript: (transcript: string): boolean => {
    return transcript.trim().length > 0 && transcript.length <= CHAT_CONFIG.MAX_MESSAGE_LENGTH
  },
  
  shouldLimitHistory: (messageCount: number): boolean => {
    return messageCount >= CHAT_CONFIG.MAX_MESSAGES_HISTORY
  },
} as const

// Error messages
export const CHAT_ERRORS = {
  RECORDING_PERMISSION_DENIED: 'Microphone access denied. Please enable microphone permissions to use voice recording.',
  RECORDING_NOT_SUPPORTED: 'Voice recording is not supported in your browser.',
  RECORDING_FAILED: 'Failed to start recording. Please try again.',
  TRANSCRIPTION_FAILED: 'Failed to transcribe audio. Please try typing your message instead.',
  MESSAGE_TOO_LONG: `Message is too long. Please keep it under ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
} as const

// UI copy
export const CHAT_UI = {
  PLACEHOLDER: 'Ask me about your health',
} as const
