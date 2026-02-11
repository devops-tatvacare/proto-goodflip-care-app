// Sample data for all health metrics
// Organized by metric type and time period

export interface ChartDataPoint {
  timestamp: string
  value: number
  label?: string
  date?: Date
}

export interface MetricData {
  daily: ChartDataPoint[]
  weekly: ChartDataPoint[]
  monthly: ChartDataPoint[]
  yearly?: ChartDataPoint[]
}

// Generate realistic data with patterns
const generateDailyData = (baseValue: number, variance: number): ChartDataPoint[] => {
  const hours = ['00', '03', '06', '09', '12', '15', '18', '21']
  return hours.map(hour => ({
    timestamp: hour,
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
    label: hour
  }))
}

const generateWeeklyData = (baseValue: number, variance: number): ChartDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    timestamp: day,
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
    label: day
  }))
}

const generateMonthlyData = (baseValue: number, variance: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  for (let day = 1; day <= 31; day++) {
    // Use sine wave for more predictable but varied data
    const variation = Math.sin((day / 31) * 2 * Math.PI) * variance * 0.5
    const randomFactor = (Math.random() - 0.5) * variance * 0.3
    data.push({
      timestamp: day.toString(),
      value: Math.max(0, baseValue + variation + randomFactor),
      label: day % 5 === 1 ? day.toString() : '' // Show labels every 5th day for readability
    })
  }
  return data
}

const generateYearlyData = (baseValue: number, variance: number): ChartDataPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    timestamp: month,
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
    label: month
  }))
}

// Steps data - similar to Apple Health
export const stepsData: MetricData = {
  daily: [
    { timestamp: '00', value: 0, label: '00' },
    { timestamp: '03', value: 45, label: '03' },
    { timestamp: '06', value: 120, label: '06' },
    { timestamp: '09', value: 340, label: '09' },
    { timestamp: '12', value: 680, label: '12' },
    { timestamp: '15', value: 420, label: '15' },
    { timestamp: '18', value: 280, label: '18' },
    { timestamp: '21', value: 140, label: '21' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 5240, label: 'Mon' },
    { timestamp: 'Tue', value: 3850, label: 'Tue' },
    { timestamp: 'Wed', value: 6120, label: 'Wed' },
    { timestamp: 'Thu', value: 5890, label: 'Thu' },
    { timestamp: 'Fri', value: 5670, label: 'Fri' },
    { timestamp: 'Sat', value: 2840, label: 'Sat' },
    { timestamp: 'Sun', value: 3200, label: 'Sun' }
  ],
  monthly: generateMonthlyData(5000, 3000),
  yearly: generateYearlyData(140000, 50000)
}

// Water intake data (in mL)
export const waterData: MetricData = {
  daily: [
    { timestamp: '00', value: 0, label: '00' },
    { timestamp: '03', value: 0, label: '03' },
    { timestamp: '06', value: 250, label: '06' },
    { timestamp: '09', value: 500, label: '09' },
    { timestamp: '12', value: 300, label: '12' },
    { timestamp: '15', value: 400, label: '15' },
    { timestamp: '18', value: 350, label: '18' },
    { timestamp: '21', value: 200, label: '21' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 2100, label: 'Mon' },
    { timestamp: 'Tue', value: 1850, label: 'Tue' },
    { timestamp: 'Wed', value: 2400, label: 'Wed' },
    { timestamp: 'Thu', value: 2200, label: 'Thu' },
    { timestamp: 'Fri', value: 1950, label: 'Fri' },
    { timestamp: 'Sat', value: 1700, label: 'Sat' },
    { timestamp: 'Sun', value: 2000, label: 'Sun' }
  ],
  monthly: generateMonthlyData(2000, 800),
  yearly: generateYearlyData(60000, 15000)
}

// Sleep data (in hours)
export const sleepData: MetricData = {
  daily: [
    { timestamp: '22', value: 1.2, label: '22' },
    { timestamp: '23', value: 0.8, label: '23' },
    { timestamp: '00', value: 1.0, label: '00' },
    { timestamp: '01', value: 1.0, label: '01' },
    { timestamp: '02', value: 1.0, label: '02' },
    { timestamp: '03', value: 1.0, label: '03' },
    { timestamp: '04', value: 1.0, label: '04' },
    { timestamp: '05', value: 1.0, label: '05' },
    { timestamp: '06', value: 0.5, label: '06' },
    { timestamp: '07', value: 0, label: '07' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 7.2, label: 'Mon' },
    { timestamp: 'Tue', value: 6.8, label: 'Tue' },
    { timestamp: 'Wed', value: 8.1, label: 'Wed' },
    { timestamp: 'Thu', value: 7.5, label: 'Thu' },
    { timestamp: 'Fri', value: 6.2, label: 'Fri' },
    { timestamp: 'Sat', value: 8.5, label: 'Sat' },
    { timestamp: 'Sun', value: 7.9, label: 'Sun' }
  ],
  monthly: generateMonthlyData(7.5, 2),
  yearly: generateYearlyData(7.3, 1)
}

// Weight data (in kg)
export const weightData: MetricData = {
  daily: [
    { timestamp: '06', value: 72.1, label: '06' },
    { timestamp: '18', value: 72.3, label: '18' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 72.2, label: 'Mon' },
    { timestamp: 'Tue', value: 72.0, label: 'Tue' },
    { timestamp: 'Wed', value: 72.1, label: 'Wed' },
    { timestamp: 'Thu', value: 71.9, label: 'Thu' },
    { timestamp: 'Fri', value: 72.3, label: 'Fri' },
    { timestamp: 'Sat', value: 72.5, label: 'Sat' },
    { timestamp: 'Sun', value: 72.2, label: 'Sun' }
  ],
  monthly: generateMonthlyData(72, 1.5),
  yearly: generateYearlyData(72, 3)
}

