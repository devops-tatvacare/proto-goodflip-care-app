export interface KairaPrompt {
  id: string
  text: string
  icon?: string
}

export interface MetricPrompts {
  [metric: string]: KairaPrompt[]
}

// Health Metrics Prompts
export const healthMetricPrompts: MetricPrompts = {
  "Diet Logs": [
    { id: "diet-1", text: "How is my diet progressing?", icon: "trending_up" },
    { id: "diet-2", text: "Suggest healthy meal recipes", icon: "restaurant" },
    { id: "diet-3", text: "Analyze my nutrition gaps", icon: "analytics" },
    { id: "diet-4", text: "Weekly diet summary", icon: "summarize" }
  ],
  "Water Logs": [
    { id: "water-1", text: "Am I drinking enough water?", icon: "water_drop" },
    { id: "water-2", text: "Best times to hydrate", icon: "schedule" },
    { id: "water-3", text: "Hydration tips for my routine", icon: "tips_and_updates" },
    { id: "water-4", text: "Weekly hydration analysis", icon: "analytics" }
  ],
  "Sleep Logs": [
    { id: "sleep-1", text: "How is my sleep quality?", icon: "bedtime" },
    { id: "sleep-2", text: "Tips for better sleep", icon: "tips_and_updates" },
    { id: "sleep-3", text: "Analyze my sleep patterns", icon: "insights" },
    { id: "sleep-4", text: "Impact of sleep on my health", icon: "health_and_safety" }
  ],
  "Steps Logs": [
    { id: "steps-1", text: "Am I meeting my step goals?", icon: "directions_walk" },
    { id: "steps-2", text: "Ways to increase daily steps", icon: "add_circle" },
    { id: "steps-3", text: "Weekly activity summary", icon: "summarize" },
    { id: "steps-4", text: "Benefits of my current activity", icon: "favorite" }
  ],
  "Weight Logs": [
    { id: "weight-1", text: "Is my weight trend healthy?", icon: "monitor_weight" },
    { id: "weight-2", text: "Weight management strategies", icon: "balance" },
    { id: "weight-3", text: "Track progress towards goals", icon: "flag" },
    { id: "weight-4", text: "Healthy weight range guidance", icon: "info" }
  ],
  "Heart Rate": [
    { id: "hr-basic-1", text: "Is my heart rate normal?", icon: "favorite" },
    { id: "hr-basic-2", text: "Heart rate during exercise", icon: "fitness_center" },
    { id: "hr-basic-3", text: "Resting heart rate trends", icon: "trending_up" },
    { id: "hr-basic-4", text: "When to be concerned", icon: "warning" }
  ],
  "Medication Logs": [
    { id: "med-1", text: "Am I taking meds correctly?", icon: "medication" },
    { id: "med-2", text: "Side effects to watch for", icon: "warning" },
    { id: "med-3", text: "Medication interaction check", icon: "sync_problem" },
    { id: "med-4", text: "Adherence improvement tips", icon: "task_alt" }
  ],
  "Fatigue Logs": [
    { id: "fatigue-1", text: "What's causing my fatigue?", icon: "battery_low" },
    { id: "fatigue-2", text: "Energy management tips", icon: "battery_charging_full" },
    { id: "fatigue-3", text: "Fatigue pattern analysis", icon: "show_chart" },
    { id: "fatigue-4", text: "When to rest vs. push through", icon: "psychology" }
  ],
  "Menstruation Logs": [
    { id: "menstrual-1", text: "Predict my next cycle", icon: "calendar_month" },
    { id: "menstrual-2", text: "Symptom management tips", icon: "healing" },
    { id: "menstrual-3", text: "Cycle pattern insights", icon: "insights" },
    { id: "menstrual-4", text: "Hormonal health overview", icon: "monitoring" }
  ]
}

