import { Icon } from '@/components/ui/icon'

export interface SymptomType {
  symptom: string
  icon: LucideIcon
  color: string
  emergency?: boolean
  semaglutide?: boolean
}

export const SYMPTOM_TYPES: SymptomType[] = [
  { symptom: "Fever", icon: (props: any) => <Icon name="thermostat" {...props} />, color: "text-red-500", emergency: true },
  { symptom: "Severe Dizziness", icon: (props: any) => <Icon name="alertTriangle" {...props} />, color: "text-red-600", emergency: true },
  { symptom: "Chest Pain", icon: (props: any) => <Icon name="heart" {...props} />, color: "text-red-600", emergency: true },
  { symptom: "Difficulty Breathing", icon: (props: any) => <Icon name="wind" {...props} />, color: "text-red-600", emergency: true },
  { symptom: "Nausea", icon: (props: any) => <Icon name="alertTriangle" {...props} />, color: "text-yellow-500", semaglutide: true },
  { symptom: "Pain", icon: (props: any) => <Icon name="zap" {...props} />, color: "text-orange-500" },
  { symptom: "Weakness", icon: (props: any) => <Icon name="glucose" {...props} />, color: "text-gray-500" },
  { symptom: "Headache", icon: (props: any) => <Icon name="brain" {...props} />, color: "text-purple-600" },
  { symptom: "Cough", icon: (props: any) => <Icon name="stethoscope" {...props} />, color: "text-blue-600" },
  { symptom: "Eye Irritation", icon: (props: any) => <Icon name="eye" {...props} />, color: "text-cyan-500" },
  { symptom: "Hypoglycemia (Low Blood Sugar)", icon: (props: any) => <Icon name="trendingDown" {...props} />, color: "text-red-500", semaglutide: true },
  { symptom: "Vomiting", icon: (props: any) => <Icon name="alertTriangle" {...props} />, color: "text-red-400", semaglutide: true },
  { symptom: "Diarrhea", icon: (props: any) => <Icon name="alertTriangle" {...props} />, color: "text-yellow-600", semaglutide: true },
  { symptom: "Dizziness", icon: (props: any) => <Icon name="alertTriangle" {...props} />, color: "text-orange-500", semaglutide: true },
]

export const isSemaglutideSymptom = (symptomName: string): boolean => {
  return SYMPTOM_TYPES.find((s) => s.symptom === symptomName)?.semaglutide || false
}