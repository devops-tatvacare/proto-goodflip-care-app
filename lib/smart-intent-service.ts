// Smart Intent Service - Configuration-driven intent processing
// Handles context-aware intent recognition, multi-intent detection, and action dispatching

import { 
  mapIntentToAction, 
  detectMultipleIntents, 
  calculateContextAwareConfidence,
  getActionHandler,
  type IntentConfig,
  type ActionConfig 
} from './intent-mapping-config'

export interface ConversationContext {
  recentActions?: string[]
  conversationFlow?: string
  recentSimilarAction?: string
  userMessage?: string
  lastInteractionTime?: number
}

export interface IntentResult {
  intent: string
  confidence: number
  action: string | null
  isMultiIntent: boolean
  multipleActions?: string[]
  contextBoosted?: boolean
}

export class SmartIntentService {
  private conversationContext: ConversationContext = {}

  // Update conversation context
  updateContext(context: Partial<ConversationContext>) {
    this.conversationContext = {
      ...this.conversationContext,
      ...context,
      lastInteractionTime: Date.now()
    }
  }

  // Add recent action to context
  addRecentAction(action: string) {
    if (!this.conversationContext.recentActions) {
      this.conversationContext.recentActions = []
    }
    
    this.conversationContext.recentActions.unshift(action)
    
    // Keep only last 5 actions
    if (this.conversationContext.recentActions.length > 5) {
      this.conversationContext.recentActions = this.conversationContext.recentActions.slice(0, 5)
    }

    // Set recent similar action
    this.conversationContext.recentSimilarAction = action
  }

  // Process intent with smart confidence calculation
  async processIntent(userMessage: string, rawIntentData: any): Promise<IntentResult> {
    // Update context with current message
    this.updateContext({ userMessage })

    const { intent, score } = rawIntentData

    // Check for multi-intent patterns first
    const multipleActions = detectMultipleIntents(userMessage)
    const isMultiIntent = multipleActions.length > 1

    if (isMultiIntent) {
      return {
        intent: 'multiple',
        confidence: score,
        action: null,
        isMultiIntent: true,
        multipleActions,
        contextBoosted: false
      }
    }

    // Calculate context-aware confidence
    const contextAwareConfidence = calculateContextAwareConfidence(
      score, 
      intent, 
      this.conversationContext
    )

    const contextBoosted = contextAwareConfidence > score

    // Map intent to action using smart mapping
    const action = mapIntentToAction(intent, {
      ...this.conversationContext,
      userMessage
    })

    return {
      intent,
      confidence: contextAwareConfidence,
      action,
      isMultiIntent: false,
      contextBoosted
    }
  }

  // Smart action dispatcher - routes to appropriate handlers
  async dispatchAction(
    result: IntentResult, 
    actionHandlers: any
  ): Promise<boolean> {
    try {
      if (result.isMultiIntent && result.multipleActions) {
        // Handle multiple intents sequentially
        for (const action of result.multipleActions) {
          await this.executeSingleAction(action, actionHandlers)
          // Add delay between actions
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
        return true
      }

      if (result.action && result.confidence > 0.2) {
        return await this.executeSingleAction(result.action, actionHandlers)
      }

      return false
    } catch (error) {
      console.error('Error dispatching action:', error)
      return false
    }
  }

  // Execute single action based on configuration
  private async executeSingleAction(action: string, handlers: any): Promise<boolean> {
    const actionConfig = getActionHandler(action)
    
    if (!actionConfig) {
      console.warn(`No configuration found for action: ${action}`)
      return false
    }

    // Add to recent actions for context
    this.addRecentAction(action)

    // Route to appropriate handler based on configuration
    switch (actionConfig.type) {
      case 'workflow':
        if (actionConfig.hasFlow && handlers[actionConfig.handler]) {
          handlers[actionConfig.handler](action)
          return true
        }
        break

      case 'content':
        if (handlers[actionConfig.handler]) {
          handlers[actionConfig.handler](action)
          return true
        }
        break

      case 'navigation':
        // Handle navigation actions
        if (handlers.handleNavigation) {
          handlers.handleNavigation(action)
          return true
        }
        break
    }

    // Fallback message if configured
    if (actionConfig.fallbackMessage && handlers.addMessage) {
      handlers.addMessage(actionConfig.fallbackMessage, false)
      return true
    }
    
    // Generic fallback for actions without specific handlers
    if (handlers.addMessage) {
      handlers.addMessage(`🎯 I understand you want to: ${action.replace('-', ' ')}. Let me help with that!`, false)
      return true
    }

    return false
  }

  // Get smart suggestions based on context
  getSuggestions(limit: number = 3): string[] {
    const suggestions: string[] = []
    const recentActions = this.conversationContext.recentActions || []

    // Context-based suggestions
    if (recentActions.includes('log-symptoms')) {
      suggestions.push('Would you also like to log your activities?')
    }
    
    if (recentActions.includes('log-diet')) {
      suggestions.push('How are you feeling after that meal?')
    }

    if (recentActions.includes('order-drug')) {
      suggestions.push('Need help with injection technique?')
    }

    // Flow-based suggestions
    if (this.conversationContext.conversationFlow === 'monitor') {
      suggestions.push('Track your daily progress', 'View your health insights')
    }

    if (this.conversationContext.conversationFlow === 'explore') {
      suggestions.push('Learn about your medication', 'Get injection guidance')
    }

    return suggestions.slice(0, limit)
  }

  // Context decay - reduce influence of old actions
  decayContext() {
    const now = Date.now()
    const lastInteraction = this.conversationContext.lastInteractionTime || now
    const timeSinceLastInteraction = now - lastInteraction

    // If more than 5 minutes, start decaying context
    if (timeSinceLastInteraction > 5 * 60 * 1000) {
      // Clear recent similar action after 10 minutes
      if (timeSinceLastInteraction > 10 * 60 * 1000) {
        this.conversationContext.recentSimilarAction = undefined
      }

      // Remove oldest actions after 15 minutes
      if (timeSinceLastInteraction > 15 * 60 * 1000) {
        if (this.conversationContext.recentActions && this.conversationContext.recentActions.length > 2) {
          this.conversationContext.recentActions = this.conversationContext.recentActions.slice(0, 2)
        }
      }
    }
  }

  // Get debug information for development
  getDebugInfo(): any {
    return {
      context: this.conversationContext,
      suggestions: this.getSuggestions(),
      timestamp: new Date().toISOString()
    }
  }

  // Reset context (useful for new conversations)
  resetContext() {
    this.conversationContext = {}
  }
}

// Global instance for the application
export const smartIntentService = new SmartIntentService()

// Helper function to call intent API with error handling
export async function callIntentAPI(text: string): Promise<{ intent: string, score: number }> {
  try {
    const response = await fetch('/api/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Intent API call failed:', error)
    return { intent: 'unknown', score: 0 }
  }
}