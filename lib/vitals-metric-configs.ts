import { MetricConfig } from "@/components/insights/metric-template-view"

// Lab Metrics
export const whiteBloodCellConfig: MetricConfig = {
  name: "White Blood Cell Count",
  color: "var(--metric-water)",
  unit: "K/µL",
  currentValue: "6.8",
  goal: "7.5",
  percentage: 91,
  icon: "science",
  metricType: "labs",
  normalRange: "4.5 - 11.0",
  aiInsightPrompt: "Your WBC count is 6.8 K/µL, within the normal range (4.5-11.0 K/µL). This indicates a healthy immune system. Your levels have been stable over the past month, showing good immune function.",
  chartData: [
    { day: "Mon", value: 6.5 },
    { day: "Tue", value: 6.7 },
    { day: "Wed", value: 6.6 },
    { day: "Thu", value: 6.9 },
    { day: "Fri", value: 6.8 },
    { day: "Sat", value: 6.7 },
    { day: "Sun", value: 6.8 }
  ],
  historyLogs: [
    {
      id: "wbc-2024-08-25",
      date: "2024-08-25",
      time: "09:15",
      value: "6.8 K/µL",
      status: "Normal",
      notes: "Routine blood work",
      dataSource: "LabCorp"
    },
    {
      id: "wbc-2024-08-18",
      date: "2024-08-18",
      time: "10:30",
      value: "6.7 K/µL",
      status: "Normal",
      notes: "Follow-up blood panel",
      dataSource: "LabCorp"
    },
    {
      id: "wbc-2024-08-11",
      date: "2024-08-11",
      time: "08:45",
      value: "6.9 K/µL",
      status: "Normal",
      notes: "Pre-treatment screening",
      dataSource: "Quest Diagnostics"
    }
  ],
  dataSources: [
    {
      name: "LabCorp",
      status: "connected",
      description: "Latest blood work results",
      lastSync: "3 days ago"
    },
    {
      name: "Quest Diagnostics",
      status: "connected",
      description: "Historical lab data",
      lastSync: "2 weeks ago"
    }
  ]
}

export const omega6Config: MetricConfig = {
  name: "Omega 6",
  color: "var(--metric-nutrition-fat)",
  unit: "mg/dL",
  currentValue: "285",
  goal: "300",
  percentage: 95,
  icon: "science",
  metricType: "labs",
  normalRange: "250 - 350",
  aiInsightPrompt: "Your Omega-6 levels are at 285 mg/dL, within the optimal range. The balance between omega-6 and omega-3 fatty acids is important for reducing inflammation.",
  chartData: [
    { day: "Mon", value: 280 },
    { day: "Tue", value: 282 },
    { day: "Wed", value: 278 },
    { day: "Thu", value: 287 },
    { day: "Fri", value: 285 },
    { day: "Sat", value: 283 },
    { day: "Sun", value: 285 }
  ],
  historyLogs: [
    {
      id: "omega6-2024-08-25",
      date: "2024-08-25",
      time: "09:30",
      value: "285 mg/dL",
      status: "Normal",
      notes: "Fatty acid profile analysis",
      dataSource: "LabCorp"
    },
    {
      id: "omega6-2024-08-11",
      date: "2024-08-11",
      time: "10:15",
      value: "287 mg/dL",
      status: "Normal",
      notes: "Nutritional assessment",
      dataSource: "LabCorp"
    }
  ],
  dataSources: [
    {
      name: "LabCorp",
      status: "connected",
      description: "Fatty acid profile test",
      lastSync: "1 week ago"
    }
  ]
}

