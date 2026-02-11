import { MetricConfig } from "@/components/insights/metric-template-view"

export const waterConfig: MetricConfig = {
  name: "Water",
  color: "var(--metric-water)",
  unit: "ml",
  currentValue: "1,600",
  goal: "2,000",
  percentage: 80,
  icon: "water_drop",
  metricType: "water",
  aiInsightPrompt: "Your water intake has been consistent this week, averaging 1,950ml daily. You're meeting 97.5% of your hydration goal. Consider increasing intake by 50ml to reach your target. Peak hydration times are after meals, which is excellent for digestion.",
  chartData: [
    { day: "Mon", value: 1850 },
    { day: "Tue", value: 2100 },
    { day: "Wed", value: 1950 },
    { day: "Thu", value: 1750 },
    { day: "Fri", value: 1600 },
    { day: "Sat", value: 2200 },
    { day: "Sun", value: 1900 }
  ],
  historyLogs: [
    {
      id: "water-2024-08-25",
      date: "2024-08-25",
      time: "20:30",
      value: "1600 ml",
      status: "Good",
      notes: "Daily total - 80% of goal",
      dataSource: "Apple Health"
    },
    {
      id: "water-2024-08-25-1",
      date: "2024-08-25",
      time: "16:45",
      value: "350 ml",
      status: "Normal",
      notes: "Afternoon hydration",
      dataSource: "Manual Entry"
    },
    {
      id: "water-2024-08-25-2",
      date: "2024-08-25",
      time: "12:15",
      value: "500 ml",
      status: "Good",
      notes: "Lunch water intake",
      dataSource: "Manual Entry"
    },
    {
      id: "water-2024-08-25-3",
      date: "2024-08-25",
      time: "08:00",
      value: "450 ml",
      status: "Good",
      notes: "Morning hydration",
      dataSource: "Apple Health"
    }
  ],
  dataSources: [
    {
      name: "Apple Health",
      status: "connected",
      description: "Syncing water intake data automatically",
      lastSync: "2 minutes ago"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged water intake entries",
      entries: "5 entries"
    },
    {
      name: "Smart Water Bottle",
      status: "not_connected",
      description: "Connect your smart bottle for automatic tracking"
    }
  ]
}

export const sleepConfig: MetricConfig = {
  name: "Sleep",
  color: "var(--metric-sleep)",
  unit: "hrs",
  currentValue: "7.5",
  goal: "8",
  percentage: 94,
  icon: "bedtime",
  metricType: "sleep",
  aiInsightPrompt: "Your sleep pattern shows consistency with an average of 7.5 hours per night. You're achieving 94% of your sleep goal. Your best sleep quality occurs between 11 PM - 6:30 AM. Consider maintaining this schedule for optimal rest.",
  chartData: [
    { day: "Mon", value: 7.2 },
    { day: "Tue", value: 8.1 },
    { day: "Wed", value: 7.5 },
    { day: "Thu", value: 7.8 },
    { day: "Fri", value: 7.5 },
    { day: "Sat", value: 8.5 },
    { day: "Sun", value: 7.3 }
  ],
  historyLogs: [
    {
      id: "sleep-2024-08-25",
      date: "2024-08-25",
      time: "07:30",
      value: "7.5 hrs",
      status: "Good",
      notes: "Sleep quality: 85%, Deep sleep: 1.8 hrs",
      dataSource: "Apple Health"
    },
    {
      id: "sleep-2024-08-24",
      date: "2024-08-24",
      time: "08:00",
      value: "8.5 hrs",
      status: "Excellent",
      notes: "Weekend sleep, quality: 92%",
      dataSource: "Sleep Tracker"
    },
    {
      id: "sleep-2024-08-23",
      date: "2024-08-23",
      time: "07:15",
      value: "7.8 hrs",
      status: "Good",
      notes: "REM sleep: 2.1 hrs",
      dataSource: "Apple Health"
    }
  ],
  dataSources: [
    {
      name: "Apple Health",
      status: "connected",
      description: "Tracking sleep stages and duration",
      lastSync: "This morning"
    },
    {
      name: "Sleep Tracker",
      status: "connected",
      description: "Monitoring sleep quality and patterns",
      lastSync: "6 hours ago"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged sleep data",
      entries: "7 entries this week"
    }
  ]
}

