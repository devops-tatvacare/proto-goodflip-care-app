"use client"

import { useState, useCallback } from "react"

export interface NavigationState {
  currentScreen: string
  previousScreen?: string
  params?: Record<string, any>
}

export function useAppNavigation(initialScreen = "main") {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentScreen: initialScreen,
  })

  const navigate = useCallback((screen: string, params?: Record<string, any>) => {
    setNavigationState((prev) => ({
      currentScreen: screen,
      previousScreen: prev.currentScreen,
      params,
    }))
  }, [])

  const goBack = useCallback(() => {
    if (navigationState.previousScreen) {
      setNavigationState((prev) => ({
        currentScreen: prev.previousScreen!,
        previousScreen: undefined,
        params: undefined,
      }))
    }
  }, [navigationState.previousScreen])

  const canGoBack = Boolean(navigationState.previousScreen)

  return {
    currentScreen: navigationState.currentScreen,
    previousScreen: navigationState.previousScreen,
    params: navigationState.params,
    navigate,
    goBack,
    canGoBack,
  }
}
