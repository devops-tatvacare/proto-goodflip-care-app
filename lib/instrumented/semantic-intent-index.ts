// Embedder functionality removed
import { QUICK_ACTION_FLOWS, type ActionFlow } from '@/components/screens/health-assistant-2/quick-actions-flows-data'
import { SEMAGLUTIDE_SYMPTOMS } from '@/components/screens/health-assistant-2/symptom-data'

type Vector = number[]

export type IntentEntry = {
  entryId: string
  intentId: string
  texts: string[]
  meta?: Record<string, any>
  prototype?: Vector
}

export type IntentMatch = {
  intentId: string
  entryId: string
  score: number
  meta?: Record<string, any>
}

let index: IntentEntry[] | null = null
let initializing: Promise<IntentEntry[]> | null = null

const FLOW_SYNONYMS: Record<string, string[]> = {
  'log-diet': [
    'log meal','food log','diet','ate','nutrition','calories','meal log','food intake','track food','track meals','record meal','add meal','calorie intake','breakfast','lunch','dinner'
  ],
  'log-exercise': [
    'workout','exercise','training','run','walk','gym','track workout','record exercise','add exercise','physical activity','activity log'
  ],
  'log-sleep': [
    'sleep','bedtime','hours slept','rest','sleep log','track sleep','record sleep','add sleep','sleep hours','nap'
  ],
  'log-water': [
    'water','drink','hydration','fluid','glass of water','track water intake','water intake','record water intake','add water','log fluids','track hydration','fluid intake'
  ],
  'log-medications': [
    'medication','medicine','dose','pill','took meds','injection','log medication','record medication','add medication','took medicine','took my meds','shot'
  ],
  'log-symptoms': [
    'log symptom','record symptom','track symptom','i feel','i have','symptom log','report symptom','feeling sick','pain','nausea','headache'
  ],
  'contact-nurse': ['nurse','consultation','appointment','help','training','injection training','schedule nurse']
}

const SYMPTOM_SYNONYMS: Record<string, string[]> = {
  'abdominal-pain': ['stomach pain', 'belly pain', 'tummy ache', 'abdominal cramps', 'stomach ache'],
  'nausea': ['feel sick', 'queasy', 'nauseous'],
  'vomiting': ['throwing up', 'vomit', 'puking'],
  'diarrhea': ['loose stools', 'diarrhoea', 'frequent stools'],
  'constipation': ['no bowel movement', 'hard stools', 'constipated'],
  'headache': ['head pain', 'migraine', 'head hurts'],
  'fatigue': ['tired', 'exhausted', 'fatigued', 'low energy'],
  'dizziness': ['lightheaded', 'vertigo', 'dizzy'],
  'heartburn': ['acid reflux', 'gerd', 'burning chest', 'indigestion'],
  'injection-site': ['injection site', 'redness at injection', 'swelling at injection', 'pain at injection']
}

function flowToEntry(flow: ActionFlow): IntentEntry {
  const texts = [
    flow.actionId.replace(/-/g, ' '),
    `log ${flow.actionId.replace('log-', '')}`,
    ...((FLOW_SYNONYMS[flow.actionId] || []))
  ]
  for (let i = 0; i < Math.min(3, flow.steps.length); i++) {
    texts.push(flow.steps[i].question)
  }
  return {
    entryId: `flow:${flow.actionId}`,
    intentId: flow.actionId,
    texts
  }
}

function symptomToEntry(sym: { id: string, name: string }): IntentEntry {
  const syns = SYMPTOM_SYNONYMS[sym.id] || []
  const texts = [sym.name, ...syns, `${sym.name.toLowerCase()} symptom`, `i have ${sym.name.toLowerCase()}`]
  return {
    entryId: `symptom:${sym.id}`,
    intentId: 'log-symptoms',
    texts,
    meta: { symptomId: sym.id, symptomName: sym.name }
  }
}

export async function getIntentIndex(): Promise<IntentEntry[]> {
  if (index) return index
  if (!initializing) {
    initializing = buildIndex()
  }
  return initializing
}

