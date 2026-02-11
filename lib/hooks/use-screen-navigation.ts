"use client"

import { useState } from "react"

export function useScreenNavigation<T extends string>(initialScreen: T) {
  const [currentScreen, setCurrentScreen] = useState<T>(initialScreen)
  const [screenStack, setScreenStack] = useState<T[]>([initialScreen])
  const [screenData, setScreenData] = useState<Record<string, any>>({})

  const navigateTo = (screen: T, data?: any) => {
    setCurrentScreen(screen)
    setScreenStack((prev) => [...prev, screen])
    if (data) {
      setScreenData((prev) => ({ ...prev, [screen]: data }))
    }
  }

  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = screenStack.slice(0, -1)
      const previousScreen = newStack[newStack.length - 1]
      setScreenStack(newStack)
      setCurrentScreen(previousScreen)
    }
  }

  const resetToRoot = () => {
    setCurrentScreen(screenStack[0])
    setScreenStack([screenStack[0]])
    setScreenData({})
  }

  const getScreenData = (screen: string) => screenData[screen]

  return {
    currentScreen,
    navigateTo,
    goBack,
    resetToRoot,
    getScreenData,
    canGoBack: screenStack.length > 1,
  }
}
