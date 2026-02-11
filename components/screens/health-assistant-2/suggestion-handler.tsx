// Contextual suggestion chip generator for health assistant messages
// Provides relevant next actions based on conversation context

export interface SuggestionChip {
  id: string
  label: string
  icon?: string
  action: string
}

export const generateSuggestionsForMessage = (
  messageContent: string,
  messageType?: string,
  conversationContext?: string[]
): SuggestionChip[] => {
  const content = messageContent.toLowerCase()
  
  // Welcome/greeting context - Most important initial actions
  if (content.includes('hi') || content.includes('hello') || content.includes('welcome') || content.includes('kaira') || content.includes('personalized')) {
    return [
      { id: 'log-symptoms', label: 'Track Symptoms', icon: '🩺', action: 'log-symptoms' },
      { id: 'log-medications', label: 'Log Medication', icon: '💊', action: 'log-medications' },
      { id: 'ai-health-plan', label: 'AI Health Plan', icon: '🧠', action: 'ai-health-plan' }
    ]
  }
  
  // Symptom-related context - Focus on immediate action and medical support
  if (content.includes('symptom') || content.includes('recorded') || content.includes('pain') || content.includes('discomfort') || content.includes('nausea') || content.includes('severity')) {
    return [
      { id: 'schedule-consultation', label: 'Contact Provider', icon: '👨‍⚕️', action: 'schedule-consultation' },
      { id: 'log-symptoms', label: 'Track Another', icon: '➕', action: 'log-symptoms' },
      { id: 'learn-drug', label: 'Side Effect Guide', icon: '📖', action: 'learn-drug' }
    ]
  }
  
  // Injection/medication context - Prioritize guidance and tracking
  if (content.includes('injection') || content.includes('inject') || content.includes('medication') || content.includes('dose') || content.includes('administration')) {
    return [
      { id: 'give-drug', label: 'Injection Protocol', icon: '💉', action: 'give-drug' },
      { id: 'set-reminder', label: 'Set Reminder', icon: '⏰', action: 'set-reminder' },
      { id: 'contact-nurse', label: 'Nurse Support', icon: '👩‍⚕️', action: 'contact-nurse' }
    ]
  }
  
  // Activity/exercise context - Focus on tracking and planning
  if (content.includes('activity') || content.includes('exercise') || content.includes('physical') || content.includes('workout') || content.includes('energy')) {
    return [
      { id: 'log-activities', label: 'Log Exercise', icon: '🏃‍♂️', action: 'log-exercise' },
      { id: 'ai-health-plan', label: 'Fitness Plan', icon: '💪', action: 'ai-health-plan' },
      { id: 'log-diet', label: 'Log Diet', icon: '🍽️', action: 'log-diet' }
    ]
  }
  
  // Diet/nutrition context - Emphasize tracking and education
  if (content.includes('food') || content.includes('eat') || content.includes('diet') || content.includes('nutrition') || content.includes('meal') || content.includes('calories')) {
    return [
      { id: 'log-diet', label: 'Log Meal', icon: '🍽️', action: 'log-diet' },
      { id: 'log-water', label: 'Log Water', icon: '💧', action: 'log-water' },
      { id: 'ai-health-plan', label: 'Meal Planning', icon: '📓', action: 'ai-health-plan' }
    ]
  }
  
  // Progress/tracking context - Show analytics and next steps
  if (content.includes('progress') || content.includes('track') || content.includes('analysis') || content.includes('report') || content.includes('metrics')) {
    return [
      { id: 'ai-health-plan', label: 'View Insights', icon: '📊', action: 'ai-health-plan' },
      { id: 'book-lab-tests', label: 'Schedule Labs', icon: '🧪', action: 'book-lab-tests' },
      { id: 'schedule-consultation', label: 'Provider Review', icon: '👨‍⚕️', action: 'schedule-consultation' }
    ]
  }
  
  // Learning/education context - Provide targeted resources
  if (content.includes('learn') || content.includes('education') || content.includes('help') || content.includes('guide') || content.includes('clinical')) {
    return [
      { id: 'learn-drug', label: 'Drug Education', icon: '📚', action: 'learn-drug' },
      { id: 'video-content', label: 'Video Guide', icon: '🎥', action: 'video-content' },
      { id: 'contact-nurse', label: 'Ask Nurse', icon: '👩‍⚕️', action: 'contact-nurse' }
    ]
  }
  
  // Success/completion context - Encourage continued engagement
  if (content.includes('complete') || content.includes('success') || content.includes('recorded') || content.includes('documented')) {
    return [
      { id: 'ai-health-plan', label: 'View Progress', icon: '📈', action: 'ai-health-plan' },
      { id: 'log-symptoms', label: 'Track More', icon: '➕', action: 'log-symptoms' },
      { id: 'join-support', label: 'Community', icon: '👥', action: 'join-support' }
    ]
  }
  
  // Hydration context
  if (content.includes('water') || content.includes('hydrat') || content.includes('fluid') || content.includes('thirst')) {
    return [
      { id: 'log-water', label: 'Log Water', icon: '💧', action: 'log-water' },
      { id: 'log-diet', label: 'Log Meal', icon: '🍽️', action: 'log-diet' },
      { id: 'log-symptoms', label: 'Track Symptoms', icon: '🩺', action: 'log-symptoms' }
    ]
  }
  
  // Sleep context
  if (content.includes('sleep') || content.includes('rest') || content.includes('tired') || content.includes('fatigue')) {
    return [
      { id: 'log-sleep', label: 'Log Sleep', icon: '😴', action: 'log-sleep' },
      { id: 'log-symptoms', label: 'Track Fatigue', icon: '😪', action: 'log-symptoms' },
      { id: 'ai-health-plan', label: 'Sleep Tips', icon: '🌙', action: 'ai-health-plan' }
    ]
  }
  
  // Default suggestions for general messages - Most common actions
  return [
    { id: 'log-symptoms', label: 'Track Health', icon: '🩺', action: 'log-symptoms' },
    { id: 'log-medications', label: 'Log Meds', icon: '💊', action: 'log-medications' },
    { id: 'ai-health-plan', label: 'Get Insights', icon: '📈', action: 'ai-health-plan' }
  ]
}

