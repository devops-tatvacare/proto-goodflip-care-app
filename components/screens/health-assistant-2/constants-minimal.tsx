// Minimal constants extracted from health-assistant-2-screen.tsx
// NO LOGIC CHANGES - just moving static data

import { Icon } from '@/components/ui/icon'

export const ASSESSMENT_QUESTIONS = [
  {
    id: "exerciseFrequency",
    question: "How often do you currently exercise?",
    type: "single-choice",
    options: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week", "Daily"]
  },
  {
    id: "dietPreference", 
    question: "What are your dietary preferences?",
    type: "single-choice",
    options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Pescatarian", "No specific preference"]
  },
  {
    id: "goals",
    question: "What are your primary goals? (You can select multiple)",
    type: "multiple-choice", 
    options: ["Weight Loss", "Improved Energy", "Better Sleep", "Reduced Cravings", "Healthier Habits", "Medical Compliance"]
  },
  {
    id: "currentWeight",
    question: "What is your current weight in kg?",
    type: "number",
    placeholder: "Enter your current weight"
  },
  {
    id: "targetWeight",
    question: "What is your target weight in kg?", 
    type: "number",
    placeholder: "Enter your target weight"
  },
  {
    id: "alcoholPreference",
    question: "How often do you consume alcohol?",
    type: "single-choice",
    options: ["Never", "Rarely (few times a year)", "Occasionally (1-2 times a month)", "Regularly (1-2 times a week)", "Frequently (3+ times a week)"]
  },
  {
    id: "medicalConditions",
    question: "Do you have any of these medical conditions? (You can select multiple)",
    type: "multiple-choice",
    options: ["Diabetes", "High Blood Pressure", "Heart Disease", "Thyroid Issues", "PCOS", "Sleep Apnea", "None"]
  },
  {
    id: "foodAllergies",
    question: "List any food allergies, intolerances, or foods you prefer to avoid",
    type: "text",
    placeholder: "e.g., Nuts, dairy, gluten, shellfish..."
  },
  {
    id: "mealTimes",
    question: "When do you prefer to have your meals? (You can select multiple)", 
    type: "multiple-choice",
    options: ["Early Breakfast (6-7 AM)", "Regular Breakfast (7-9 AM)", "Mid-Morning Snack", "Lunch (12-2 PM)", "Afternoon Snack", "Early Dinner (5-7 PM)", "Late Dinner (7-9 PM)"]
  }
]

// Journey phase functions - pure functions, no side effects
export const getUserJourneyDay = () => {
  return Math.floor(Math.random() * 30) + 1
}

export const getJourneyPhase = (day: number) => {
  if (day <= 10) return 'basics'
  if (day <= 20) return 'progress'
  return 'community'
}

export const getTabContent = (phase: string, day: number) => {
  switch (phase) {
    case 'basics':
      return {
        activeTab: 'basics',
        tabs: [
          { id: 'basics', label: '💊 Basics', icon: (props: any) => <Icon name="medication" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'profile', label: 'Profile', icon: (props: any) => <Icon name="person" {...props} /> }
        ],
        content: {
          title: 'ESSENTIAL ACTIONS',
          actions: [
            { id: 'buy-drug', icon: (props: any) => <Icon name="shoppingCart" {...props} />, label: 'BUY', sublabel: 'DRUG', description: 'Get Started', color: 'from-blue-500 to-blue-600' },
            { id: 'give-drug', icon: (props: any) => <Icon name="vaccines" {...props} />, label: 'GIVE', sublabel: 'DRUG', description: 'Schedule', color: 'from-green-500 to-green-600' },
            { id: 'learn-drug', icon: (props: any) => <Icon name="school" {...props} />, label: 'LEARN', sublabel: 'DRUG', description: 'FAQ', color: 'from-purple-500 to-purple-600' }
          ],
          conversation: "I'm here to guide you through your medication journey"
        }
      }
    case 'progress':
      return {
        activeTab: 'progress',
        tabs: [
          { id: 'progress', label: '📊 Progress', icon: (props: any) => <Icon name="barChart" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'community', label: 'Community', icon: (props: any) => <Icon name="group" {...props} /> }
        ],
        content: {
          title: 'YOUR JOURNEY',
          journey: {
            weeks: [
              { id: 'week-1-2', label: 'WEEK', sublabel: '1-2', status: 'complete', icon: '✓' },
              { id: 'this-week', label: 'THIS', sublabel: 'WEEK', status: 'current', icon: '📊' },
              { id: 'next-week', label: 'NEXT', sublabel: 'WEEK', status: 'upcoming', icon: '🎯' }
            ]
          },
          actions: ['View Details', 'Set Goals'],
          conversation: "Based on your progress, you might want to focus on..."
        }
      }
    case 'community':
      return {
        activeTab: 'community',
        tabs: [
          { id: 'metrics', label: '📈 Metrics', icon: (props: any) => <Icon name="heartMonitor" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'community', label: 'Community', icon: (props: any) => <Icon name="group" {...props} /> }
        ],
        content: {
          title: 'HEALTH INSIGHTS',
          insights: {
            biomarkers: [
              { label: 'Weight', value: '-3.2kg', trend: '↓', color: 'text-green-600' },
              { label: 'Energy', value: '+40%', trend: '↑', color: 'text-blue-600' },
              { label: 'Sleep', value: '7.5hrs', trend: '→', color: 'text-purple-600' }
            ]
          },
          actions: ['Advanced Analytics', 'Community Compare'],
          conversation: "Your health data shows remarkable improvement patterns..."
        }
      }
    default:
      return getTabContent('basics', day)
  }
}

// Context sections initial state
export const INITIAL_CONTEXT_SECTIONS = {
  coreProfile: false,
  healthContext: false,
  aiPersonalization: false
}