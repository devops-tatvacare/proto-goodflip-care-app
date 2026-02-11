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
  const [activePreviewTab, setActivePreviewTab] = useState("App Login")
  const [activeTab, setActiveTab] = useState("home")
  const [assistantInitialAction, setAssistantInitialAction] = useState<string | undefined>(undefined)
  const [insightsInitialMetric, setInsightsInitialMetric] = useState<string | undefined>(undefined)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false)
  const [navigationSource, setNavigationSource] = useState<string | undefined>(undefined)

  const handleNavigateToAssistant = (action: string) => {
    setAssistantInitialAction(action)
    setActiveTab("health-assistant")
    setNavigationSource('app-navigation') // Regular navigation from app tabs
    setShowWelcomeScreen(false) // Never show welcome for regular navigation
  }

  const handleNavigateToInsights = (metric: string) => {
    setInsightsInitialMetric(metric)
    setActiveTab("insights")
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat)
  }

  const handleBackFromChat = () => {
    setSelectedChat(null)
  }

  const handleAppLoginComplete = () => {
    setActivePreviewTab("App")
  }

  const handleSkipToHealthAssistant = (source: string) => {
    // Batch all state updates together to prevent intermediate renders
    React.startTransition(() => {
      setActiveTab("health-assistant")
      setActivePreviewTab("App")
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
    setActiveTab(newTab)
    
    // Handle health assistant navigation from bottom nav
    if (newTab === 'health-assistant') {
      setNavigationSource('app-navigation')
      setShowWelcomeScreen(false) // Never show welcome for bottom nav clicks
    }
  }

  const renderAppScreen = () => {
    // If a chat is selected, show full-screen chat
    if (selectedChat) {
      return <ChatDetailScreen chat={selectedChat} onBack={handleBackFromChat} />
    }

    switch (activeTab) {
      case "home":
        return <HomeScreen onTabChange={setActiveTab} onNavigateToAssistant={handleNavigateToAssistant} onNavigateToInsights={handleNavigateToInsights} />
      case "insights":
        const insightsScreen = <InsightsScreen onNavigateToAssistant={handleNavigateToAssistant} initialMetric={insightsInitialMetric} />
        // Clear the initial metric after rendering
        if (insightsInitialMetric) {
          setTimeout(() => setInsightsInitialMetric(undefined), 100)
        }
        return insightsScreen
      case "health-assistant":
        const screen = <VersionAwareHealthAssistant2 
          version="current" 
          initialAction={assistantInitialAction}
          showWelcome={showWelcomeScreen}
          navigationSource={navigationSource}
          onWelcomeComplete={() => {
            setShowWelcomeScreen(false)
            setNavigationSource(undefined)
          }}
        />
        // Clear the initial action after rendering  
        if (assistantInitialAction) {
          setTimeout(() => setAssistantInitialAction(undefined), 100)
        }
        return screen
      case "chats":
        return <ChatsScreen onBack={() => setActiveTab("home")} onChatSelect={handleChatSelect} />
      case "social":
        return <SocialScreen onBack={() => setActiveTab("home")} />
      default:
        return <HomeScreen onTabChange={setActiveTab} onNavigateToAssistant={handleNavigateToAssistant} onNavigateToInsights={handleNavigateToInsights} />
    }
  }

  const renderTabContent = () => {
    if (activePreviewTab === "Onboarding") {
      return (
        <ToastProvider>
          <MobileFrame>
            <div className="flex flex-col h-full bg-white">
              <OnboardingScreen onComplete={() => setActivePreviewTab("App")} />
              <Toaster />
            </div>
          </MobileFrame>
        </ToastProvider>
      )
    }

    if (activePreviewTab === "App Login") {
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


    if (activePreviewTab === "App") {
      return (
        <ToastProvider>
          <MobileFrame>
            <div className="flex flex-col h-full bg-gray-50 relative">
              <div className="flex-1 overflow-hidden">{renderAppScreen()}</div>
              {/* Hide bottom navigation when in chat detail */}
              {!selectedChat && <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />}
              <Toaster />
              {/* GlobalFAB - Render for insights and social screens */}
              {(activeTab === 'insights' || activeTab === 'social') && !selectedChat && <GlobalFAB />}
            </div>
          </MobileFrame>
        </ToastProvider>
      )
    }




    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tab Navigation */}
      <div className="flex justify-center items-center gap-6 pt-8 pb-4">
        <div className="flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActivePreviewTab("Onboarding")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === "Onboarding"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Onboarding
          </button>
          <button
            onClick={() => setActivePreviewTab("App Login")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === "App Login"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            App Login
          </button>
          <button
            onClick={() => setActivePreviewTab("App")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activePreviewTab === "App"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            App
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}
