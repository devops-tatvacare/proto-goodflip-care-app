import { Icon } from '@/components/ui/icon'
import { AssessmentQuestion, JourneyPhaseContent } from "./types"

// Health Assessment Questions from QuestionnaireScreen
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "exercise-frequency",
    question: "How often do you currently exercise?",
    questionType: "single-choice",
    options: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week", "Daily"]
  },
  {
    id: "diet-preference",
    question: "What are your dietary preferences?",
    questionType: "single-choice",
    options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Pescatarian", "No specific preference"]
  },
  {
    id: "primary-goals",
    question: "What are your primary goals? (Select all that apply)",
    questionType: "multiple-choice",
    options: ["Weight Loss", "Improved Energy", "Better Sleep", "Reduced Cravings", "Healthier Habits", "Medical Compliance"]
  },
  {
    id: "current-weight",
    question: "What is your current weight (kg)?",
    questionType: "number",
    placeholder: "Enter your current weight"
  },
  {
    id: "target-weight", 
    question: "What is your target weight (kg)?",
    questionType: "number",
    placeholder: "Enter your target weight"
  },
  {
    id: "alcohol-consumption",
    question: "How often do you consume alcohol?",
    questionType: "single-choice",
    options: ["Never", "Rarely (few times a year)", "Occasionally (1-2 times a month)", "Regularly (1-2 times a week)", "Frequently (3+ times a week)"]
  },
  {
    id: "medical-conditions",
    question: "Do you have any of these conditions? (Select all that apply)",
    questionType: "multiple-choice",
    options: ["Diabetes", "High Blood Pressure", "Heart Disease", "Thyroid Issues", "PCOS", "Sleep Apnea", "None"]
  },
  {
    id: "food-allergies",
    question: "List any food allergies, intolerances, or foods you prefer to avoid",
    questionType: "text",
    placeholder: "e.g., Nuts, dairy, gluten, shellfish..."
  },
  {
    id: "meal-times",
    question: "When do you prefer to have your meals? (Select all that apply)",
    questionType: "multiple-choice",
    options: ["Early Breakfast (6-7 AM)", "Regular Breakfast (7-9 AM)", "Mid-Morning Snack", "Lunch (12-2 PM)", "Afternoon Snack", "Early Dinner (5-7 PM)", "Late Dinner (7-9 PM)"]
  }
]

// User Journey Phases and Content
export const getUserJourneyDay = (): number => {
  return Math.floor(Math.random() * 30) + 1
}

export const getJourneyPhase = (day: number): string => {
  if (day <= 10) return 'basics'
  if (day <= 20) return 'progress'
  return 'community'
}

export const getTabContent = (phase: string, day: number): JourneyPhaseContent => {
  switch (phase) {
    case 'basics':
      return {
        activeTab: 'basics',
        tabs: [
          { id: 'basics', label: '💊 Basics', icon: (props: any) => <Icon name="medication" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'profile', label: 'Profile', icon: (props: any) => <Icon name="person" {...props} /> }
        ],
        widgets: [
          {
            title: "Today's Focus",
            subtitle: "Building healthy foundations",
            description: "Learn the essentials of your Semaglutide journey",
            icon: (props: any) => <Icon name="target" {...props} />,
            color: "var(--ds-interactive-primary)"
          }
        ]
      }

    case 'progress':
      return {
        activeTab: 'progress',
        tabs: [
          { id: 'progress', label: '📊 Progress', icon: (props: any) => <Icon name="barChart" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'community', label: 'Community', icon: (props: any) => <Icon name="group" {...props} /> }
        ],
        widgets: [
          {
            title: "Progress Tracking",
            subtitle: "Your journey so far",
            description: `Day ${day} - You're making great progress!`,
            icon: (props: any) => <Icon name="barChart" {...props} />,
            color: "var(--ds-status-success)"
          }
        ]
      }

    case 'community':
      return {
        activeTab: 'community',
        tabs: [
          { id: 'metrics', label: '📈 Metrics', icon: (props: any) => <Icon name="glucose" {...props} /> },
          { id: 'chat', label: 'Chat', icon: (props: any) => <Icon name="brain" {...props} /> },
          { id: 'community', label: 'Community', icon: (props: any) => <Icon name="group" {...props} /> }
        ],
        widgets: [
          {
            title: "Community Connect",
            subtitle: "Share your success",
            description: `Day ${day} - Connect with others on similar journeys`,
            icon: (props: any) => <Icon name="group" {...props} />,
            color: "var(--ds-brand-secondary)"
          }
        ]
      }

    default:
      return getTabContent('basics', day)
  }
}

// Context Sections Initial State
export const INITIAL_CONTEXT_SECTIONS = {
  coreProfile: false,
  healthContext: false,
  aiPersonalization: false
}

// Plan Generation Mock Data
export const GENERATED_PLAN_DATA = {
  assessmentData: "User assessment completed",
  planSummary: "Based on your responses, I've created a comprehensive 30-day plan focusing on gradual lifestyle changes, personalized nutrition, and sustainable habits that work with your Semaglutide therapy."
}