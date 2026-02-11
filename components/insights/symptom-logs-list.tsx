"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { PainMapView } from "@/components/insights/pain-map-view"
import type { SymptomLog } from "@/lib/types"
import { SEMAGLUTIDE_SYMPTOMS, SYMPTOM_FREQUENCIES } from "@/components/screens/health-assistant-2/symptom-data"

interface SymptomLogsListProps {
  symptomLogs: SymptomLog[]
  onBack: () => void
}

export function SymptomLogsList({ symptomLogs, onBack }: SymptomLogsListProps) {
  const [activeTab, setActiveTab] = useState<"heat-map" | "history">("heat-map")

  // Generate enhanced symptom history data similar to health metrics
  const generateSymptomHistory = () => {
    const history = []
    const symptoms = ['Nausea', 'Abdominal Pain', 'Fatigue', 'Headache', 'Diarrhea', 'Constipation']
    const frequencies = ['First time', 'Once a week', '2-3 times a week', 'Daily', 'Multiple times a day']
    
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const symptom = symptoms[Math.floor(Math.random() * symptoms.length)]
      const symptomData = SEMAGLUTIDE_SYMPTOMS.find(s => s.name === symptom)
      
      history.push({
        id: `symptom-${i}`,
        date: date.toISOString(),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        symptom: symptom,
        emoji: symptomData?.emoji || '🤒',
        inputs: [
          { question: 'Symptom Type', answer: symptom },
          { question: 'Intensity', answer: `${Math.floor(Math.random() * 9) + 1}/10` },
          { question: 'Frequency', answer: frequencies[Math.floor(Math.random() * frequencies.length)] },
          { question: 'Duration', answer: `${Math.floor(Math.random() * 60) + 5} minutes` },
          { question: 'Triggers', answer: 'After medication intake' },
          { question: 'Relief Methods', answer: 'Rest and hydration' }
        ],
        outputs: [
          { metric: 'Severity Score', value: `${Math.floor(Math.random() * 5) + 3}/10` },
          { metric: 'Impact on Activities', value: 'Moderate' },
          { metric: 'Medication Correlation', value: 'Likely related' },
          { metric: 'Recovery Time', value: '30-60 minutes' }
        ],
        status: Math.random() > 0.5 ? 'improving' : 'stable'
      })
    }
    
    return history
  }

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const symptomHistory = generateSymptomHistory()
  const sortedLogs = symptomHistory

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }


  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--app-login-gradient)" }}>
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-gradient-to-br from-green-200/20 to-transparent rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      {/* Tab Navigation with Back Button */}
      <div className="flex items-center justify-between px-4 py-2 relative z-20">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 shadow-lg shadow-black/10 flex items-center justify-center text-[var(--ds-text-secondary)] hover:bg-gray-100 transition-all duration-300"
        >
          <Icon name="arrowLeft" className="w-4 h-4" />
        </button>

        {/* Tab Container */}
        <div className="bg-[var(--ds-surface-primary)]/95 backdrop-blur-xl border border-[var(--ds-border-default)]/50 rounded-full shadow-lg shadow-black/10 p-1.5">
          <div className="flex items-center gap-1">
            {/* Pain Map Tab */}
            <button
              onClick={() => setActiveTab('heat-map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'heat-map' 
                  ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                  : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
              }`}
              style={activeTab === 'heat-map' ? {
                background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
              } : {}}
            >
              Pain Map
            </button>
            
            {/* History Tab */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'history' 
                  ? 'text-[var(--ds-text-inverse)] shadow-sm' 
                  : 'text-[var(--ds-text-secondary)] hover:bg-gray-100'
              }`}
              style={activeTab === 'history' ? {
                background: 'linear-gradient(to right, var(--app-primary), var(--app-primary-hover))'
              } : {}}
            >
              History
            </button>
          </div>
        </div>

        {/* Empty space for balance */}
        <div className="w-9"></div>
      </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto relative z-10">
          {activeTab === 'heat-map' && (
            <div className="p-4">
              <PainMapView />
            </div>
          )}

          {activeTab === 'history' && (
            <>
              {/* Clean Header - No filters, matching health metrics style */}
              <div className="px-4 py-3">
                <h2 className="text-lg font-semibold text-gray-900">Symptom History</h2>
                <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Track your symptoms over time</p>
              </div>

              {/* Symptom History List - Matching Health Metrics Style */}
              <div className="flex-1 overflow-y-auto mx-4 rounded-b-lg">
                <div className="p-4 space-y-3">
                  {/* Day-based grouping */}
                  {Object.entries(
                    sortedLogs.reduce((acc, log) => {
                      const dateKey = new Date(log.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                      if (!acc[dateKey]) acc[dateKey] = []
                      acc[dateKey].push(log)
                      return acc
                    }, {} as Record<string, typeof sortedLogs>)
                  ).slice(0, 7).map(([dateKey, logs]) => (
                    <div key={dateKey} className="space-y-2">
                      <div className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider px-1">
                        {dateKey}
                      </div>
                      {logs.map((log) => {
                        const isExpanded = expandedCards.has(log.id)
                        return (
                          <Card
                            key={log.id}
                            className="bg-[var(--ds-surface-primary)] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <CardContent className="p-4">
                              {/* Main Row */}
                              <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => {
                                  const newExpanded = new Set(expandedCards)
                                  if (isExpanded) {
                                    newExpanded.delete(log.id)
                                  } else {
                                    newExpanded.add(log.id)
                                  }
                                  setExpandedCards(newExpanded)
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Symptom Emoji */}
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--app-primary)]/10 to-[var(--app-primary)]/5 flex items-center justify-center">
                                    <span className="text-lg">{log.emoji}</span>
                                  </div>
                                  
                                  {/* Symptom Info */}
                                  <div>
                                    <div className="font-medium text-gray-900">{log.symptom}</div>
                                    <div className="text-xs text-[var(--ds-text-secondary)]">{log.time}</div>
                                  </div>
                                </div>
                                
                                {/* Status and Expand */}
                                <div className="flex items-center gap-2">
                                  {log.status === 'improving' ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <Icon name="trendingDown" className="w-4 h-4" />
                                      <span className="text-xs font-medium">Improving</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-blue-600">
                                      <Icon name="glucose" className="w-4 h-4" />
                                      <span className="text-xs font-medium">Stable</span>
                                    </div>
                                  )}
                                  <button className="p-1 hover:bg-[var(--ds-surface-secondary)] rounded transition-colors">
                                    {isExpanded ? (
                                      <Icon name="chevronUp" className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <Icon name="chevronDown" className="w-4 h-4 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Expanded Content */}
                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                  {/* Inputs Section */}
                                  <div>
                                    <h4 className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-2">Assessment Inputs</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {log.inputs.map((input, idx) => (
                                        <div key={idx} className="text-xs">
                                          <span className="text-[var(--ds-text-secondary)]">{input.question}:</span>
                                          <span className="ml-1 text-gray-800 font-medium">{input.answer}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Outputs Section */}
                                  <div>
                                    <h4 className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-2">Analysis Results</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {log.outputs.map((output, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                                          <span className="text-xs text-[var(--ds-text-secondary)]">{output.metric}</span>
                                          <span className="text-xs font-medium text-gray-900">{output.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ))}
                  
                  {/* Show All Data Button */}
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-[var(--ds-border-default)] text-[var(--ds-text-secondary)] hover:bg-[var(--ds-surface-secondary)]"
                      onClick={() => console.log('Show all symptom data')}
                    >
                      Show All Data
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  )
}
