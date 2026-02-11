// Minimal utilities extracted from health-assistant-2-screen.tsx
// NO LOGIC CHANGES - just moving pure utility functions

import type React from "react"

// Scroll utility function
export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement>) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}