// Generate suggestions based on current conversation flow/context
export const generateContextualSuggestions = (
  lastAssistantMessage: string,
  conversationHistory: string[],
  currentFlow?: string
): SuggestionChip[] => {
  // If we're in a specific flow, provide flow-relevant suggestions
  if (currentFlow) {
    switch (currentFlow) {
      case 'symptom-logging':
        return [
          { id: 'schedule-consultation', label: 'Get Help', icon: '🆘', action: 'schedule-consultation' },
          { id: 'log-symptoms', label: 'Log Another', icon: '➕', action: 'log-symptoms' },
          { id: 'log-medications', label: 'Log Meds', icon: '💊', action: 'log-medications' }
        ]
      case 'medication-logging':
        return [
          { id: 'set-reminder', label: 'Set Reminder', icon: '⏰', action: 'set-reminder' },
          { id: 'log-symptoms', label: 'Track Effects', icon: '🩺', action: 'log-symptoms' },
          { id: 'contact-nurse', label: 'Get Support', icon: '👩‍⚕️', action: 'contact-nurse' }
        ]
      case 'diet-logging':
        return [
          { id: 'log-water', label: 'Log Water', icon: '💧', action: 'log-water' },
          { id: 'log-exercise', label: 'Log Exercise', icon: '🏃', action: 'log-exercise' },
          { id: 'ai-health-plan', label: 'Meal Plan', icon: '📓', action: 'ai-health-plan' }
        ]
      case 'exercise-logging':
        return [
          { id: 'log-water', label: 'Hydrate', icon: '💧', action: 'log-water' },
          { id: 'log-diet', label: 'Log Meal', icon: '🍽️', action: 'log-diet' },
          { id: 'ai-health-plan', label: 'Fitness Plan', icon: '💪', action: 'ai-health-plan' }
        ]
      case 'injection-tracking':
        return [
          { id: 'set-reminder', label: 'Set Reminder', icon: '⏰', action: 'set-reminder' },
          { id: 'track-sites', label: 'Track Sites', icon: '📍', action: 'track-sites' },
          { id: 'contact-nurse', label: 'Nurse Help', icon: '👩‍⚕️', action: 'contact-nurse' }
        ]
    }
  }
  
  return generateSuggestionsForMessage(lastAssistantMessage, undefined, conversationHistory)
}