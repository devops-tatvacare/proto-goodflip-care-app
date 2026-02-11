// Smart symptom flow handler - dynamic step generation
// Maintains clean separation and avoids hardcoding

import { SEMAGLUTIDE_SYMPTOMS, SYMPTOM_FREQUENCIES, getSymptomById, getSymptomByName, getBodyLocationsForSymptom } from "./symptom-data"
import { FlowStep, ActionFlow } from "./quick-actions-flows-data"
import { HEALTH_ASSISTANT_MESSAGES } from "./messages"

// Dynamically generate symptom selection step
export const generateSymptomSelectionStep = (): FlowStep => ({
  id: 'symptom-selection',
  type: 'list',
  question: HEALTH_ASSISTANT_MESSAGES.SYMPTOM_SELECTION,
  options: SEMAGLUTIDE_SYMPTOMS.map(symptom => ({
    id: symptom.id,
    label: `${symptom.emoji} ${symptom.name}`,
    value: symptom.name
  }))
})

// Generate frequency selection step
export const generateFrequencyStep = (): FlowStep => ({
  id: 'frequency',
  type: 'list',
  question: HEALTH_ASSISTANT_MESSAGES.FREQUENCY_QUESTION,
  options: SYMPTOM_FREQUENCIES.map(freq => ({
    id: freq.id,
    label: freq.label,
    value: freq.value
  }))
})

// Generate intensity step based on selected symptom
export const generateIntensityStep = (selectedSymptom: string): FlowStep => {
  const symptom = getSymptomByName(selectedSymptom)
  
  if (!symptom) {
    // Default intensity step
    return {
      id: 'intensity',
      type: 'slider',
      question: HEALTH_ASSISTANT_MESSAGES.INTENSITY_RATING,
      min: 1,
      max: 10,
      unit: 'intensity'
    }
  }

  return {
    id: 'intensity',
    type: 'slider',
    question: `Rate the ${symptom.intensityRange.unit}:`,
    min: symptom.intensityRange.min,
    max: symptom.intensityRange.max,
    unit: symptom.intensityRange.unit
  }
}

// Generate body location step (conditional)
export const generateBodyLocationStep = (selectedSymptom: string): FlowStep | null => {
  const symptom = getSymptomByName(selectedSymptom)
  
  if (!symptom || !symptom.hasBodyLocation) {
    return null // Skip this step for symptoms without body locations
  }

  const bodyLocations = getBodyLocationsForSymptom(symptom.id)
  
  if (bodyLocations.length === 0) {
    return null
  }

  return {
    id: 'body-location',
    type: 'body-area-selector',
    question: HEALTH_ASSISTANT_MESSAGES.BODY_LOCATION_QUESTION(symptom.name),
    options: bodyLocations.map(location => ({
      id: location.id,
      label: location.label,
      value: location.label
    }))
  }
}

// Smart flow generation based on user selections
export const generateSymptomFlow = (answers: Record<string, any>): ActionFlow => {
  const steps: FlowStep[] = []
  
  // Always include symptom selection
  steps.push(generateSymptomSelectionStep())
  
  // Add intensity step (dynamic based on symptom)
  if (answers['symptom-selection']) {
    steps.push(generateIntensityStep(answers['symptom-selection']))
  } else {
    steps.push({
      id: 'intensity',
      type: 'slider',
      question: HEALTH_ASSISTANT_MESSAGES.INTENSITY_RATING,
      min: 1,
      max: 10,
      unit: 'intensity'
    })
  }
  
  // Always include frequency
  steps.push(generateFrequencyStep())
  
  // Conditionally add body location step
  if (answers['symptom-selection']) {
    const bodyLocationStep = generateBodyLocationStep(answers['symptom-selection'])
    if (bodyLocationStep) {
      steps.push(bodyLocationStep)
    }
  }
  
  return {
    actionId: 'log-symptoms',
    steps,
    successMessage: () => HEALTH_ASSISTANT_MESSAGES.SYMPTOM_SUCCESS_TITLE,
    detailsMessage: (flowAnswers) => HEALTH_ASSISTANT_MESSAGES.SYMPTOM_SUCCESS_DETAILS(flowAnswers)
  }
}

// Check if symptom requires body location
export const symptomRequiresLocation = (symptomName: string): boolean => {
  const symptom = getSymptomByName(symptomName)
  return symptom?.hasBodyLocation || false
}

// Get symptom-specific data for UI components
export const getSymptomIntensityData = (symptomName: string) => {
  const symptom = getSymptomByName(symptomName)
  return symptom?.intensityRange || {
    min: 1,
    max: 10,
    unit: 'intensity',
    labels: { low: 'Mild', high: 'Severe' }
  }
}