export const progesteroneConfig: MetricConfig = {
  name: "Progesterone",
  color: "var(--metric-hormones)",
  unit: "ng/mL",
  currentValue: "12.4",
  goal: "15",
  percentage: 83,
  icon: "science",
  metricType: "labs",
  normalRange: "0.1 - 25",
  aiInsightPrompt: "Your progesterone level is 12.4 ng/mL, which is within the normal range for your cycle phase. Levels fluctuate throughout the menstrual cycle.",
  chartData: [
    { day: "Mon", value: 8.2 },
    { day: "Tue", value: 9.8 },
    { day: "Wed", value: 11.5 },
    { day: "Thu", value: 13.1 },
    { day: "Fri", value: 12.4 },
    { day: "Sat", value: 14.2 },
    { day: "Sun", value: 13.8 }
  ],
  historyLogs: [
    {
      id: "progesterone-2024-08-25",
      date: "2024-08-25",
      time: "08:30",
      value: "12.4 ng/mL",
      status: "Normal",
      notes: "Cycle day 21 measurement",
      dataSource: "LabCorp"
    },
    {
      id: "progesterone-2024-07-28",
      date: "2024-07-28",
      time: "09:00",
      value: "13.8 ng/mL",
      status: "Normal",
      notes: "Previous cycle peak",
      dataSource: "LabCorp"
    }
  ],
  dataSources: [
    {
      name: "LabCorp",
      status: "connected",
      description: "Hormone panel results",
      lastSync: "5 days ago"
    }
  ]
}

export const prolactinConfig: MetricConfig = {
  name: "Prolactin",
  color: "var(--metric-sleep)",
  unit: "ng/mL",
  currentValue: "15.2",
  goal: "20",
  percentage: 76,
  icon: "science",
  metricType: "labs",
  normalRange: "4 - 23",
  aiInsightPrompt: "Your prolactin level is 15.2 ng/mL, well within the normal range (4-23 ng/mL). This hormone is important for reproductive health.",
  chartData: [
    { day: "Mon", value: 14.8 },
    { day: "Tue", value: 15.1 },
    { day: "Wed", value: 14.9 },
    { day: "Thu", value: 15.5 },
    { day: "Fri", value: 15.2 },
    { day: "Sat", value: 15.0 },
    { day: "Sun", value: 15.3 }
  ],
  historyLogs: [
    {
      id: "prolactin-2024-08-25",
      date: "2024-08-25",
      time: "10:00",
      value: "15.2 ng/mL",
      status: "Normal",
      notes: "Endocrine panel",
      dataSource: "Quest Diagnostics"
    },
    {
      id: "prolactin-2024-08-11",
      date: "2024-08-11",
      time: "09:15",
      value: "15.5 ng/mL",
      status: "Normal",
      notes: "Follow-up hormone test",
      dataSource: "Quest Diagnostics"
    }
  ],
  dataSources: [
    {
      name: "Quest Diagnostics",
      status: "connected",
      description: "Endocrine panel",
      lastSync: "1 week ago"
    }
  ]
}

export const redBloodCellConfig: MetricConfig = {
  name: "Red Blood Cell",
  color: "var(--metric-blood-primary)",
  unit: "M/µL",
  currentValue: "4.7",
  goal: "5.0",
  percentage: 94,
  icon: "science",
  metricType: "labs",
  normalRange: "4.2 - 5.4",
  aiInsightPrompt: "Your RBC count is 4.7 M/µL, within the normal range. This indicates good oxygen-carrying capacity. Your levels have been consistent.",
  chartData: [
    { day: "Mon", value: 4.6 },
    { day: "Tue", value: 4.8 },
    { day: "Wed", value: 4.7 },
    { day: "Thu", value: 4.9 },
    { day: "Fri", value: 4.7 },
    { day: "Sat", value: 4.6 },
    { day: "Sun", value: 4.8 }
  ],
  historyLogs: [
    {
      id: "rbc-2024-08-25",
      date: "2024-08-25",
      time: "09:15",
      value: "4.7 M/µL",
      status: "Normal",
      notes: "Complete blood count",
      dataSource: "LabCorp"
    },
    {
      id: "rbc-2024-08-18",
      date: "2024-08-18",
      time: "10:30",
      value: "4.8 M/µL",
      status: "Normal",
      notes: "Routine CBC",
      dataSource: "LabCorp"
    }
  ],
  dataSources: [
    {
      name: "LabCorp",
      status: "connected",
      description: "Complete blood count",
      lastSync: "3 days ago"
    }
  ]
}