// Vitals Metrics Prompts
export const vitalsMetricPrompts: MetricPrompts = {
  // Labs
  "Blood Panel": [
    { id: "blood-1", text: "Explain my blood test results", icon: "biotech" },
    { id: "blood-2", text: "Are my levels concerning?", icon: "priority_high" },
    { id: "blood-3", text: "How to improve my markers", icon: "trending_up" },
    { id: "blood-4", text: "Compare to previous tests", icon: "compare_arrows" }
  ],
  "Cholesterol": [
    { id: "chol-1", text: "Is my cholesterol healthy?", icon: "favorite" },
    { id: "chol-2", text: "Diet tips for cholesterol", icon: "restaurant" },
    { id: "chol-3", text: "HDL vs LDL explained", icon: "school" },
    { id: "chol-4", text: "Natural ways to lower it", icon: "eco" }
  ],
  "White Blood Cell Count": [
    { id: "wbc-1", text: "What does my WBC indicate?", icon: "biotech" },
    { id: "wbc-2", text: "Signs of infection to watch", icon: "coronavirus" },
    { id: "wbc-3", text: "How to boost immunity", icon: "shield" },
    { id: "wbc-4", text: "When to be concerned", icon: "warning" }
  ],
  "Omega 6": [
    { id: "omega6-1", text: "Are my Omega 6 levels optimal?", icon: "biotech" },
    { id: "omega6-2", text: "Omega 6 vs Omega 3 balance", icon: "balance" },
    { id: "omega6-3", text: "Foods high in Omega 6", icon: "restaurant" },
    { id: "omega6-4", text: "Inflammation and Omega 6", icon: "local_fire_department" }
  ],
  "Progesterone": [
    { id: "prog-1", text: "What do my progesterone levels mean?", icon: "biotech" },
    { id: "prog-2", text: "Progesterone and menstrual cycle", icon: "calendar_month" },
    { id: "prog-3", text: "Natural ways to support levels", icon: "eco" },
    { id: "prog-4", text: "Hormonal balance insights", icon: "balance" }
  ],
  "Prolactin": [
    { id: "prol-1", text: "Are my prolactin levels normal?", icon: "biotech" },
    { id: "prol-2", text: "What affects prolactin levels?", icon: "psychology" },
    { id: "prol-3", text: "Prolactin and fertility", icon: "child_care" },
    { id: "prol-4", text: "When to be concerned", icon: "warning" }
  ],
  "Red Blood Cell": [
    { id: "rbc-1", text: "What does my RBC count mean?", icon: "biotech" },
    { id: "rbc-2", text: "Signs of anemia to watch", icon: "warning" },
    { id: "rbc-3", text: "Iron and RBC health", icon: "restaurant" },
    { id: "rbc-4", text: "Improving oxygen transport", icon: "air" }
  ],
  "Vitamin D": [
    { id: "vitd-1", text: "Am I getting enough Vitamin D?", icon: "wb_sunny" },
    { id: "vitd-2", text: "Sun exposure recommendations", icon: "sunny" },
    { id: "vitd-3", text: "Vitamin D deficiency symptoms", icon: "warning" },
    { id: "vitd-4", text: "Foods rich in Vitamin D", icon: "restaurant" }
  ],
  "Vitamin B12": [
    { id: "vitb12-1", text: "Are my B12 levels sufficient?", icon: "biotech" },
    { id: "vitb12-2", text: "B12 deficiency symptoms", icon: "warning" },
    { id: "vitb12-3", text: "Best sources of B12", icon: "restaurant" },
    { id: "vitb12-4", text: "B12 and energy levels", icon: "battery_charging_full" }
  ],
  "Zinc": [
    { id: "zinc-1", text: "Is my zinc level optimal?", icon: "biotech" },
    { id: "zinc-2", text: "Zinc and immune function", icon: "shield" },
    { id: "zinc-3", text: "Foods high in zinc", icon: "restaurant" },
    { id: "zinc-4", text: "Signs of zinc deficiency", icon: "warning" }
  ],

  // Body Composition
  "Weight": [
    { id: "weight-1", text: "Am I at a healthy weight?", icon: "monitor_weight" },
    { id: "weight-2", text: "Weight trend analysis", icon: "trending_up" },
    { id: "weight-3", text: "Sustainable weight goals", icon: "flag" },
    { id: "weight-4", text: "Impact on my health metrics", icon: "analytics" }
  ],
  "Body Fat": [
    { id: "fat-1", text: "Is my body fat percentage healthy?", icon: "percent" },
    { id: "fat-2", text: "How to reduce body fat safely", icon: "fitness_center" },
    { id: "fat-3", text: "Body fat vs muscle ratio", icon: "balance" },
    { id: "fat-4", text: "Optimal range for my age", icon: "person" }
  ],
  "Muscle Mass": [
    { id: "muscle-1", text: "Am I maintaining muscle mass?", icon: "fitness_center" },
    { id: "muscle-2", text: "Protein needs for muscle", icon: "egg" },
    { id: "muscle-3", text: "Strength training tips", icon: "sports_gymnastics" },
    { id: "muscle-4", text: "Age-related muscle loss", icon: "elderly" }
  ],
  "Lean Body Mass": [
    { id: "lbm-1", text: "What is my lean body mass?", icon: "fitness_center" },
    { id: "lbm-2", text: "Lean mass vs total weight", icon: "balance" },
    { id: "lbm-3", text: "Building lean muscle", icon: "sports_gymnastics" },
    { id: "lbm-4", text: "Metabolism and lean mass", icon: "local_fire_department" }
  ],
  "Visceral Fat": [
    { id: "vfat-1", text: "Is my visceral fat level safe?", icon: "warning" },
    { id: "vfat-2", text: "Health risks of visceral fat", icon: "priority_high" },
    { id: "vfat-3", text: "How to reduce visceral fat", icon: "fitness_center" },
    { id: "vfat-4", text: "Diet for visceral fat loss", icon: "restaurant" }
  ],
  "Subcutaneous Fat": [
    { id: "sfat-1", text: "What is subcutaneous fat?", icon: "info" },
    { id: "sfat-2", text: "Subcutaneous vs visceral fat", icon: "compare_arrows" },
    { id: "sfat-3", text: "Healthy fat distribution", icon: "balance" },
    { id: "sfat-4", text: "Managing subcutaneous fat", icon: "fitness_center" }
  ],
  "Skeletal Muscle": [
    { id: "skel-1", text: "How much skeletal muscle do I have?", icon: "fitness_center" },
    { id: "skel-2", text: "Maintaining muscle as I age", icon: "elderly" },
    { id: "skel-3", text: "Exercise for muscle health", icon: "sports_gymnastics" },
    { id: "skel-4", text: "Protein for muscle growth", icon: "egg" }
  ],
  "Bone Mass": [
    { id: "bone-1", text: "Is my bone density healthy?", icon: "skeleton" },
    { id: "bone-2", text: "Preventing bone loss", icon: "shield" },
    { id: "bone-3", text: "Calcium and bone health", icon: "restaurant" },
    { id: "bone-4", text: "Exercise for strong bones", icon: "fitness_center" }
  ],
  "BMI": [
    { id: "bmi-1", text: "What does my BMI indicate?", icon: "monitor_weight" },
    { id: "bmi-2", text: "BMI limitations and context", icon: "info" },
    { id: "bmi-3", text: "Healthy BMI range for me", icon: "target" },
    { id: "bmi-4", text: "Beyond BMI health metrics", icon: "analytics" }
  ],

  // Cardiovascular
  "Heart Rate": [
    { id: "hr-1", text: "Is my heart rate normal?", icon: "favorite" },
    { id: "hr-2", text: "Resting vs active heart rate", icon: "monitor_heart" },
    { id: "hr-3", text: "Heart rate variability insights", icon: "insights" },
    { id: "hr-4", text: "Cardiovascular fitness level", icon: "fitness_center" }
  ],
  "Blood Pressure": [
    { id: "bp-1", text: "Is my blood pressure healthy?", icon: "bloodtype" },
    { id: "bp-2", text: "Natural ways to lower BP", icon: "eco" },
    { id: "bp-3", text: "When to take readings", icon: "schedule" },
    { id: "bp-4", text: "Lifestyle impact on BP", icon: "self_improvement" }
  ],
  "Respiration Rate": [
    { id: "resp-1", text: "Is my breathing rate normal?", icon: "air" },
    { id: "resp-2", text: "Breathing exercises for health", icon: "self_improvement" },
    { id: "resp-3", text: "What affects breathing rate?", icon: "psychology" },
    { id: "resp-4", text: "Respiratory health indicators", icon: "monitor_heart" }
  ],

  // Glucose Monitoring
  "Blood Glucose": [
    { id: "glucose-1", text: "Are my glucose levels normal?", icon: "glucose" },
    { id: "glucose-2", text: "Pre-diabetic risk assessment", icon: "warning" },
    { id: "glucose-3", text: "Foods that spike glucose", icon: "restaurant" },
    { id: "glucose-4", text: "Time in range analysis", icon: "timer" }
  ],
  "HbA1c": [
    { id: "hba1c-1", text: "What does my HbA1c mean?", icon: "biotech" },
    { id: "hba1c-2", text: "3-month glucose average", icon: "calendar_month" },
    { id: "hba1c-3", text: "How to lower HbA1c", icon: "trending_down" },
    { id: "hba1c-4", text: "Diabetes risk assessment", icon: "assessment" }
  ],
  "Time In Range": [
    { id: "tir-1", text: "What is my time in range?", icon: "timer" },
    { id: "tir-2", text: "Improving glucose stability", icon: "trending_up" },
    { id: "tir-3", text: "Target ranges for health", icon: "target" },
    { id: "tir-4", text: "Lifestyle factors affecting TIR", icon: "self_improvement" }
  ]
}

