import { Icon } from '@/components/ui/icon'

export interface Device {
  id: string
  name: string
  type: string
  brand: string
  model: string
  isConnected: boolean
  lastSync: string
  batteryLevel?: number
  icon: any
  color: string
  bgColor: string
  stats?: {
    label: string
    value: string
    unit: string
    trend?: "up" | "down" | "stable"
  }[]
}

export const CONNECTED_DEVICES: Device[] = [
  {
    id: "bca-001",
    name: "Body Composition Analyzer",
    type: "BCA",
    brand: "InBody",
    model: "H20N",
    isConnected: true,
    lastSync: "2 minutes ago",
    batteryLevel: 85,
    icon: (props: any) => <Icon name="heartMonitor" {...props} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    stats: [
      { label: "Weight", value: "68.5", unit: "kg", trend: "down" },
      { label: "Body Fat", value: "18.2", unit: "%", trend: "down" },
      { label: "Muscle Mass", value: "52.3", unit: "kg", trend: "up" },
      { label: "BMI", value: "22.4", unit: "", trend: "stable" },
    ],
  },
  {
    id: "bp-001",
    name: "Blood Pressure Monitor",
    type: "Blood Pressure",
    brand: "Omron",
    model: "HEM-7156T",
    isConnected: true,
    lastSync: "5 minutes ago",
    batteryLevel: 92,
    icon: (props: any) => <Icon name="heart" {...props} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    stats: [
      { label: "Systolic", value: "118", unit: "mmHg", trend: "stable" },
      { label: "Diastolic", value: "76", unit: "mmHg", trend: "stable" },
      { label: "Pulse", value: "72", unit: "bpm", trend: "stable" },
    ],
  },
  {
    id: "glucose-001",
    name: "Glucose Monitor",
    type: "Diabetes",
    brand: "FreeStyle",
    model: "Libre 3",
    isConnected: false,
    lastSync: "1 hour ago",
    batteryLevel: 45,
    icon: (props: any) => <Icon name="waterDrop" {...props} />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    stats: [
      { label: "Current", value: "95", unit: "mg/dL", trend: "stable" },
      { label: "Average", value: "102", unit: "mg/dL", trend: "down" },
      { label: "Time in Range", value: "78", unit: "%", trend: "up" },
    ],
  },
  {
    id: "spirometer-001",
    name: "Digital Spirometer",
    type: "Respiratory",
    brand: "MIR",
    model: "Spirobank Smart",
    isConnected: true,
    lastSync: "30 minutes ago",
    batteryLevel: 67,
    icon: (props: any) => <Icon name="wind" {...props} />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    stats: [
      { label: "FEV1", value: "3.2", unit: "L", trend: "stable" },
      { label: "FVC", value: "4.1", unit: "L", trend: "up" },
      { label: "Peak Flow", value: "420", unit: "L/min", trend: "stable" },
    ],
  },
]

export const AVAILABLE_DEVICES = [
  {
    id: "cgm-new",
    name: "Continuous Glucose Monitor",
    type: "CGM",
    brand: "Dexcom",
    model: "G7",
    description: "Real-time glucose monitoring with smartphone connectivity",
    icon: (props: any) => <Icon name="waterDrop" {...props} />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "fitness-tracker",
    name: "Fitness Tracker",
    type: "Wearable",
    brand: "Fitbit",
    model: "Charge 6",
    description: "Track steps, heart rate, sleep, and more",
    icon: (props: any) => <Icon name="heartMonitor" {...props} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "smart-scale",
    name: "Smart Scale",
    type: "BCA",
    brand: "Withings",
    model: "Body+",
    description: "Wi-Fi connected body composition scale",
    icon: (props: any) => <Icon name="heartMonitor" {...props} />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "pulse-oximeter",
    name: "Pulse Oximeter",
    type: "Respiratory",
    brand: "Masimo",
    model: "MightySat",
    description: "Fingertip pulse oximeter with Bluetooth",
    icon: (props: any) => <Icon name="heart" {...props} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "thermometer",
    name: "Smart Thermometer",
    type: "Temperature",
    brand: "Kinsa",
    model: "QuickCare",
    description: "Instant digital thermometer with app connectivity",
    icon: (props: any) => <Icon name="thermostat" {...props} />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "ecg-monitor",
    name: "ECG Monitor",
    type: "Cardiac",
    brand: "AliveCor",
    model: "KardiaMobile 6L",
    description: "6-lead ECG recorder for comprehensive heart monitoring",
    icon: (props: any) => <Icon name="zap" {...props} />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
]
