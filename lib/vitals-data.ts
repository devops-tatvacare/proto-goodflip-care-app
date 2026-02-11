// Vitals categories and their specific metrics
// Clean implementation for circle-based vitals selection

export interface VitalsMetric {
  id: string
  name: string
  unit: string
  currentValue: string
  goal?: string
  range?: string
  status: 'normal' | 'high' | 'low' | 'critical'
}

export interface VitalsCategory {
  id: string
  title: string
  materialIcon: string
  color: string
  bgColor: string
  description: string
  metrics: VitalsMetric[]
  chartData: {
    daily: Array<{ timestamp: string; value: number; label: string }>
    weekly: Array<{ timestamp: string; value: number; label: string }>
    monthly: Array<{ timestamp: string; value: number; label: string }>
    yearly: Array<{ timestamp: string; value: number; label: string }>
  }
}

// Generate sample chart data
const generateChartData = (baseValue: number, variance: number) => ({
  daily: [
    { timestamp: '00', value: baseValue + Math.random() * variance - variance/2, label: '00' },
    { timestamp: '06', value: baseValue + Math.random() * variance - variance/2, label: '06' },
    { timestamp: '12', value: baseValue + Math.random() * variance - variance/2, label: '12' },
    { timestamp: '18', value: baseValue + Math.random() * variance - variance/2, label: '18' },
  ],
  weekly: [
    { timestamp: 'Mon', value: baseValue + Math.random() * variance - variance/2, label: 'Mon' },
    { timestamp: 'Tue', value: baseValue + Math.random() * variance - variance/2, label: 'Tue' },
    { timestamp: 'Wed', value: baseValue + Math.random() * variance - variance/2, label: 'Wed' },
    { timestamp: 'Thu', value: baseValue + Math.random() * variance - variance/2, label: 'Thu' },
    { timestamp: 'Fri', value: baseValue + Math.random() * variance - variance/2, label: 'Fri' },
    { timestamp: 'Sat', value: baseValue + Math.random() * variance - variance/2, label: 'Sat' },
    { timestamp: 'Sun', value: baseValue + Math.random() * variance - variance/2, label: 'Sun' },
  ],
  monthly: Array.from({ length: 31 }, (_, i) => ({
    timestamp: (i + 1).toString(),
    value: baseValue + Math.random() * variance - variance/2,
    label: (i + 1) % 5 === 1 ? (i + 1).toString() : ''
  })),
  yearly: [
    { timestamp: 'Jan', value: baseValue + Math.random() * variance - variance/2, label: 'Jan' },
    { timestamp: 'Feb', value: baseValue + Math.random() * variance - variance/2, label: 'Feb' },
    { timestamp: 'Mar', value: baseValue + Math.random() * variance - variance/2, label: 'Mar' },
    { timestamp: 'Apr', value: baseValue + Math.random() * variance - variance/2, label: 'Apr' },
    { timestamp: 'May', value: baseValue + Math.random() * variance - variance/2, label: 'May' },
    { timestamp: 'Jun', value: baseValue + Math.random() * variance - variance/2, label: 'Jun' },
    { timestamp: 'Jul', value: baseValue + Math.random() * variance - variance/2, label: 'Jul' },
    { timestamp: 'Aug', value: baseValue + Math.random() * variance - variance/2, label: 'Aug' },
    { timestamp: 'Sep', value: baseValue + Math.random() * variance - variance/2, label: 'Sep' },
    { timestamp: 'Oct', value: baseValue + Math.random() * variance - variance/2, label: 'Oct' },
    { timestamp: 'Nov', value: baseValue + Math.random() * variance - variance/2, label: 'Nov' },
    { timestamp: 'Dec', value: baseValue + Math.random() * variance - variance/2, label: 'Dec' },
  ]
})