export const stepsConfig: MetricConfig = {
  name: "Steps",
  color: "var(--metric-activity)",
  unit: "steps",
  currentValue: "8,432",
  goal: "10,000",
  percentage: 84,
  icon: "footprint",
  metricType: "steps",
  aiInsightPrompt: "Great progress! You've averaged 8,432 steps today, reaching 84% of your daily goal. Your most active period was between 7-9 AM. Consider a short evening walk to reach your 10,000 step target.",
  chartData: [
    { day: "Mon", value: 9250 },
    { day: "Tue", value: 7890 },
    { day: "Wed", value: 10234 },
    { day: "Thu", value: 8567 },
    { day: "Fri", value: 8432 },
    { day: "Sat", value: 11450 },
    { day: "Sun", value: 6780 }
  ],
  historyLogs: [
    {
      id: "steps-2024-08-25",
      date: "2024-08-25",
      time: "18:30",
      value: "8,432 steps",
      status: "Good",
      notes: "84% of daily goal, active minutes: 45",
      dataSource: "Apple Health"
    },
    {
      id: "steps-2024-08-24",
      date: "2024-08-24",
      time: "21:00",
      value: "11,450 steps",
      status: "Excellent",
      notes: "Goal exceeded! Weekend hike included",
      dataSource: "Apple Health"
    },
    {
      id: "steps-2024-08-23",
      date: "2024-08-23",
      time: "20:45",
      value: "8,567 steps",
      status: "Good",
      notes: "Evening walk added 2,000 steps",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Apple Health",
      status: "connected",
      description: "Tracking steps from iPhone and Apple Watch",
      lastSync: "Just now"
    },
    {
      name: "Fitbit",
      status: "not_connected",
      description: "Connect your Fitbit for enhanced tracking"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged step counts",
      entries: "2 entries today"
    }
  ]
}

export const fatigueConfig: MetricConfig = {
  name: "Fatigue",
  color: "var(--metric-blood-secondary)",
  unit: "level",
  currentValue: "3",
  goal: "< 5",
  percentage: 40, // Lower is better for fatigue
  icon: "energy_savings_leaf",
  metricType: "fatigue",
  aiInsightPrompt: "Your fatigue level is well-managed at 3/10. This is below your threshold of 5, indicating good energy levels. Patterns show lower fatigue after morning exercise and proper hydration. Maintain your current routine.",
  chartData: [
    { day: "Mon", value: 4 },
    { day: "Tue", value: 3 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 5 },
    { day: "Fri", value: 3 },
    { day: "Sat", value: 2 },
    { day: "Sun", value: 3 }
  ],
  historyLogs: [
    {
      id: "fatigue-2024-08-25",
      date: "2024-08-25",
      time: "14:00",
      value: "3 level",
      status: "Low",
      notes: "Afternoon check-in, energy good",
      dataSource: "Daily Check-ins"
    },
    {
      id: "fatigue-2024-08-25-1",
      date: "2024-08-25",
      time: "08:30",
      value: "2 level",
      status: "Very Low",
      notes: "Morning energy levels high",
      dataSource: "Daily Check-ins"
    },
    {
      id: "fatigue-2024-08-24",
      date: "2024-08-24",
      time: "16:30",
      value: "5 level",
      status: "Moderate",
      notes: "End of work week fatigue",
      dataSource: "Wearable Data"
    }
  ],
  dataSources: [
    {
      name: "Daily Check-ins",
      status: "active",
      description: "Self-reported fatigue assessments",
      entries: "2 entries today"
    },
    {
      name: "Wearable Data",
      status: "connected",
      description: "Heart rate variability and activity patterns",
      lastSync: "1 hour ago"
    },
    {
      name: "Sleep Quality",
      status: "connected",
      description: "Correlated with sleep tracking data",
      lastSync: "This morning"
    }
  ]
}