export const vitaminDConfig: MetricConfig = {
  name: "Vitamin D",
  color: "var(--metric-vitamins-yellow)",
  unit: "ng/mL",
  currentValue: "42",
  goal: "50",
  percentage: 84,
  icon: "science",
  metricType: "labs",
  normalRange: "30 - 100",
  aiInsightPrompt: "Your Vitamin D level is 42 ng/mL, which is sufficient but could be optimized. Consider increasing sun exposure or supplementation to reach 50+ ng/mL.",
  chartData: [
    { day: "Mon", value: 38 },
    { day: "Tue", value: 40 },
    { day: "Wed", value: 41 },
    { day: "Thu", value: 43 },
    { day: "Fri", value: 42 },
    { day: "Sat", value: 44 },
    { day: "Sun", value: 42 }
  ],
  historyLogs: [
    {
      id: "vitd-2024-08-25",
      date: "2024-08-25",
      time: "08:45",
      value: "42 ng/mL",
      status: "Sufficient",
      notes: "Vitamin D 25-hydroxy test",
      dataSource: "LabCorp"
    },
    {
      id: "vitd-2024-05-15",
      date: "2024-05-15",
      time: "09:30",
      value: "38 ng/mL",
      status: "Sufficient",
      notes: "Quarterly vitamin panel",
      dataSource: "LabCorp"
    }
  ],
  dataSources: [
    {
      name: "LabCorp",
      status: "connected",
      description: "Vitamin panel",
      lastSync: "2 weeks ago"
    }
  ]
}

export const vitaminB12Config: MetricConfig = {
  name: "Vitamin B12",
  color: "var(--metric-vitamins-green)",
  unit: "pg/mL",
  currentValue: "580",
  goal: "600",
  percentage: 97,
  icon: "science",
  metricType: "labs",
  normalRange: "200 - 900",
  aiInsightPrompt: "Your B12 level is 580 pg/mL, well within the normal range. This is important for nerve function and red blood cell formation.",
  chartData: [
    { day: "Mon", value: 570 },
    { day: "Tue", value: 575 },
    { day: "Wed", value: 578 },
    { day: "Thu", value: 582 },
    { day: "Fri", value: 580 },
    { day: "Sat", value: 585 },
    { day: "Sun", value: 580 }
  ],
  historyLogs: [
    {
      id: "b12-2024-08-25",
      date: "2024-08-25",
      time: "10:00",
      value: "580 pg/mL",
      status: "Normal",
      notes: "B-vitamin panel",
      dataSource: "Quest Diagnostics"
    },
    {
      id: "b12-2024-05-20",
      date: "2024-05-20",
      time: "09:15",
      value: "575 pg/mL",
      status: "Normal",
      notes: "Routine vitamin assessment",
      dataSource: "Quest Diagnostics"
    }
  ],
  dataSources: [
    {
      name: "Quest Diagnostics",
      status: "connected",
      description: "B-vitamin panel",
      lastSync: "10 days ago"
    }
  ]
}

export const zincConfig: MetricConfig = {
  name: "Zinc",
  color: "var(--metric-minerals)",
  unit: "µg/dL",
  currentValue: "95",
  goal: "100",
  percentage: 95,
  icon: "science",
  metricType: "labs",
  normalRange: "70 - 120",
  aiInsightPrompt: "Your zinc level is 95 µg/dL, within the optimal range. Zinc is crucial for immune function and wound healing.",
  chartData: [
    { day: "Mon", value: 92 },
    { day: "Tue", value: 94 },
    { day: "Wed", value: 93 },
    { day: "Thu", value: 97 },
    { day: "Fri", value: 95 },
    { day: "Sat", value: 96 },
    { day: "Sun", value: 95 }
  ],
  historyLogs: [
    {
      id: "zinc-2024-08-25",
      date: "2024-08-25",
      time: "11:00",
      value: "95 µg/dL",
      status: "Normal",
      notes: "Mineral panel analysis",
      dataSource: "LabCorp"
    },
    {
      id: "zinc-2024-08-11",
      date: "2024-08-11",
      time: "09:45",
      value: "93 µg/dL",
      status: "Normal",
      notes: "Follow-up mineral test",
      dataSource: "LabCorp"
    }
  ],
  dataSources: [
    {
      name: "LabCorp",
      status: "connected",
      description: "Mineral panel",
      lastSync: "1 week ago"
    }
  ]
}

