"use client"

import { useState } from "react"

const AI_SUMMARIES = {
  "Medication Logs": `**Medication Adherence Analysis**

**Overall Performance:** You've maintained an 87.5% medication adherence rate over the past 30 days, which is excellent for treatment effectiveness.

**Key Insights:**
• Most consistent with morning medications (Paracetamol, Vitamin D)
• Occasional missed evening doses, particularly on weekends
• Best adherence during weekdays (92%) vs weekends (78%)

**Trends Identified:**
• 15% improvement in consistency over the last 2 weeks
• Missed doses correlate with irregular sleep patterns
• Higher adherence when using reminder notifications

**Recommendations:**
• Set weekend-specific reminders for evening medications
• Consider pill organizer for better tracking
• Maintain current morning routine - it's working well!

**Health Impact:** Your consistent adherence is supporting optimal treatment outcomes and symptom management.`,

  "Water Logs": `**Hydration Pattern Analysis**

**Overall Performance:** You're averaging 1,850ml daily, which is 92% of your 2,000ml goal - great progress!

**Key Insights:**
• Most hydrated during work hours (9 AM - 5 PM)
• Consistent intake patterns with slight weekend dips
• Best hydration on Tuesdays and Wednesdays

**Trends Identified:**
• 12% increase in daily intake over the past month
• Morning hydration has improved significantly
• Evening intake could be optimized (after 6 PM)

**Patterns Observed:**
• Higher intake correlates with physical activity days
• Weather doesn't significantly impact your habits
• Reminder notifications boost intake by 23%

**Recommendations:**
• Add one extra glass in the evening routine
• Keep water bottle visible during meetings
• Celebrate - you're building excellent hydration habits!

**Health Impact:** Your improved hydration supports better energy levels and overall wellness.`,

  "Sleep Logs": `**Sleep Quality Analysis**

**Overall Performance:** Averaging 7.2 hours nightly with 78% sleep efficiency - solid foundation with room for optimization.

**Key Insights:**
• Most consistent bedtime: 10:30 PM (±30 minutes)
• Best sleep quality on Sunday-Tuesday nights
• Deep sleep averages 1.8 hours (target: 2+ hours)

**Trends Identified:**
• 25-minute improvement in sleep onset over 3 weeks
• Weekend sleep schedule shifts by 1.5 hours
• Sleep quality correlates with daily step count

**Patterns Observed:**
• Screen time after 9 PM reduces sleep quality by 15%
• Room temperature affects deep sleep duration
• Consistent wake time improves next-day energy

**Recommendations:**
• Maintain weekday sleep schedule on weekends
• Implement 30-minute wind-down routine
• Consider blackout curtains for deeper sleep

**Health Impact:** Your improving sleep patterns support better recovery and cognitive function.`,

  "Steps Logs": `**Activity Pattern Analysis**

**Overall Performance:** Averaging 8,745 steps daily (87% of 10K goal) with strong consistency and upward trend.

**Key Insights:**
• Most active on weekdays (9,200 avg) vs weekends (7,800 avg)
• Peak activity: 2-4 PM and 6-8 PM
• 15% increase in daily average over past month

**Trends Identified:**
• Consistent improvement in weekend activity
• Weather has minimal impact on your routine
• Higher step days correlate with better sleep quality

**Activity Patterns:**
• Morning walks boost daily totals by 1,200 steps
• Workplace movement accounts for 35% of daily steps
• Evening activities vary most (2,000-4,000 steps)

**Recommendations:**
• Add 10-minute morning walk to reach 10K goal
• Take stairs when possible during workday
• Weekend hiking could boost weekly average

**Health Impact:** Your increasing activity levels support cardiovascular health and energy levels.`,

  "Symptom Logs": `**Symptom Pattern Analysis**

**Overall Trends:** Tracked 47 symptom episodes across 14 days, revealing important patterns for management.

**Key Insights:**
• Most frequent: Headache (28%), Fatigue (23%), Nausea (19%)
• Peak symptom times: 2-4 PM and 8-10 PM
• Average pain scale: 4.2/10 (moderate level)

**Pattern Recognition:**
• Symptoms cluster around meal times and stress periods
• Weekend symptom frequency 40% lower than weekdays
• Weather changes correlate with headache intensity

**Severity Trends:**
• Pain levels decreasing over past week (5.1 → 3.8 avg)
• Duration of episodes shortening (45 min → 30 min avg)
• Recovery time improving with consistent medication

**Recommendations:**
• Monitor stress levels during 2-4 PM period
• Consider meal timing adjustments
• Track sleep quality correlation with morning symptoms

**Health Impact:** Your detailed tracking is enabling better symptom management and treatment optimization.`,
  "Lab Test Analysis: Complete_Blood_Count.pdf": `**Complete Blood Count Analysis**

**Overall Assessment:** Your CBC results show excellent blood health with all parameters within normal ranges, indicating good overall health status.

**Key Findings:**
• Hemoglobin: 13.8 g/dL (Normal range: 12.0-15.5) - Excellent oxygen-carrying capacity
• White Blood Cell Count: 6,200/μL (Normal) - Strong immune system function  
• Platelet Count: 285,000/μL (Normal) - Good blood clotting ability
• Hematocrit: 41.2% (Normal) - Optimal blood volume ratio

**Health Correlations:**
• Your consistent hydration (1,850ml daily average) supports healthy blood volume
• Regular physical activity (8,745 steps daily) correlates with improved circulation
• Medication adherence (87.5%) maintains stable blood parameters

**Trends & Insights:**
• Hemoglobin levels improved from 12.8 to 13.8 g/dL over 3 months
• Iron levels stable, indicating effective supplementation
• No signs of infection or inflammation

**Recommendations:**
• Continue current iron supplementation routine
• Maintain excellent hydration habits
• Regular monitoring every 3-4 months recommended

**Health Impact:** Your CBC results reflect the positive impact of your consistent health habits and medication adherence.`,

  "Lab Test Analysis: Liver_Function_Test.pdf": `**Liver Function Test Analysis**

**Overall Assessment:** Outstanding liver health with all enzymes and proteins within optimal ranges, reflecting excellent liver function.

**Key Findings:**
• ALT (Alanine Aminotransferase): 28 U/L (Normal: <40) - Excellent liver cell health
• AST (Aspartate Aminotransferase): 24 U/L (Normal: <40) - No liver damage detected
• Bilirubin Total: 0.8 mg/dL (Normal: 0.3-1.2) - Optimal bile processing
• Albumin: 4.2 g/dL (Normal: 3.5-5.0) - Good protein synthesis

**Health Correlations:**
• Your medication adherence (87.5%) shows no adverse liver effects
• Adequate hydration (1,850ml daily) supports liver detoxification
• Sleep quality (7.2 hours average) aids liver regeneration processes

**Protective Factors:**
• No alcohol consumption impact detected
• Medication levels well-tolerated by liver
• Consistent sleep patterns support liver recovery

**Recommendations:**
• Continue current medication regimen safely
• Maintain hydration levels for optimal liver function
• Annual liver function monitoring recommended

**Health Impact:** Your liver is processing medications efficiently while maintaining excellent function, supporting your overall treatment plan.`,

  "Lab Test Analysis: Lipid_Profile.pdf": `**Lipid Profile Analysis**

**Overall Assessment:** Significant improvement in cardiovascular risk profile with cholesterol levels moving toward optimal ranges.

**Key Findings:**
• Total Cholesterol: 220 mg/dL (Previous: 285) - 23% improvement
• LDL Cholesterol: 135 mg/dL (Previous: 180) - 25% reduction  
• HDL Cholesterol: 52 mg/dL (Previous: 45) - 16% increase
• Triglycerides: 145 mg/dL (Previous: 200) - 28% improvement

**Health Correlations:**
• Increased daily steps (8,745 average) directly correlates with HDL improvement
• Consistent medication adherence supporting cholesterol management
• Sleep quality improvements (7.2 hours) aid metabolic health

**Lifestyle Impact:**
• Physical activity increase shows measurable cardiovascular benefits
• Dietary modifications reflected in triglyceride reduction
• Stress management correlates with overall lipid improvement

**Risk Assessment:**
• Cardiovascular risk reduced from moderate-high to moderate
• Continue current trajectory for optimal heart health
• Target: Total cholesterol <200 mg/dL achievable

**Recommendations:**
• Increase daily steps to 10,000 for additional HDL benefits
• Continue current medication and lifestyle modifications
• Retest in 3 months to track continued progress

**Health Impact:** Your lifestyle changes are creating measurable improvements in heart health markers.`,
}

export function useAISummary() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const generateSummary = async (title: string, data: any[]) => {
    setIsGenerating(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const generatedSummary =
      AI_SUMMARIES[title as keyof typeof AI_SUMMARIES] ||
      "AI analysis completed. Your data shows consistent patterns that support your health goals."

    setSummary(generatedSummary)
    setIsGenerating(false)
  }

  const clearSummary = () => {
    setSummary(null)
  }

  return { isGenerating, summary, generateSummary, clearSummary }
}
