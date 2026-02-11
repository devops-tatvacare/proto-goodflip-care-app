"use client"

import { HealthAssistant2Screen } from "./screens/health-assistant-2-screen"

interface VersionAwareHA2Props {
  version?: string // Keep for compatibility but unused
  initialAction?: string
  showWelcome?: boolean
  navigationSource?: string
  onWelcomeComplete?: () => void
}

export function VersionAwareHealthAssistant2({ 
  initialAction, 
  showWelcome, 
  navigationSource, 
  onWelcomeComplete 
}: VersionAwareHA2Props) {
  return (
    <HealthAssistant2Screen 
      initialAction={initialAction} 
      showWelcome={showWelcome}
      navigationSource={navigationSource}
      onWelcomeComplete={onWelcomeComplete}
    />
  )
}