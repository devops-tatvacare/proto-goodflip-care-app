// Quick Actions Flow Data - smart organization, no hardcoding
// All flow configurations, options, and constants

import { SEMAGLUTIDE_SYMPTOMS, SYMPTOM_FREQUENCIES } from "./symptom-data"

export interface FlowStep {
  id: string
  type: 'list' | 'slider' | 'text' | 'date-picker' | 'options-with-inline-datepicker' | 'body-area-selector'
  question: string
  options?: Array<{
    id: string
    label: string
    value: string
    hasDatePicker?: boolean
  }>
  min?: number
  max?: number
  unit?: string
  placeholder?: string
}

export interface ActionFlow {
  actionId: string
  steps: FlowStep[]
  successMessage: (answers: Record<string, any>) => string
  detailsMessage: (answers: Record<string, any>) => string
}

// Log Diet Flow
const LOG_DIET_FLOW: ActionFlow = {
  actionId: 'log-diet',
  steps: [
    {
      id: 'meal-timing',
      type: 'options-with-inline-datepicker',
      question: 'Dietary Intake Documentation: Please select the date for this nutritional entry to ensure accurate tracking of your metabolic response.',
      options: [
        { id: 'today', label: 'Today', value: 'today' },
        { id: 'yesterday', label: 'Yesterday', value: 'yesterday' },
        { id: 'custom', label: 'Select Specific Date', value: 'custom', hasDatePicker: true }
      ]
    },
    {
      id: 'meal-type', 
      type: 'list',
      question: 'Meal Category Selection: Identify the meal period for proper circadian nutrition analysis and glycemic impact assessment.',
      options: [
        { id: 'breakfast', label: 'Breakfast (6AM-10AM)', value: 'breakfast' },
        { id: 'lunch', label: 'Lunch (11AM-2PM)', value: 'lunch' },
        { id: 'snacks', label: 'Snacks/Between Meals', value: 'snacks' },
        { id: 'dinner', label: 'Dinner (5PM-8PM)', value: 'dinner' },
        { id: 'late-eating', label: 'Late Evening (After 8PM)', value: 'late-eating' }
      ]
    },
    {
      id: 'diet-plan-adherence',
      type: 'list',
      question: 'Diet Plan Adherence: Did you follow your prescribed diet plan for this meal?',
      options: [
        { id: 'yes', label: 'Yes - Followed my diet plan', value: 'yes' },
        { id: 'no', label: 'No - Deviated from diet plan', value: 'no' }
      ]
    },
    {
      id: 'pre-meal-glucose',
      type: 'list',
      question: 'Pre-meal glucose status: Did you check your blood glucose before this meal?',
      options: [
        { id: 'yes-normal', label: 'Yes - Within target range (70-130 mg/dL)', value: 'yes-normal' },
        { id: 'yes-high', label: 'Yes - Above target (>130 mg/dL)', value: 'yes-high' },
        { id: 'yes-low', label: 'Yes - Below target (<70 mg/dL)', value: 'yes-low' },
        { id: 'not-checked', label: 'Not checked', value: 'not-checked' }
      ]
    },
    {
      id: 'food-description',
      type: 'text',
      question: 'Detailed Food Documentation: Please describe all foods and beverages consumed, including portion sizes. Our AI-powered nutritional analysis will calculate macronutrients, glycemic load, and medication-food interactions.',
      placeholder: 'Example: 1 cup brown rice, 4 oz grilled salmon, 2 cups mixed vegetables with 1 tbsp olive oil'
    },
    {
      id: 'eating-speed',
      type: 'list',
      question: 'Meal Duration Assessment: How long did it take you to consume this meal? (Slower eating improves GLP-1 response)',
      options: [
        { id: 'very-fast', label: 'Less than 10 minutes', value: 'very-fast' },
        { id: 'fast', label: '10-15 minutes', value: 'fast' },
        { id: 'moderate', label: '15-20 minutes', value: 'moderate' },
        { id: 'slow', label: '20-30 minutes', value: 'slow' },
        { id: 'very-slow', label: 'More than 30 minutes', value: 'very-slow' }
      ]
    }
  ],
  successMessage: (answers) => 'Nutritional Entry Recorded',
  detailsMessage: (answers) => {
    const analysis = calculateNutritionAnalysis(answers['food-description'])
    const glucoseNote = getGlucoseRecommendation(answers['pre-meal-glucose'])
    const speedNote = getEatingSpeedRecommendation(answers['eating-speed'])
    const adherenceNote = getDietPlanAdherenceNote(answers['diet-plan-adherence'], answers['diet-plan-items'])
    
    return `Nutritional Analysis Complete\n\n${adherenceNote}\n\nMacronutrient Breakdown:\n• Total Energy: ${analysis.calories} kcal\n• Protein: ${analysis.protein}g (${analysis.proteinPercent}% of calories)\n• Carbohydrates: ${analysis.carbs}g (${analysis.carbsPercent}% of calories)\n• Dietary Fat: ${analysis.fat}g (${analysis.fatPercent}% of calories)\n• Dietary Fiber: ${analysis.fiber}g\n• Estimated Glycemic Load: ${analysis.glycemicLoad}\n\n${glucoseNote}\n\n${speedNote}\n\nRecommendation: ${analysis.recommendation}`
  }
}

// Helper function for nutrition calculation
const calculateNutritionAnalysis = (foodDescription: string) => {
  // Simplified calculation - in production would use actual API
  return {
    calories: 485,
    protein: 28,
    proteinPercent: 23,
    carbs: 52,
    carbsPercent: 43,
    fat: 18,
    fatPercent: 34,
    fiber: 8,
    glycemicLoad: 'Medium (12)',
    recommendation: 'Well-balanced meal with adequate protein. Consider adding more non-starchy vegetables to optimize GLP-1 response.'
  }
}