// Symptoms Prompts
export const symptomPrompts: KairaPrompt[] = [
  { id: "symptom-1", text: "What triggers my symptoms?", icon: "psychology" },
  { id: "symptom-2", text: "Symptom pattern analysis", icon: "analytics" },
  { id: "symptom-3", text: "Management strategies", icon: "lightbulb" },
  { id: "symptom-4", text: "When to contact doctor", icon: "medical_services" }
]

// Helper function to get prompts for a metric
export function getPromptsForMetric(
  category: "health" | "vitals" | "symptoms", 
  metric?: string
): KairaPrompt[] {
  if (category === "symptoms") {
    return symptomPrompts
  }
  
  if (category === "health" && metric) {
    return healthMetricPrompts[metric] || []
  }
  
  if (category === "vitals" && metric) {
    return vitalsMetricPrompts[metric] || []
  }
  
  return []
}

// Get title for prompt selection
export function getPromptSelectionTitle(
  category: "health" | "vitals" | "symptoms",
  metric?: string
): string {
  if (category === "symptoms") {
    return "Symptom Insights"
  }
  
  if (metric) {
    // Special formatting for certain metrics
    if (metric === "HbA1c") return "HbA1c Insights"
    if (metric === "Blood Pressure") return "Blood Pressure Insights"
    
    // Default formatting
    return `${metric} Insights`
  }
  
  return "Health Insights"
}