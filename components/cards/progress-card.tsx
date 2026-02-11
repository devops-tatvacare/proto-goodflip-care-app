"use client"

import { Icon } from '@/components/ui/icon'
import { MaterialIcon } from "@/components/ui/material-icon"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProgressCardProps {
  onNavigate: (section: string) => void
}

export function ProgressCard({ onNavigate }: ProgressCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
                <MaterialIcon icon="route" variant="round" size={12} color="white" />
              </div>
              Your Journey
            </CardTitle>
            <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5 font-medium">See how far you've come</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full transition-colors h-7 w-7 self-center"
            onClick={() => onNavigate("health-journey")}
          >
            <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
      <CardContent className="px-4 pt-3 pb-4 space-y-4">
        {/* Journey Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Month 4 - Day 7</span>
            <span className="text-sm font-semibold text-gray-700">58% complete</span>
          </div>
          
          {/* Journey Milestone Timeline */}
          <div className="relative">
            {/* Container for proper spacing */}
            <div className="px-4 py-2">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2"></div>
              
              {/* Active Progress Line - progresses to current position in Month 4 */}
              <div 
                className="absolute top-1/2 left-4 h-0.5 -translate-y-1/2 transition-all duration-500"
                style={{
                  backgroundColor: "var(--app-primary)",
                  width: "58%", // 3 complete months (50%) + 7 days into month 4 (8% extra)
                }}
              ></div>
              
              {/* Milestone Nodes */}
              <div className="relative flex justify-between items-center">
                {/* Month 1 - Completed (Awards Star) */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--app-primary)",
                      borderColor: "var(--app-primary)",
                    }}
                  >
                    <MaterialIcon icon="star" variant="round" size={10} color="white" />
                  </div>
                  <div className="absolute -bottom-6 text-[10px] font-medium text-[var(--ds-text-secondary)] whitespace-nowrap">
                    Month 1
                  </div>
                </div>
                
                {/* Month 2 - Completed (Editor's Choice) */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--app-primary)",
                      borderColor: "var(--app-primary)",
                    }}
                  >
                    <MaterialIcon icon="verified" variant="round" size={10} color="white" />
                  </div>
                </div>
                
                {/* Month 3 - Completed (Reward/Trophy) */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--app-primary)",
                      borderColor: "var(--app-primary)",
                    }}
                  >
                    <MaterialIcon icon="emoji_events" variant="round" size={10} color="white" />
                  </div>
                  <div className="absolute -bottom-6 text-[10px] font-medium text-[var(--ds-text-secondary)] whitespace-nowrap">
                    Month 3
                  </div>
                </div>
                
                {/* Month 4 - In Progress (Current) */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: "white",
                      borderColor: "var(--app-primary)",
                    }}
                  >
                    <MaterialIcon icon="workspace_premium" variant="round" size={10} style={{ color: "var(--app-primary)" }} />
                  </div>
                </div>
                
                {/* Month 5 - Upcoming */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 bg-[var(--ds-surface-primary)] border-gray-300 transition-all duration-300 flex items-center justify-center"
                  >
                    <MaterialIcon icon="military_tech" variant="round" size={10} color="var(--gray-400)" />
                  </div>
                  <div className="absolute -bottom-6 text-[10px] font-medium text-gray-400 whitespace-nowrap">
                    Month 5
                  </div>
                </div>
                
                {/* Month 6 - Upcoming (Crown) */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 bg-[var(--ds-surface-primary)] border-gray-300 transition-all duration-300 flex items-center justify-center"
                  >
                    <MaterialIcon icon="auto_awesome" variant="round" size={10} color="var(--gray-400)" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom spacing for labels */}
            <div className="h-6"></div>
          </div>
        </div>

        {/* Achieved Section - Milestone Badges */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Achieved</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-200 bg-green-50 justify-center">
              <MaterialIcon icon="emoji_events" variant="round" size={12} color="var(--metric-body-composition)" />
              <span className="text-xs font-medium text-center leading-tight text-green-700">
                Month 3 Complete
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 justify-center">
              <MaterialIcon icon="check_circle" variant="round" size={12} color="var(--metric-lab-panel)" />
              <span className="text-xs font-medium text-center leading-tight text-blue-700">
                Dose 6 Complete
              </span>
            </div>
          </div>
        </div>

        {/* Next Section - Updated with Your Services styling */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Next</h4>
          <div className="space-y-2">

            {/* Connect CGM */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden"
                       style={{ backgroundColor: "var(--icon-bg-primary)" }}>
                    <img src="/images/bca.png" alt="BCA Device" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">Connect your BCA</h4>
                    <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">Body composition analysis</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNavigate("connect-bca")}
                  className="h-8 px-4 text-xs font-medium rounded-lg border-2 border-[var(--app-primary)] text-[var(--app-primary)] bg-transparent hover:bg-[var(--app-primary)] hover:text-[var(--ds-text-inverse)] transition-all duration-200"
                >
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