// Body Composition Metrics
export const leanBodyMassConfig: MetricConfig = {
  name: "Lean Body Mass",
  color: "var(--metric-body-composition)",
  unit: "kg",
  currentValue: "58.2",
  goal: "60",
  percentage: 97,
  icon: "scale",
  metricType: "body",
  normalRange: "50 - 65",
  aiInsightPrompt: "Your lean body mass is 58.2 kg, representing 78% of your total body weight. This excellent proportion indicates strong muscle development and healthy metabolism.",
  chartData: [
    { day: "Mon", value: 57.8 },
    { day: "Tue", value: 58.0 },
    { day: "Wed", value: 58.1 },
    { day: "Thu", value: 58.3 },
    { day: "Fri", value: 58.2 },
    { day: "Sat", value: 58.4 },
    { day: "Sun", value: 58.2 }
  ],
  historyLogs: [
    {
      id: "lbm-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "58.2 kg",
      status: "Excellent",
      notes: "Morning body composition scan",
      dataSource: "InBody Scale"
    },
    {
      id: "lbm-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "58.0 kg",
      status: "Excellent",
      notes: "Weekly measurement",
      dataSource: "InBody Scale"
    },
    {
      id: "lbm-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "57.8 kg",
      status: "Good",
      notes: "DEXA scan analysis",
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
      description: "Professional body scan",
      lastSync: "3 weeks ago"
    }
  ]
}

export const visceralFatConfig: MetricConfig = {
  name: "Visceral Fat",
  color: "var(--metric-blood-primary)",
  unit: "level",
  currentValue: "4",
  goal: "< 10",
  percentage: 90,
  icon: "scale",
  metricType: "body",
  normalRange: "1 - 9",
  aiInsightPrompt: "Your visceral fat level is 4, which is excellent and well within the healthy range. This low level significantly reduces cardiovascular and metabolic disease risks.",
  chartData: [
    { day: "Mon", value: 4.2 },
    { day: "Tue", value: 4.0 },
    { day: "Wed", value: 3.8 },
    { day: "Thu", value: 4.1 },
    { day: "Fri", value: 4.0 },
    { day: "Sat", value: 3.9 },
    { day: "Sun", value: 4.0 }
  ],
  historyLogs: [
    {
      id: "vfat-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "4 level",
      status: "Excellent",
      notes: "Body composition analysis",
      dataSource: "InBody Scale"
    },
    {
      id: "vfat-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "4.1 level",
      status: "Excellent",
      notes: "Weekly body scan",
      dataSource: "InBody Scale"
    },
    {
      id: "vfat-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "4.2 level",
      status: "Excellent",
      notes: "Professional DEXA scan",
      dataSource: "DEXA Scan"
    }
  ],
  dataSources: [
    {
      name: "InBody Scale",
      status: "connected",
      description: "Visceral fat measurement",
      lastSync: "This morning"
    },
    {
      name: "DEXA Scan",
      status: "connected",
      description: "Abdominal fat analysis",
      lastSync: "3 weeks ago"
    }
  ]
}