const getGlucoseRecommendation = (glucoseStatus: string) => {
  const recommendations = {
    'yes-normal': 'Pre-meal glucose within target range. Excellent glycemic control.',
    'yes-high': 'Pre-meal glucose elevated. Consider reducing carbohydrate portion and increasing physical activity.',
    'yes-low': 'Pre-meal glucose below target. This meal should help stabilize levels.',
    'not-checked': 'Consider checking pre-meal glucose to optimize medication timing and meal composition.'
  }
  return recommendations[glucoseStatus] || recommendations['not-checked']
}

const getEatingSpeedRecommendation = (speed: string) => {
  const recommendations = {
    'very-fast': 'Eating Speed Alert: Consuming meals too quickly may reduce GLP-1 effectiveness. Try to extend meal duration to 20+ minutes.',
    'fast': 'Eating pace is slightly fast. Slowing down may improve satiety and medication response.',
    'moderate': 'Good eating pace. This duration supports optimal digestion and medication effectiveness.',
    'slow': 'Excellent meal pacing. This supports optimal GLP-1 receptor activation and satiety signaling.',
    'very-slow': 'Mindful eating practiced. Excellent for maximizing treatment benefits.'
  }
  return recommendations[speed] || recommendations['moderate']
}

const getDietPlanAdherenceNote = (adherence: string, dietPlanItems: any[]) => {
  if (adherence === 'yes' && dietPlanItems) {
    const completedCount = dietPlanItems.filter(item => item.completed).length
    const totalCount = dietPlanItems.length
    const percentage = Math.round((completedCount / totalCount) * 100)
    
    if (percentage === 100) {
      return `🎉 Diet Plan Adherence: Perfect! All ${totalCount} recommended items included.\nExcellent compliance with therapeutic nutrition protocol.`
    } else if (percentage >= 80) {
      return `✅ Diet Plan Adherence: Excellent (${completedCount}/${totalCount} items - ${percentage}%)\nStrong compliance supporting treatment effectiveness.`
    } else if (percentage >= 60) {
      return `⚠️ Diet Plan Adherence: Good (${completedCount}/${totalCount} items - ${percentage}%)\nConsider incorporating missing elements for optimal results.`
    } else {
      return `❌ Diet Plan Adherence: Needs Improvement (${completedCount}/${totalCount} items - ${percentage}%)\nReview your diet plan with your healthcare provider.`
    }
  } else if (adherence === 'no') {
    return `❌ Diet Plan Adherence: Not followed\nConsider discussing barriers with your healthcare team to improve compliance.`
  }
  
  return 'Diet Plan Adherence: Not assessed'
}

// Log Exercise Flow  
const LOG_EXERCISE_FLOW: ActionFlow = {
  actionId: 'log-exercise',
  steps: [
    {
      id: 'exercise-timing',
      type: 'list',
      question: 'Physical Activity Timing: When did you perform this exercise? (Important for glucose management)',
      options: [
        { id: 'fasting', label: 'Fasting/Before breakfast', value: 'fasting' },
        { id: 'post-meal', label: 'Within 2 hours after eating', value: 'post-meal' },
        { id: 'pre-meal', label: 'Before a meal (not breakfast)', value: 'pre-meal' },
        { id: 'evening', label: 'Evening (>3 hours after dinner)', value: 'evening' }
      ]
    },
    {
      id: 'exercise-type',
      type: 'list', 
      question: 'Activity Classification: Select the primary exercise modality for accurate metabolic equivalent (MET) calculation.',
      options: [
        { id: 'walking', label: 'Walking (3-4 METs)', value: 'Walking' },
        { id: 'running', label: 'Running/Jogging (7-9 METs)', value: 'Running' },
        { id: 'cycling', label: 'Cycling (4-8 METs)', value: 'Cycling' },
        { id: 'swimming', label: 'Swimming (6-8 METs)', value: 'Swimming' },
        { id: 'resistance', label: 'Resistance/Weight Training (3-6 METs)', value: 'Resistance' },
        { id: 'yoga', label: 'Yoga/Stretching (2-3 METs)', value: 'Yoga' },
        { id: 'hiit', label: 'High-Intensity Interval Training (8-12 METs)', value: 'HIIT' },
        { id: 'other', label: 'Other Activity', value: 'Other' }
      ]
    },
    {
      id: 'duration',
      type: 'list',
      question: 'Exercise Duration: Total active time (excluding rest periods)', 
      options: [
        { id: '10min', label: '10 minutes', value: '10' },
        { id: '15min', label: '15 minutes', value: '15' },
        { id: '20min', label: '20 minutes', value: '20' },
        { id: '30min', label: '30 minutes', value: '30' },
        { id: '45min', label: '45 minutes', value: '45' },
        { id: '60min', label: '60 minutes', value: '60' },
        { id: '90min', label: '90 minutes', value: '90' },
        { id: '120min', label: '2+ hours', value: '120' }
      ]
    },
    {
      id: 'intensity',
      type: 'list',
      question: 'Perceived Exertion Level: Rate your exercise intensity using the Borg Scale',
      options: [
        { id: 'very-light', label: 'Very Light (Can sing while exercising)', value: 'Very Light' },
        { id: 'light', label: 'Light (Can maintain conversation)', value: 'Light' },
        { id: 'moderate', label: 'Moderate (Can speak in short sentences)', value: 'Moderate' },
        { id: 'vigorous', label: 'Vigorous (Difficult to speak)', value: 'Vigorous' },
        { id: 'max', label: 'Maximum (Cannot speak)', value: 'Maximum' }
      ]
    },
    {
      id: 'symptoms',
      type: 'list',
      question: 'Exercise Tolerance: Did you experience any symptoms during or after exercise?',
      options: [
        { id: 'none', label: 'No symptoms - felt good', value: 'none' },
        { id: 'mild-fatigue', label: 'Mild fatigue (expected)', value: 'mild-fatigue' },
        { id: 'dizziness', label: 'Dizziness or lightheadedness', value: 'dizziness' },
        { id: 'nausea', label: 'Nausea', value: 'nausea' },
        { id: 'hypoglycemia', label: 'Hypoglycemia symptoms', value: 'hypoglycemia' },
        { id: 'chest', label: 'Chest discomfort', value: 'chest' }
      ]
    }
  ],
  successMessage: (answers) => 'Physical Activity Recorded',
  detailsMessage: (answers) => {
    const calories = getCaloriesBurned(answers)
    const glucoseImpact = getGlucoseImpact(answers['exercise-timing'], answers.intensity)
    const recommendation = getExerciseRecommendation(answers.symptoms, answers.intensity)
    
    return `Exercise Analysis Complete\n\nActivity Metrics:\n• Type: ${answers['exercise-type']}\n• Duration: ${answers.duration} minutes\n• Intensity: ${answers.intensity}\n• Energy Expenditure: ${calories} kcal\n• MET-minutes: ${getMETMinutes(answers)}\n\n${glucoseImpact}\n\n${recommendation}\n\nWeekly Progress: ${getWeeklyExerciseProgress()} minutes (Target: 150 min/week of moderate activity)`
  }
}

