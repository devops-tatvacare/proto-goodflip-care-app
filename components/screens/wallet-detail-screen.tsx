"use client"

import type React from "react"
import { Icon } from '@/components/ui/icon'
import { Card, CardContent } from "@/components/ui/card"
import { HorizontalScroll } from "@/components/ui/horizontal-scroll"
import { MaterialIcon } from "@/components/ui/material-icon"

interface WalletDetailScreenProps {
  onBack: () => void
}

interface WalletAction {
  id: string
  title: string
  icon?: React.ReactNode
  image?: React.ReactNode
  description: string
}

interface Transaction {
  id: string
  type: "earned" | "spent"
  amount: number
  description: string
  date: string
  category: string
}

const walletActions: WalletAction[] = [
  {
    id: "appointment",
    title: "Book Appointment",
    icon: <MaterialIcon icon="medical_services" variant="filled" size={24} color="var(--app-primary)" />,
    description: "Consult with specialists",
  },
  {
    id: "care-products",
    title: "Buy Care Products",
    icon: <MaterialIcon icon="favorite" variant="filled" size={24} color="var(--app-primary)" />,
    description: "Health & wellness products",
  },
  {
    id: "pharmacy",
    title: "Refill Prescription",
    image: <img src="/images/rxrefill.png" alt="Refill Prescription" className="w-full h-full object-contain" />,
    description: "Medicines & supplements",
  },
  {
    id: "care-plans",
    title: "Buy Care Plans",
    icon: <MaterialIcon icon="health_and_safety" variant="filled" size={24} color="var(--app-primary)" />,
    description: "Comprehensive care packages",
  },
  {
    id: "devices",
    title: "Buy Devices",
    image: <img src="/images/bca.png" alt="Buy Devices" className="w-full h-full object-contain" />,
    description: "Health monitoring devices",
  },
]

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "earned",
    amount: 100,
    description: "Completed health assessment",
    date: "2025-08-14",
    category: "Assessment",
  },
  {
    id: "2",
    type: "spent",
    amount: 250,
    description: "Nutrition consultation",
    date: "2025-08-13",
    category: "Consultation",
  },
  {
    id: "3",
    type: "earned",
    amount: 50,
    description: "Daily check-in bonus",
    date: "2025-08-12",
    category: "Bonus",
  },
  {
    id: "4",
    type: "earned",
    amount: 200,
    description: "Care program milestone",
    date: "2025-08-11",
    category: "Milestone",
  },
  {
    id: "5",
    type: "spent",
    amount: 150,
    description: "Health supplement order",
    date: "2025-08-10",
    category: "Purchase",
  },
]

export function WalletDetailScreen({ onBack }: WalletDetailScreenProps) {
  const handleActionClick = (actionId: string) => {
    // Handle different wallet actions
    console.log("Wallet action clicked:", actionId)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header with Hero Section */}
      <div className="flex-shrink-0 relative">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between py-4 px-4">
          {/* Back Button - Circular */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 bg-[var(--overlay-bg)] backdrop-blur-sm"
          >
            <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          
          {/* Title Section */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[var(--card-header-text)]">
              Your Wallet
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Manage your coins and rewards</p>
          </div>
          
          {/* Right spacer for balance */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Hero Image Section - Wallet with Balance */}
        <div className="flex justify-center px-4 pb-3">
          <div className="relative">
            <img
              src="/images/digiwallet.png"
              alt="Digital Wallet"
              className="w-20 h-20 object-contain"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] rounded-full flex items-center justify-center">
              <MaterialIcon icon="toll" variant="round" size={12} color="white" />
            </div>
          </div>
        </div>

        {/* Coin Balance Banner */}
        <div className="mx-4 mb-3 px-4 py-3 rounded-xl" 
             style={{ 
               backgroundColor: "var(--overlay-bg)", 
               backdropFilter: "blur(8px)",
               border: "1px solid var(--overlay-border)"
             }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MaterialIcon icon="account_balance_wallet" variant="round" size={20} color="var(--app-primary)" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Available Balance</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: "var(--app-primary)" }}>1,000</div>
              <div className="text-xs text-[var(--ds-text-secondary)]">coins = ₹1,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Single Smooth Scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pb-6">
          {/* Put your coins to use section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Put your coins to use
            </h2>

            <HorizontalScroll className="pb-2">
              <div className="flex gap-2">
                {walletActions.map((action) => (
                  <div
                    key={action.id}
                    className="relative flex flex-col rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      minWidth: "90px",
                      maxWidth: "90px",
                      height: "120px",
                      backgroundColor: "var(--surface-elevated)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid var(--overlay-border)"
                    }}
                    onClick={() => handleActionClick(action.id)}
                  >
                    {/* Image/Icon Section - Everything except fixed text section */}
                    <div 
                      className="flex items-center justify-center flex-1"
                      style={{ 
                        backgroundColor: action.image ? "transparent" : "var(--primary-alpha-10)",
                      }}
                    >
                      {action.image ? (
                        <div className="w-full h-full overflow-hidden">
                          {action.image}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: "var(--primary-alpha-20)" }}>
                          {action.icon}
                        </div>
                      )}
                    </div>
                    
                    {/* Fixed Text Section */}
                    <div className="flex flex-col items-center justify-center px-2 py-2 flex-shrink-0"
                         style={{ 
                           height: "32px",
                           backgroundColor: "var(--app-primary)",
                           borderTop: "1px solid var(--overlay-border-light)"
                         }}>
                      <h4 className="text-[10px] font-semibold text-[var(--ds-text-inverse)] leading-tight line-clamp-2">
                        {action.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          {/* Transaction History section */}
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Transaction History
            </h2>

            <div className="space-y-2">
              {mockTransactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: "var(--surface-elevated)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                           style={{ backgroundColor: "var(--primary-alpha-10)" }}>
                        {transaction.type === "earned" ? (
                          <MaterialIcon icon="add_circle" variant="filled" size={20} color="var(--app-primary)" />
                        ) : (
                          <MaterialIcon icon="remove_circle" variant="filled" size={20} color="var(--app-primary)" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-1 text-[var(--text-muted)]">
                          <MaterialIcon icon="calendar_month" variant="filled" size={12} color="var(--text-muted)" />
                          <span>{new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          className="font-bold text-base"
                          style={{
                            color: transaction.type === "earned" ? "var(--status-success)" : "var(--status-error)",
                          }}
                        >
                          {transaction.type === "earned" ? "+" : "-"}{transaction.amount}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          coins
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
