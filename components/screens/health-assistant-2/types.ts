export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  type?:
    | "normal"
    | "options"
    | "slider"
    | "file-upload"
    | "lab-results"
    | "date-picker"
    | "options-with-inline-datepicker"
    | "diet-input-wait"
    | "success-card"
    | "collapsible-sections"
    | "unified-message"
    | "assessment-choice"
    | "assessment-input"
    | "ai-generation"
    | "plan-ready-card"
  data?: any
  isActive?: boolean
}

export interface HealthAssistant2ScreenProps {
  initialAction?: string
}

export interface AssessmentQuestion {
  id: string
  question: string
  questionType: "single-choice" | "multiple-choice" | "text" | "number"
  options?: string[]
  placeholder?: string
}

export interface ContextSections {
  coreProfile: boolean
  healthContext: boolean
  aiPersonalization: boolean
}

export type CurrentMode = 'program' | 'chat' | 'context'

export interface JourneyTab {
  id: string
  label: string
  icon: any
}

export interface JourneyPhaseContent {
  activeTab: string
  tabs: JourneyTab[]
  widgets: any[]
}

export interface MessageFlow {
  id: string
  name: string
  messages: Omit<Message, 'id' | 'timestamp'>[]
}