export const dietConfig: MetricConfig = {
  name: "Diet",
  color: "var(--metric-nutrition-diet)",
  unit: "kcal",
  currentValue: "1,950",
  goal: "2,000",
  percentage: 97,
  icon: "restaurant",
  metricType: "diet",
  aiInsightPrompt: "Your nutrition intake is excellent at 1,950 calories daily, achieving 97% of your goal. You're maintaining good balance across macronutrients with consistent meal timing. Consider adding 50 more calories from healthy fats to reach your target.",
  chartData: [
    { day: "Mon", value: 1850 },
    { day: "Tue", value: 2100 },
    { day: "Wed", value: 1980 },
    { day: "Thu", value: 2050 },
    { day: "Fri", value: 1950 },
    { day: "Sat", value: 2200 },
    { day: "Sun", value: 1900 }
  ],
  historyLogs: [
    {
      id: "diet-2024-08-25",
      date: "2024-08-25",
      time: "20:00",
      value: "1,950 kcal",
      status: "On Target",
      notes: "Daily total: Protein 130g, Carbs 220g, Fat 65g",
      dataSource: "Manual Entry"
    },
    {
      id: "diet-2024-08-25-1",
      date: "2024-08-25",
      time: "18:30",
      value: "650 kcal",
      status: "Normal",
      notes: "Dinner: Grilled salmon with vegetables",
      dataSource: "Photo Recognition"
    },
    {
      id: "diet-2024-08-25-2",
      date: "2024-08-25",
      time: "12:45",
      value: "580 kcal",
      status: "Normal",
      notes: "Lunch: Chicken salad bowl",
      dataSource: "Manual Entry"
    },
    {
      id: "diet-2024-08-25-3",
      date: "2024-08-25",
      time: "08:00",
      value: "420 kcal",
      status: "Normal",
      notes: "Breakfast: Oatmeal with berries",
      dataSource: "Photo Recognition"
    }
  ],
  dataSources: [
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged meals and nutrition data",
      entries: "8 meals logged today"
    },
    {
      name: "Photo Recognition",
      status: "connected",
      description: "AI-powered food scanning and analysis",
      lastSync: "30 minutes ago"
    },
    {
      name: "MyFitnessPal",
      status: "not_connected",
      description: "Connect to sync nutrition data automatically"
    }
  ]
}

// Nutrition Metrics for Diet
export const fatConfig: MetricConfig = {
  name: "Fat",
  color: "var(--metric-nutrition-fat)",
  unit: "g",
  currentValue: "65",
  goal: "70",
  percentage: 93,
  icon: "restaurant",
  metricType: "nutrition",
  aiInsightPrompt: "Your fat intake is 65g, representing 30% of your daily calories. You're close to your goal with a good balance of healthy fats from sources like avocados, nuts, and olive oil.",
  chartData: [
    { day: "Mon", value: 62 },
    { day: "Tue", value: 68 },
    { day: "Wed", value: 64 },
    { day: "Thu", value: 71 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 73 },
    { day: "Sun", value: 63 }
  ],
  historyLogs: [
    {
      id: "fat-2024-08-25",
      date: "2024-08-25",
      time: "20:00",
      value: "65 g",
      status: "Good",
      notes: "Daily total: Saturated 18g, Unsaturated 47g",
      dataSource: "Manual Entry"
    },
    {
      id: "fat-2024-08-25-1",
      date: "2024-08-25",
      time: "18:30",
      value: "22 g",
      status: "Normal",
      notes: "Dinner: Salmon (healthy omega-3)",
      dataSource: "Photo Recognition"
    },
    {
      id: "fat-2024-08-25-2",
      date: "2024-08-25",
      time: "12:45",
      value: "18 g",
      status: "Normal",
      notes: "Lunch: Avocado and olive oil",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Manual Entry",
      status: "active",
      description: "Tracked fat intake from meals",
      entries: "8 meals logged today"
    },
    {
      name: "Photo Recognition",
      status: "connected",
      description: "AI analysis of fat content in meals",
      lastSync: "30 minutes ago"
    }
  ]
}

