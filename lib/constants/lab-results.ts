export interface LabResult {
  id: string
  category: string
  name: string
  date: string
  time: string
  status: string
  results: {
    parameter: string
    value: string
    unit: string
    range: string
    trend: string
  }[]
  recommendations?: string[]
}

export const RECENT_LAB_RESULTS: LabResult[] = [
  {
    id: "1",
    category: "Blood Work",
    name: "Complete Blood Count",
    date: "Dec 15, 2024",
    time: "10:30 AM",
    status: "Normal",
    results: [
      { parameter: "Hemoglobin", value: "13.2", unit: "g/dL", range: "12.0-15.5", trend: "up" },
      { parameter: "WBC Count", value: "6.8", unit: "×10³/μL", range: "4.5-11.0", trend: "stable" },
      { parameter: "Platelet Count", value: "285", unit: "×10³/μL", range: "150-450", trend: "stable" }
    ],
    recommendations: [
      "Continue current iron supplementation",
      "Maintain balanced diet rich in iron",
      "Schedule follow-up in 3 months"
    ]
  },
  {
    id: "2", 
    category: "Metabolic Panel",
    name: "Comprehensive Metabolic Panel",
    date: "Dec 10, 2024",
    time: "9:15 AM", 
    status: "Good",
    results: [
      { parameter: "Glucose", value: "95", unit: "mg/dL", range: "70-100", trend: "down" },
      { parameter: "Creatinine", value: "0.9", unit: "mg/dL", range: "0.6-1.2", trend: "stable" },
      { parameter: "BUN", value: "18", unit: "mg/dL", range: "7-20", trend: "stable" }
    ],
    recommendations: [
      "Excellent glucose control - keep up current lifestyle",
      "Kidney function is optimal",
      "Continue regular monitoring"
    ]
  },
  {
    id: "3",
    category: "Lipid Profile", 
    name: "Cholesterol Panel",
    date: "Dec 5, 2024",
    time: "8:45 AM",
    status: "Needs Attention", 
    results: [
      { parameter: "Total Cholesterol", value: "220", unit: "mg/dL", range: "<200", trend: "down" },
      { parameter: "LDL", value: "145", unit: "mg/dL", range: "<100", trend: "down" },
      { parameter: "HDL", value: "52", unit: "mg/dL", range: ">40", trend: "up" }
    ],
    recommendations: [
      "Continue statin therapy as prescribed",
      "Increase cardiovascular exercise to 150 min/week",
      "Follow heart-healthy diet plan",
      "Recheck in 6 weeks"
    ]
  },
  {
    id: "4",
    category: "Thyroid Function",
    name: "Thyroid Stimulating Hormone",
    date: "Nov 30, 2024", 
    time: "11:00 AM",
    status: "Normal",
    results: [
      { parameter: "TSH", value: "2.1", unit: "mIU/L", range: "0.4-4.0", trend: "stable" },
      { parameter: "T4", value: "7.8", unit: "μg/dL", range: "4.5-12.0", trend: "stable" },
      { parameter: "T3", value: "125", unit: "ng/dL", range: "80-200", trend: "stable" }
    ],
    recommendations: [
      "Thyroid function is optimal",
      "Continue current medication dosage",
      "Annual monitoring recommended"
    ]
  }
]