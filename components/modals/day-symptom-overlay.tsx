"use client"

import { Icon } from '@/components/ui/icon'
import type { SymptomLog } from "@/lib/types"

interface DaySymptomOverlayProps {
  date: string
  symptoms: SymptomLog[]
  onClose: () => void
}

export function DaySymptomOverlay({ date, symptoms, onClose }: DaySymptomOverlayProps) {
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPainScaleColor = (scale: number) => {
    if (scale <= 3) return { color: "var(--status-success)", backgroundColor: "rgba(90, 186, 74, 0.1)" }
    if (scale <= 6) return { color: "var(--status-warning)", backgroundColor: "rgba(243, 115, 54, 0.1)" }
    return { color: "var(--status-error)", backgroundColor: "rgba(229, 62, 62, 0.1)" }
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-[var(--ds-surface-primary)] rounded-t-xl w-full max-h-[60%] overflow-y-auto" 
           style={{ borderColor: "var(--border-color)" }}>
        {/* Compact Header */}
        <div className="sticky top-0 bg-[var(--ds-surface-primary)] border-b px-4 py-3" 
             style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: "var(--chip-bg-primary)" }}>
                <Icon name="glucose" className="w-3.5 h-3.5" style={{ color: "var(--app-primary)" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Symptoms Logged
                </h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {formatFullDate(date)}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full transition-colors hover:opacity-70"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <Icon name="close" className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-4">
          {symptoms.length === 0 ? (
            <div className="text-center py-6 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <Icon name="glucose" className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                No symptoms logged for this day
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {symptoms.map((symptom) => {
                const IconComponent = symptom.icon
                const painColor = symptom.painScale ? getPainScaleColor(symptom.painScale) : undefined
                
                return (
                  <div key={symptom.id} className="border rounded-lg p-3" 
                       style={{ borderColor: "var(--border-color)", backgroundColor: "white" }}>
                    <div className="flex items-start gap-3">
                      {/* Compact Icon */}
                      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" 
                           style={{ backgroundColor: "var(--chip-bg-primary)" }}>
                        <IconComponent className={`w-3.5 h-3.5 ${symptom.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {symptom.symptom}
                          </h4>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {symptom.time}
                          </span>
                        </div>

                        {/* Compact Details */}
                        <div className="space-y-1.5">
                          {/* Pain Scale & Duration in One Row */}
                          <div className="flex items-center gap-4 text-xs">
                            {symptom.painScale && (
                              <div className="flex items-center gap-1.5">
                                <span style={{ color: "var(--text-secondary)" }}>Pain:</span>
                                <span 
                                  className="px-1.5 py-0.5 rounded text-xs font-medium"
                                  style={painColor}
                                >
                                  {symptom.painScale}/10
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1.5">
                              <span style={{ color: "var(--text-secondary)" }}>Duration:</span>
                              <span style={{ color: "var(--text-primary)" }}>{symptom.duration}</span>
                            </div>
                          </div>

                          {/* Notes */}
                          {symptom.notes && (
                            <div className="rounded-md p-2" style={{ backgroundColor: "var(--bg-secondary)" }}>
                              <p className="text-xs leading-tight" style={{ color: "var(--text-primary)" }}>
                                {symptom.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
