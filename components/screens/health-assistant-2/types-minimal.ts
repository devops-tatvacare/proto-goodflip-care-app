// Minimal type definitions extracted from health-assistant-2-screen.tsx
// NO LOGIC CHANGES - just moving type definitions

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