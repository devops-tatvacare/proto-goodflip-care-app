"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import type { InsightData, SymptomLog } from "@/lib/types"

export function useInsightsData(): InsightData[] {
  return [
    {
      title: "Medication Logs",
      icon: (props: any) => <Icon name="glucose" {...props} />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      logged: 21,
      missed: 3,
      unit: "days",
      description: "You logged medication for fewer days over the last 24 days.",
      chart: [8, 12, 15, 18, 21, 19, 16, 14, 18, 21, 19, 17, 15, 18, 21, 19, 16, 14, 18, 21, 19, 17, 15, 21],
      period: "24 days",
      hasData: true,
    },
    {
      title: "Water Logs",
      icon: (props: any) => <Icon name="waterDrop" {...props} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      logged: 1850,
      missed: 150,
      unit: "ml per day",
      description: "Your daily water intake was consistent over the last 21 days.",
      chart: [
        1800, 1900, 1750, 2000, 1850, 1900, 1800, 1950, 1850, 1900, 1800, 1850, 1900, 1850, 1800, 1900, 1850, 1800,
        1900, 1850, 1800,
      ],
      period: "21 days",
      hasData: true,
    },
    {
      title: "Sleep Logs",
      icon: (props: any) => <Icon name="bedtime" {...props} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      logged: 7.2,
      missed: 0.8,
      unit: "hours per day",
      description: "Your sleep duration improved over the last 23 days.",
      chart: [
        6.5, 7, 7.2, 6.8, 7.5, 7.2, 7, 7.3, 7.2, 7.1, 7.4, 7.2, 7, 7.3, 7.2, 7.1, 7.4, 7.2, 7, 7.3, 7.2, 7.1, 7.4,
      ],
      period: "23 days",
      hasData: true,
    },
    {
      title: "Steps Logs",
      icon: (props: any) => <Icon name="footprints" {...props} />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      logged: 8745,
      missed: 1255,
      unit: "steps per day",
      description: "The number of steps you took per day was higher over the last 23 days.",
      chart: [
        8000, 8500, 9000, 8200, 8800, 9200, 8600, 8900, 8745, 8400, 8700, 9100, 8300, 8600, 8900, 8200, 8500, 8800,
        8100, 8400, 8700, 9000, 8300,
      ],
      period: "23 days",
      hasData: true,
    },
    {
      title: "Fatigue Logs",
      icon: (props: any) => <Icon name="glucose" {...props} />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      logged: 0,
      missed: 0,
      unit: "entries",
      description: "Track your daily fatigue levels to identify patterns and triggers.",
      chart: [],
      period: "0 days",
      hasData: false,
    },
    {
      title: "Menstruation Logs",
      icon: (props: any) => <Icon name="glucose" {...props} />,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      logged: 12,
      missed: 0,
      unit: "cycles",
      description: "Track your menstrual cycle patterns and symptoms.",
      chart: [28, 30, 27, 29, 28, 31, 28, 29, 27, 28, 30, 28],
      period: "12 cycles",
      hasData: true,
    },
  ]
}

