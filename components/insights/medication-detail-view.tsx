"use client"

import { useState } from "react"
import { Icon } from '@/components/ui/icon'
import { ScreenLayout } from "@/components/layouts/screen-layout"
import { useScreenNavigation } from "@/lib/hooks/use-screen-navigation"
import { MedicationTrendsChart } from "@/components/charts/medication-trends-chart"
import { useModal } from "@/lib/hooks/use-modal"
import { ReminderModal } from "@/components/modals/reminder-modal"
import { MedicationModal } from "@/components/modals/medication-modal"

type TimeRange = "D" | "W"
type MedicationScreen = "main" | "history" | "data-sources"

interface MedicationDetailViewProps {
  title?: string
  onClose?: () => void
}

export function MedicationDetailView({ title = "Medication", onClose }: MedicationDetailViewProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("W")
  const [aiInsight, setAiInsight] = useState<string>("")
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)
  const [medications, setMedications] = useState<string[]>(["Paracetamol", "Vitamin D", "Aspirin", "Actibile", "Dolo"])
  const { currentScreen, navigateTo, goBack } = useScreenNavigation<MedicationScreen>("main")
  
  // Modals
  const reminderModal = useModal()
  const medicationModal = useModal()

  const handleAskKaira = async () => {
    setIsLoadingInsight(true)
    setTimeout(() => {
      setAiInsight("Your medication adherence is at 85% this week. You've been consistent with morning doses but occasionally miss evening medications. Consider setting reminders for 8 PM doses. Paracetamol and Vitamin D show perfect compliance.")
      setIsLoadingInsight(false)
    }, 2000)
  }

  const handleSetReminder = (reminderData: any) => {
    console.log('Setting medication reminder:', reminderData)
    reminderModal.close()
  }

  const handleAddMedication = (medication: string) => {
    setMedications(prev => [...prev, medication])
    medicationModal.close()
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

  // History Screen
  if (currentScreen === "history") {
    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-7 h-7 rounded-full border border-[var(--ds-border-default)] flex items-center justify-center hover:bg-[var(--ds-surface-secondary)] transition-colors"
            >
              <Icon name="chevronLeft" className="w-3.5 h-3.5 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-sm font-semibold text-gray-900">Medication History</h2>
            <div className="w-7" />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="space-y-1">
              {[
                { date: "Today", time: "8:00 AM", medication: "Paracetamol", status: "Taken", dosage: "500mg" },
                { date: "Today", time: "8:00 AM", medication: "Vitamin D", status: "Taken", dosage: "1000 IU" },
                { date: "Today", time: "2:00 PM", medication: "Paracetamol", status: "Taken", dosage: "500mg" },
                { date: "Today", time: "8:00 PM", medication: "Aspirin", status: "Missed", dosage: "100mg" },
                { date: "Yesterday", time: "8:00 AM", medication: "Paracetamol", status: "Taken", dosage: "500mg" },
                { date: "Yesterday", time: "9:00 AM", medication: "Vitamin D", status: "Taken", dosage: "1000 IU" },
                { date: "Yesterday", time: "2:00 PM", medication: "Paracetamol", status: "Taken", dosage: "500mg" },
                { date: "Yesterday", time: "7:00 PM", medication: "Actibile", status: "Taken", dosage: "10mg" },
              ].map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-gray-900">{entry.medication}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        entry.status === "Taken" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--ds-text-secondary)]">{entry.date} • {entry.time} • {entry.dosage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScreenLayout>
    )
  }

  // Data Sources Screen
  if (currentScreen === "data-sources") {
    return (
      <ScreenLayout contentPadding="none">
        <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <button
              onClick={goBack}
              className="w-7 h-7 rounded-full border border-[var(--ds-border-default)] flex items-center justify-center hover:bg-[var(--ds-surface-secondary)] transition-colors"
            >
              <Icon name="chevronLeft" className="w-3.5 h-3.5 text-[var(--ds-text-secondary)]" />
            </button>
            <h2 className="text-sm font-semibold text-gray-900">Data Sources & Access</h2>
            <div className="w-7" />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-gray-900">Manual Entry</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Active</span>
                </div>
                <p className="text-[10px] text-[var(--ds-text-secondary)] mb-2">Manually logged medication doses</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--ds-text-secondary)]">Entries today</span>
                  <span className="text-gray-700">8 doses</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-gray-900">Pharmacy Data</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Connected</span>
                </div>
                <p className="text-[10px] text-[var(--ds-text-secondary)] mb-2">Prescription refill tracking</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--ds-text-secondary)]">Last sync</span>
                  <span className="text-gray-700">2 days ago</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 opacity-60">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-gray-900">Smart Pill Dispenser</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-[var(--ds-text-secondary)]">Not Connected</span>
                </div>
                <p className="text-[10px] text-[var(--ds-text-secondary)] mb-2">Connect your smart dispenser for automatic tracking</p>
                <button className="text-[10px] font-medium text-green-600">
                  Connect Device →
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScreenLayout>
    )
  }

  // Main Medication Detail Screen
  return (
    <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
      {/* Compact Header */}
      <div className="px-3 py-2 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">Medication</h2>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => reminderModal.open()}
                className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[var(--ds-text-secondary)]" style={{ fontSize: "16px" }}>notifications</span>
              </button>
              <button 
                onClick={() => medicationModal.open()}
                className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[var(--ds-text-secondary)]" style={{ fontSize: "16px" }}>medication</span>
              </button>
              <button 
                className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity bg-green-600"
              >
                <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: "16px" }}>add</span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">85%</p>
            <p className="text-[10px] text-[var(--ds-text-secondary)]">Adherence</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Medication List */}
        <div className="px-3 py-2 border-b border-gray-50">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Active Medications</h3>
          <div className="flex gap-1.5 flex-wrap">
            {medications.map((med) => (
              <span 
                key={med} 
                className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
              >
                {med}
              </span>
            ))}
          </div>
        </div>

        {/* Trends Section with Medication Chart */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Medication Schedule</h3>
            <div className="inline-flex rounded-md bg-gray-100 p-0.5">
              {(["D", "W"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                    selectedTimeRange === range
                      ? "bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm"
                      : "text-[var(--ds-text-secondary)] hover:text-gray-700"
                  }`}
                >
                  {range === "D" ? "Today" : "Week"}
                </button>
              ))}
            </div>
          </div>

          {/* Medication Trends Chart - Preserved as is */}
          <div className="bg-gray-50 rounded-lg p-2">
            <MedicationTrendsChart selectedPeriod={selectedTimeRange} medications={medications} />
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">AI Insights</h3>
          
          {!aiInsight ? (
            <button
              onClick={handleAskKaira}
              disabled={isLoadingInsight}
              className="w-full py-2 rounded-lg font-medium text-xs text-[var(--ds-text-inverse)] transition-all hover:opacity-90 disabled:opacity-50 bg-green-600"
            >
              {isLoadingInsight ? "Generating..." : "Ask Kaira"}
            </button>
          ) : (
            <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-lg p-2.5 border border-green-100/50">
              <div className="flex items-start gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600"
                >
                  <span className="material-symbols-outlined text-[var(--ds-text-inverse)]" style={{ fontSize: "14px" }}>auto_awesome</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-[var(--ds-text-secondary)] leading-relaxed">{aiInsight}</p>
                  <button
                    onClick={handleAskKaira}
                    className="mt-1.5 text-[10px] font-medium text-green-600"
                  >
                    Refresh →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Doses */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Next Doses</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between bg-orange-50 rounded-lg px-2.5 py-2">
              <div>
                <p className="text-xs font-medium text-gray-900">Paracetamol</p>
                <p className="text-[10px] text-[var(--ds-text-secondary)]">500mg • In 2 hours</p>
              </div>
              <span className="text-[10px] font-medium text-orange-600">8:00 PM</span>
            </div>
            <div className="flex items-center justify-between bg-blue-50 rounded-lg px-2.5 py-2">
              <div>
                <p className="text-xs font-medium text-gray-900">Aspirin</p>
                <p className="text-[10px] text-[var(--ds-text-secondary)]">100mg • In 3 hours</p>
              </div>
              <span className="text-[10px] font-medium text-blue-600">8:30 PM</span>
            </div>
          </div>
        </div>

        {/* History & Data Sources */}
        <div className="px-3 pb-3 space-y-1.5">
          <button
            onClick={() => navigateTo("history")}
            className="w-full bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs font-medium text-gray-700">Show All Data</span>
            <Icon name="chevronRight" className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => navigateTo("data-sources")}
            className="w-full bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="text-xs font-medium text-gray-700">Data Sources & Access</span>
            <Icon name="chevronRight" className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ReminderModal
        isOpen={reminderModal.isOpen}
        onClose={reminderModal.close}
        onSave={handleSetReminder}
        metricType="Medication"
      />

      <MedicationModal
        isOpen={medicationModal.isOpen}
        onClose={medicationModal.close}
        medications={medications}
        onAdd={handleAddMedication}
        onRemove={handleRemoveMedication}
      />
    </div>
  )
}