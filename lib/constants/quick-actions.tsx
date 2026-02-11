import React from "react"
import { Icon } from '@/components/ui/icon'
import { QuickActionCardData } from "@/components/cards/quick-action-card"

// Kaira Avatar Component - matching health assistant program screen
const KairaAvatar = () => (
  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/30 backdrop-blur-sm relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 50%, var(--app-secondary) 100%)' }}
  >
    {/* Subtle inner glow */}
    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>

    {/* Health Professional Icon */}
    <div className="relative z-10 flex flex-col items-center text-white">
      <Icon name="stethoscope" className="text-white drop-shadow-sm" size={32} />
    </div>
  </div>
)

export const QUICK_ACTION_CARDS: QuickActionCardData[] = [
  {
    id: "ask-kaira",
    image: <KairaAvatar />,
    title: "AI Health Assistant",
    buttonText: "Ask Kaira",
  },
  {
    id: "semaglutide-guidance",
    image: <img src="/images/injectionzyduscolors.png" alt="Semaglutide Guidance" className="w-full h-full object-contain" />,
    title: "Guidance on Semaglutide",
  },
  {
    id: "your-wallet",
    image: <img src="/images/digiwallet.png" alt="Your Wallet" className="w-full h-full object-contain" />,
    title: "Your Wallet",
  },
  {
    id: "tailored-health-plans",
    image: <img src="/images/injectionzydusaidiet.png" alt="Tailored Health Plans" className="w-full h-full object-contain" />,
    title: "Tailored Health Plans",
  },
  {
    id: "visit-health-store",
    image: <img src="/images/store.png" alt="Visit Health Store" className="w-full h-full object-contain" />,
    title: "Visit Health Store",
  },
  {
    id: "refill-prescription",
    image: <img src="/images/rxrefill.png" alt="Refill Prescription" className="w-full h-full object-contain" />,
    title: "Refill Prescription",
  },
  {
    id: "community-talks",
    image: <img src="/images/community.png" alt="Community Talks" className="w-full h-full object-contain" />,
    title: "View Trending Community Talks",
  },
  {
    id: "app-tour",
    image: <img src="/images/apptour.png" alt="App Tour" className="w-full h-full object-contain" />,
    title: "Get a App Tour",
  }
]