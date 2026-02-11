// Centralized intent dictionary for the local classifier
// Includes IDs, concise descriptions, and a few examples

export type IntentDef = {
  id: string
  description: string
  examples?: string[]
}

export const INTENT_DICTIONARY: IntentDef[] = [
  { id: 'log-water', description: 'Log water or fluid intake', examples: ['log water', 'track hydration', 'add water', 'record water intake'] },
  { id: 'log-diet', description: 'Log meals or food intake', examples: ['log breakfast', 'record meal', 'track food'] },
  { id: 'log-exercise', description: 'Log workouts or physical activity', examples: ['log run', 'record workout', 'add exercise'] },
  { id: 'log-sleep', description: 'Log sleep duration or naps', examples: ['track sleep', 'record sleep hours'] },
  { id: 'log-medications', description: 'Log medication taken or dose', examples: ['i took my meds', 'log medication'] },
  { id: 'log-symptoms', description: 'Log a health symptom; can include a specific symptom', examples: ['i have nausea', 'record headache'] },
  { id: 'order-drug', description: 'Order or buy prescribed medication from pharmacy', examples: ['buy semaglutide', 'order prescription'] },
  { id: 'take-injection', description: 'Get injection guidance or technique help', examples: ['how to inject', 'injection steps'] },
  { id: 'know-drug', description: 'Learn about medication information or side effects', examples: ['drug info', 'side effects'] },
  { id: 'journey-guide', description: 'View treatment journey milestones and what to expect', examples: ['treatment journey', 'program guide'] },
  { id: 'purchase-bca', description: 'Purchase a body composition analyzer device', examples: ['buy BCA device', 'purchase monitor'] },
  { id: 'book-lab-tests', description: 'Book or schedule lab tests', examples: ['book lab test', 'schedule blood test'] },
  { id: 'schedule-consultation', description: 'Schedule a doctor/clinical consultation', examples: ['schedule consultation', 'book doctor visit'] },
  { id: 'contact-nurse', description: 'Schedule a nursing consultation for injection training', examples: ['nurse training', 'book nurse'] },
]

// Importing symptom list from existing data
import { SEMAGLUTIDE_SYMPTOMS } from '@/components/screens/health-assistant-2/symptom-data'

export const SYMPTOM_OPTIONS = SEMAGLUTIDE_SYMPTOMS.map(s => ({ id: s.id, name: s.name }))

