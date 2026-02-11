// Body Selector Types - Clean type definitions
// Centralized type system for body selection components

export interface BodyRegion {
  id: string
  name: string
  coordinates: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface BodyView {
  id: 'front' | 'back'
  name: string
  regions: BodyRegion[]
}

export interface BodySelectorProps {
  selectedRegions?: string[]
  onRegionSelect: (regionId: string, regionName: string) => void
  multiSelect?: boolean
  size?: 'small' | 'medium' | 'large'
  showLabels?: boolean
  disabled?: boolean
}

export interface BodySilhouetteProps {
  view: 'front' | 'back'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export interface InteractiveOverlayProps {
  regions: BodyRegion[]
  selectedRegions: string[]
  onRegionClick: (regionId: string, regionName: string) => void
  viewBox: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}