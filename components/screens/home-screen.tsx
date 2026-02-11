"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from '@/components/ui/icon'
import { MaterialIcon } from "@/components/ui/material-icon"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { SPECIALISTS, EDUCATIONAL_CONTENT } from "@/lib/constants/data"
import { QUICK_ACTION_CARDS } from "@/lib/constants/quick-actions"
import { HeroBanner } from "@/components/home/hero-banner"
import { NotificationBell } from "@/components/ui/notification-bell"
import { QuickActionsSection } from "@/components/home/quick-actions-section"
import { ProfileOverlay } from "@/components/overlays/profile-overlay"
import { SettingsOverlay } from "@/components/overlays/settings-overlay"
import { NotificationsOverlay } from "@/components/overlays/notifications-overlay"
import { DevicesOverlay } from "@/components/overlays/devices-overlay"
import { HealthDiaryExportOverlay } from "@/components/overlays/health-diary-export-overlay"
import { CalendarOverlay } from "@/components/overlays/calendar-overlay"
import { ProgressCard } from "@/components/cards/progress-card"
import { DeviceManagementScreen } from "@/components/screens/device-management-screen"
// Specialist view removed during refactoring
const SpecialistListView = ({ onBack }: any) => null
import { ProgramOverviewScreen } from "./program-overview-screen"
import { BookConsultationScreen } from "@/components/screens/book-consultation-screen"
import { WalletDetailScreen } from "@/components/screens/wallet-detail-screen"
import { RecordsScreen } from "@/components/screens/records-screen"
import { ChatsScreen } from "@/components/screens/chats-screen"
import { ChatDetailScreen } from "@/components/screens/chat-detail-screen"
import { ExpandableRemindersCard } from "@/components/cards/expandable-reminders-card"
import { ServicesPriorityCard } from "@/components/cards/services-priority-card"
import { RemindersPriorityCard } from "@/components/cards/reminders-priority-card"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HealthTipsCard } from "@/components/health-data/health-tips-card"
import { HealthArticleReader } from "@/components/health-data/health-article-reader"
// Health articles functionality removed (Strapi integration removed)
import { Badge } from "@/components/ui/badge"
import { HorizontalScroll } from "@/components/ui/horizontal-scroll"
import { CuratedForYouCard } from "@/components/cards/curated-for-you-card"
import { HealthJourneyDetailScreen } from "@/components/screens/health-journey-detail-screen"
import { HealthJourney2Card } from "@/components/cards/health-journey-2-card"
import { SettingsTab } from "@/components/screens/health-journey/settings-tab"
import { HealthTipsListScreen } from "@/components/screens/health-tips-list-screen"
import { PrescriptionRefillScreen } from "@/components/screens/prescription-refill-screen"
import { TodaysProgressCard } from "@/components/cards/todays-progress-card"
import { WebViewScreen } from "@/components/screens/webview-screen"
import { UpsellCarousel } from "@/components/home/upsell-carousel"
import { CuratedPlansSelectionScreen } from "@/components/screens/curated-plans-selection-screen"
import { QuestionnaireScreen } from "@/components/screens/questionnaire-screen"
import { AIGenerationScreen } from "@/components/screens/ai-generation-screen"
import { PlanReadyScreen } from "@/components/screens/plan-ready-screen"
import { PlanDetailsScreen } from "@/components/screens/plan-details-screen"

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
  appointments?: Array<{
    id: string
    doctorName: string
    date: string
    time: string
    duration: number
    type: "video" | "phone"
    status: "scheduled" | "active" | "completed" | "cancelled"
  }>
}

