"use client"

import React, { useState } from "react"
import { MobileFrame } from "@/components/mobile-frame"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeScreen } from "@/components/screens/home-screen"
import { InsightsScreen } from "@/components/insights/insights-screen"
import { VersionAwareHealthAssistant2 } from "@/components/version-aware-health-assistant-2"
import { ChatsScreen } from "@/components/screens/chats-screen"
import { ChatDetailScreen } from "@/components/screens/chat-detail-screen"
import { SocialScreen } from "@/components/screens/social-screen"
import { ToastProvider } from "@/lib/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { AppLoginScreen } from "@/components/screens/app-login-screen"
import { GlobalFAB } from "@/components/ui/global-fab"
import {
  PREVIEW_TABS,
  getAppPreviewVariant,
  isZeroStateFeatureEnabled,
  type AppPreviewVariant,
  type PreviewTab,
} from "@/lib/app-preview-config"

interface Chat {
  id: string
  specialist: {
    name: string
    role: string
    avatar?: string
    isOnline: boolean
  }
  lastMessage: {
    content: string
    timestamp: string
    isFromUser: boolean
  }
  unreadCount: number
}

export default function HealthApp() {
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>(PREVIEW_TABS.appLogin)
  const [activeTab, setActiveTab] = useState("home")
  const [assistantInitialAction, setAssistantInitialAction] = useState<string | undefined>(undefined)
  const [insightsInitialMetric, setInsightsInitialMetric] = useState<string | undefined>(undefined)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false)
  const [navigationSource, setNavigationSource] = useState<string | undefined>(undefined)
  const [isDeviceInstallerMode, setIsDeviceInstallerMode] = useState(false)
  const [zeroStateActiveTab, setZeroStateActiveTab] = useState("home")
  const [zeroStateAssistantInitialAction, setZeroStateAssistantInitialAction] = useState<string | undefined>(undefined)
  const [zeroStateInsightsInitialMetric, setZeroStateInsightsInitialMetric] = useState<string | undefined>(undefined)
  const [zeroStateSelectedChat, setZeroStateSelectedChat] = useState<Chat | null>(null)
  const [zeroStateShowWelcomeScreen, setZeroStateShowWelcomeScreen] = useState(false)
  const [zeroStateNavigationSource, setZeroStateNavigationSource] = useState<string | undefined>(undefined)
  const [isZeroStateDeviceInstallerMode, setIsZeroStateDeviceInstallerMode] = useState(false)

  const isZeroStatePreview = activePreviewTab === PREVIEW_TABS.appZeroState
  const currentVariant: AppPreviewVariant = getAppPreviewVariant(activePreviewTab)
  const currentActiveTab = isZeroStatePreview ? zeroStateActiveTab : activeTab
  const currentAssistantInitialAction = isZeroStatePreview ? zeroStateAssistantInitialAction : assistantInitialAction
  const currentInsightsInitialMetric = isZeroStatePreview ? zeroStateInsightsInitialMetric : insightsInitialMetric
  const currentSelectedChat = isZeroStatePreview ? zeroStateSelectedChat : selectedChat
  const currentShowWelcomeScreen = isZeroStatePreview ? zeroStateShowWelcomeScreen : showWelcomeScreen
  const currentNavigationSource = isZeroStatePreview ? zeroStateNavigationSource : navigationSource
  const currentInstallerMode = isZeroStatePreview ? isZeroStateDeviceInstallerMode : isDeviceInstallerMode

  const setCurrentActiveTab = (newTab: string) => {
    if (isZeroStatePreview) {
      setZeroStateActiveTab(newTab)
      return
    }
    setActiveTab(newTab)
  }

  const handleNavigateToAssistant = (action: string) => {
    if (isZeroStatePreview) {
      setZeroStateAssistantInitialAction(action)
      setZeroStateActiveTab("health-assistant")
      setZeroStateNavigationSource("app-navigation")
      setZeroStateShowWelcomeScreen(false)
      return
    }

    setAssistantInitialAction(action)
    setActiveTab("health-assistant")
    setNavigationSource("app-navigation")
    setShowWelcomeScreen(false)
  }

  const handleNavigateToInsights = (metric: string) => {
    if (isZeroStatePreview) {
      setZeroStateInsightsInitialMetric(metric)
      setZeroStateActiveTab("insights")
      return
    }

    setInsightsInitialMetric(metric)
    setActiveTab("insights")
  }

  const handleChatSelect = (chat: Chat) => {
    if (isZeroStatePreview) {
      setZeroStateSelectedChat(chat)
      return
    }

    setSelectedChat(chat)
  }

  const handleBackFromChat = () => {
    if (isZeroStatePreview) {
      setZeroStateSelectedChat(null)
      return
    }

    setSelectedChat(null)
  }

  const handleAppLoginComplete = () => {
    setActivePreviewTab(PREVIEW_TABS.app)
  }

  const handleSkipToHealthAssistant = (source: string) => {
    // Batch all state updates together to prevent intermediate renders
    React.startTransition(() => {
      setActiveTab("health-assistant")
      setActivePreviewTab(PREVIEW_TABS.app)
      setNavigationSource(source)
    })
    
    // If coming from app-login-skip, reset the welcome state and show welcome
    if (source === 'app-login-skip') {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('meetKaira_shown')
      }
      React.startTransition(() => {
        setShowWelcomeScreen(true)
      })
    } else {
      React.startTransition(() => {
        setShowWelcomeScreen(false)
      })
    }
  }


  const handleTabChange = (newTab: string) => {
    setCurrentActiveTab(newTab)

    if (newTab === "health-assistant") {
      if (isZeroStatePreview) {
        setZeroStateNavigationSource("app-navigation")
        setZeroStateShowWelcomeScreen(false)
        return
      }

      setNavigationSource("app-navigation")
      setShowWelcomeScreen(false)
    }
  }

  const renderAppScreen = (variant: AppPreviewVariant) => {
    if (currentSelectedChat) {
      return <ChatDetailScreen chat={currentSelectedChat} onBack={handleBackFromChat} />
    }

    switch (currentActiveTab) {
      case "home":
        const homeInstallerModeHandler = isZeroStatePreview ? setIsZeroStateDeviceInstallerMode : setIsDeviceInstallerMode
        if (variant === "zero-state" && isZeroStateFeatureEnabled("home")) {
          return <HomeScreen onTabChange={handleTabChange} onNavigateToAssistant={handleNavigateToAssistant} onNavigateToInsights={handleNavigateToInsights} onDeviceInstallerModeChange={homeInstallerModeHandler} isZeroStatePreview={isZeroStatePreview} />
        }
        return <HomeScreen onTabChange={handleTabChange} onNavigateToAssistant={handleNavigateToAssistant} onNavigateToInsights={handleNavigateToInsights} onDeviceInstallerModeChange={homeInstallerModeHandler} isZeroStatePreview={isZeroStatePreview} />
      case "insights":
        const insightsScreen = <InsightsScreen onNavigateToAssistant={handleNavigateToAssistant} initialMetric={currentInsightsInitialMetric} isZeroStatePreview={isZeroStatePreview} onDeviceInstallerModeChange={isZeroStatePreview ? setIsZeroStateDeviceInstallerMode : setIsDeviceInstallerMode} />
        if (currentInsightsInitialMetric) {
          if (isZeroStatePreview) {
            setTimeout(() => setZeroStateInsightsInitialMetric(undefined), 100)
          } else {
            setTimeout(() => setInsightsInitialMetric(undefined), 100)
          }
        }
        return insightsScreen
      case "health-assistant":
        const screen = <VersionAwareHealthAssistant2 
          version="current" 
          initialAction={currentAssistantInitialAction}
          showWelcome={currentShowWelcomeScreen}
          navigationSource={currentNavigationSource}
          onWelcomeComplete={() => {
            if (isZeroStatePreview) {
              setZeroStateShowWelcomeScreen(false)
              setZeroStateNavigationSource(undefined)
              return
            }

            setShowWelcomeScreen(false)
            setNavigationSource(undefined)
          }}
        />
        if (currentAssistantInitialAction) {
          if (isZeroStatePreview) {
            setTimeout(() => setZeroStateAssistantInitialAction(undefined), 100)
          } else {
            setTimeout(() => setAssistantInitialAction(undefined), 100)
          }
        }
        return screen
      case "chats":
        return <ChatsScreen onBack={() => handleTabChange("home")} onChatSelect={handleChatSelect} />
      case "social":
        return <SocialScreen onBack={() => handleTabChange("home")} />
      default:
        return <HomeScreen onTabChange={handleTabChange} onNavigateToAssistant={handleNavigateToAssistant} onNavigateToInsights={handleNavigateToInsights} onDeviceInstallerModeChange={isZeroStatePreview ? setIsZeroStateDeviceInstallerMode : setIsDeviceInstallerMode} isZeroStatePreview={isZeroStatePreview} />
    }
  }

  const renderAppPreviewShell = (variant: AppPreviewVariant) => {
    return (
      <ToastProvider>
        <MobileFrame>
          <div className="flex flex-col h-full bg-gray-50 relative">
            <div className="flex-1 overflow-hidden">{renderAppScreen(variant)}</div>
            {!currentSelectedChat && !currentInstallerMode && <BottomNavigation activeTab={currentActiveTab} onTabChange={handleTabChange} />}
            <Toaster />
            {(currentActiveTab === "insights" || currentActiveTab === "social") && !currentSelectedChat && !currentInstallerMode && <GlobalFAB />}
          </div>
        </MobileFrame>
      </ToastProvider>
    )
  }

  const renderTabContent = () => {
    if (activePreviewTab === PREVIEW_TABS.onboarding) {
      return (
        <ToastProvider>
          <MobileFrame>
            <div className="flex flex-col h-full bg-white">
              <OnboardingScreen onComplete={() => setActivePreviewTab(PREVIEW_TABS.app)} />
              <Toaster />
            </div>
          </MobileFrame>
        </ToastProvider>
      )
    }

    if (activePreviewTab === PREVIEW_TABS.appLogin) {
      return (
        <ToastProvider>
          <MobileFrame>
            <div className="flex flex-col h-full bg-white">
              <AppLoginScreen onComplete={handleAppLoginComplete} onSkipToHealthAssistant={handleSkipToHealthAssistant} />
              <Toaster />
            </div>
          </MobileFrame>
        </ToastProvider>
      )
    }


    if (activePreviewTab === PREVIEW_TABS.app || activePreviewTab === PREVIEW_TABS.appZeroState) {
      return renderAppPreviewShell(currentVariant)
    }




    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tab Navigation */}
      <div className="flex justify-center items-center gap-6 pt-8 pb-4">
        <div className="flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActivePreviewTab(PREVIEW_TABS.onboarding)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === PREVIEW_TABS.onboarding
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Onboarding
          </button>
          <button
            onClick={() => setActivePreviewTab(PREVIEW_TABS.appLogin)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === PREVIEW_TABS.appLogin
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            App Login
          </button>
          <button
            onClick={() => setActivePreviewTab(PREVIEW_TABS.app)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === PREVIEW_TABS.app
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            App
          </button>
          <button
            onClick={() => setActivePreviewTab(PREVIEW_TABS.appZeroState)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === PREVIEW_TABS.appZeroState
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            App - Zero State
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}
