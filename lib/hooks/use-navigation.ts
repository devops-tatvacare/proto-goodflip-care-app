"use client"

import { useState } from "react"

export function useNavigation<T extends string>(initialView: T) {
  const [currentView, setCurrentView] = useState<T>(initialView)
  const [viewStack, setViewStack] = useState<T[]>([initialView])

  const navigateTo = (view: T) => {
    setCurrentView(view)
    setViewStack((prev) => [...prev, view])
  }

  const goBack = () => {
    if (viewStack.length > 1) {
      const newStack = viewStack.slice(0, -1)
      setViewStack(newStack)
      setCurrentView(newStack[newStack.length - 1])
    }
  }

  const resetToRoot = () => {
    setCurrentView(viewStack[0])
    setViewStack([viewStack[0]])
  }

  return {
    currentView,
    navigateTo,
    goBack,
    resetToRoot,
    canGoBack: viewStack.length > 1,
  }
}