export const subcutaneousFatConfig: MetricConfig = {
  name: "Subcutaneous Fat",
  color: "var(--metric-nutrition-fat)",
  unit: "%",
  currentValue: "18.3",
  goal: "< 20",
  percentage: 92,
  icon: "scale",
  metricType: "body",
  normalRange: "10 - 25",
  aiInsightPrompt: "Your subcutaneous fat is 18.3%, which is excellent and well within the healthy range. This optimal level provides necessary energy storage while maintaining a lean physique.",
  chartData: [
    { day: "Mon", value: 18.5 },
    { day: "Tue", value: 18.2 },
    { day: "Wed", value: 18.0 },
    { day: "Thu", value: 18.4 },
    { day: "Fri", value: 18.3 },
    { day: "Sat", value: 18.1 },
    { day: "Sun", value: 18.3 }
  ],
  historyLogs: [
    {
      id: "sfat-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "18.3%",
      status: "Excellent",
      notes: "Body fat analysis",
      dataSource: "InBody Scale"
    },
    {
      id: "sfat-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "18.1%",
      status: "Excellent",
      notes: "Weekly body composition",
      dataSource: "InBody Scale"
    },
    {
      id: "sfat-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "18.5%",
      status: "Good",
      notes: "DEXA body fat distribution",
      dataSource: "DEXA Scan"
    }
  ],
  dataSources: [
    {
      name: "InBody Scale",
      status: "connected",
      description: "Subcutaneous fat analysis",
      lastSync: "This morning"
    },
    {
      name: "DEXA Scan",
      status: "connected",
      description: "Body fat distribution",
      lastSync: "3 weeks ago"
    }
  ]
}

export const skeletalMuscleConfig: MetricConfig = {
  name: "Skeletal Muscle",
  color: "var(--metric-muscle)",
  unit: "%",
  currentValue: "42.8",
  goal: "> 40",
  percentage: 107,
  icon: "scale",
  metricType: "body",
  normalRange: "35 - 45",
  aiInsightPrompt: "Your skeletal muscle percentage is 42.8%, which is excellent and above average. This high level indicates superior strength, metabolism, and overall fitness.",
  chartData: [
    { day: "Mon", value: 42.5 },
    { day: "Tue", value: 42.7 },
    { day: "Wed", value: 42.9 },
    { day: "Thu", value: 42.6 },
    { day: "Fri", value: 42.8 },
    { day: "Sat", value: 43.0 },
    { day: "Sun", value: 42.8 }
  ],
  historyLogs: [
    {
      id: "smuscle-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "42.8%",
      status: "Excellent",
      notes: "Skeletal muscle mass analysis",
      dataSource: "InBody Scale"
    },
    {
      id: "smuscle-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "42.6%",
      status: "Excellent",
      notes: "Weekly muscle assessment",
      dataSource: "InBody Scale"
    },
    {
      id: "smuscle-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "42.5%",
      status: "Excellent",
      notes: "DEXA muscle composition",
      dataSource: "DEXA Scan"
    }
  ],
  dataSources: [
    {
      name: "InBody Scale",
      status: "connected",
      description: "Muscle mass analysis",
      lastSync: "This morning"
    },
    {
      name: "DEXA Scan",
      status: "connected",
      description: "Muscle tissue composition",
      lastSync: "3 weeks ago"
    }
  ]
}

export const boneMassConfig: MetricConfig = {
  name: "Bone Mass",
  color: "var(--metric-minerals)",
  unit: "kg",
  currentValue: "3.1",
  goal: "> 2.8",
  percentage: 111,
  icon: "scale",
  metricType: "body",
  normalRange: "2.5 - 3.5",
  aiInsightPrompt: "Your bone mass is 3.1 kg, which is excellent and indicates strong bone density. This healthy level reduces fracture risk and supports overall skeletal health.",
  chartData: [
    { day: "Mon", value: 3.08 },
    { day: "Tue", value: 3.09 },
    { day: "Wed", value: 3.10 },
    { day: "Thu", value: 3.11 },
    { day: "Fri", value: 3.10 },
    { day: "Sat", value: 3.12 },
    { day: "Sun", value: 3.10 }
  ],
  historyLogs: [
    {
      id: "bone-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "3.1 kg",
      status: "Excellent",
      notes: "Estimated bone mass",
      dataSource: "InBody Scale"
    },
    {
      id: "bone-2024-08-04",
      date: "2024-08-04",
      time: "14:30",
      value: "3.08 kg",
      status: "Excellent",
      notes: "DEXA bone density scan",
      dataSource: "DEXA Scan"
    },
    {
      id: "bone-2024-05-15",
      date: "2024-05-15",
      time: "15:00",
      value: "3.07 kg",
      status: "Good",
      notes: "Quarterly bone assessment",
      dataSource: "DEXA Scan"
    }
  ],
  dataSources: [
    {
      name: "DEXA Scan",
      status: "connected",
      description: "Bone density measurement",
      lastSync: "3 weeks ago"
    },
    {
      name: "InBody Scale",
      status: "connected",
      description: "Estimated bone mass",
      lastSync: "This morning"
    }
  ]
}