export const proteinConfig: MetricConfig = {
  name: "Protein",
  color: "var(--metric-blood-primary)",
  unit: "g",
  currentValue: "120",
  goal: "130",
  percentage: 92,
  icon: "restaurant",
  metricType: "nutrition",
  aiInsightPrompt: "Your protein intake is 120g, representing 25% of your daily calories. Excellent for muscle maintenance and satiety. Consider adding 10g more from lean sources.",
  chartData: [
    { day: "Mon", value: 115 },
    { day: "Tue", value: 128 },
    { day: "Wed", value: 122 },
    { day: "Thu", value: 135 },
    { day: "Fri", value: 120 },
    { day: "Sat", value: 140 },
    { day: "Sun", value: 118 }
  ],
  historyLogs: [
    {
      id: "protein-2024-08-25",
      date: "2024-08-25",
      time: "20:00",
      value: "120 g",
      status: "Good",
      notes: "Daily total: Complete proteins from varied sources",
      dataSource: "Manual Entry"
    },
    {
      id: "protein-2024-08-25-1",
      date: "2024-08-25",
      time: "18:30",
      value: "42 g",
      status: "Excellent",
      notes: "Dinner: Grilled salmon (6 oz)",
      dataSource: "Photo Recognition"
    },
    {
      id: "protein-2024-08-25-2",
      date: "2024-08-25",
      time: "12:45",
      value: "35 g",
      status: "Good",
      notes: "Lunch: Chicken breast salad",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Manual Entry",
      status: "active",
      description: "Tracked protein from various sources",
      entries: "8 meals logged today"
    },
    {
      name: "Photo Recognition",
      status: "connected",
      description: "AI analysis of protein content",
      lastSync: "30 minutes ago"
    }
  ]
}

export const carbohydratesConfig: MetricConfig = {
  name: "Carbohydrates",
  color: "var(--metric-nutrition-carbs)",
  unit: "g",
  currentValue: "220",
  goal: "225",
  percentage: 98,
  icon: "restaurant",
  metricType: "nutrition",
  aiInsightPrompt: "Your carbohydrate intake is 220g, representing 45% of your calories. Good balance of complex carbs providing sustained energy throughout the day.",
  chartData: [
    { day: "Mon", value: 210 },
    { day: "Tue", value: 235 },
    { day: "Wed", value: 215 },
    { day: "Thu", value: 228 },
    { day: "Fri", value: 220 },
    { day: "Sat", value: 245 },
    { day: "Sun", value: 205 }
  ],
  historyLogs: [
    {
      id: "carbs-2024-08-25",
      date: "2024-08-25",
      time: "20:00",
      value: "220 g",
      status: "On Target",
      notes: "Daily total: Fiber 28g, Sugars 45g",
      dataSource: "Manual Entry"
    },
    {
      id: "carbs-2024-08-25-1",
      date: "2024-08-25",
      time: "18:30",
      value: "65 g",
      status: "Normal",
      notes: "Dinner: Brown rice and vegetables",
      dataSource: "Photo Recognition"
    },
    {
      id: "carbs-2024-08-25-2",
      date: "2024-08-25",
      time: "12:45",
      value: "72 g",
      status: "Normal",
      notes: "Lunch: Whole grain pasta salad",
      dataSource: "Manual Entry"
    },
    {
      id: "carbs-2024-08-25-3",
      date: "2024-08-25",
      time: "08:00",
      value: "55 g",
      status: "Normal",
      notes: "Breakfast: Oatmeal with fruits",
      dataSource: "Photo Recognition"
    }
  ],
  dataSources: [
    {
      name: "Manual Entry",
      status: "active",
      description: "Tracked carbs from meals and snacks",
      entries: "8 meals logged today"
    },
    {
      name: "Photo Recognition",
      status: "connected",
      description: "AI analysis of carbohydrate content",
      lastSync: "30 minutes ago"
    }
  ]
}

// Additional metric configs
export const heartRateConfig: MetricConfig = {
  name: "Heart Rate",
  color: "var(--metric-blood-primary)",
  unit: "bpm",
  currentValue: "72",
  goal: "< 100",
  percentage: 72,
  icon: "favorite",
  metricType: "heartRate",
  aiInsightPrompt: "Your resting heart rate of 72 bpm indicates good cardiovascular health. Your heart rate patterns show healthy responses to activity and rest cycles. Continue your current fitness routine to maintain this healthy range.",
  chartData: [
    { day: "Mon", value: 70 },
    { day: "Tue", value: 73 },
    { day: "Wed", value: 71 },
    { day: "Thu", value: 74 },
    { day: "Fri", value: 72 },
    { day: "Sat", value: 69 },
    { day: "Sun", value: 72 }
  ],
  historyLogs: [
    {
      id: "hr-2024-08-25",
      date: "2024-08-25",
      time: "07:30",
      value: "72 bpm",
      status: "Normal",
      notes: "Resting heart rate upon waking",
      dataSource: "Apple Watch"
    },
    {
      id: "hr-2024-08-25",
      date: "2024-08-25",
      time: "14:15",
      value: "78 bpm",
      status: "Normal",
      notes: "Post-lunch reading",
      dataSource: "Apple Watch"
    },
    {
      id: "hr-2024-08-24",
      date: "2024-08-24",
      time: "19:45",
      value: "85 bpm",
      status: "Elevated",
      notes: "After 30-minute walk",
      dataSource: "Apple Watch"
    }
  ],
  dataSources: [
    {
      name: "Apple Watch",
      status: "connected",
      description: "Continuous heart rate monitoring",
      lastSync: "Just now"
    },
    {
      name: "Chest Strap Monitor",
      status: "not_connected",
      description: "Connect for workout heart rate tracking"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually recorded heart rate readings",
      entries: "3 entries today"
    }
  ]
}

