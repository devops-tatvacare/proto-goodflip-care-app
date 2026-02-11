// Symptom tracking data - semaglutide common symptoms
// Smart organization with maintainable symptom definitions

export interface Symptom {
  id: string
  name: string
  emoji: string
  hasBodyLocation: boolean
  intensityRange: {
    min: number
    max: number
    unit: string
    labels: {
      low: string
      high: string
    }
  }
}

// Top 10 common semaglutide symptoms
export const SEMAGLUTIDE_SYMPTOMS: Symptom[] = [
  {
    id: "nausea",
    name: "Nausea",
    emoji: "🤢",
    hasBodyLocation: false,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "intensity",
      labels: { low: "Mild", high: "Severe" }
    }
  },
  {
    id: "vomiting", 
    name: "Vomiting",
    emoji: "🤮",
    hasBodyLocation: false,
    intensityRange: {
      min: 1,
      max: 5,
      unit: "episodes",
      labels: { low: "Once", high: "5+ times" }
    }
  },
  {
    id: "abdominal-pain",
    name: "Abdominal Pain",
    emoji: "🤒",
    hasBodyLocation: true,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "pain level",
      labels: { low: "Mild", high: "Severe" }
    }
  },
  {
    id: "diarrhea",
    name: "Diarrhea", 
    emoji: "💩",
    hasBodyLocation: false,
    intensityRange: {
      min: 1,
      max: 5,
      unit: "episodes",
      labels: { low: "Once", high: "5+ times" }
    }
  },
  {
    id: "constipation",
    name: "Constipation",
    emoji: "😣",
    hasBodyLocation: false,
    intensityRange: {
      min: 1,
      max: 7,
      unit: "days",
      labels: { low: "1 day", high: "7+ days" }
    }
  },
  {
    id: "headache",
    name: "Headache",
    emoji: "🤕",
    hasBodyLocation: true,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "pain level",
      labels: { low: "Mild", high: "Severe" }
    }
  },
  {
    id: "fatigue",
    name: "Fatigue",
    emoji: "😴",
    hasBodyLocation: false,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "tiredness",
      labels: { low: "Slight", high: "Exhausted" }
    }
  },
  {
    id: "dizziness",
    name: "Dizziness",
    emoji: "😵",
    hasBodyLocation: false,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "intensity",
      labels: { low: "Light", high: "Severe" }
    }
  },
  {
    id: "heartburn",
    name: "Heartburn/GERD",
    emoji: "🔥",
    hasBodyLocation: true,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "intensity",
      labels: { low: "Mild", high: "Severe" }
    }
  },
  {
    id: "injection-site",
    name: "Injection Site Reaction",
    emoji: "💉",
    hasBodyLocation: true,
    intensityRange: {
      min: 1,
      max: 10,
      unit: "severity",
      labels: { low: "Mild", high: "Severe" }
    }
  }
]

// Frequency options for all symptoms
export const SYMPTOM_FREQUENCIES = [
  { id: "rarely", label: "Rarely (once a week or less)", value: "rarely" },
  { id: "occasionally", label: "Occasionally (2-3 times/week)", value: "occasionally" },
  { id: "frequently", label: "Frequently (daily)", value: "frequently" },
  { id: "constantly", label: "Constantly (multiple times/day)", value: "constantly" }
]

// Body location mappings for location-specific symptoms
export const BODY_LOCATIONS = {
  "abdominal-pain": [
    { id: "upper-left", label: "Upper Left Abdomen", icon: "🔸" },
    { id: "upper-right", label: "Upper Right Abdomen", icon: "🔸" },
    { id: "center-left", label: "Center Left Abdomen", icon: "🔸" },
    { id: "center-right", label: "Center Right Abdomen", icon: "🔸" },
    { id: "lower-left", label: "Lower Left Abdomen", icon: "🔸" },
    { id: "lower-right", label: "Lower Right Abdomen", icon: "🔸" },
    { id: "around-navel", label: "Around Navel", icon: "⭕" },
    { id: "entire-area", label: "Entire Abdominal Area", icon: "🟨" }
  ],
  "headache": [
    { id: "forehead", label: "Forehead", icon: "🧠" },
    { id: "temples", label: "Temples", icon: "🧠" },
    { id: "back-head", label: "Back of Head", icon: "🧠" },
    { id: "top-head", label: "Top of Head", icon: "🧠" },
    { id: "entire-head", label: "Entire Head", icon: "🤕" }
  ],
  "heartburn": [
    { id: "chest-center", label: "Center of Chest", icon: "💖" },
    { id: "chest-upper", label: "Upper Chest", icon: "💖" },
    { id: "throat", label: "Throat Area", icon: "🗣️" },
    { id: "chest-sides", label: "Sides of Chest", icon: "💖" }
  ],
  "injection-site": [
    { id: "upper-arm", label: "Upper Arm", icon: "💪" },
    { id: "upper-abdomen", label: "Upper Abdomen", icon: "🤱" },
    { id: "lower-abdomen", label: "Lower Abdomen", icon: "🤱" },
    { id: "front-thigh", label: "Front of Thigh", icon: "🦵" },
    { id: "outer-thigh", label: "Outer Thigh", icon: "🦵" }
  ]
}

// Utility functions
export const getSymptomById = (id: string): Symptom | undefined => {
  return SEMAGLUTIDE_SYMPTOMS.find(symptom => symptom.id === id)
}

export const getSymptomByName = (name: string): Symptom | undefined => {
  return SEMAGLUTIDE_SYMPTOMS.find(symptom => symptom.name === name)
}

export const getBodyLocationsForSymptom = (symptomId: string) => {
  return BODY_LOCATIONS[symptomId as keyof typeof BODY_LOCATIONS] || []
}