export const vitalsCategories: VitalsCategory[] = [
  {
    id: 'lab-results',
    title: 'Lab Results',
    materialIcon: 'science',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Review lab test results to monitor various health aspects',
    metrics: [
      { 
        id: 'glucose', 
        name: 'Glucose', 
        unit: 'mg/dL', 
        currentValue: '95', 
        range: '70-99', 
        status: 'normal' 
      },
      { 
        id: 'cholesterol', 
        name: 'Total Cholesterol', 
        unit: 'mg/dL', 
        currentValue: '180', 
        range: '<200', 
        status: 'normal' 
      },
      { 
        id: 'hdl', 
        name: 'HDL Cholesterol', 
        unit: 'mg/dL', 
        currentValue: '55', 
        range: '>40', 
        status: 'normal' 
      },
      { 
        id: 'ldl', 
        name: 'LDL Cholesterol', 
        unit: 'mg/dL', 
        currentValue: '110', 
        range: '<100', 
        status: 'high' 
      },
      { 
        id: 'triglycerides', 
        name: 'Triglycerides', 
        unit: 'mg/dL', 
        currentValue: '120', 
        range: '<150', 
        status: 'normal' 
      },
    ],
    chartData: generateChartData(95, 20)
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular',
    materialIcon: 'favorite',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Monitor key metrics for heart and blood circulation',
    metrics: [
      { 
        id: 'heart-rate', 
        name: 'Resting Heart Rate', 
        unit: 'bpm', 
        currentValue: '72', 
        range: '60-100', 
        status: 'normal' 
      },
      { 
        id: 'blood-pressure-sys', 
        name: 'Systolic BP', 
        unit: 'mmHg', 
        currentValue: '120', 
        range: '<130', 
        status: 'normal' 
      },
      { 
        id: 'blood-pressure-dia', 
        name: 'Diastolic BP', 
        unit: 'mmHg', 
        currentValue: '80', 
        range: '<85', 
        status: 'normal' 
      },
      { 
        id: 'hrv', 
        name: 'Heart Rate Variability', 
        unit: 'ms', 
        currentValue: '45', 
        range: '30-60', 
        status: 'normal' 
      },
    ],
    chartData: generateChartData(72, 15)
  },
  {
    id: 'body-composition',
    title: 'Body Composition',
    materialIcon: 'monitor_weight',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Understand your body\'s fat, muscle, and water levels',
    metrics: [
      { 
        id: 'weight', 
        name: 'Weight', 
        unit: 'kg', 
        currentValue: '72.1', 
        goal: '72.0', 
        status: 'normal' 
      },
      { 
        id: 'bmi', 
        name: 'BMI', 
        unit: 'kg/m²', 
        currentValue: '22.4', 
        range: '18.5-24.9', 
        status: 'normal' 
      },
      { 
        id: 'body-fat', 
        name: 'Body Fat %', 
        unit: '%', 
        currentValue: '18.5', 
        range: '10-25', 
        status: 'normal' 
      },
      { 
        id: 'muscle-mass', 
        name: 'Muscle Mass', 
        unit: 'kg', 
        currentValue: '35.2', 
        range: '30-40', 
        status: 'normal' 
      },
      { 
        id: 'water-percentage', 
        name: 'Body Water %', 
        unit: '%', 
        currentValue: '62', 
        range: '50-65', 
        status: 'normal' 
      },
    ],
    chartData: generateChartData(72, 3)
  },
  {
    id: 'cgm-analytics',
    title: 'CGM Analytics',
    materialIcon: 'glucose',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Continuous glucose monitoring insights and trends analysis',
    metrics: [
      { 
        id: 'avg-glucose', 
        name: 'Average Glucose', 
        unit: 'mg/dL', 
        currentValue: '110', 
        range: '80-130', 
        status: 'normal' 
      },
      { 
        id: 'time-in-range', 
        name: 'Time in Range', 
        unit: '%', 
        currentValue: '75', 
        goal: '>70', 
        status: 'normal' 
      },
      { 
        id: 'glucose-variability', 
        name: 'Glucose Variability', 
        unit: 'CV%', 
        currentValue: '28', 
        range: '<36', 
        status: 'normal' 
      },
      { 
        id: 'dawn-phenomenon', 
        name: 'Dawn Phenomenon', 
        unit: 'mg/dL', 
        currentValue: '+15', 
        range: '<20', 
        status: 'normal' 
      },
    ],
    chartData: generateChartData(110, 25)
  }
]