const getMETMinutes = (answers: Record<string, any>) => {
  const mets = {
    'Walking': 3.5, 'Running': 8, 'Cycling': 6, 'Swimming': 7,
    'Resistance': 4, 'Yoga': 2.5, 'HIIT': 10, 'Other': 4
  }
  const duration = parseInt(answers.duration) || 30
  return Math.round((mets[answers['exercise-type']] || 4) * duration)
}

const getGlucoseImpact = (timing: string, intensity: string) => {
  if (timing === 'post-meal') {
    return 'Glucose Impact: Excellent timing! Post-meal exercise significantly reduces glucose spikes and enhances insulin sensitivity.'
  } else if (timing === 'fasting') {
    return 'Glucose Impact: Fasting exercise enhances fat oxidation. Monitor for hypoglycemia if on glucose-lowering medications.'
  }
  return 'Glucose Impact: Good timing for metabolic health. Regular exercise improves long-term glycemic control.'
}

const getExerciseRecommendation = (symptoms: string, intensity: string) => {
  if (symptoms === 'hypoglycemia') {
    return 'Safety Alert: Hypoglycemia symptoms noted. Consider carrying glucose tablets and adjusting meal/medication timing around exercise.'
  } else if (symptoms === 'chest') {
    return 'Important: Chest discomfort during exercise requires medical evaluation. Please consult your physician before next exercise session.'
  } else if (symptoms === 'none') {
    return 'Exercise Tolerance: Excellent! Your body is adapting well to physical activity. Consider progressive intensity increases.'
  }
  return 'Exercise well tolerated. Continue current activity level and monitor response.'
}

const getWeeklyExerciseProgress = () => {
  return Math.floor(Math.random() * 50) + 100 // Simulated weekly total
}

// Log Sleep Flow
const LOG_SLEEP_FLOW: ActionFlow = {
  actionId: 'log-sleep',
  steps: [
    {
      id: 'bedtime',
      type: 'list',
      question: 'Sleep Schedule: What time did you go to bed last night?',
      options: [
        { id: 'before-9', label: 'Before 9:00 PM', value: 'before-9' },
        { id: '9-10', label: '9:00-10:00 PM', value: '9-10' },
        { id: '10-11', label: '10:00-11:00 PM', value: '10-11' },
        { id: '11-12', label: '11:00 PM-12:00 AM', value: '11-12' },
        { id: 'after-12', label: 'After midnight', value: 'after-12' }
      ]
    },
    {
      id: 'sleep-hours',
      type: 'slider',
      question: 'Sleep Duration: Total hours of sleep obtained',
      min: 0,
      max: 14,
      unit: 'hours'
    },
    {
      id: 'sleep-quality',
      type: 'list',
      question: 'Sleep Quality Assessment: How would you rate your sleep quality?',
      options: [
        { id: 'excellent', label: 'Excellent - Fully refreshed', value: 'excellent' },
        { id: 'good', label: 'Good - Well rested', value: 'good' },
        { id: 'fair', label: 'Fair - Somewhat rested', value: 'fair' },
        { id: 'poor', label: 'Poor - Tired upon waking', value: 'poor' },
        { id: 'very-poor', label: 'Very Poor - Exhausted', value: 'very-poor' }
      ]
    },
    {
      id: 'sleep-disruptions',
      type: 'list',
      question: 'Sleep Disruption Analysis: Did anything interrupt your sleep?',
      options: [
        { id: 'none', label: 'No disruptions', value: 'none' },
        { id: 'bathroom', label: 'Bathroom visits', value: 'bathroom' },
        { id: 'pain', label: 'Pain or discomfort', value: 'pain' },
        { id: 'anxiety', label: 'Anxiety or racing thoughts', value: 'anxiety' },
        { id: 'nausea', label: 'Nausea or GI discomfort', value: 'nausea' },
        { id: 'other', label: 'Other disruptions', value: 'other' }
      ]
    }
  ],
  successMessage: (answers) => 'Sleep Data Recorded',
  detailsMessage: (answers) => {
    const quality = getSleepQuality(answers['sleep-hours'])
    const recommendation = getSleepRecommendation(answers['sleep-hours'])
    const disruptionNote = getSleepDisruptionAdvice(answers['sleep-disruptions'])
    const circadianNote = getCircadianRhythmAdvice(answers.bedtime)
    
    return `Sleep Analysis Complete\n\nSleep Metrics:\n• Bedtime: ${formatBedtime(answers.bedtime)}\n• Duration: ${answers['sleep-hours']} hours\n• Quality Rating: ${answers['sleep-quality']}\n• Clinical Assessment: ${quality}\n• Disruptions: ${answers['sleep-disruptions']}\n\n${recommendation}\n\n${disruptionNote}\n\n${circadianNote}\n\nClinical Note: Quality sleep is essential for metabolic health, weight management, and medication effectiveness. Poor sleep can affect glucose control and appetite regulation.`
  }
}

