// Smart Intent Mapping Configuration
// This file defines the relationship between user intents and system actions
// without hardcoding - using data-driven approach

export interface IntentConfig {
  id: string
  label: string
  action: string
  category: 'explore' | 'learn' | 'monitor' | 'recommended'
  keywords: string[]
  contextBoosts: string[]
  confidence: {
    base: number
    contextBoost: number
    keywordBoost: number
  }
  synonyms: string[]
  examples: string[]
}

export interface ActionConfig {
  id: string
  type: 'workflow' | 'content' | 'navigation'
  handler: string
  hasFlow: boolean
  fallbackMessage?: string
}

// Configuration-driven intent definitions
export const INTENT_CONFIGS: IntentConfig[] = [
  // EXPLORE YOUR PROGRAM category
  {
    id: 'purchase-medication',
    label: 'ordering medication from pharmacy or buying prescription drugs online',
    action: 'order-drug',
    category: 'explore',
    keywords: ['buy', 'purchase', 'order', 'medication', 'semaglutide', 'pharmacy', 'prescription'],
    contextBoosts: ['program', 'explore', 'drug'],
    confidence: { base: 0.2, contextBoost: 0.1, keywordBoost: 0.05 },
    synonyms: ['buy medication', 'order prescription', 'purchase drug', 'get semaglutide'],
    examples: [
      'I want to buy semaglutide',
      'Where can I order my medication?',
      'I need to purchase my prescription'
    ]
  },
  {
    id: 'injection-guidance',
    label: 'learning proper injection technique and administration methods',
    action: 'take-injection',
    category: 'explore',
    keywords: ['inject', 'injection', 'technique', 'how to', 'administer', 'needle', 'pen'],
    contextBoosts: ['injection', 'technique', 'guidance'],
    confidence: { base: 0.2, contextBoost: 0.1, keywordBoost: 0.05 },
    synonyms: ['injection help', 'how to inject', 'injection technique', 'administration guide'],
    examples: [
      'How do I inject semaglutide?',
      'Show me proper injection technique',
      'I need help with injections'
    ]
  },
  {
    id: 'medication-education',
    label: 'understanding medication information side effects and how it works',
    action: 'know-drug',
    category: 'explore',
    keywords: ['learn', 'understand', 'medication', 'drug', 'information', 'how it works', 'side effects'],
    contextBoosts: ['learn', 'education', 'information'],
    confidence: { base: 0.2, contextBoost: 0.1, keywordBoost: 0.05 },
    synonyms: ['medication info', 'drug information', 'understand medication', 'learn about drug'],
    examples: [
      'Tell me about semaglutide',
      'How does this medication work?',
      'What should I know about my drug?'
    ]
  },

  // MONITOR & TRACK category (highest confidence - working flows)
  {
    id: 'symptom-logging',
    label: 'recording symptoms pain side effects or how feeling physically',
    action: 'log-symptoms',
    category: 'monitor',
    keywords: ['symptom', 'pain', 'side effect', 'feeling', 'nausea', 'headache', 'dizzy', 'sick'],
    contextBoosts: ['symptoms', 'feeling', 'pain', 'side effects'],
    confidence: { base: 0.15, contextBoost: 0.15, keywordBoost: 0.08 },
    synonyms: ['log symptoms', 'record pain', 'track side effects', 'feeling unwell'],
    examples: [
      'I have a headache',
      'Feeling nauseous after injection',
      'Want to log my symptoms'
    ]
  },
  {
    id: 'activity-logging',
    label: 'recording what was eaten for meals or logging food and diet intake',
    action: 'log-activities', 
    category: 'monitor',
    keywords: ['log', 'track', 'diet', 'food', 'exercise', 'medication', 'activity', 'ate', 'workout', 'breakfast', 'lunch', 'dinner', 'meal'],
    contextBoosts: ['diet', 'food', 'exercise', 'activities'],
    confidence: { base: 0.15, contextBoost: 0.15, keywordBoost: 0.08 },
    synonyms: ['log diet', 'track food', 'record exercise', 'log activities'],
    examples: [
      'I want to log my breakfast',
      'Track what I ate today',
      'Record my exercise'
    ]
  },

  // LEARN & UNDERSTAND category
  {
    id: 'journey-guidance',
    label: 'understanding treatment journey milestones and what to expect',
    action: 'journey-guide',
    category: 'learn',
    keywords: ['journey', 'treatment', 'milestone', 'progress', 'what to expect', 'roadmap'],
    contextBoosts: ['journey', 'treatment', 'progress'],
    confidence: { base: 0.2, contextBoost: 0.1, keywordBoost: 0.05 },
    synonyms: ['treatment journey', 'progress roadmap', 'what to expect'],
    examples: [
      'What should I expect in my treatment?',
      'Show me my treatment journey',
      'What are the milestones?'
    ]
  },

  // RECOMMENDED FOR YOU category
  {
    id: 'device-purchase',
    label: 'purchasing health monitoring devices like BCA or glucose monitors',
    action: 'purchase-bca',
    category: 'recommended',
    keywords: ['BCA', 'body composition', 'device', 'monitor', 'purchase', 'buy', 'glucose', 'CGM'],
    contextBoosts: ['device', 'monitor', 'BCA', 'glucose'],
    confidence: { base: 0.2, contextBoost: 0.1, keywordBoost: 0.05 },
    synonyms: ['buy BCA', 'purchase monitor', 'get device'],
    examples: [
      'I want to buy a BCA device',
      'Purchase body composition analyzer',
      'Get glucose monitoring device'
    ]
  }
]