export const bmiConfig: MetricConfig = {
  name: "BMI",
  color: "var(--metric-water)",
  unit: "kg/m²",
  currentValue: "21.8",
  goal: "18.5 - 24.9",
  percentage: 95,
  icon: "scale",
  metricType: "body",
  normalRange: "18.5 - 24.9",
  aiInsightPrompt: "Your BMI is 21.8, which is in the optimal range for health and longevity. This indicates an excellent weight-to-height ratio with reduced disease risk.",
  chartData: [
    { day: "Mon", value: 21.9 },
    { day: "Tue", value: 21.7 },
    { day: "Wed", value: 21.8 },
    { day: "Thu", value: 21.6 },
    { day: "Fri", value: 21.8 },
    { day: "Sat", value: 21.9 },
    { day: "Sun", value: 21.8 }
  ],
  historyLogs: [
    {
      id: "bmi-2024-08-25",
      date: "2024-08-25",
      time: "07:00",
      value: "21.8 kg/m²",
      status: "Normal",
      notes: "Body mass index calculation",
      dataSource: "InBody Scale"
    },
    {
      id: "bmi-2024-08-18",
      date: "2024-08-18",
      time: "07:15",
      value: "21.7 kg/m²",
      status: "Normal",
      notes: "Weekly BMI check",
      dataSource: "Manual Entry"
    },
    {
      id: "bmi-2024-08-11",
      date: "2024-08-11",
      time: "07:00",
      value: "21.9 kg/m²",
      status: "Normal",
      notes: "Weight and height measurement",
      dataSource: "InBody Scale"
    }
  ],
  dataSources: [
    {
      name: "InBody Scale",
      status: "connected",
      description: "Height and weight tracking",
      lastSync: "This morning"
    },
    {
      name: "Manual Entry",
      status: "active",
      description: "Verified measurements",
      entries: "Weekly check-ins"
    }
  ]
}

// Cardiovascular Metrics
export const respirationRateConfig: MetricConfig = {
  name: "Respiration Rate",
  color: "var(--metric-cardiovascular)",
  unit: "breaths/min",
  currentValue: "14",
  goal: "16",
  percentage: 88,
  icon: "favorite",
  metricType: "cardiovascular",
  normalRange: "12 - 20",
  aiInsightPrompt: "Your respiration rate is 14 breaths/min, within the normal range. This indicates good respiratory health and efficient oxygen exchange.",
  chartData: [
    { day: "Mon", value: 15 },
    { day: "Tue", value: 14 },
    { day: "Wed", value: 13 },
    { day: "Thu", value: 15 },
    { day: "Fri", value: 14 },
    { day: "Sat", value: 14 },
    { day: "Sun", value: 14 }
  ],
  historyLogs: [
    {
      id: "resp-2024-08-25",
      date: "2024-08-25",
      time: "12:30",
      value: "14 breaths/min",
      status: "Normal",
      notes: "Resting respiratory rate",
      dataSource: "Apple Watch"
    },
    {
      id: "resp-2024-08-25",
      date: "2024-08-25",
      time: "08:45",
      value: "13 breaths/min",
      status: "Normal",
      notes: "Morning measurement",
      dataSource: "Apple Watch"
    },
    {
      id: "resp-2024-08-24",
      date: "2024-08-24",
      time: "16:20",
      value: "15 breaths/min",
      status: "Normal",
      notes: "Afternoon reading",
      dataSource: "Apple Watch"
    }
  ],
  dataSources: [
    {
      name: "Apple Watch",
      status: "connected",
      description: "Continuous respiratory monitoring",
      lastSync: "Just now"
    },
    {
      name: "Fitbit",
      status: "not_connected",
      description: "Connect for additional tracking"
    }
  ]
}

