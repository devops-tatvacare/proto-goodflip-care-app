import { Icon } from '@/components/ui/icon'

// Medications
export const SAVED_MEDICATIONS = ["Actibile", "Dolo", "Paracetamol", "Aspirin", "Vitamin D"]

// Water intake options
export const WATER_INTAKE_OPTIONS = [
  { value: 50, label: "50ml" },
  { value: 100, label: "100ml" },
  { value: 150, label: "150ml" },
  { value: 200, label: "200ml" },
  { value: 250, label: "250ml" },
  { value: 300, label: "300ml" },
  { value: 350, label: "350ml" },
  { value: 400, label: "400ml" },
  { value: 450, label: "450ml" },
  { value: 500, label: "500ml" }
]

// Drug actions
export interface DrugAction {
  icon: string
  label: string
  actionType: string
}

export const DRUG_ACTIONS: DrugAction[] = [
  { icon: "💊", label: "Buy Drug", actionType: "buy" },
  { icon: "💉", label: "Administer Drug", actionType: "administer" },
  { icon: "📚", label: "Know Your Drug", actionType: "know" },
]

// More actions
export interface MoreAction {
  icon: LucideIcon
  label: string
  actionType: string
}

export const MORE_ACTIONS: MoreAction[] = [
  { icon: (props: any) => <Icon name="medication" {...props} />, label: "Log Medication", actionType: "medication" },
  { icon: (props: any) => <Icon name="waterDrop" {...props} />, label: "Log Water", actionType: "water" },
  { icon: (props: any) => <Icon name="bedtime" {...props} />, label: "Log Sleep", actionType: "sleep" },
  { icon: (props: any) => <Icon name="footprints" {...props} />, label: "Log Steps", actionType: "steps" },
  { icon: (props: any) => <Icon name="heartMonitor" {...props} />, label: "Log Fatigue", actionType: "fatigue" },
  { icon: (props: any) => <Icon name="thermostat" {...props} />, label: "Log Symptoms", actionType: "symptoms" },
  { icon: (props: any) => <Icon name="fileText" {...props} />, label: "Lab Results", actionType: "lab-results" },
  { icon: (props: any) => <Icon name="heartMonitor" {...props} />, label: "Log Periods", actionType: "periods" },
  { icon: (props: any) => <Icon name="restaurant" {...props} />, label: "Log Diet", actionType: "diet" },
]

// Health summaries
export interface HealthSummary {
  icon: LucideIcon
  label: string
  actionType: string
}

export const HEALTH_SUMMARIES: HealthSummary[] = [
  { icon: (props: any) => <Icon name="bedtime" {...props} />, label: "Sleep Summary", actionType: "sleep-summary" },
  { icon: (props: any) => <Icon name="trendingUp" {...props} />, label: "Health Progress", actionType: "health-progress" },
  { icon: (props: any) => <Icon name="heartMonitor" {...props} />, label: "Liver Health", actionType: "liver-health" },
  { icon: (props: any) => <Icon name="heart" {...props} />, label: "Heart Health", actionType: "heart-health" },
]

// Diet confirmation options
export const DIET_CONFIRMATION_OPTIONS = [
  "Yes, that's correct",
  "Let me modify this",
  "I want to start over",
  "Save this meal plan"
]

// Meal time options
export const MEAL_TIME_OPTIONS = [
  "Breakfast (7:00 AM)",
  "Mid-Morning Snack (10:00 AM)", 
  "Lunch (1:00 PM)",
  "Afternoon Snack (4:00 PM)",
  "Dinner (7:00 PM)"
]

// Period flow options
export const PERIOD_FLOW_OPTIONS = [
  "Light",
  "Moderate", 
  "Heavy",
  "Very Heavy"
]

// Mood options
export const MOOD_OPTIONS = [
  "😊 Great",
  "🙂 Good",
  "😐 Okay", 
  "😔 Not great",
  "😢 Terrible"
]

// Emergency action options
export const EMERGENCY_ACTION_OPTIONS = [
  "🚨 Call Emergency Services",
  "🏥 Go to Hospital", 
  "📞 Contact Doctor",
  "💊 Take Emergency Medication",
  "👥 Get Help from Someone",
  "📱 Use Health App"
]