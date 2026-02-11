import { Message } from "./types"
import { ASSESSMENT_QUESTIONS } from "./constants"

// Utility function to scroll to bottom of messages
export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement>) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}

// Utility function to add new message to messages array
export const addMessageToList = (
  messages: Message[], 
  content: string, 
  isUser: boolean, 
  type?: Message["type"], 
  data?: any, 
  isActive?: boolean
): Message[] => {
  const newMessage: Message = {
    id: Date.now().toString(),
    content,
    isUser,
    timestamp: new Date(),
    type,
    data,
    isActive
  }
  return [...messages, newMessage]
}

// Utility function to update message active state
export const updateMessageActiveState = (messages: Message[], messageId: string, isActive: boolean): Message[] => {
  return messages.map(msg => 
    msg.id === messageId ? { ...msg, isActive } : msg
  )
}

// Utility function to remove message by ID
export const removeMessageById = (messages: Message[], messageId: string): Message[] => {
  return messages.filter(msg => msg.id !== messageId)
}

// Utility function to find next assessment question
export const getNextAssessmentQuestion = (currentQuestionIndex: number): typeof ASSESSMENT_QUESTIONS[0] | null => {
  if (currentQuestionIndex >= ASSESSMENT_QUESTIONS.length - 1) {
    return null // No more questions
  }
  return ASSESSMENT_QUESTIONS[currentQuestionIndex + 1]
}

// Utility function to calculate assessment progress
export const getAssessmentProgress = (currentQuestionIndex: number): number => {
  return ((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100
}

// Utility function to validate assessment answer
export const validateAssessmentAnswer = (questionType: string, answer: any): boolean => {
  if (!answer) return false
  
  switch (questionType) {
    case "single-choice":
      return typeof answer === "string" && answer.trim().length > 0
    case "multiple-choice":
      return Array.isArray(answer) && answer.length > 0
    case "text":
      return typeof answer === "string" && answer.trim().length > 0
    case "number":
      return !isNaN(Number(answer)) && Number(answer) > 0
    default:
      return false
  }
}

// Utility function to format assessment answers for display
export const formatAssessmentAnswer = (questionType: string, answer: any): string => {
  switch (questionType) {
    case "single-choice":
    case "text":
    case "number":
      return String(answer)
    case "multiple-choice":
      return Array.isArray(answer) ? answer.join(", ") : String(answer)
    default:
      return String(answer)
  }
}

// Utility function to generate message ID
export const generateMessageId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Utility function to check if message type needs active state
export const messageNeedsActiveState = (type?: Message["type"]): boolean => {
  const activeTypes = ["assessment-choice", "assessment-input", "plan-ready-card"]
  return activeTypes.includes(type || "")
}