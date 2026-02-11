// Symptom tracking UI components - Enhanced with new body selector system
// Clean, maintainable components for symptom logging

import React, { useState } from "react"
import { getBodyLocationsForSymptom } from "./symptom-data"
import { SymptomBodySelector, isSymptomLocationSpecific } from "@/components/body-selector"

interface BodyAreaSelectorProps {
  symptomId: string
  onSelect: (location: string) => void
  multiSelect?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const BodyAreaSelector: React.FC<BodyAreaSelectorProps> = ({ 
  symptomId, 
  onSelect, 
  multiSelect = false,
  size = 'medium'  // Changed default to medium for better visibility
}) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  // Check if this symptom supports body location selection
  if (!isSymptomLocationSpecific(symptomId)) {
    return null
  }

  const handleRegionSelect = (regionId: string, regionName: string) => {
    // Update internal state
    if (multiSelect) {
      setSelectedRegions(prev => 
        prev.includes(regionId) 
          ? prev.filter(id => id !== regionId)
          : [...prev, regionId]
      )
    } else {
      setSelectedRegions(prev => 
        prev.includes(regionId) ? [] : [regionId]
      )
    }
    
    // Call the parent callback with region name
    onSelect(regionName)
  }

  return (
    <div className="w-full">
      <SymptomBodySelector
        symptomId={symptomId}
        selectedRegions={selectedRegions}
        onRegionSelect={handleRegionSelect}
        multiSelect={multiSelect}
        size={size}
        disabled={false}
        showInstructions={true}
      />
    </div>
  )
}

// Simple symptom intensity slider with contextual labeling
interface SymptomSliderProps {
  symptom: {
    intensityRange: {
      min: number
      max: number
      unit: string
      labels: {
        low: string
        high: string
      }
    }
  }
  value: number
  onChange: (value: number) => void
  onSubmit: (value: number) => void
}

export const SymptomSlider: React.FC<SymptomSliderProps> = ({ 
  symptom, 
  value, 
  onChange, 
  onSubmit 
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--ds-text-secondary)]">{symptom.intensityRange.labels.low}</span>
      <span className="px-2 py-1 bg-[var(--app-primary)] text-[var(--ds-text-inverse)] rounded text-xs">
        {value} {symptom.intensityRange.unit}
      </span>
      <span className="text-[var(--ds-text-secondary)]">{symptom.intensityRange.labels.high}</span>
    </div>
    <input
      type="range"
      min={symptom.intensityRange.min}
      max={symptom.intensityRange.max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
    <button
      onClick={() => onSubmit(value)}
      className="w-full bg-[var(--app-primary)] text-[var(--ds-text-inverse)] px-3 py-2 rounded text-sm"
    >
      Log {value} {symptom.intensityRange.unit}
    </button>
  </div>
)