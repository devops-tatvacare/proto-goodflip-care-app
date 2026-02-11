"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { SelectPrescriptionScreen } from './select-prescription-screen'

interface RefillHistory {
  id: string
  medicationName: string
  dosage: string
  refillDate: string
  status: 'completed' | 'processing' | 'ready' | 'shipped'
  quantity: number
  prescriptionNumber: string
  pharmacyName: string
  nextRefillDate?: string
}

interface PrescriptionRefillScreenProps {
  onBack: () => void
}

export function PrescriptionRefillScreen({ onBack }: PrescriptionRefillScreenProps) {
  const [showSelectPrescription, setShowSelectPrescription] = useState(false)

  // Mock refill history data
  const refillHistory: RefillHistory[] = [
    {
      id: '1',
      medicationName: 'Semaglutide',
      dosage: '0.5mg',
      refillDate: '2024-08-10',
      status: 'completed',
      quantity: 4,
      prescriptionNumber: 'RX12345',
      pharmacyName: 'GoodFlip Pharmacy',
      nextRefillDate: '2024-09-10'
    },
    {
      id: '2',
      medicationName: 'Metformin',
      dosage: '500mg',
      refillDate: '2024-08-05',
      status: 'ready',
      quantity: 90,
      prescriptionNumber: 'RX12346',
      pharmacyName: 'GoodFlip Pharmacy',
      nextRefillDate: '2024-09-05'
    },
    {
      id: '3',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      refillDate: '2024-07-28',
      status: 'shipped',
      quantity: 30,
      prescriptionNumber: 'RX12347',
      pharmacyName: 'GoodFlip Pharmacy',
      nextRefillDate: '2024-08-28'
    }
  ]

  const getStatusColor = (status: RefillHistory['status']) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ready: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[status]
  }

  const getStatusIcon = (status: RefillHistory['status']) => {
    switch (status) {
      case 'completed':
        return <Icon name="checkCircle" className="w-4 h-4" />
      case 'processing':
        return <Icon name="clock" className="w-4 h-4" />
      case 'ready':
        return <Icon name="package" className="w-4 h-4" />
      case 'shipped':
        return <Icon name="package" className="w-4 h-4" />
      default:
        return <Icon name="alertCircle" className="w-4 h-4" />
    }
  }

  const handleUploadRx = () => {
    // Handle file upload logic here
    console.log('Upload Rx clicked')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (showSelectPrescription) {
    return (
      <SelectPrescriptionScreen 
        onBack={() => setShowSelectPrescription(false)}
        onSelect={(prescription) => {
          console.log('Selected prescription:', prescription)
          // Handle prescription selection
        }}
      />
    )
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
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
          >
            <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          
          {/* Title Section */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[var(--card-header-text)]">
              Refill Prescription
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Upload prescription or manage refills</p>
          </div>
          
          {/* Right spacer for balance */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Hero Image Section - Small and neat */}
        <div className="flex justify-center px-4 pb-3">
          <div className="relative">
            <img
              src="/images/rxrefill.png"
              alt="Prescription Refill"
              className="w-20 h-20 object-contain"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] rounded-full flex items-center justify-center">
              <Icon name="medication" className="w-2.5 h-2.5 text-[var(--ds-text-inverse)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content - Single Smooth Scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-8">
          {/* Action Buttons - Same Size */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleUploadRx}
              className="w-full h-11 text-sm font-medium bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] transition-all duration-200"
            >
              <Icon name="upload" className="w-4 h-4 mr-2" />
              Upload Prescription
            </Button>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-[var(--ds-text-secondary)] font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowSelectPrescription(true)}
              className="w-full h-11 text-sm font-medium border-[var(--app-primary)] text-[var(--app-primary)] bg-[var(--ds-surface-primary)] hover:bg-blue-50 transition-all duration-200"
            >
              <Icon name="fileText" className="w-4 h-4 mr-2" />
              Select from Existing Prescriptions
            </Button>
          </div>

          {/* Orders History Title on Background */}
          <div className="relative mb-4">
            <h2 className="text-lg font-bold text-[var(--ds-text-secondary)] text-center tracking-widest uppercase">
              Orders History
            </h2>
          </div>

          {/* History Cards - Floating Design */}
          <div className="space-y-3">
            {refillHistory.length === 0 ? (
              <Card className="shadow-lg border-0 bg-[var(--ds-surface-primary)]/95 backdrop-blur rounded-xl">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="clock" className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-[var(--ds-text-secondary)]">No order history available</p>
                </CardContent>
              </Card>
            ) : (
              refillHistory.map((refill, index) => (
                <Card 
                  key={refill.id} 
                  className="shadow-lg border-0 bg-[var(--ds-surface-primary)]/95 backdrop-blur hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden hover:transform hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'slideUp 0.5s ease-out forwards'
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-base text-[var(--card-header-text)]">
                            {refill.medicationName}
                          </h4>
                          <Badge className={`text-xs px-2 py-0.5 h-5 ${getStatusColor(refill.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(refill.status)}
                              <span className="capitalize">{refill.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-[var(--ds-text-secondary)]">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Dosage:</span>
                            <span>{refill.dosage}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Quantity:</span>
                            <span>{refill.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="calendar" className="w-3 h-3" />
                            <span>{formatDate(refill.refillDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Rx#:</span>
                            <span>{refill.prescriptionNumber}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-[var(--ds-text-secondary)]">
                          <span className="font-medium">Pharmacy:</span> {refill.pharmacyName}
                        </div>
                        {refill.nextRefillDate && (
                          <div className="mt-1 text-sm text-[var(--ds-text-secondary)]">
                            <span className="font-medium">Next refill:</span> {formatDate(refill.nextRefillDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {refill.status === 'ready' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          className="w-full h-9 text-xs font-medium bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] transition-all duration-200"
                        >
                          <Icon name="package" className="w-3 h-3 mr-1" />
                          Ready for Pickup
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}