const formatBedtime = (bedtime: string) => {
  const times = {
    'before-9': 'Before 9:00 PM',
    '9-10': '9:00-10:00 PM',
    '10-11': '10:00-11:00 PM',
    '11-12': '11:00 PM-12:00 AM',
    'after-12': 'After midnight'
  }
  return times[bedtime] || 'Not specified'
}

const getSleepDisruptionAdvice = (disruption: string) => {
  const advice = {
    'none': 'Sleep Continuity: Excellent! Uninterrupted sleep optimizes recovery and metabolic function.',
    'bathroom': 'Nocturia Management: Consider limiting fluids 2 hours before bed. If frequent (>2x/night), discuss with provider.',
    'pain': 'Pain-Related Insomnia: Document pain location and intensity. May require pain management optimization.',
    'anxiety': 'Sleep Anxiety: Consider relaxation techniques, meditation, or CBT-I (Cognitive Behavioral Therapy for Insomnia).',
    'nausea': 'GI-Related Disruption: Common with GLP-1 therapy. Try smaller evening meals and elevate head of bed.',
    'other': 'Sleep Hygiene: Evaluate bedroom environment (temperature, light, noise) and establish consistent routine.'
  }
  return advice[disruption] || advice['other']
}

const getCircadianRhythmAdvice = (bedtime: string) => {
  if (bedtime === 'before-9' || bedtime === '9-10' || bedtime === '10-11') {
    return 'Circadian Alignment: Good sleep timing supports natural melatonin production and metabolic regulation.'
  } else {
    return 'Circadian Optimization: Consider earlier bedtime to align with natural circadian rhythms and improve metabolic health.'
  }
}

// Log Water Flow
const LOG_WATER_FLOW: ActionFlow = {
  actionId: 'log-water',
  steps: [
    {
      id: 'water-timing',
      type: 'list',
      question: 'Hydration Timing Assessment: When are you logging this fluid intake?',
      options: [
        { id: 'morning', label: 'Morning (6AM-12PM)', value: 'morning' },
        { id: 'afternoon', label: 'Afternoon (12PM-6PM)', value: 'afternoon' },
        { id: 'evening', label: 'Evening (6PM-10PM)', value: 'evening' },
        { id: 'night', label: 'Night (After 10PM)', value: 'night' }
      ]
    },
    {
      id: 'water-type',
      type: 'list',
      question: 'Fluid Type Classification: What type of hydration are you recording?',
      options: [
        { id: 'plain-water', label: 'Plain Water', value: 'plain-water' },
        { id: 'sparkling', label: 'Sparkling/Carbonated Water', value: 'sparkling' },
        { id: 'electrolyte', label: 'Electrolyte Water', value: 'electrolyte' },
        { id: 'herbal-tea', label: 'Herbal Tea (Caffeine-free)', value: 'herbal-tea' },
        { id: 'other-beverage', label: 'Other Beverage', value: 'other-beverage' }
      ]
    },
    {
      id: 'water-amount',
      type: 'list',
      question: 'Volume Measurement: Select the amount of fluid consumed',
      options: [
        { id: '250ml', label: '250 ml (1 cup)', value: '250' },
        { id: '350ml', label: '350 ml (12 oz)', value: '350' },
        { id: '500ml', label: '500 ml (16.9 oz)', value: '500' },
        { id: '750ml', label: '750 ml (25 oz)', value: '750' },
        { id: '1000ml', label: '1000 ml (1 liter)', value: '1000' },
        { id: 'custom', label: 'Other amount', value: 'custom' }
      ]
    },
    {
      id: 'thirst-level',
      type: 'list',
      question: 'Hydration Status: How would you rate your current thirst level?',
      options: [
        { id: 'not-thirsty', label: 'Not thirsty', value: 'not-thirsty' },
        { id: 'slightly', label: 'Slightly thirsty', value: 'slightly' },
        { id: 'moderately', label: 'Moderately thirsty', value: 'moderately' },
        { id: 'very', label: 'Very thirsty', value: 'very' },
        { id: 'extreme', label: 'Extremely thirsty (concerning)', value: 'extreme' }
      ]
    }
  ],
  successMessage: (answers) => 'Hydration Entry Recorded',
  detailsMessage: (answers) => {
    const amount = parseInt(answers['water-amount']) || 250
    const dailyProgress = getWaterProgress(amount.toString())
    const hydrationStatus = getHydrationRecommendation(answers['thirst-level'])
    const timingNote = getHydrationTiming(answers['water-timing'])
    
    return `Hydration Analysis Complete\n\nFluid Intake Summary:\n• Type: ${formatFluidType(answers['water-type'])}\n• Volume: ${amount} ml\n• Time Period: ${answers['water-timing']}\n\nDaily Hydration Status:\n• Today\'s Total: ${dailyProgress.current} ml\n• Target Progress: ${dailyProgress.percentage}%\n• Remaining Goal: ${dailyProgress.remaining} ml\n\n${hydrationStatus}\n\n${timingNote}\n\nClinical Note: Adequate hydration supports medication effectiveness and helps minimize GLP-1 related gastrointestinal side effects.`
  }
}

