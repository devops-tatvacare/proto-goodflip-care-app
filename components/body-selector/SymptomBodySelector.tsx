import React, { useState, useEffect } from 'react'
import { BodySelector } from './BodySelector'
import { BodySilhouetteFront } from './BodySilhouetteFront'
import { BodySilhouetteBack } from './BodySilhouetteBack'
import { InteractiveOverlay } from './InteractiveOverlay'
import { STANDARD_VIEWBOX } from './utils/coordinates'
import { 
  getSymptomBodyMapping, 
  getFilteredRegionsForSymptom,
  getSupportedViewsForSymptom,
  getSymptomRegionInstructions,
  getSymptomDisplayName 
} from './symptom-mappings'

interface SymptomBodySelectorProps {
  symptomId: string
  selectedRegions?: string[]
  onRegionSelect: (regionId: string, regionName: string) => void
  multiSelect?: boolean
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  showInstructions?: boolean
}

export const SymptomBodySelector: React.FC<SymptomBodySelectorProps> = ({
  symptomId,
  selectedRegions = [],
  onRegionSelect,
  multiSelect = false,
  size = 'medium',
  disabled = false,
  showInstructions = true
}) => {
  const mapping = getSymptomBodyMapping(symptomId)
  const supportedViews = getSupportedViewsForSymptom(symptomId)
  const [activeView, setActiveView] = useState<'front' | 'back'>(supportedViews[0] || 'front')

  // Auto-switch to first supported view when symptom changes
  useEffect(() => {
    if (supportedViews.length > 0 && !supportedViews.includes(activeView)) {
      setActiveView(supportedViews[0])
    }
  }, [symptomId, supportedViews, activeView])

  if (!mapping || supportedViews.length === 0) {
    return (
      <div className="text-center text-[var(--ds-text-secondary)] py-8">
        <p>This symptom doesn't require body location selection.</p>
      </div>
    )
  }

  const filteredRegions = getFilteredRegionsForSymptom(symptomId, activeView)
  const displayName = getSymptomDisplayName(symptomId)
  const instructions = getSymptomRegionInstructions(symptomId)

  const handleRegionClick = (regionId: string, regionName: string) => {
    if (disabled) return
    onRegionSelect(regionId, regionName)
  }

  return (
    <div className="symptom-body-selector flex flex-col items-center space-y-4">
      {/* Header */}
      {showInstructions && (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{displayName}</h3>
          <p className="text-sm text-[var(--ds-text-secondary)]">{instructions}</p>
        </div>
      )}

      {/* View Toggle (only if multiple views supported) */}
      {supportedViews.length > 1 && (
        <div className="flex bg-gray-100 rounded-lg p-1">
          {supportedViews.map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              disabled={disabled}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm'
                  : 'text-[var(--ds-text-secondary)] hover:text-gray-800'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {view === 'front' ? 'Front View' : 'Back View'}
            </button>
          ))}
        </div>
      )}

      {/* Body Diagram with Filtered Interactive Overlay */}
      <div className="relative body-diagram-container">
        {activeView === 'front' ? (
          <BodySilhouetteFront view="front" size={size} />
        ) : (
          <BodySilhouetteBack view="back" size={size} />
        )}
        
        <InteractiveOverlay
          regions={filteredRegions}
          selectedRegions={selectedRegions}
          onRegionClick={handleRegionClick}
          viewBox={STANDARD_VIEWBOX.viewBoxString}
          size={size}
          disabled={disabled}
        />
      </div>

      {/* Selected Regions Display */}
      {selectedRegions.length > 0 && (
        <div className="selected-regions max-w-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Areas:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((regionId) => {
              const region = filteredRegions.find(r => r.id === regionId)
              if (!region) return null
              
              return (
                <span
                  key={regionId}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  {region.name}
                  {!disabled && (
                    <button
                      onClick={() => handleRegionClick(regionId, region.name)}
                      className="ml-1 h-3 w-3 rounded-full hover:bg-red-200 flex items-center justify-center"
                    >
                      <span className="sr-only">Remove</span>
                      ×
                    </button>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!disabled && (
        <p className="text-xs text-[var(--ds-text-secondary)] text-center max-w-md">
          {multiSelect 
            ? `Click on body areas to select multiple ${symptomId.replace('-', ' ')} locations. Click again to deselect.` 
            : `Click on a body area to select your ${symptomId.replace('-', ' ')} location. Click again to deselect.`
          }
        </p>
      )}
    </div>
  )
}