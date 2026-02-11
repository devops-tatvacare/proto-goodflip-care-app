"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { useToast } from "@/lib/hooks/use-toast"

interface GoalModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  onSave: (value: number) => void
}

export function GoalModal({ title, isOpen, onClose, onSave }: GoalModalProps) {
  const { toast } = useToast()
  const [tempGoal, setTempGoal] = useState("")

  const handleSave = () => {
    const value = Number.parseInt(tempGoal) || 0
    if (value > 0) {
      onSave(value)
      toast({
        title: "Goal Updated!",
        description: `${title.replace(" Logs", "")} goal set to ${value}`,
        type: "success",
      })
      onClose()
      setTempGoal("")
    }
  }

  const getPlaceholder = () => {
    if (title.includes("Water")) return "2000"
    if (title.includes("Sleep")) return "8"
    if (title.includes("Steps")) return "10000"
    if (title.includes("Fatigue")) return "5"
    return "Enter value"
  }

  const getUnit = () => {
    if (title.includes("Water")) return "ml"
    if (title.includes("Sleep")) return "hours"
    if (title.includes("Steps")) return "steps"
    if (title.includes("Fatigue")) return "/10"
    return ""
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Goal"
      actions={
        <>
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 text-xs py-2 border-[var(--ds-border-default)] text-[var(--ds-text-secondary)] hover:bg-[var(--ds-surface-secondary)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!tempGoal || Number.parseInt(tempGoal) <= 0}
            className="flex-1 text-xs py-2 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] disabled:opacity-50"
          >
            Set Goal
          </Button>
        </>
      }
    >
      <div>
        <p className="text-xs text-[var(--ds-text-secondary)] mb-2">Set your daily goal for {title.replace(" Logs", "").toLowerCase()}</p>
        <div className="relative">
          <input
            type="number"
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]"
          />
          {getUnit() && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[var(--ds-text-secondary)]">
              {getUnit()}
            </span>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