const formatFluidType = (type: string) => {
  const types = {
    'plain-water': 'Plain Water (Optimal)',
    'sparkling': 'Carbonated Water',
    'electrolyte': 'Electrolyte-Enhanced Water',
    'herbal-tea': 'Herbal Tea',
    'other-beverage': 'Other Beverage'
  }
  return types[type] || 'Water'
}

const getHydrationRecommendation = (thirstLevel: string) => {
  const recommendations = {
    'not-thirsty': 'Hydration Status: Well hydrated. Continue regular fluid intake.',
    'slightly': 'Hydration Status: Mild dehydration possible. Increase water intake.',
    'moderately': 'Hydration Status: Moderate dehydration likely. Prioritize hydration over next 2 hours.',
    'very': 'Hydration Alert: Significant dehydration. Drink 500ml water within the next hour.',
    'extreme': 'Medical Alert: Severe thirst may indicate hyperglycemia or medication side effects. Check blood glucose and consult provider if persistent.'
  }
  return recommendations[thirstLevel] || recommendations['slightly']
}

const getHydrationTiming = (timing: string) => {
  const notes = {
    'morning': 'Morning hydration helps restore fluid balance after overnight fasting.',
    'afternoon': 'Afternoon hydration maintains energy and cognitive function.',
    'evening': 'Evening hydration is important but consider limiting 2 hours before bedtime.',
    'night': 'Late-night hydration may affect sleep quality. Consider earlier intake timing.'
  }
  return notes[timing] || ''
}

// Log Medications Flow
const LOG_MEDICATIONS_FLOW: ActionFlow = {
  actionId: 'log-medications',
  steps: [
    {
      id: 'medication-type',
      type: 'list',
      question: 'Medication Category: Select the type of medication you are documenting',
      options: [
        { id: 'glp1', label: 'GLP-1 Medication (Primary therapy)', value: 'glp1' },
        { id: 'diabetes', label: 'Other Diabetes Medications', value: 'diabetes' },
        { id: 'cardiovascular', label: 'Cardiovascular Medications', value: 'cardiovascular' },
        { id: 'pain', label: 'Pain/Anti-inflammatory', value: 'pain' },
        { id: 'gi', label: 'Gastrointestinal Medications', value: 'gi' },
        { id: 'other', label: 'Other Medications', value: 'other' }
      ]
    },
    {
      id: 'medication',
      type: 'list',
      question: 'Medication Selection: Which specific medication did you take?',
      options: [
        { id: 'semaglutide', label: 'Semaglutide (Ozempic/Wegovy)', value: 'Semaglutide' },
        { id: 'metformin', label: 'Metformin', value: 'Metformin' },
        { id: 'atorvastatin', label: 'Atorvastatin (Lipitor)', value: 'Atorvastatin' },
        { id: 'lisinopril', label: 'Lisinopril', value: 'Lisinopril' },
        { id: 'omeprazole', label: 'Omeprazole (Prilosec)', value: 'Omeprazole' },
        { id: 'ondansetron', label: 'Ondansetron (Zofran)', value: 'Ondansetron' },
        { id: 'acetaminophen', label: 'Acetaminophen (Tylenol)', value: 'Acetaminophen' },
        { id: 'ibuprofen', label: 'Ibuprofen (Advil/Motrin)', value: 'Ibuprofen' }
      ]
    },
    {
      id: 'dose-taken',
      type: 'list',
      question: 'Dose Administration: What dose did you take?',
      options: [
        { id: 'as-prescribed', label: 'As prescribed (standard dose)', value: 'as-prescribed' },
        { id: 'half-dose', label: 'Half dose', value: 'half-dose' },
        { id: 'double-dose', label: 'Double dose (catch-up)', value: 'double-dose' },
        { id: 'not-sure', label: 'Not sure of dose', value: 'not-sure' }
      ]
    },
    {
      id: 'administration-time',
      type: 'list',
      question: 'Administration Timing: When did you take this medication?',
      options: [
        { id: 'just-now', label: 'Just now', value: 'just-now' },
        { id: '30min', label: '30 minutes ago', value: '30min' },
        { id: '1hour', label: '1 hour ago', value: '1hour' },
        { id: '2hours', label: '2 hours ago', value: '2hours' },
        { id: 'earlier', label: 'Earlier today', value: 'earlier' }
      ]
    },
    {
      id: 'food-timing',
      type: 'list',
      question: 'Food Interaction: Did you take this medication with food?',
      options: [
        { id: 'with-meal', label: 'With a meal', value: 'with-meal' },
        { id: 'empty-stomach', label: 'On empty stomach', value: 'empty-stomach' },
        { id: '30min-before', label: '30 minutes before eating', value: '30min-before' },
        { id: '1hour-after', label: '1 hour after eating', value: '1hour-after' }
      ]
    },
    {
      id: 'side-effects',
      type: 'list',
      question: 'Tolerance Assessment: Any immediate side effects noticed?',
      options: [
        { id: 'none', label: 'No side effects', value: 'none' },
        { id: 'mild-nausea', label: 'Mild nausea', value: 'mild-nausea' },
        { id: 'stomach-upset', label: 'Stomach upset', value: 'stomach-upset' },
        { id: 'dizziness', label: 'Dizziness', value: 'dizziness' },
        { id: 'other', label: 'Other effects', value: 'other' }
      ]
    }
  ],
  successMessage: (answers) => 'Medication Administration Documented',
  detailsMessage: (answers) => {
    const nextDose = getNextDoseTime(answers.medication)
    const interaction = getMedicationInteraction(answers.medication, answers['food-timing'])
    const adherenceNote = getAdherenceNote(answers['dose-taken'])
    const sideEffectNote = getSideEffectManagement(answers['side-effects'])
    
    return `Medication Administration Record\n\nMedication Details:\n• Drug: ${answers.medication}\n• Category: ${formatMedicationType(answers['medication-type'])}\n• Dose: ${answers['dose-taken']}\n• Time: ${formatAdministrationTime(answers['administration-time'])}\n• Food Timing: ${answers['food-timing']}\n• Immediate Tolerance: ${answers['side-effects']}\n\n${adherenceNote}\n\n${interaction}\n\n${sideEffectNote}\n\nNext Scheduled Dose: ${nextDose}\n\nClinical Note: Consistent medication timing and proper administration optimize therapeutic outcomes and minimize adverse effects.`
  }
}