// Heart Rate data (BPM)
export const heartRateData: MetricData = {
  daily: [
    { timestamp: '00', value: 58, label: '00' },
    { timestamp: '03', value: 55, label: '03' },
    { timestamp: '06', value: 62, label: '06' },
    { timestamp: '09', value: 78, label: '09' },
    { timestamp: '12', value: 85, label: '12' },
    { timestamp: '15', value: 95, label: '15' },
    { timestamp: '18', value: 72, label: '18' },
    { timestamp: '21', value: 68, label: '21' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 74, label: 'Mon' },
    { timestamp: 'Tue', value: 72, label: 'Tue' },
    { timestamp: 'Wed', value: 78, label: 'Wed' },
    { timestamp: 'Thu', value: 76, label: 'Thu' },
    { timestamp: 'Fri', value: 75, label: 'Fri' },
    { timestamp: 'Sat', value: 70, label: 'Sat' },
    { timestamp: 'Sun', value: 69, label: 'Sun' }
  ],
  monthly: generateMonthlyData(74, 10),
  yearly: generateYearlyData(74, 8)
}

// Blood Pressure data (systolic)
export const bloodPressureData: MetricData = {
  daily: [
    { timestamp: '06', value: 118, label: '06' },
    { timestamp: '12', value: 122, label: '12' },
    { timestamp: '18', value: 120, label: '18' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 120, label: 'Mon' },
    { timestamp: 'Tue', value: 118, label: 'Tue' },
    { timestamp: 'Wed', value: 122, label: 'Wed' },
    { timestamp: 'Thu', value: 119, label: 'Thu' },
    { timestamp: 'Fri', value: 121, label: 'Fri' },
    { timestamp: 'Sat', value: 117, label: 'Sat' },
    { timestamp: 'Sun', value: 116, label: 'Sun' }
  ],
  monthly: generateMonthlyData(119, 8),
  yearly: generateYearlyData(119, 6)
}

// Diet/Calories data
export const dietData: MetricData = {
  daily: [
    { timestamp: '06', value: 320, label: '06' }, // Breakfast
    { timestamp: '12', value: 480, label: '12' }, // Lunch
    { timestamp: '15', value: 150, label: '15' }, // Snack
    { timestamp: '19', value: 520, label: '19' }, // Dinner
    { timestamp: '21', value: 80, label: '21' }   // Late snack
  ],
  weekly: [
    { timestamp: 'Mon', value: 1850, label: 'Mon' },
    { timestamp: 'Tue', value: 1920, label: 'Tue' },
    { timestamp: 'Wed', value: 1780, label: 'Wed' },
    { timestamp: 'Thu', value: 2100, label: 'Thu' },
    { timestamp: 'Fri', value: 2200, label: 'Fri' },
    { timestamp: 'Sat', value: 2350, label: 'Sat' },
    { timestamp: 'Sun', value: 1950, label: 'Sun' }
  ],
  monthly: generateMonthlyData(2000, 500),
  yearly: generateYearlyData(730000, 100000)
}

// Medication adherence (percentage)
export const medicationData: MetricData = {
  daily: [
    { timestamp: '08', value: 100, label: '08' }, // Morning dose
    { timestamp: '20', value: 100, label: '20' }  // Evening dose
  ],
  weekly: [
    { timestamp: 'Mon', value: 100, label: 'Mon' },
    { timestamp: 'Tue', value: 100, label: 'Tue' },
    { timestamp: 'Wed', value: 50, label: 'Wed' }, // Missed evening dose
    { timestamp: 'Thu', value: 100, label: 'Thu' },
    { timestamp: 'Fri', value: 100, label: 'Fri' },
    { timestamp: 'Sat', value: 100, label: 'Sat' },
    { timestamp: 'Sun', value: 100, label: 'Sun' }
  ],
  monthly: generateMonthlyData(95, 20),
  yearly: generateYearlyData(92, 15)
}

// Fatigue levels (1-10 scale)
export const fatigueData: MetricData = {
  daily: [
    { timestamp: '06', value: 7, label: '06' },
    { timestamp: '09', value: 5, label: '09' },
    { timestamp: '12', value: 3, label: '12' },
    { timestamp: '15', value: 4, label: '15' },
    { timestamp: '18', value: 6, label: '18' },
    { timestamp: '21', value: 8, label: '21' }
  ],
  weekly: [
    { timestamp: 'Mon', value: 5.2, label: 'Mon' },
    { timestamp: 'Tue', value: 4.8, label: 'Tue' },
    { timestamp: 'Wed', value: 6.1, label: 'Wed' },
    { timestamp: 'Thu', value: 5.5, label: 'Thu' },
    { timestamp: 'Fri', value: 6.8, label: 'Fri' },
    { timestamp: 'Sat', value: 3.2, label: 'Sat' },
    { timestamp: 'Sun', value: 3.8, label: 'Sun' }
  ],
  monthly: generateMonthlyData(5, 3),
  yearly: generateYearlyData(5.2, 2)
}

// Export all data
export const metricsData = {
  steps: stepsData,
  water: waterData,
  sleep: sleepData,
  weight: weightData,
  heartRate: heartRateData,
  bloodPressure: bloodPressureData,
  diet: dietData,
  medication: medicationData,
  fatigue: fatigueData
}

export type MetricType = keyof typeof metricsData
export type TimePeriod = keyof MetricData