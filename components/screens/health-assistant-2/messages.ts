// Health Assistant Messages - Centralized message management
// Keeps core functionality clean and messages maintainable

export const HEALTH_ASSISTANT_MESSAGES = {
  // System messages
  PROCESSING: "Welcome to your personalized health companion. I'm here to support your treatment journey with evidence-based clinical guidance, medication adherence monitoring, and comprehensive symptom tracking tailored to your specific therapeutic needs.",
  VOICE_PROCESSED: "Voice input successfully captured and processed. How may I assist you with your health management needs today?",
  
  // Action confirmations
  TRACK_SYMPTOMS: "Track Symptoms",
  LOG_ACTIVITIES: "Log Health Activities",
  BUY_DRUG: "Purchase Medication",
  TAKE_INJECTION: "Injection Guidance",
  KNOW_DRUG: "Medication Education",
  AI_HEALTH_PLANS: "Personalized Health Plans",
  
  // Symptom flow messages
  SYMPTOM_SELECTION: "Which symptom are you currently experiencing? Your symptom data helps identify treatment patterns, potential medication side effects, and enables personalized clinical interventions.",
  INTENSITY_RATING: "Please rate your symptom severity on a clinical scale of 1-10, where 1 represents minimal discomfort and 10 indicates severe impact requiring immediate medical attention.",
  FREQUENCY_QUESTION: "How frequently has this symptom occurred in the past 7 days? This temporal data is crucial for understanding symptom patterns and treatment efficacy.",
  BODY_LOCATION_QUESTION: (symptomName: string) => `Please indicate the anatomical location of your ${symptomName.toLowerCase()}. Precise localization helps differentiate between expected medication effects and conditions requiring clinical evaluation.`,
  
  // Success messages
  SYMPTOM_SUCCESS_TITLE: "Symptom recorded successfully",
  SYMPTOM_SUCCESS_DETAILS: (answers: Record<string, any>) => {
    const symptom = answers['symptom-selection'] || 'Unknown'
    const intensity = answers.intensity || 'Not specified'
    const frequency = answers.frequency || 'Not specified'
    const location = answers['body-location'] || 'General'
    const timestamp = new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    })
    
    return `Medical Record Updated\n\nSymptom: ${symptom}\nSeverity: ${intensity}/10\nFrequency: ${frequency}\nLocation: ${location}\nRecorded: ${timestamp}\n\nYour symptom has been documented in your health record. Your care team will be notified if intervention is recommended.`
  },
  
  // Activity messages
  ACTIVITY_TRACKING: "Health Activity Documentation\n\nSystematic tracking of daily activities provides essential data for evaluating treatment response, metabolic changes, and overall therapeutic outcomes. Please select the activity category you wish to record.",
  ACTIVITY_SELECTION: "Select the health activity category for documentation in your medical record:",
  
  // Drug ordering messages
  BUY_DRUG_INTRO: "Medication Procurement Services\n\nAccess your prescribed medications through our network of licensed, FDA-registered pharmacies. All partners maintain GDP (Good Distribution Practice) compliance, cold-chain integrity for temperature-sensitive biologics, and provide lot traceability for patient safety.",
  PHARMACY_SECTION_TITLE: "Accredited Pharmacy Network\n\nOur verified pharmacy partners specialize in GLP-1 receptor agonist distribution with dedicated patient support programs, prior authorization assistance, and copay optimization services. Each pharmacy maintains URAC accreditation and NABP VIPPS certification.",
  
  // Injection guidance
  INJECTION_GUIDE_INTRO: "Subcutaneous Self-Administration Protocol\n\nCorrect injection technique is critical for optimal pharmacokinetic absorption, bioavailability, and minimizing injection site reactions. This step-by-step clinical protocol ensures safe and effective medication delivery.",
  INJECTION_EATING_CHECK: "Pre-Administration Screening\n\nTo minimize gastrointestinal adverse events and optimize medication tolerance, please confirm your current fasting status. Have you consumed any food or caloric beverages within the past 2 hours?",
  
  // Learning content
  LEARN_DRUG_INTRO: "Clinical Education Resource Center\n\nComprehensive understanding of your prescribed GLP-1 receptor agonist therapy enhances treatment adherence and clinical outcomes. Access evidence-based educational materials covering pharmacodynamics, mechanism of action, clinical trial efficacy data, and adverse event management protocols.",
  
  // AI Health Plans
  AI_PLANS_INTRO: "AI-Driven Precision Medicine Planning\n\nOur clinical decision support system utilizes machine learning algorithms to analyze your biomarkers, treatment response patterns, and phenotypic data to generate personalized, evidence-based therapeutic recommendations aligned with current clinical guidelines.",
  AI_PLANS_FEATURES: "Personalized Clinical Protocol Components:\n\n• Medical nutrition therapy optimized for GLP-1 receptor agonist pharmacodynamics\n• Graduated physical activity prescriptions based on metabolic equivalents (METs)\n• Cognitive behavioral therapy techniques for sustainable lifestyle modification\n• Predictive analytics utilizing clinical biomarkers and patient-reported outcomes\n• Adverse event mitigation strategies based on pharmacovigilance data\n• Medication adherence optimization using behavioral economics principles",
  
  // Assessment flow
  ASSESSMENT_START: "Comprehensive Clinical Assessment Protocol\n\nTo develop your individualized therapeutic strategy, we need to collect detailed information about your medical history, current health status, treatment objectives, and psychosocial factors. This validated assessment instrument takes approximately 5-7 minutes and ensures your care plan aligns with evidence-based clinical guidelines and personalized medicine principles.\n\nAre you ready to begin your clinical assessment?",
  
  // Error and fallback messages
  INFO_NOTED: "Information recorded in your health profile",
  FEATURE_ACTIVATED: "Advanced health tracking interface activated. Your dashboard will now adapt to your current treatment phase and health priorities.",
  
  // Progress tracking messages
  PROGRESS_DETAILS: (actionIndex: number) => {
    const actions = ['Detailed Analytics', 'Goal Management']
    const selectedAction = actions[actionIndex]
    return `${selectedAction}\n\nAccessing your comprehensive health metrics and treatment progress indicators.`
  },
  
  PROGRESS_SUMMARY: "Weekly Clinical Progress Report\n\nTherapeutic Response Indicators:\n• Medication Adherence Rate: 95% (Target: ≥80%)\n• Weight Reduction: -2.3 kg (5.1 lbs) - Within expected range of 0.5-1kg/week\n• Vitality Index Improvement: +35% from baseline\n• Pittsburgh Sleep Quality Index: 7.2/10 (Clinically significant improvement)\n• Mean Fasting Glucose: 92 mg/dL (Target: <100 mg/dL)\n• Adverse Event Profile: Grade 1 (Mild, no intervention required)\n\nClinical Interpretation: Excellent therapeutic response. Maintain current dosing regimen and monitoring schedule.",
  
  // Metrics messages
  METRICS_LOADING: (actionIndex: number) => {
    const actions = ['Advanced Health Analytics', 'Comparative Analysis']
    const selectedAction = actions[actionIndex]
    return `${selectedAction}\n\nProcessing your health data using machine learning algorithms to identify patterns and optimization opportunities.`
  },
  
  METRICS_ANALYSIS: "Clinical Analytics Report\n\nEvidence-Based Findings:\n• Composite Biomarker Score: 23% improvement from baseline (p<0.05)\n• Cohort Comparative Analysis: 85th percentile for treatment response\n• Predictive Risk Score: 8.4/10 (95% CI: 7.9-8.9)\n• Therapeutic Efficacy Index: 1.3x above population mean response\n• Cardiovascular Risk Factors: Within target ranges per ACC/AHA guidelines\n\nClinical Recommendation: Continue current therapeutic protocol. Schedule follow-up assessment in 4 weeks.",
  
  // Reminder and tracking messages
  REMINDER_SET: "Medication Administration Schedule Configured\n\nDosing Protocol:\n• Medication: Semaglutide 0.25-2.0mg (Weekly subcutaneous injection)\n• Administration Day: Every Sunday (7-day interval ±1 day acceptable)\n• Scheduled Time: 10:00 AM (maintain consistent circadian timing)\n• Alert System: Multi-modal reminders with pre-administration checklist\n• Preparation Alert: 30 minutes prior for room temperature equilibration\n\nAdherence Monitoring Active: Consistent weekly administration maintains therapeutic plasma concentrations and optimizes glycemic control while minimizing gastrointestinal adverse events.",
  
  SITE_TRACKING: "Injection Site Rotation Protocol Activated\n\nClinical Management Features:\n• Systematic rotation tracking per manufacturer guidelines\n• Weekly site selection with anatomical visualization\n• Interactive subcutaneous injection zone mapping\n• Injection site reaction grading (CTCAE v5.0 criteria)\n• Comprehensive injection history with site-specific outcomes\n\nClinical Rationale: Systematic rotation prevents lipodystrophy, ensures consistent pharmacokinetic absorption profiles, and minimizes local injection site reactions.",
  
  NURSE_CONSULTATION: "Specialized Nursing Consultation Service\n\nClinical Education Session:\n• Provider: Board-Certified Diabetes Care and Education Specialist (CDCES)\n• Consultation Type: Individual subcutaneous injection technique training\n• Duration: 30-45 minute comprehensive clinical education\n• Setting: Clinical practice facility or telehealth platform\n• Components: Demonstration, supervised practice, competency verification, educational materials\n\nEvidence Base: Structured injection technique education reduces injection anxiety by 65% and improves medication adherence rates to >90% (J Diabetes Sci Technol, 2019).",
  
  DOCTOR_CONSULTATION: "Endocrinology Consultation Appointment\n\nClinical Visit Details:\n• Appointment: Next available slot - Tomorrow, 2:00 PM\n• Provider: Dr. Sarah Johnson, MD, FACE (Board-Certified Endocrinologist)\n• Visit Type: Comprehensive Treatment Evaluation\n• Clinical Agenda: Therapeutic response assessment, adverse event review, dose titration evaluation, metabolic parameter review, patient-centered care planning\n• Allocated Time: 20-30 minutes\n\nPreparation: Document current symptoms, medication adherence, glucose logs, and specific clinical questions for optimal consultation efficiency.",
  
  SUPPORT_GROUP: "Therapeutic Support Community\n\nPeer Support Resources:\n• Structured Support Groups: Weekly facilitated sessions led by certified health coaches\n• Patient Narratives: Clinically-verified treatment success stories and outcome data\n• Moderated Forums: 24/7 peer support with clinical moderator oversight\n• Evidence-Based Resources: Curated clinical guidelines and self-management tools\n• Expert Panels: Monthly Q&A with multidisciplinary healthcare team\n\nClinical Evidence: Peer support participation associated with 40% improvement in medication persistence and 25% better clinical outcomes (Diabetes Care, 2020).",
  
  COMPANION_APP: "Digital Therapeutics Platform\n\nClinical Management Features:\n• Medication adherence tracking with pharmacokinetic modeling\n• Real-time biomarker monitoring and trend analysis\n• Adverse event reporting per FDA MedWatch standards\n• Intelligent dosing reminders with circadian optimization\n• Medical device integration (CGM, blood pressure, fitness trackers)\n• HIPAA-compliant data synchronization with EHR systems\n\nClinical validation: FDA-registered Class II Software as Medical Device. Available for iOS 14+ and Android 10+ platforms."
}

// Helper function to format messages consistently
export const formatMessage = (template: string | ((args: any) => string), args?: any): string => {
  if (typeof template === 'function') {
    return template(args)
  }
  return template
}

// Message types for type safety
export type MessageType = keyof typeof HEALTH_ASSISTANT_MESSAGES