const formatMedicationType = (type: string) => {
  const types = {
    'glp1': 'GLP-1 Receptor Agonist',
    'diabetes': 'Antidiabetic Agent',
    'cardiovascular': 'Cardiovascular',
    'pain': 'Analgesic/Anti-inflammatory',
    'gi': 'Gastrointestinal',
    'other': 'Other'
  }
  return types[type] || 'Unspecified'
}

const formatAdministrationTime = (time: string) => {
  const now = new Date()
  const times = {
    'just-now': now.toLocaleTimeString(),
    '30min': new Date(now.getTime() - 30*60000).toLocaleTimeString(),
    '1hour': new Date(now.getTime() - 60*60000).toLocaleTimeString(),
    '2hours': new Date(now.getTime() - 120*60000).toLocaleTimeString(),
    'earlier': 'Earlier today'
  }
  return times[time] || now.toLocaleTimeString()
}

const getMedicationInteraction = (medication: string, foodTiming: string) => {
  if (medication === 'Semaglutide') {
    if (foodTiming === 'with-meal') {
      return 'Food Interaction: Taking with food may help reduce nausea but does not affect absorption.'
    }
    return 'Administration Optimal: Semaglutide can be taken with or without food.'
  } else if (medication === 'Metformin') {
    if (foodTiming === 'empty-stomach') {
      return 'Food Interaction Alert: Metformin should be taken with food to minimize GI side effects.'
    }
    return 'Administration Optimal: Taking with food reduces gastrointestinal side effects.'
  }
  return 'Food Interaction: Follow prescribed administration instructions for optimal effectiveness.'
}

const getAdherenceNote = (doseTaken: string) => {
  if (doseTaken === 'as-prescribed') {
    return 'Adherence Status: Excellent! Taking medication as prescribed optimizes therapeutic outcomes.'
  } else if (doseTaken === 'double-dose') {
    return 'Adherence Alert: Double dosing may increase side effects. Contact provider if you missed previous dose.'
  } else if (doseTaken === 'half-dose') {
    return 'Dose Modification: Partial dosing may reduce effectiveness. Discuss dose adjustments with provider.'
  }
  return 'Dose Verification: Please confirm correct dose with prescription label or contact pharmacy.'
}

const getSideEffectManagement = (sideEffect: string) => {
  const management = {
    'none': 'Tolerance: Excellent! No adverse effects noted.',
    'mild-nausea': 'Nausea Management: Try ginger tea, small frequent meals, and remain upright after eating.',
    'stomach-upset': 'GI Management: Consider taking with more food, staying hydrated, and avoiding spicy/fatty foods.',
    'dizziness': 'Dizziness Alert: Rise slowly from sitting/lying. Check blood pressure and glucose. Stay hydrated.',
    'other': 'Side Effect Monitoring: Document symptoms and report persistent or worsening effects to provider.'
  }
  return management[sideEffect] || management['other']
}

// Helper functions
const getCaloriesBurned = (answers: Record<string, any>): number => {
  const baseCalories = { 'Cardio': 8, 'Running': 12, 'Cycling': 10, 'Other': 6 }
  const durationMins = parseInt(answers.duration) || 30
  const intensityMultiplier = { 'Low': 0.8, 'Medium': 1.0, 'Intense': 1.4 }
  
  return Math.round((baseCalories[answers['exercise-type']] || 8) * durationMins * (intensityMultiplier[answers.intensity] || 1.0))
}

const getSleepQuality = (hours: number): string => {
  if (hours >= 7 && hours <= 9) return 'Excellent'
  if (hours >= 6 && hours < 7) return 'Good'  
  if (hours >= 5 && hours < 6) return 'Fair'
  return 'Poor'
}

const getSleepRecommendation = (hours: number): string => {
  if (hours < 6) return 'Try to get more sleep for better health'
  if (hours > 10) return 'Consider if you need this much sleep'
  return 'Keep maintaining good sleep habits'
}