export const bloodPressureConfig: MetricConfig = {
  name: "Blood Pressure",
  color: "var(--metric-blood-pressure)",
  unit: "mmHg",
  currentValue: "120/80",
  goal: "< 130/85",
  percentage: 85,
  icon: "monitor_heart",
  metricType: "bloodPressure",
  aiInsightPrompt: "Your blood pressure readings of 120/80 mmHg are in the normal healthy range. The consistency in your readings indicates good cardiovascular health. Continue monitoring regularly and maintain your current lifestyle habits.",
  chartData: [
    { day: "Mon", value: 118 },
    { day: "Tue", value: 122 },
    { day: "Wed", value: 119 },
    { day: "Thu", value: 121 },
    { day: "Fri", value: 120 },
    { day: "Sat", value: 117 },
    { day: "Sun", value: 120 }
  ],
  historyLogs: [
    {
      id: "bp-2024-08-25",
      date: "2024-08-25",
      time: "08:00",
      value: "120/80 mmHg",
      status: "Normal",
      notes: "Morning blood pressure check",
      dataSource: "Blood Pressure Monitor"
    },
    {
      id: "bp-2024-08-24",
      date: "2024-08-24",
      time: "20:30",
      value: "117/78 mmHg",
      status: "Normal",
      notes: "Evening reading before bed",
      dataSource: "Blood Pressure Monitor"
    },
    {
      id: "bp-2024-08-23",
      date: "2024-08-23",
      time: "09:15",
      value: "122/82 mmHg",
      status: "Normal",
      notes: "Post-exercise measurement",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Blood Pressure Monitor",
      status: "connected",
      description: "Automatic readings from connected device",
      lastSync: "2 hours ago"
    },
    {
      name: "Apple Health",
      status: "connected",
      description: "Syncing blood pressure data",
      lastSync: "2 hours ago"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged blood pressure readings",
      entries: "1 entry today"
    }
  ]
}

export const weightConfig: MetricConfig = {
  name: "Weight",
  color: "var(--metric-body-composition)",
  unit: "kg",
  currentValue: "72.1",
  goal: "72.0",
  percentage: 100,
  icon: "scale",
  metricType: "weight",
  aiInsightPrompt: "Your weight is stable at 72.1 kg, very close to your goal of 72.0 kg. The minor daily fluctuations are normal and within healthy ranges. Continue your current diet and exercise routine to maintain this healthy weight.",
  chartData: [
    { day: "Mon", value: 72.3 },
    { day: "Tue", value: 71.9 },
    { day: "Wed", value: 72.2 },
    { day: "Thu", value: 72.0 },
    { day: "Fri", value: 72.1 },
    { day: "Sat", value: 71.8 },
    { day: "Sun", value: 72.1 }
  ],
  historyLogs: [
    {
      id: "weight-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "72.1 kg",
      status: "On Target",
      notes: "Morning weigh-in after bathroom",
      dataSource: "Smart Scale"
    },
    {
      id: "weight-2024-08-24",
      date: "2024-08-24",
      time: "07:05",
      value: "71.8 kg",
      status: "On Target",
      notes: "Daily morning measurement",
      dataSource: "Smart Scale"
    },
    {
      id: "weight-2024-08-23",
      date: "2024-08-23",
      time: "07:10",
      value: "72.2 kg",
      status: "On Target",
      notes: "Weekend weigh-in",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Smart Scale",
      status: "connected",
      description: "Automatic weight tracking with body composition",
      lastSync: "This morning"
    },
    {
      name: "Apple Health",
      status: "connected",
      description: "Syncing weight and body metrics",
      lastSync: "This morning"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged weight measurements",
      entries: "1 entry today"
    }
  ]
}

