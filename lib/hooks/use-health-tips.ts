/**
 * React hooks for Health Tips data
 * Mock data implementation (Strapi integration removed)
 */

import { useState, useEffect } from 'react'

export interface HealthTip {
  id: number
  title: string
  description: string
  category: string
  isActive: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// Mock health tips data
const mockHealthTips: HealthTip[] = [
  {
    id: 1,
    title: "Stay Hydrated Throughout the Day",
    description: "Drinking adequate water helps maintain proper body function, supports digestion, and keeps your skin healthy. Aim for 8-10 glasses per day.",
    category: "nutrition",
    isActive: true,
    publishedAt: "2024-01-15T08:00:00.000Z",
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-01-15T08:00:00.000Z"
  },
  {
    id: 2,
    title: "Take Regular Walking Breaks",
    description: "Even 5-10 minutes of walking every hour can improve circulation, reduce stress, and boost energy levels throughout your day.",
    category: "exercise",
    isActive: true,
    publishedAt: "2024-01-14T10:30:00.000Z",
    createdAt: "2024-01-14T10:30:00.000Z",
    updatedAt: "2024-01-14T10:30:00.000Z"
  },
  {
    id: 3,
    title: "Practice Deep Breathing for Stress Relief",
    description: "Deep breathing exercises can help reduce stress hormones, lower blood pressure, and improve focus. Try 4-7-8 breathing technique.",
    category: "mental-health",
    isActive: true,
    publishedAt: "2024-01-13T14:15:00.000Z",
    createdAt: "2024-01-13T14:15:00.000Z",
    updatedAt: "2024-01-13T14:15:00.000Z"
  },
  {
    id: 4,
    title: "Maintain Good Posture While Working",
    description: "Proper posture reduces back pain, improves breathing, and increases productivity. Keep your screen at eye level and feet flat on the floor.",
    category: "ergonomics",
    isActive: true,
    publishedAt: "2024-01-12T16:45:00.000Z",
    createdAt: "2024-01-12T16:45:00.000Z",
    updatedAt: "2024-01-12T16:45:00.000Z"
  },
  {
    id: 5,
    title: "Get Quality Sleep",
    description: "7-9 hours of quality sleep improves immune function, mental clarity, and emotional regulation. Create a consistent bedtime routine.",
    category: "sleep",
    isActive: true,
    publishedAt: "2024-01-11T20:00:00.000Z",
    createdAt: "2024-01-11T20:00:00.000Z",
    updatedAt: "2024-01-11T20:00:00.000Z"
  }
]

interface UseHealthTipsState {
  tips: HealthTip[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useHealthTips(limit?: number): UseHealthTipsState {
  const [state, setState] = useState<{
    tips: HealthTip[]
    loading: boolean
    error: string | null
  }>({
    tips: [],
    loading: true,
    error: null
  })

  const fetchTips = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Use mock data (Strapi integration removed)
      const tips = limit ? mockHealthTips.slice(0, limit) : mockHealthTips
      setState({ tips, loading: false, error: null })
    } catch (error) {
      setState({
        tips: [],
        loading: false,
        error: 'Failed to load health tips'
      })
    }
  }

  useEffect(() => {
    fetchTips()
  }, [limit])

  return {
    ...state,
    refetch: fetchTips
  }
}

export function useHealthTipsByCategory(category: string): UseHealthTipsState {
  const [state, setState] = useState<{
    tips: HealthTip[]
    loading: boolean
    error: string | null
  }>({
    tips: [],
    loading: true,
    error: null
  })

  const fetchTips = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Filter mock data by category
      const filteredTips = mockHealthTips.filter(tip => tip.category === category)
      setState({ tips: filteredTips, loading: false, error: null })
    } catch (error) {
      setState({
        tips: [],
        loading: false,
        error: 'Failed to load health tips'
      })
    }
  }

  useEffect(() => {
    fetchTips()
  }, [category])

  return {
    ...state,
    refetch: fetchTips
  }
}