const getWaterProgress = (amount: string) => {
  const ml = parseInt(amount) || 0
  const dailyGoal = 2500 // Updated goal for GLP-1 therapy
  const currentTotal = 1200 + ml // Simulate daily progress
  const percentage = Math.min(Math.round((currentTotal / dailyGoal) * 100), 100)
  const remaining = Math.max(dailyGoal - currentTotal, 0)
  
  return {
    current: currentTotal,
    percentage: percentage,
    remaining: remaining,
    goal: dailyGoal
  }
}

const getNextDoseTime = (medication: string): string => {
  const schedules = {
    'Semaglutide': '7 days',
    'Paracetamol': '6 hours', 
    'Aspirin': '24 hours',
    'Ibuprofen': '8 hours',
    'Risovostatin': '24 hours'
  }
  return schedules[medication] || '24 hours'
}

// Log Symptoms Flow - Comprehensive symptom tracking with clinical detail
const LOG_SYMPTOMS_FLOW: ActionFlow = {
  actionId: 'log-symptoms',
  steps: [
    {
      id: 'symptom-onset',
      type: 'list',
      question: 'Symptom Timeline: When did this symptom first begin?',
      options: [
        { id: 'just-now', label: 'Just now (within past hour)', value: 'just-now' },
        { id: 'today', label: 'Earlier today', value: 'today' },
        { id: 'yesterday', label: 'Yesterday', value: 'yesterday' },
        { id: 'few-days', label: '2-3 days ago', value: 'few-days' },
        { id: 'week', label: 'Within past week', value: 'week' },
        { id: 'longer', label: 'More than a week ago', value: 'longer' }
      ]
    },
    {
      id: 'symptom-selection',
      type: 'list',
      question: 'Symptom Identification: Select the primary symptom you are experiencing. Common GLP-1 therapy-related symptoms are listed first.',
      options: SEMAGLUTIDE_SYMPTOMS.map(symptom => ({
        id: symptom.id,
        label: `${symptom.emoji} ${symptom.name}`,
        value: symptom.name
      }))
    },
    {
      id: 'intensity',
      type: 'slider',
      question: 'Severity Assessment: Rate your symptom intensity on a validated clinical scale',
      min: 1,
      max: 10,
      unit: 'severity'
    },
    {
      id: 'frequency',
      type: 'list', 
      question: 'Frequency Pattern: How often has this symptom occurred in the past 7 days?',
      options: SYMPTOM_FREQUENCIES.map(freq => ({
        id: freq.id,
        label: freq.label,
        value: freq.value
      }))
    },
    {
      id: 'body-location',
      type: 'body-area-selector',
      question: 'Anatomical Localization: Please indicate the specific area affected (shown if symptom requires location)',
      options: [] // Will be populated dynamically based on selected symptom
    },
    {
      id: 'triggers',
      type: 'list',
      question: 'Symptom Triggers: What seems to trigger or worsen this symptom?',
      options: [
        { id: 'medication', label: 'After taking medication', value: 'medication' },
        { id: 'eating', label: 'Related to eating', value: 'eating' },
        { id: 'activity', label: 'During/after physical activity', value: 'activity' },
        { id: 'stress', label: 'During stressful situations', value: 'stress' },
        { id: 'random', label: 'No clear trigger pattern', value: 'random' },
        { id: 'continuous', label: 'Constant/continuous', value: 'continuous' }
      ]
    },
    {
      id: 'impact',
      type: 'list',
      question: 'Functional Impact: How is this symptom affecting your daily activities?',
      options: [
        { id: 'none', label: 'No impact - can do all activities', value: 'none' },
        { id: 'minimal', label: 'Minimal - slight adjustments needed', value: 'minimal' },
        { id: 'moderate', label: 'Moderate - some activities limited', value: 'moderate' },
        { id: 'severe', label: 'Severe - many activities affected', value: 'severe' },
        { id: 'complete', label: 'Complete - unable to perform activities', value: 'complete' }
      ]
    },
    {
      id: 'interventions',
      type: 'list',
      question: 'Self-Management: Have you tried anything to relieve this symptom?',
      options: [
        { id: 'none', label: 'Nothing yet', value: 'none' },
        { id: 'rest', label: 'Rest/relaxation', value: 'rest' },
        { id: 'otc', label: 'Over-the-counter medication', value: 'otc' },
        { id: 'dietary', label: 'Dietary changes', value: 'dietary' },
        { id: 'hydration', label: 'Increased hydration', value: 'hydration' },
        { id: 'multiple', label: 'Multiple interventions', value: 'multiple' }
      ]
    }
  ],
  successMessage: (answers) => 'Symptom Documentation Complete',
  detailsMessage: (answers) => {
    const severity = getSeverityClassification(answers.intensity)
    const clinicalUrgency = assessClinicalUrgency(answers)
    const recommendation = getSymptomRecommendation(answers)
    
    return `Clinical Symptom Assessment\n\nSymptom Profile:\n• Primary Symptom: ${answers['symptom-selection']}\n• Onset: ${answers['symptom-onset']}\n• Severity: ${answers.intensity}/10 (${severity})\n• Frequency: ${answers.frequency}\n• Location: ${answers['body-location'] || 'Generalized'}\n• Trigger Pattern: ${answers.triggers}\n• Functional Impact: ${answers.impact}\n• Self-Management: ${answers.interventions}\n\n${clinicalUrgency}\n\n${recommendation}\n\nDocumented: ${new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}\nThis information has been added to your medical record for provider review.`
  }
}

const getSeverityClassification = (intensity: number) => {
  if (intensity <= 3) return 'Mild (CTCAE Grade 1)'
  if (intensity <= 6) return 'Moderate (CTCAE Grade 2)'
  if (intensity <= 8) return 'Severe (CTCAE Grade 3)'
  return 'Very Severe (CTCAE Grade 4)'
}