export const medicationConfig: MetricConfig = {
  name: "Medication",
  color: "var(--metric-nutrition-carbs)",
  unit: "doses",
  currentValue: "14/14",
  goal: null,
  percentage: null,
  icon: "medication",
  metricType: "medication",
  aiInsightPrompt: "Excellent medication adherence! You've taken all 14 prescribed doses this week. Your consistent timing helps maintain optimal therapeutic levels. Continue this routine for the best health outcomes.",
  chartData: [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 2 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 2 },
    { day: "Fri", value: 2 },
    { day: "Sat", value: 2 },
    { day: "Sun", value: 2 }
  ],
  historyLogs: [
    {
      id: "med-2024-08-25",
      date: "2024-08-25",
      time: "20:00",
      value: "Evening dose",
      status: "Taken",
      notes: "Metformin 500mg - after dinner",
      dataSource: "Smart Pill Dispenser"
    },
    {
      id: "med-2024-08-25-1",
      date: "2024-08-25",
      time: "08:00",
      value: "Morning dose",
      status: "Taken",
      notes: "Metformin 500mg - with breakfast",
      dataSource: "Smart Pill Dispenser"
    },
    {
      id: "med-2024-08-24",
      date: "2024-08-24",
      time: "20:15",
      value: "Evening dose",
      status: "Taken",
      notes: "Metformin 500mg - after dinner",
      dataSource: "Manual Entry"
    },
    {
      id: "med-2024-08-24-1",
      date: "2024-08-24",
      time: "08:30",
      value: "Morning dose",
      status: "Taken",
      notes: "Metformin 500mg - with breakfast",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Smart Pill Dispenser",
      status: "connected",
      description: "Automated medication tracking and reminders",
      lastSync: "30 minutes ago"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually logged medication intake",
      entries: "2 doses logged today"
    },
    {
      name: "Pharmacy Integration",
      status: "not_connected",
      description: "Connect to sync prescription refills and schedules"
    }
  ]
}

// Vitals category configurations
export const bloodPanelConfig: MetricConfig = {
  name: "Blood Panel",
  color: "var(--metric-lab-panel)",
  unit: "results",
  currentValue: "Normal",
  goal: "Normal",
  percentage: 100,
  icon: "science",
  metricType: "labs",
  aiInsightPrompt: "Your latest blood panel shows all markers within normal ranges. Hemoglobin levels are optimal, cholesterol is well-controlled, and liver function tests are excellent. Continue your current health routine for sustained wellness.",
  chartData: [
    { day: "3 months ago", value: 95 },
    { day: "2 months ago", value: 98 },
    { day: "1 month ago", value: 97 },
    { day: "3 weeks ago", value: 100 },
    { day: "2 weeks ago", value: 100 },
    { day: "1 week ago", value: 100 },
    { day: "Today", value: 100 }
  ],
  historyLogs: [
    {
      id: "bloodpanel-2024-08-25",
      date: "2024-08-25",
      time: "09:00",
      value: "All Normal",
      status: "Normal",
      notes: "Comprehensive metabolic panel - all values within range",
      dataSource: "Lab Results"
    },
    {
      id: "bloodpanel-2024-08-11",
      date: "2024-08-11",
      time: "08:30",
      value: "All Normal",
      status: "Normal",
      notes: "Hemoglobin: 14.2 g/dL, Glucose: 89 mg/dL, Creatinine: 0.9 mg/dL",
      dataSource: "Lab Results"
    },
    {
      id: "bloodpanel-2024-07-28",
      date: "2024-07-28",
      time: "10:15",
      value: "All Normal",
      status: "Normal",
      notes: "Quarterly comprehensive panel",
      dataSource: "Manual Entry"
    }
  ],
  dataSources: [
    {
      name: "Lab Results",
      status: "connected",
      description: "Direct integration with lab systems",
      lastSync: "3 days ago"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Manually entered lab results",
      entries: "5 results this month"
    }
  ]
}