// Glucose Monitoring Metrics
export const timeInRangeConfig: MetricConfig = {
  name: "Time in Range",
  color: "var(--metric-vitamins-green)",
  unit: "%",
  currentValue: "78",
  goal: "80",
  percentage: 98,
  icon: "glucose",
  metricType: "glucose",
  normalRange: "70 - 180 mg/dL",
  aiInsightPrompt: "Your time in range is 78%, very close to the target of 80%. You spent 18.7 hours in the target glucose range (70-180 mg/dL) over the last 24 hours.",
  chartData: [
    { day: "Mon", value: 75 },
    { day: "Tue", value: 79 },
    { day: "Wed", value: 82 },
    { day: "Thu", value: 76 },
    { day: "Fri", value: 78 },
    { day: "Sat", value: 81 },
    { day: "Sun", value: 78 }
  ],
  historyLogs: [
    {
      id: "tir-2024-08-25",
      date: "2024-08-25",
      time: "23:59",
      value: "78%",
      status: "Good",
      notes: "Daily time in range summary",
      dataSource: "Dexcom G6"
    },
    {
      id: "tir-2024-08-24",
      date: "2024-08-24",
      time: "23:59",
      value: "81%",
      status: "Excellent",
      notes: "Daily glucose control",
      dataSource: "Dexcom G6"
    },
    {
      id: "tir-2024-08-23",
      date: "2024-08-23",
      time: "23:59",
      value: "76%",
      status: "Good",
      notes: "Weekend glucose management",
      dataSource: "Dexcom G6"
    }
  ],
  dataSources: [
    {
      name: "Dexcom G6",
      status: "connected",
      description: "Continuous glucose monitoring",
      lastSync: "Real-time"
    },
    {
      name: "FreeStyle Libre",
      status: "not_connected",
      description: "Alternative CGM device"
    }
  ]
}

// Generate sample chart data based on units
export const generateChartData = (config: MetricConfig, days: number = 7): any[] => {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    let value = 0
    const baseValue = parseFloat(config.currentValue.replace(/,/g, ''))
    
    // Generate realistic variations based on metric type
    switch (config.metricType) {
      case 'labs':
        // Lab values change slowly
        value = baseValue * (0.95 + Math.random() * 0.1)
        break
      case 'body':
        // Body composition changes gradually
        value = baseValue * (0.98 + Math.random() * 0.04)
        break
      case 'cardiovascular':
        // Cardiovascular metrics fluctuate more
        value = baseValue * (0.9 + Math.random() * 0.2)
        break
      case 'glucose':
        // Glucose metrics vary throughout the day
        value = baseValue * (0.85 + Math.random() * 0.3)
        break
      case 'nutrition':
        // Nutrition metrics vary based on meals
        value = baseValue * (0.8 + Math.random() * 0.4)
        break
      default:
        value = baseValue * (0.9 + Math.random() * 0.2)
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
      label: date.toLocaleDateString('en-US', { weekday: 'short' })
    })
  }
  
  return data
}

// Generate sample history logs based on metric type
export const generateHistoryLogs = (config: MetricConfig, days: number = 14): any[] => {
  const logs = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const baseValue = parseFloat(config.currentValue.replace(/,/g, ''))
    let value = baseValue * (0.9 + Math.random() * 0.2)
    
    logs.push({
      id: `${config.name}-${dateStr}`,
      date: dateStr,
      time: `${8 + Math.floor(Math.random() * 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      value: `${value.toFixed(2)} ${config.unit}`,
      status: value >= baseValue * 0.95 ? "Normal" : "Low",
      notes: `${config.name} measurement`,
      dataSource: config.dataSources?.[0]?.name || "Manual Entry"
    })
  }
  
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}