async function buildIndex(): Promise<IntentEntry[]> {
  console.log('📚 Building semantic intent index...')
  const startTime = Date.now()
  
  const entries: IntentEntry[] = []
  
  // Add flows as broad intents
  for (const flow of QUICK_ACTION_FLOWS) {
    entries.push(flowToEntry(flow))
  }
  
  // Add content/guide actions
  const contentActions: Array<{ id: string, texts: string[] }> = [
    { id: 'order-drug', texts: ['buy medication','order prescription','purchase semaglutide','pharmacy','medication order','order meds','buy semaglutide','purchase medication'] },
    { id: 'take-injection', texts: ['injection guide','how to inject','injection technique','self injection','inject myself','injection steps'] },
    { id: 'know-drug', texts: ['medication information','side effects','how it works','learn about drug','drug info','semaglutide information'] },
    { id: 'journey-guide', texts: ['treatment journey','milestones','what to expect','program guide','journey guide','treatment roadmap'] },
    { id: 'purchase-bca', texts: ['buy device','BCA','body composition analyzer','monitor device','purchase monitor','body composition monitor'] },
    { id: 'book-lab-tests', texts: ['book lab test','schedule lab','blood test','lab tests','lab appointment','lab booking','book bloodwork'] },
    { id: 'schedule-consultation', texts: ['doctor appointment','consultation','schedule consultation','see a doctor','book doctor','doctor visit'] },
  ]
  
  for (const a of contentActions) {
    entries.push({ entryId: `action:${a.id}`, intentId: a.id, texts: a.texts })
  }
  
  // Add symptom-specific intents
  for (const sym of SEMAGLUTIDE_SYMPTOMS) {
    entries.push(symptomToEntry(sym))
  }
  
  // Prototype computation removed (no embedder available)
  
  const buildTime = Date.now() - startTime
  console.log(`✅ Semantic index built: ${entries.length} entries in ${buildTime}ms`)
  
  index = entries
  return entries
}

export async function searchIntent(query: string): Promise<IntentMatch> {
  // Fallback to keyword-based intent matching (semantic search removed)
  const lowerQuery = query.toLowerCase()

  // Simple keyword matching fallback
  for (const [intentId, keywords] of Object.entries(INTENT_NOUNS)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      const isValid = await intentKeywordAccept(intentId, query)
      if (isValid) {
        return { intentId, entryId: `fallback:${intentId}`, score: 0.8, meta: undefined }
      }
    }
  }

  return { intentId: 'log-symptoms', entryId: 'flow:log-symptoms', score: 0, meta: undefined }
}

// Keyword safety net per intent
const VERBS_LOG = ['log','track','record','add','enter','note']
const VERBS_ORDER = ['order','buy','purchase','get']
const VERBS_SCHEDULE = ['schedule','book','arrange','set up']

const INTENT_NOUNS: Record<string, string[]> = {
  'log-water': ['water','hydration','fluid','fluids'],
  'log-diet': ['food','diet','meal','calorie','nutrition','breakfast','lunch','dinner','snack'],
  'log-exercise': ['exercise','workout','training','run','walk','gym','activity'],
  'log-sleep': ['sleep','bedtime','nap','hours'],
  'log-medications': ['medication','medicine','dose','pill','tablet','injection','shot','meds'],
  'log-symptoms': ['symptom','pain','nausea','headache','fatigue','dizziness','diarrhea','constipation','heartburn'],
  'order-drug': ['medication','pharmacy','semaglutide','prescription'],
  'take-injection': ['inject','injection','needle','pen'],
  'know-drug': ['medication','drug','side effects','information'],
  'journey-guide': ['journey','milestones','roadmap','program'],
  'purchase-bca': ['bca','device','body composition','monitor'],
  'book-lab-tests': ['lab','test','bloodwork','blood test'],
  'schedule-consultation': ['consultation','doctor','appointment','visit'],
  'contact-nurse': ['nurse','training','injection training']
}

export async function intentKeywordAccept(intentId: string, text: string): Promise<boolean> {
  const t = text.toLowerCase()
  const nouns = INTENT_NOUNS[intentId] || []
  const hasNoun = nouns.some(n => t.includes(n))

  let verbs: string[] = []
  if (intentId.startsWith('log-') || intentId === 'log-symptoms') verbs = VERBS_LOG
  else if (intentId === 'order-drug' || intentId === 'purchase-bca') verbs = VERBS_ORDER
  else if (intentId === 'book-lab-tests' || intentId === 'schedule-consultation' || intentId === 'contact-nurse') verbs = VERBS_SCHEDULE
  else if (intentId === 'take-injection' || intentId === 'know-drug' || intentId === 'journey-guide') verbs = []

  const hasVerb = verbs.length === 0 ? true : verbs.some(v => t.includes(v))
  return hasVerb && hasNoun
}