export const cholesterolConfig: MetricConfig = {
  name: "Cholesterol",
  color: "var(--metric-blood-primary)",
  unit: "mg/dL",
  currentValue: "185",
  goal: "< 200",
  percentage: 92,
  icon: "monitor_heart",
  metricType: "labs",
  aiInsightPrompt: "Your cholesterol level of 185 mg/dL is within the healthy range. Your LDL and HDL ratios are well-balanced, indicating good cardiovascular health. Continue your current diet and exercise routine.",
  chartData: [
    { day: "6 months ago", value: 195 },
    { day: "5 months ago", value: 192 },
    { day: "4 months ago", value: 188 },
    { day: "3 months ago", value: 190 },
    { day: "2 months ago", value: 187 },
    { day: "1 month ago", value: 185 },
    { day: "Today", value: 185 }
  ],
  historyLogs: [
    {
      id: "chol-2024-08-25",
      date: "2024-08-25",
      time: "09:30",
      value: "185 mg/dL",
      status: "Normal",
      notes: "Total cholesterol: 185, LDL: 110, HDL: 62, Triglycerides: 95",
      dataSource: "Lab Results"
    },
    {
      id: "chol-2024-05-15",
      date: "2024-05-15",
      time: "08:45",
      value: "188 mg/dL",
      status: "Normal",
      notes: "Lipid panel - improving trend",
      dataSource: "Lab Results"
    },
    {
      id: "chol-2024-02-20",
      date: "2024-02-20",
      time: "09:00",
      value: "195 mg/dL",
      status: "Borderline",
      notes: "Started dietary modifications",
      dataSource: "Lab Results"
    }
  ],
  dataSources: [
    {
      name: "Lab Results",
      status: "connected",
      description: "Lipid panel results from lab",
      lastSync: "1 week ago"
    }
  ]
}

export const bodyFatConfig: MetricConfig = {
  name: "Body Fat",
  color: "var(--metric-body-composition)",
  unit: "%",
  currentValue: "15.2",
  goal: "10-18",
  percentage: 92,
  icon: "scale",
  metricType: "body",
  aiInsightPrompt: "Your body fat percentage of 15.2% is excellent and within the athletic range. This optimal level indicates superior physical conditioning and metabolic health.",
  chartData: [
    { day: "Mon", value: 15.4 },
    { day: "Tue", value: 15.1 },
    { day: "Wed", value: 15.3 },
    { day: "Thu", value: 15.0 },
    { day: "Fri", value: 15.2 },
    { day: "Sat", value: 14.9 },
    { day: "Sun", value: 15.2 }
  ],
  historyLogs: [
    {
      id: "bodyfat-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "15.2%",
      status: "Excellent",
      notes: "Body composition scan",
      dataSource: "InBody Scale"
    },
    {
      id: "bodyfat-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "15.0%",
      status: "Excellent",
      notes: "Weekly body fat measurement",
      dataSource: "InBody Scale"
    },
    {
      id: "bodyfat-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "15.4%",
      status: "Excellent",
      notes: "Professional DEXA scan",
      dataSource: "DEXA Scan"
    }
  ],
  dataSources: [
    {
      name: "InBody Scale",
      status: "connected",
      description: "Body composition analysis",
      lastSync: "This morning"
    },
    {
      name: "DEXA Scan",
      status: "connected",
      description: "Precise body composition analysis",
      lastSync: "3 weeks ago"
    }
  ]
}

export const muscleMassConfig: MetricConfig = {
  name: "Muscle Mass",
  color: "var(--metric-muscle)",
  unit: "kg",
  currentValue: "58.2",
  goal: "> 55",
  percentage: 106,
  icon: "fitness_center",
  metricType: "body",
  aiInsightPrompt: "Your muscle mass of 58.2 kg exceeds your target, indicating excellent strength training results. Your lean muscle development supports healthy metabolism and bone density.",
  chartData: [
    { day: "Mon", value: 57.9 },
    { day: "Tue", value: 58.1 },
    { day: "Wed", value: 58.0 },
    { day: "Thu", value: 58.3 },
    { day: "Fri", value: 58.2 },
    { day: "Sat", value: 58.4 },
    { day: "Sun", value: 58.2 }
  ],
  historyLogs: [
    {
      id: "muscle-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "58.2 kg",
      status: "Excellent",
      notes: "Muscle mass analysis",
      dataSource: "InBody Scale"
    },
    {
      id: "muscle-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "58.0 kg",
      status: "Excellent",
      notes: "Weekly muscle mass check",
      dataSource: "InBody Scale"
    },
    {
      id: "muscle-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "57.9 kg",
      status: "Good",
      notes: "DEXA muscle mass measurement",
      dataSource: "DEXA Scan"
    }
  ],
  dataSources: [
    {
      name: "InBody Scale",
      status: "connected",
      description: "Bioelectrical impedance analysis",
      lastSync: "This morning"
    },
    {
      name: "DEXA Scan",
      status: "connected",
      description: "Precise muscle mass measurement",
      lastSync: "3 weeks ago"
    }
  ]
}