export function useSymptomData() {
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  }

  const dates = generateDates()

  const SYMPTOM_TYPES = [
    { symptom: "Fever", icon: (props: any) => <Icon name="thermostat" {...props} />, color: "text-red-500" },
    { symptom: "Nausea", icon: (props: any) => <Icon name="alertTriangle" {...props} />, color: "text-yellow-500" },
    { symptom: "Pain", icon: (props: any) => <Icon name="zap" {...props} />, color: "text-orange-500" },
    { symptom: "Weakness", icon: (props: any) => <Icon name="glucose" {...props} />, color: "text-gray-500" },
    { symptom: "Chest Pain", icon: (props: any) => <Icon name="heart" {...props} />, color: "text-red-600" },
    { symptom: "Headache", icon: (props: any) => <Icon name="brain" {...props} />, color: "text-purple-600" },
    { symptom: "Cough", icon: (props: any) => <Icon name="stethoscope" {...props} />, color: "text-blue-600" },
    { symptom: "Eye Irritation", icon: (props: any) => <Icon name="eye" {...props} />, color: "text-cyan-500" },
    { symptom: "Shortness of Breath", icon: (props: any) => <Icon name="wind" {...props} />, color: "text-blue-500" },
  ]

  const createSymptomLogs = (): SymptomLog[] => {
    const logs: SymptomLog[] = []
    const times = ["07:30", "09:15", "11:45", "14:20", "16:30", "18:45", "20:15", "22:00"]

    dates.forEach((dateStr) => {
      const numSymptoms = Math.floor(Math.random() * 3) + 2
      const selectedSymptoms = [...SYMPTOM_TYPES].sort(() => 0.5 - Math.random()).slice(0, numSymptoms)
      const selectedTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, numSymptoms)

      selectedSymptoms.forEach((symptom, index) => {
        logs.push({
          id: `${dateStr}-${index}`,
          symptom: symptom.symptom,
          icon: symptom.icon,
          time: selectedTimes[index],
          date: dateStr,
          painScale: Math.floor(Math.random() * 8) + 2,
          duration: ["Occasional", "Continuous", "Repeatedly"][Math.floor(Math.random() * 3)],
          notes: `${symptom.symptom} on ${new Date(dateStr).toLocaleDateString()}`,
          color: symptom.color,
        })
      })
    })

    return logs
  }

  const symptomLogs = createSymptomLogs()
  const symptomsByDate = symptomLogs.reduce(
    (acc, log) => {
      if (!acc[log.date]) {
        acc[log.date] = []
      }
      acc[log.date].push(log)
      return acc
    },
    {} as Record<string, SymptomLog[]>,
  )

  Object.keys(symptomsByDate).forEach((date) => {
    symptomsByDate[date].sort((a, b) => a.time.localeCompare(b.time))
  })

  return { dates, symptomLogs, symptomsByDate }
}

export function useGoals() {
  const [goals, setGoals] = useState({
    "Water Logs": 2000,
    "Sleep Logs": 8,
    "Steps Logs": 10000,
  })

  const getGoalValue = (title: string) => {
    return goals[title as keyof typeof goals] || 0
  }

  const setGoal = (title: string, value: number) => {
    setGoals((prev) => ({ ...prev, [title]: value }))
  }

  return { goals, getGoalValue, setGoal }
}

export function useMedications() {
  const [medications, setMedications] = useState(["Paracetamol", "Vitamin D", "Aspirin", "Actibile", "Dolo"])

  const addMedication = (medication: string) => {
    setMedications((prev) => [...prev, medication.trim()])
  }

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  return { medications, addMedication, removeMedication }
}

export function useMenstrualData() {
  const [menstrualData, setMenstrualData] = useState({
    cycles: [
      {
        id: "cycle-1",
        startDate: "2024-03-01",
        duration: 5,
        cycleLength: 28,
        flow: "Normal",
        pain: 6,
        mood: "Neutral",
      },
      {
        id: "cycle-2",
        startDate: "2024-02-02",
        duration: 4,
        cycleLength: 30,
        flow: "Heavy",
        pain: 8,
        mood: "Frustrated",
      },
      {
        id: "cycle-3",
        startDate: "2024-01-05",
        duration: 5,
        cycleLength: 27,
        flow: "Normal",
        pain: 5,
        mood: "Happy",
      },
    ],
  })

  const addCycle = (cycle: any) => {
    setMenstrualData((prev) => ({
      ...prev,
      cycles: [cycle, ...prev.cycles],
    }))
  }

  const calculatePhase = (date: Date, lastPeriodStart: Date, cycleLength: number) => {
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24))
    const dayInCycle = daysSinceLastPeriod % cycleLength

    if (dayInCycle >= 0 && dayInCycle <= 5) return "period"
    if (dayInCycle >= 6 && dayInCycle <= 11) return "post-period"
    if (dayInCycle >= 12 && dayInCycle <= 16) return "ovulation"
    if (dayInCycle >= 17 && dayInCycle <= 23) return "pre-period"
    return "pre-period"
  }

  return { menstrualData, addCycle, calculatePhase }
}
