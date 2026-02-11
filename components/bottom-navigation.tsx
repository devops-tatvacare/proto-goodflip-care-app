"use client"

import { Icon } from '@/components/ui/icon'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: (props: any) => <Icon name="home" {...props} /> },
    { id: "social", label: "Social", icon: (props: any) => <Icon name="group" {...props} /> },
    { id: "health-assistant", label: "Assistant", icon: (props: any) => <Icon name="sparkles" {...props} /> },
    { id: "insights", label: "Insights", icon: (props: any) => <Icon name="pieChart" {...props} /> },
    { id: "chats", label: "Chats", icon: (props: any) => <Icon name="forum" {...props} /> },
  ]

  return (
    <div className="bg-[var(--ds-surface-primary)] border-t border-[var(--ds-border-default)] px-2 py-2 flex-shrink-0 relative z-30">

      <div className="flex justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-300 min-w-0 flex-1 relative"
            >
              {tab.id === "health-assistant" ? (
                <div
                  className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, var(--health-assistant-active-start), var(--health-assistant-active-middle), var(--health-assistant-active-end))`
                      : `linear-gradient(135deg, var(--health-assistant-inactive-start), var(--health-assistant-inactive-middle), var(--health-assistant-inactive-end))`,
                    boxShadow: isActive
                      ? `0 10px 25px -5px var(--health-assistant-active-shadow), 0 4px 6px -2px var(--health-assistant-active-shadow)`
                      : "none",
                    border: isActive ? "none" : `2px solid var(--health-assistant-inactive-border)`,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--health-assistant-inactive-border-hover)"
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px var(--black-alpha-10), 0 2px 4px -1px var(--black-alpha-5)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--health-assistant-inactive-border)"
                      e.currentTarget.style.boxShadow = "none"
                    }
                  }}
                >
                  <IconComponent variant={isActive ? "filled" : "outlined"}
                    className={`w-6 h-6 transition-colors ${isActive ? "text-[var(--ds-text-inverse)] drop-shadow-sm" : "text-[var(--app-primary)]"}`}
                  />
                </div>
              ) : (
                <IconComponent variant={isActive ? "filled" : "outlined"}
                  className={`w-6 h-6 transition-colors ${
                    isActive
                      ? "text-[var(--app-primary)]"
                      : "text-[var(--ds-text-secondary)]"
                  }`}
                />
              )}
              {tab.id !== "health-assistant" && (
                <span
                  className={`text-xs font-medium text-center leading-tight transition-colors mt-1 ${
                    isActive
                      ? "text-[var(--app-primary)]"
                      : "text-[var(--ds-text-secondary)]"
                  }`}
                >
                  {tab.label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
