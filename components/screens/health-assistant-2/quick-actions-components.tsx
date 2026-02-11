// Quick Actions UI components - horizontal scroll panel
// Clean separation of UI logic from business logic

import React from "react"
import { QUICK_ACTIONS, QuickAction } from "./quick-actions-data"

interface QuickActionsBarProps {
  onActionClick?: (actionId: string) => void
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ 
  onActionClick 
}) => {
  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action.id)
    }
  }

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK_ACTIONS.map((action) => {
          const IconComponent = action.icon
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--ds-surface-primary)]/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 hover:bg-[var(--ds-surface-primary)] hover:shadow-md transition-all duration-200 whitespace-nowrap flex-shrink-0 border border-white/20"
            >
              <IconComponent className="w-4 h-4" />
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}