export function HomeScreen({ onTabChange, onNavigateToAssistant, onNavigateToInsights, onDeviceInstallerModeChange, isZeroStatePreview }: { 
  onTabChange?: (tab: string) => void
  onNavigateToAssistant?: (action: string) => void
  onNavigateToInsights?: (metric: string) => void
  onDeviceInstallerModeChange?: (active: boolean) => void
  isZeroStatePreview?: boolean
}) {
  const [showProfileOverlay, setShowProfileOverlay] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false)
  const [showNotificationsOverlay, setShowNotificationsOverlay] = useState(false)
  const [showDevicesOverlay, setShowDevicesOverlay] = useState(false)
  const [launchBcaInstallerDirect, setLaunchBcaInstallerDirect] = useState(false)
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false)
  const [showDeviceManagement, setShowDeviceManagement] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null)
  const [articleInteractions, setArticleInteractions] = useState<Record<number, { isBookmarked: boolean, isLiked: boolean }>>({})

  // Article functionality removed (Strapi integration removed)
  const selectedArticle = null
  const [showHealthDiaryOverlay, setShowHealthDiaryOverlay] = useState(false)
  const [showSpecialistList, setShowSpecialistList] = useState(false)
  const [showProgramOverview, setShowProgramOverview] = useState(false)
  const [showConsultation, setShowConsultation] = useState(false)
  const [showWalletDetail, setShowWalletDetail] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [showRecords, setShowRecords] = useState(false)
  const [showChats, setShowChats] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null)
  const [showAppointmentChat, setShowAppointmentChat] = useState(false)
  const [showCareProgram, setShowCareProgram] = useState(false)
  const [careProgramView, setCareProgramView] = useState<"main" | "treatment-journey" | "education" | "curated-plans">("main")
  const [currentSpecialistIndex, setCurrentSpecialistIndex] = useState(0)
  const [showHealthJourney, setShowHealthJourney] = useState(false)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [showHealthTipsList, setShowHealthTipsList] = useState(false)
  const [showPrescriptionRefill, setShowPrescriptionRefill] = useState(false)
  const [showWebView, setShowWebView] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState("")
  const [webViewTitle, setWebViewTitle] = useState("")
  
  // Curated Plans flow states
  const [showCuratedPlans, setShowCuratedPlans] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [showAIGeneration, setShowAIGeneration] = useState(false)
  const [showPlanReady, setShowPlanReady] = useState(false)
  const [showPlanDetails, setShowPlanDetails] = useState(false)
  const [questionnaireData, setQuestionnaireData] = useState<any>(null)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [planVerificationStatus, setPlanVerificationStatus] = useState<"pending" | "verified">("pending")
  
  // Boolean to control visibility of Recommended For You section
  const showRecommendedForYou = false
  
  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop
        setIsScrolled(scrollTop > 10)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const { unreadCount, unreadNotifications, readNotifications, markAsRead, markAllAsRead } = useNotifications()

  // Define Dr Sarah Johnson chat with appointments
  const drSarahJohnsonChat: Chat = {
    id: "dr-sarah-johnson",
    specialist: {
      name: "Dr Sarah Johnson",
      role: "Hepatologist",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      content: "Your free drug is ready for claim. We can discuss this during our appointment.",
      timestamp: "5 min ago",
      isFromUser: false,
    },
    unreadCount: 1,
    appointments: [
      {
        id: "sarah-johnson-1",
        doctorName: "Dr Sarah Johnson",
        date: new Date().toISOString().split("T")[0], // Today
        time: "14:00", // 2:00 PM
        duration: 30,
        type: "video",
        status: "scheduled",
      },
    ],
  }

  // Define Dr Sarah Wilson chat for appointments
  const drSarahWilsonChat: Chat = {
    id: "dr-sarah-wilson",
    specialist: {
      name: "Dr Sarah Wilson",
      role: "Cardiologist",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      content: "Looking forward to our appointment tomorrow at 2:00 PM. Please bring your recent test results.",
      timestamp: "1 hour ago",
      isFromUser: false,
    },
    unreadCount: 0,
    appointments: [
      {
        id: "sarah-wilson-1",
        doctorName: "Dr Sarah Wilson",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow
        time: "14:00", // 2:00 PM
        duration: 30,
        type: "video",
        status: "scheduled",
      },
    ],
  }

  const handleNotificationClick = (notification: any) => {
    console.log("Notification item clicked:", notification.id)
    markAsRead(notification.id)
  }

  const handleNotificationBellClick = () => {
    console.log("Notification bell clicked, opening notifications")
    setShowNotificationsOverlay(true)
  }

  const handleCloseNotifications = () => {
    console.log("Closing notifications screen")
    setShowNotificationsOverlay(false)
  }

  const handleDeviceManagement = () => {
    setShowDevicesOverlay(true)
    setShowProfileOverlay(false)
  }

  const handleDeviceIconClick = () => {
    console.log("Device icon clicked, opening devices overlay")
    setShowDevicesOverlay(true)
  }

  const handleCalendarIconClick = () => {
    console.log("Calendar icon clicked, opening calendar overlay")
    setShowCalendarOverlay(true)
  }

  const handleRecords = () => {
    setShowRecords(true)
    setShowProfileOverlay(false)
  }

  const handleHealthDiary = () => {
    setShowHealthDiaryOverlay(true)
    setShowProfileOverlay(false)
  }

  const handleBookConsultation = (specialist: any) => {
    setSelectedSpecialist(specialist)
    setShowConsultation(true)
  }

  const handleWalletClick = () => {
    setShowWalletDetail(true)
  }

  const handleProgressClick = (section?: string) => {
    if (section === 'health-journey') {
      setShowHealthJourney(true)
    } else if (section === "connect-bca" && isZeroStatePreview) {
      setLaunchBcaInstallerDirect(true)
      setShowDevicesOverlay(true)
    } else {
      // Navigate to insights tab at app level
      onTabChange?.("insights")
    }
  }

  const handleTodaysProgressMetricClick = (metricType: string) => {
    // Map Today's Progress Card metric types to Insights Screen metric names
    const metricMapping: Record<string, string> = {
      'water': 'Water Logs',
      'sleep': 'Sleep Logs', 
      'steps': 'Steps Logs',
      'calories': 'Diet Logs' // Calories is under Diet Logs
    }
    
    const insightMetric = metricMapping[metricType]
    if (insightMetric && onNavigateToInsights) {
      // Navigate to insights tab with the specific metric preselected
      onNavigateToInsights(insightMetric)
    }
  }

  const handleCareProgramClick = () => {
    setShowProgramOverview(true)
  }

  const handleEducationalContentClick = () => {
    setCareProgramView("education")
    setShowCareProgram(true)
  }

  const handleFreeDrugReminderClick = () => {
    // Navigate to care program treatment journey screen
    setCareProgramView("treatment-journey")
    setShowCareProgram(true)
    // Navigate to care program view
    // Note: care-program tab was removed, keeping local state navigation
  }

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat)
  }

  const handleBackFromChat = () => {
    setSelectedChat(null)
  }

  const handleBackFromChats = () => {
    setShowChats(false)
    setSelectedChat(null)
  }

  const handleAppointmentReminderClick = () => {
    setShowAppointmentChat(true)
  }

  const handleBackFromAppointmentChat = () => {
    setShowAppointmentChat(false)
  }

  const handleArticleClick = (articleId: number) => {
    setSelectedArticleId(articleId)
  }

  const handleArticleBack = () => {
    setSelectedArticleId(null)
  }

  const handleArticleBookmark = (articleId: number) => {
    setArticleInteractions(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        isBookmarked: !prev[articleId]?.isBookmarked
      }
    }))
  }

  const handleArticleLike = (articleId: number) => {
    setArticleInteractions(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        isLiked: !prev[articleId]?.isLiked
      }
    }))
  }

  const handleArticleShare = (article: any) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${article.title}: ${article.summary}`)
    }
  }

  const handleSpecialistPrev = () => {
    setCurrentSpecialistIndex((prev) => (prev === 0 ? SPECIALISTS.length - 1 : prev - 1))
  }

  const handleSpecialistNext = () => {
    setCurrentSpecialistIndex((prev) => (prev === SPECIALISTS.length - 1 ? 0 : prev + 1))
  }

  const handleExploreYourBenefits = () => {
    // Navigate to health assistant with a flag to highlight the program card
    if (onNavigateToAssistant) {
      onNavigateToAssistant("explore-benefits")
    } else {
      onTabChange?.("health-assistant")
    }
  }

  const handleHealthJourneyDetail = () => {
    setShowHealthJourney(true)
  }

  const handleHealthTipsViewAll = () => {
    setShowHealthTipsList(true)
  }

  const handlePrescriptionRefill = () => {
    setShowPrescriptionRefill(true)
  }

  const handleServiceBookAppointment = () => {
    const nutritionist = SPECIALISTS.find((s) => s.role.toLowerCase().includes("nutritionist")) || {
      name: "Dr. Emily Rodriguez",
      role: "Nutritionist",
      price: "400",
    }
    handleBookConsultation(nutritionist)
  }

  const handleServiceBookLabTest = () => {
    console.log("Navigate to lab tests booking")
  }

  const handleServiceViewPlans = () => {
    setShowCuratedPlans(true)
  }

  const handleServiceVisitStore = () => {
    console.log("Navigate to health store")
  }

  const handleReminderLogWater = () => {
    if (onNavigateToAssistant) {
      onNavigateToAssistant("log-water")
    }
  }

  const handleReminderLogSleep = () => {
    if (onNavigateToAssistant) {
      onNavigateToAssistant("log-sleep")
    }
  }

  const handleReminderLogSteps = () => {
    if (onNavigateToAssistant) {
      onNavigateToAssistant("log-steps")
    }
  }

  const handleReminderLogDiet = () => {
    if (onNavigateToAssistant) {
      onNavigateToAssistant("log-diet")
    }
  }

  const handleProfile = () => {
    setShowProfileSettings(true)
    setShowProfileOverlay(false)
  }

  const handleGoodFlipClick = () => {
    // Navigate to GoodFlip app store link
    setWebViewUrl("https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://apps.apple.com/in/app/goodflip-formerly-mytatva/id1590299281&ved=2ahUKEwj8o8iDtKaPAxUX3zQHHZDWOsoQFnoECB0QAQ&usg=AOvVaw17_PxAWV4aknRLCo0wYucu")
    setWebViewTitle("GoodFlip App")
    setShowWebView(true)
  }

  const handleAvatarClick = () => {
    setShowProfileOverlay(true)
  }

  const handleSettingsClick = () => {
    setShowSettingsOverlay(true)
  }

  const handleQuickActionClick = (cardId: string) => {
    if (cardId === "ask-kaira") {
      // Navigate to health assistant chat tab
      if (onNavigateToAssistant) {
        onNavigateToAssistant("chat")
      } else {
        onTabChange?.("health-assistant")
      }
    } else if (cardId === "care-program") {
      // Same action as "Program Details" button in hero banner
      handleCareProgramClick()
    } else if (cardId === "refill-prescription") {
      handlePrescriptionRefill()
    } else if (cardId === "your-wallet") {
      // Navigate to wallet detail screen
      handleWalletClick()
    } else if (cardId === "visit-health-store") {
      // Navigate to health store webview
      setWebViewUrl("https://shop.goodflip.in")
      setWebViewTitle("Visit Health Store")
      setShowWebView(true)
    }
    // Handle other card clicks here when needed
  }

  if (showAppointmentChat) {
    return <ChatDetailScreen chat={drSarahWilsonChat} onBack={handleBackFromAppointmentChat} />
  }

  if (showRecords) {
    return <RecordsScreen onBack={() => setShowRecords(false)} />
  }


  if (showWalletDetail) {
    return <WalletDetailScreen onBack={() => setShowWalletDetail(false)} />
  }

  // Show full article reader
  if (selectedArticle) {
    return (
      <HealthArticleReader
        article={selectedArticle}
        onBack={handleArticleBack}
        onBookmark={handleArticleBookmark}
        onLike={handleArticleLike}
        onShare={handleArticleShare}
        isBookmarked={articleInteractions[selectedArticle.id]?.isBookmarked || false}
        isLiked={articleInteractions[selectedArticle.id]?.isLiked || false}
      />
    )
  }

  if (showConsultation) {
    return (
      <BookConsultationScreen onBack={() => setShowConsultation(false)} specialistName={selectedSpecialist?.name} />
    )
  }

  if (showDeviceManagement) {
    return <DeviceManagementScreen onBack={() => setShowDeviceManagement(false)} />
  }

  if (showSpecialistList) {
    return <SpecialistListView specialists={SPECIALISTS} onBack={() => setShowSpecialistList(false)} />
  }

  if (showProgramOverview) {
    return <ProgramOverviewScreen onBack={() => setShowProgramOverview(false)} />
  }

  if (showChats) {
    // If a chat is selected, show chat detail
    if (selectedChat) {
      return <ChatDetailScreen chat={selectedChat} onBack={handleBackFromChat} />
    }
    // Otherwise show chats list
    return <ChatsScreen onBack={handleBackFromChats} onChatSelect={handleChatSelect} />
  }

  if (showCareProgram) {
    return (
      <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => setShowCareProgram(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold">Care Program</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Care Program</h2>
            <p className="text-[var(--ds-text-secondary)] max-w-sm">
              Care program features are under development. Please check back later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (showHealthJourney) {
    return <HealthJourneyDetailScreen onBack={() => setShowHealthJourney(false)} />
  }

  if (showHealthTipsList) {
    return (
      <HealthTipsListScreen
        onBack={() => setShowHealthTipsList(false)}
        onArticleClick={handleArticleClick}
      />
    )
  }

  if (showPrescriptionRefill) {
    return (
      <PrescriptionRefillScreen
        onBack={() => setShowPrescriptionRefill(false)}
      />
    )
  }

  if (showWebView) {
    return (
      <WebViewScreen
        url={webViewUrl}
        title={webViewTitle}
        onBack={() => setShowWebView(false)}
      />
    )
  }

  // Curated Plans flow screens
  if (showCuratedPlans) {
    return (
      <CuratedPlansSelectionScreen
        onBack={() => setShowCuratedPlans(false)}
        onGetStarted={() => {
          setShowCuratedPlans(false)
          setShowQuestionnaire(true)
        }}
      />
    )
  }

  if (showQuestionnaire) {
    return (
      <QuestionnaireScreen
        onBack={() => {
          setShowQuestionnaire(false)
          // Go directly back to home screen, not to curated plans
        }}
        onSubmit={(data) => {
          setQuestionnaireData(data)
          setShowQuestionnaire(false)
          setShowAIGeneration(true)
        }}
      />
    )
  }

  if (showAIGeneration) {
    return (
      <AIGenerationScreen
        onComplete={() => {
          // Simulate plan generation
          const mockPlan = {
            id: "plan-1",
            duration: 30,
            dietPlan: "Personalized diet plan based on your preferences",
            exercisePlan: "Customized exercise routine for your fitness level",
          }
          setGeneratedPlan(mockPlan)
          setShowAIGeneration(false)
          setShowPlanReady(true)
        }}
      />
    )
  }

  if (showPlanReady) {
    return (
      <PlanReadyScreen
        plan={generatedPlan}
        verificationStatus={planVerificationStatus}
        onBack={() => {
          setShowPlanReady(false)
          // Go back to home screen
        }}
        onViewDetails={() => {
          setShowPlanReady(false)
          setShowPlanDetails(true)
        }}
        onRetakeQuestionnaire={() => {
          setShowPlanReady(false)
          setShowQuestionnaire(true)
        }}
        onRequestHCPReview={() => setPlanVerificationStatus("verified")}
      />
    )
  }

  if (showPlanDetails) {
    return (
      <PlanDetailsScreen
        plan={generatedPlan}
        onBack={() => {
          setShowPlanDetails(false)
          setShowPlanReady(true)
        }}
      />
    )
  }

  if (showProfileSettings) {
    return (
      <div className="flex flex-col h-full" style={{ background: 'var(--app-login-gradient)' }}>
        <div className="px-4 pt-6 pb-4 border-b" style={{ 
          borderColor: 'rgba(39, 116, 174, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)'
        }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileSettings(false)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              Profile Settings
            </h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SettingsTab />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Background gradient layer - positioned behind everything */}
      <div className="absolute inset-0 z-0" style={{ background: 'var(--app-login-gradient)' }}>
        {/* Subtle background pattern overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-32 right-16 w-24 h-24 bg-gradient-to-br from-green-200/20 to-transparent rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Sticky header strip overlay - positioned over background */}
      <div 
        className="absolute top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/30"
        style={{ 
          height: '48px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <div className="flex items-center justify-between px-3 h-full">
          {/* Avatar at left */}
          <button
            className="relative w-8 h-8 rounded-full shadow-md hover:shadow-lg transition-shadow border-2 border-white flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 100%)' }}
            onClick={handleAvatarClick}
          >
            <MaterialIcon icon="account_circle" size={20} color="white" variant="filled" />
          </button>

          {/* Icons at right */}
          <div className="flex items-center gap-2">
            {/* Calendar Icon */}
            <button
              className="relative w-8 h-8 bg-white hover:bg-gray-50 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              onClick={handleCalendarIconClick}
            >
              <MaterialIcon icon="calendar_month" size="small" color="#374151" />
            </button>
            
            {/* Device Icon */}
            <button
              className="relative w-8 h-8 bg-white hover:bg-gray-50 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              onClick={handleDeviceIconClick}
            >
              <Icon name="watch" className="w-4 h-4 text-gray-700" />
            </button>
            
            {/* Notifications Icon */}
            <NotificationBell unreadCount={unreadCount} onClick={handleNotificationBellClick} />
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative z-10">
        <HeroBanner
          onAvatarClick={handleAvatarClick}
          onNotificationClick={handleNotificationBellClick}
          onDeviceClick={handleDeviceIconClick}
          onCalendarClick={handleCalendarIconClick}
          onCareProgramClick={handleCareProgramClick}
          unreadCount={unreadCount}
        />

        {/* Quick Actions - Full width horizontal scrollable cards */}
        <div className="mt-4 mb-5">
          <QuickActionsSection 
            cards={QUICK_ACTION_CARDS}
            showScrollHint={true}
            onCardClick={handleQuickActionClick}
          />
        </div>

        <div className="px-4 space-y-5">
          {/* Your Journey Card */}
          <ProgressCard onNavigate={handleProgressClick} />
          
          {/* Today's Progress Card */}
          <TodaysProgressCard onMetricClick={handleTodaysProgressMetricClick} />
          
          {/* Hidden but preserved - Your Health Journey card */}
          {false && <HealthJourney2Card onNavigateToDetail={handleHealthJourneyDetail} />}

          {showRecommendedForYou && <CuratedForYouCard />}

          {/* Reminders Priority Card */}
          <RemindersPriorityCard
            onFreeDrugClick={handleFreeDrugReminderClick}
            onAppointmentClick={handleAppointmentReminderClick}
            onLogWater={handleReminderLogWater}
            onLogSleep={handleReminderLogSleep}
            onLogSteps={handleReminderLogSteps}
            onLogDiet={handleReminderLogDiet}
          />

          {/* Services Priority Card */}
          <ServicesPriorityCard
            onBookAppointment={handleServiceBookAppointment}
            onBookLabTest={handleServiceBookLabTest}
            onViewPlans={handleServiceViewPlans}
            onRefillPrescription={handlePrescriptionRefill}
            onVisitStore={handleServiceVisitStore}
          />

          {/* Health Tips For You */}
          <HealthTipsCard 
            limit={3}
            showCategory={true}
            onArticleClick={handleArticleClick}
            onViewAll={handleHealthTipsViewAll}
          />
          
          {/* Educational Content - Hidden */}
          {false && <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                      <MaterialIcon icon="school" variant="round" size={12} color="white" />
                    </div>
                    Educational Content
                  </CardTitle>
                  <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">All your questions answered in one place</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 rounded-full transition-colors h-7 w-7 self-center"
                  onClick={handleEducationalContentClick}
                >
                  <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>
            <CardContent className="px-4 pt-0 pb-3">
              <HorizontalScroll>
                {EDUCATIONAL_CONTENT.slice(0, 4).map((content, index) => (
                  <div key={`educational-content-${index}-${content.title.slice(0, 20)}`} className="flex-shrink-0 w-44">
                    <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl overflow-hidden mb-2 border border-yellow-200">
                      <img
                        src={
                          index % 2 === 0 ? "/images/medical-consultation.png" : "/images/telemedicine-consultation.png"
                        }
                        alt={content.title}
                        className="w-full h-16 object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {content.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge
                          key={`educational-tag-${index}-${tagIndex}-${tag}`}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4"
                          style={{
                            backgroundColor: "var(--chip-bg-primary)",
                            color: "var(--chip-text-primary)",
                            borderColor: "var(--chip-border-primary)"
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-relaxed">{content.title}</h4>
                  </div>
                ))}
              </HorizontalScroll>
            </CardContent>
          </Card>}

          {/* Upsell Carousel - Last card */}
          <UpsellCarousel onGoodFlipClick={handleGoodFlipClick} />

          {/* Footer with GoodFlip branding */}
          <div className="flex items-center justify-center gap-2 text-xs whitespace-nowrap mt-6 pb-6">
            <span className="text-[var(--ds-text-secondary)] text-[13px]">Powered by</span>
            <img src="/images/goodflip-logo.svg" alt="GoodFlip" className="h-5 w-auto object-contain" />
          </div>
        </div>
      </div>

      <ProfileOverlay
        isOpen={showProfileOverlay}
        onClose={() => setShowProfileOverlay(false)}
        onSettingsClick={handleSettingsClick}
        onDeviceManagement={handleDeviceManagement}
        onRecords={handleRecords}
        onHealthDiary={handleHealthDiary}
      />
      <SettingsOverlay
        isOpen={showSettingsOverlay}
        onClose={() => setShowSettingsOverlay(false)}
      />

      <NotificationsOverlay
        isOpen={showNotificationsOverlay}
        onClose={handleCloseNotifications}
        unreadNotifications={unreadNotifications}
        readNotifications={readNotifications}
        unreadCount={unreadCount}
        onMarkRead={markAsRead}
        onMarkAllRead={markAllAsRead}
        onNotificationClick={handleNotificationClick}
      />
      <DevicesOverlay
        isOpen={showDevicesOverlay}
        onClose={() => {
          setShowDevicesOverlay(false)
          setLaunchBcaInstallerDirect(false)
        }}
        onInstallerModeChange={onDeviceInstallerModeChange}
        launchInstallerDirect={launchBcaInstallerDirect}
        onAddDevice={() => {
          setShowDeviceManagement(true)
          setShowDevicesOverlay(false)
        }}
        onDeviceSelect={(device) => {
          console.log("Selected device:", device.name)
          setShowDevicesOverlay(false)
        }}
      />
      <HealthDiaryExportOverlay
        isOpen={showHealthDiaryOverlay}
        onClose={() => setShowHealthDiaryOverlay(false)}
      />
      <CalendarOverlay
        isOpen={showCalendarOverlay}
        onClose={() => setShowCalendarOverlay(false)}
      />
    </div>
  )
}