// Action handler configuration
export const ACTION_CONFIGS: ActionConfig[] = [
  { id: 'log-symptoms', type: 'workflow', handler: 'handleQuickAction', hasFlow: true },
  { id: 'log-activities', type: 'workflow', handler: 'handleQuickAction', hasFlow: true }, 
  { id: 'log-diet', type: 'workflow', handler: 'handleQuickAction', hasFlow: true },
  { id: 'order-drug', type: 'content', handler: 'handleActionClick', hasFlow: false },
  { id: 'take-injection', type: 'content', handler: 'handleActionClick', hasFlow: false },
  { id: 'know-drug', type: 'content', handler: 'handleActionClick', hasFlow: false },
  { id: 'journey-guide', type: 'content', handler: 'handleActionClick', hasFlow: false, 
    fallbackMessage: '🚀 Journey Guide - Coming Soon!' },
  { id: 'purchase-bca', type: 'content', handler: 'handleActionClick', hasFlow: false }
]

// Smart label generation for API
export function generateIntentLabels(): string[] {
  return INTENT_CONFIGS.map(config => config.label)
}

// Smart intent-to-action mapping
export function mapIntentToAction(detectedIntent: string, context: any = {}): string | null {
  // Find the matching configuration
  const config = INTENT_CONFIGS.find(c => c.label === detectedIntent)
  if (!config) return null

  // Calculate confidence with context and keyword boosting
  let confidence = config.confidence.base
  
  // Context boosting
  if (context.recentActions) {
    const hasContextBoost = config.contextBoosts.some(boost => 
      context.recentActions.includes(boost)
    )
    if (hasContextBoost) {
      confidence += config.confidence.contextBoost
    }
  }

  // Keyword boosting from user message
  if (context.userMessage) {
    const messageWords = context.userMessage.toLowerCase().split(' ')
    const keywordMatches = config.keywords.filter(keyword => 
      messageWords.some(word => word.includes(keyword.toLowerCase()))
    )
    confidence += keywordMatches.length * config.confidence.keywordBoost
  }

  return confidence > 0.2 ? config.action : null
}

// Multi-intent detection for complex queries
export function detectMultipleIntents(userMessage: string): string[] {
  const words = userMessage.toLowerCase()
  const matchedIntents: string[] = []

  // Check for conjunction patterns
  if (words.includes(' and ') || words.includes(' also ') || words.includes(' plus ')) {
    // Split and analyze each part
    const parts = words.split(/ and | also | plus /)
    
    parts.forEach(part => {
      INTENT_CONFIGS.forEach(config => {
        const hasKeywords = config.keywords.some(keyword => 
          part.includes(keyword.toLowerCase())
        )
        if (hasKeywords) {
          matchedIntents.push(config.action)
        }
      })
    })
  }

  return [...new Set(matchedIntents)] // Remove duplicates
}

// Context-aware confidence boosting
export function calculateContextAwareConfidence(
  baseScore: number, 
  intent: string, 
  context: any
): number {
  const config = INTENT_CONFIGS.find(c => c.label === intent)
  if (!config) return baseScore

  let boostedScore = baseScore

  // Recent action context boost
  if (context.recentActions && config.contextBoosts.length > 0) {
    const hasRelevantContext = config.contextBoosts.some(boost =>
      context.recentActions.includes(boost)
    )
    if (hasRelevantContext) {
      boostedScore += 0.1
    }
  }

  // Conversation flow context
  if (context.conversationFlow === config.category) {
    boostedScore += 0.08
  }

  // Time-based context (recent similar actions)
  if (context.recentSimilarAction === config.action) {
    boostedScore += 0.05
  }

  return Math.min(boostedScore, 0.95) // Cap at 95%
}

// Get action handler configuration
export function getActionHandler(actionId: string): ActionConfig | null {
  return ACTION_CONFIGS.find(config => config.id === actionId) || null
}