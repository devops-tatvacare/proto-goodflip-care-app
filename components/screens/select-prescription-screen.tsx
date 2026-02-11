"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/ui/icon'

interface SelectPrescriptionScreenProps {
  onBack: () => void
  onSelect?: (prescription: any) => void
}

export function SelectPrescriptionScreen({ onBack, onSelect }: SelectPrescriptionScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null)

  // Mock prescription data
  const prescriptions = [
    {
      id: '1',
      medicationName: 'Semaglutide',
      dosage: '0.5mg',
      prescribedDate: '2024-06-15',
      prescribedBy: 'Dr. Sarah Johnson',
      prescriptionNumber: 'RX12345',
      instructions: 'Inject once weekly, rotate injection sites',
      refillsRemaining: 3,
      totalRefills: 5
    },
    {
      id: '2',
      medicationName: 'Metformin',
      dosage: '500mg',
      prescribedDate: '2024-05-20',
      prescribedBy: 'Dr. Sarah Johnson',
      prescriptionNumber: 'RX12346',
      instructions: 'Take twice daily with meals',
      refillsRemaining: 1,
      totalRefills: 3
    },
    {
      id: '3',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      prescribedDate: '2024-04-10',
      prescribedBy: 'Dr. Michael Chen',
      prescriptionNumber: 'RX12347',
      instructions: 'Take once daily in the morning',
      refillsRemaining: 0,
      totalRefills: 2
    },
    {
      id: '4',
      medicationName: 'Atorvastatin',
      dosage: '20mg',
      prescribedDate: '2024-07-01',
      prescribedBy: 'Dr. Sarah Johnson',
      prescriptionNumber: 'RX12348',
      instructions: 'Take once daily at bedtime',
      refillsRemaining: 2,
      totalRefills: 4
    }
  ]

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleSelectPrescription = (prescription: any) => {
    setSelectedPrescription(prescription.id)
    if (onSelect) {
      onSelect(prescription)
    }
    // Navigate back after selection
    setTimeout(() => onBack(), 300)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--app-login-gradient)" }}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 relative">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between py-4 px-4">
          {/* Back Button - Circular */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
          >
            <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          
          {/* Title Section */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[var(--card-header-text)]">
              Select Prescription
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Choose from your existing prescriptions</p>
          </div>
          
          {/* Right spacer for balance */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by medication name or Rx number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 bg-[var(--ds-surface-primary)] border-[var(--ds-border-default)] rounded-xl shadow-sm focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content - Prescription List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="fileText" className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-[var(--ds-text-secondary)]">No prescriptions found</p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <Card 
                key={prescription.id} 
                className={`shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer ${
                  selectedPrescription === prescription.id 
                    ? 'border-[var(--app-primary)] ring-2 ring-[var(--app-primary)]/20' 
                    : 'border-gray-100'
                }`}
                onClick={() => handleSelectPrescription(prescription)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-base text-[var(--card-header-text)]">
                          {prescription.medicationName}
                        </h4>
                        <Badge className={`text-xs px-2 py-0.5 h-5 ${
                          prescription.refillsRemaining > 0 
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-[var(--ds-text-secondary)] border-[var(--ds-border-default)]'
                        }`}>
                          {prescription.refillsRemaining} refills left
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-[var(--ds-text-secondary)]">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Dosage:</span>
                          <span>{prescription.dosage}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="calendar" className="w-3 h-3" />
                          <span>{formatDate(prescription.prescribedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Rx#:</span>
                          <span>{prescription.prescriptionNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Dr:</span>
                          <span>{prescription.prescribedBy}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-[var(--ds-text-secondary)]">
                        <span className="font-medium">Instructions:</span> {prescription.instructions}
                      </div>
                    </div>
                    {selectedPrescription === prescription.id && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-[var(--app-primary)] flex items-center justify-center">
                          <Icon name="check" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}