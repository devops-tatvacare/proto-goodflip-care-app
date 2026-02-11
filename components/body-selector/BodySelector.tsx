import React, { useState } from 'react'
import { BodySelectorProps } from './types'
import { BodySilhouetteFront } from './BodySilhouetteFront'
import { BodySilhouetteBack } from './BodySilhouetteBack'
import { InteractiveOverlay } from './InteractiveOverlay'
import { FRONT_BODY_REGIONS, BACK_BODY_REGIONS } from './data/body-regions'
import { STANDARD_VIEWBOX } from './utils/coordinates'

export const BodySelector: React.FC<BodySelectorProps> = ({
  selectedRegions = [],
  onRegionSelect,
  multiSelect = false,
  size = 'medium',
  showLabels = true,
  disabled = false
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back'>('front')
  const currentBodyView = activeView === 'front' ? FRONT_BODY_REGIONS : BACK_BODY_REGIONS

  const handleRegionClick = (regionId: string, regionName: string) => {
    if (disabled) return

    let newSelection: string[]
    
    if (multiSelect) {
      newSelection = selectedRegions.includes(regionId)
        ? selectedRegions.filter(id => id !== regionId)
        : [...selectedRegions, regionId]
    } else {
      newSelection = selectedRegions.includes(regionId) ? [] : [regionId]
    }

    onRegionSelect(regionId, regionName)
  }

  return (
    <div className="body-selector flex flex-col items-center space-y-4">
      {/* View Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveView('front')}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'front'
              ? 'bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm'
              : 'text-[var(--ds-text-secondary)] hover:text-gray-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Front View
        </button>
        <button
          onClick={() => setActiveView('back')}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'back'
              ? 'bg-[var(--ds-surface-primary)] text-gray-900 shadow-sm'
              : 'text-[var(--ds-text-secondary)] hover:text-gray-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Back View
        </button>
      </div>

      {/* Body Diagram with Interactive Overlay */}
      <div className="relative body-diagram-container">
        {activeView === 'front' ? (
          <BodySilhouetteFront view="front" size={size} />
        ) : (
          <BodySilhouetteBack view="back" size={size} />
        )}
        
        <InteractiveOverlay
          regions={currentBodyView.regions}
          selectedRegions={selectedRegions}
          onRegionClick={handleRegionClick}
          viewBox={STANDARD_VIEWBOX.viewBoxString}
          size={size}
          disabled={disabled}
        />
      </div>

      {/* Selected Regions Display */}
      {showLabels && selectedRegions.length > 0 && (
        <div className="selected-regions max-w-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Areas:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((regionId) => {
              const region = currentBodyView.regions.find(r => r.id === regionId)
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
            ? 'Click on body areas to select multiple regions. Click again to deselect.' 
            : 'Click on a body area to select it. Click again to deselect.'
          }
        </p>
      )}
    </div>
  )
}