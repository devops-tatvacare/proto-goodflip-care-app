export const CHART_CONFIG = {
  height: 240,
  containerWidth: 70,
  iconSize: 28,
  yAxisWidth: 28,
  xAxisHeight: 40,
} as const

export const SYMPTOM_TYPES = [
  { symptom: "Fever", icon: "Thermometer", color: "text-red-500" },
  { symptom: "Nausea", icon: "AlertTriangle", color: "text-yellow-500" },
  { symptom: "Pain", icon: "Zap", color: "text-orange-500" },
  { symptom: "Weakness", icon: "Activity", color: "text-gray-500" },
  { symptom: "Chest Pain", icon: "Heart", color: "text-red-600" },
  { symptom: "Headache", icon: "Brain", color: "text-purple-600" },
  { symptom: "Cough", icon: "Stethoscope", color: "text-blue-600" },
  { symptom: "Eye Irritation", icon: "Eye", color: "text-cyan-500" },
  { symptom: "Shortness of Breath", icon: "Wind", color: "text-blue-500" },
] as const