export const bloodGlucoseConfig: MetricConfig = {
  name: "Blood Glucose",
  color: "var(--metric-blood-pressure)",
  unit: "mg/dL",
  currentValue: "95",
  goal: "70-100",
  percentage: 90,
  icon: "glucose",
  metricType: "glucose",
  aiInsightPrompt: "Your blood glucose level of 95 mg/dL is in the optimal range. Your glucose control indicates healthy insulin sensitivity and metabolic function.",
  chartData: [
    { day: "Mon", value: 92 },
    { day: "Tue", value: 97 },
    { day: "Wed", value: 89 },
    { day: "Thu", value: 96 },
    { day: "Fri", value: 95 },
    { day: "Sat", value: 91 },
    { day: "Sun", value: 95 }
  ],
  historyLogs: [
    {
      id: "glucose-2024-08-25",
      date: "2024-08-25",
      time: "08:00",
      value: "95 mg/dL",
      status: "Normal",
      notes: "Fasting blood glucose",
      dataSource: "Continuous Glucose Monitor"
    },
    {
      id: "glucose-2024-08-25",
      date: "2024-08-25",
      time: "12:30",
      value: "118 mg/dL",
      status: "Normal",
      notes: "Post-meal glucose (2 hours)",
      dataSource: "Continuous Glucose Monitor"
    },
    {
      id: "glucose-2024-08-24",
      date: "2024-08-24",
      time: "07:45",
      value: "91 mg/dL",
      status: "Normal",
      notes: "Morning fingerstick reading",
      dataSource: "Fingerstick Readings"
    }
  ],
  dataSources: [
    {
      name: "Continuous Glucose Monitor",
      status: "connected",
      description: "Real-time glucose monitoring",
      lastSync: "Just now"
    },
    {
      name: "Fingerstick Readings",
      status: "active",
      description: "Manual glucose measurements",
      entries: "4 readings today"
    }
  ]
}

export const hba1cConfig: MetricConfig = {
  name: "HbA1c",
  color: "var(--metric-hormones-secondary)",
  unit: "%",
  currentValue: "5.2",
  goal: "< 5.7",
  percentage: 95,
  icon: "bloodtype",
  metricType: "glucose",
  aiInsightPrompt: "Your HbA1c level of 5.2% indicates excellent long-term glucose control. This suggests very low risk for diabetes-related complications and optimal metabolic health.",
  chartData: [
    { day: "12 months ago", value: 5.8 },
    { day: "9 months ago", value: 5.6 },
    { day: "6 months ago", value: 5.4 },
    { day: "3 months ago", value: 5.3 },
    { day: "6 weeks ago", value: 5.2 },
    { day: "3 weeks ago", value: 5.2 },
    { day: "Today", value: 5.2 }
  ],
  historyLogs: [
    {
      id: "hba1c-2024-08-25",
      date: "2024-08-25",
      time: "09:00",
      value: "5.2%",
      status: "Excellent",
      notes: "Quarterly HbA1c test - continued improvement",
      dataSource: "Lab Results"
    },
    {
      id: "hba1c-2024-05-15",
      date: "2024-05-15",
      time: "08:30",
      value: "5.3%",
      status: "Good",
      notes: "3-month glucose control assessment",
      dataSource: "Lab Results"
    },
    {
      id: "hba1c-2024-02-12",
      date: "2024-02-12",
      time: "10:00",
      value: "5.4%",
      status: "Good",
      notes: "Baseline HbA1c measurement",
      dataSource: "Lab Results"
    }
  ],
  dataSources: [
    {
      name: "Lab Results",
      status: "connected",
      description: "Quarterly HbA1c lab tests",
      lastSync: "2 weeks ago"
    }
  ]
}