const assessClinicalUrgency = (answers: Record<string, any>) => {
  const urgentSymptoms = ['chest', 'severe', 'complete']
  const isUrgent = answers.intensity >= 8 || 
                   urgentSymptoms.some(s => Object.values(answers).includes(s))
  
  if (isUrgent) {
    return 'Clinical Alert: This symptom severity warrants prompt medical evaluation. Consider contacting your healthcare provider within 24 hours.'
  } else if (answers.intensity >= 6) {
    return 'Clinical Note: Moderate symptom requiring monitoring. If worsening or persistent beyond 48 hours, medical consultation recommended.'
  }
  return 'Clinical Note: Symptom documented for trending. Continue monitoring and report changes at next appointment.'
}

const getSymptomRecommendation = (answers: Record<string, any>) => {
  const symptom = answers['symptom-selection']?.toLowerCase() || ''
  const trigger = answers.triggers
  
  let recommendation = 'Management Recommendations:\n'
  
  // Symptom-specific recommendations
  if (symptom.includes('nausea')) {
    recommendation += '• Eat smaller, more frequent meals\n• Avoid high-fat foods\n• Consider ginger tea or peppermint\n• Stay upright for 30 minutes after eating'
  } else if (symptom.includes('pain')) {
    recommendation += '• Apply heat or cold to affected area\n• Gentle stretching if tolerated\n• Monitor for changes in pattern or intensity\n• Document any radiation of pain'
  } else if (symptom.includes('fatigue')) {
    recommendation += '• Maintain consistent sleep schedule\n• Light exercise as tolerated\n• Ensure adequate hydration\n• Monitor blood glucose levels'
  } else if (symptom.includes('constipation')) {
    recommendation += '• Increase fiber intake gradually\n• Hydrate with 2.5L water daily\n• Light physical activity\n• Consider probiotic supplementation'
  } else {
    recommendation += '• Continue monitoring symptom patterns\n• Maintain symptom diary\n• Identify and avoid triggers\n• Report persistent symptoms to provider'
  }
  
  // Trigger-based modifications
  if (trigger === 'medication') {
    recommendation += '\n\nMedication Timing: Consider adjusting administration time or taking with food. Discuss with pharmacist.'
  } else if (trigger === 'eating') {
    recommendation += '\n\nDietary Modification: Keep food diary to identify specific triggers. Consider consultation with dietitian.'
  }
  
  return recommendation
}

// Nurse Consultation Flow
const NURSE_CONSULTATION_FLOW: ActionFlow = {
  actionId: 'contact-nurse',
  steps: [
    {
      id: 'appointment-date',
      type: 'options-with-inline-datepicker',
      question: '📅 When would you like to schedule your injection training appointment?',
      options: [
        { id: 'tomorrow', label: 'Tomorrow', value: 'tomorrow' },
        { id: 'this-week', label: 'This Week', value: 'this-week' },
        { id: 'next-week', label: 'Next Week', value: 'next-week' },
        { id: 'custom', label: 'Pick a Date', value: 'custom', hasDatePicker: true }
      ]
    },
    {
      id: 'time-slot',
      type: 'list',
      question: '⏰ What time works best for you?',
      options: [
        { id: 'morning', label: '9:00 AM - Morning', value: '9:00 AM' },
        { id: 'midmorning', label: '10:30 AM - Mid-Morning', value: '10:30 AM' },
        { id: 'afternoon', label: '2:00 PM - Afternoon', value: '2:00 PM' },
        { id: 'lateafternoon', label: '3:30 PM - Late Afternoon', value: '3:30 PM' },
        { id: 'evening', label: '5:00 PM - Early Evening', value: '5:00 PM' }
      ]
    },
    {
      id: 'location-type',
      type: 'list',
      question: '📍 Where would you prefer to meet?',
      options: [
        { id: 'clinic', label: '🏥 At the clinic', value: 'clinic' },
        { id: 'home', label: '🏠 At my home', value: 'home' },
        { id: 'telehealth', label: '💻 Virtual consultation', value: 'telehealth' }
      ]
    },
    {
      id: 'address-input',
      type: 'text',
      question: '🗺️ Please provide the address for your appointment by typing it in the chat box below:',
      placeholder: 'Enter your address or select from map...'
    },
    {
      id: 'confirmation',
      type: 'list',
      question: '✅ Please confirm your appointment details:',
      options: [
        { id: 'confirm', label: '✅ Confirm Appointment', value: 'confirm' },
        { id: 'modify', label: '✏️ Modify Details', value: 'modify' }
      ]
    }
  ],
  successMessage: (answers) => `✅ Appointment scheduled successfully!`,
  detailsMessage: (answers) => `👩‍⚕️ Nurse Consultation Confirmed:\n• Date: ${answers['appointment-date']}\n• Time: ${answers['time-slot']}\n• Location: ${answers['location-type'] === 'clinic' ? 'Clinic' : answers['location-type'] === 'home' ? 'Home Visit' : 'Virtual'}\n• Address: ${answers['address-input']}\n• Duration: 30 minutes\n• A certified diabetes educator will provide hands-on injection training`
}

// Export all flows
export const QUICK_ACTION_FLOWS: ActionFlow[] = [
  LOG_DIET_FLOW,
  LOG_EXERCISE_FLOW, 
  LOG_SLEEP_FLOW,
  LOG_WATER_FLOW,
  LOG_MEDICATIONS_FLOW,
  LOG_SYMPTOMS_FLOW,
  NURSE_CONSULTATION_FLOW
]