// Coordinate Utilities - Helper functions for body region positioning
// Scale-independent coordinate management and collision detection

import { BodyRegion } from '../types'

export const SIZE_MULTIPLIERS = {
  small: 0.7,
  medium: 1.0,
  large: 1.4
} as const

export const STANDARD_VIEWBOX = {
  width: 200,
  height: 240,
  viewBoxString: '0 0 200 240'
} as const

/**
 * Scale coordinates based on size setting
 */
export function scaleCoordinates(
  coords: BodyRegion['coordinates'],
  size: keyof typeof SIZE_MULTIPLIERS = 'medium'
): BodyRegion['coordinates'] {
  const multiplier = SIZE_MULTIPLIERS[size]
  
  return {
    x: coords.x * multiplier,
    y: coords.y * multiplier,
    width: coords.width * multiplier,
    height: coords.height * multiplier
  }
}

/**
 * Check if a point is within a region
 */
export function isPointInRegion(
  x: number, 
  y: number, 
  region: BodyRegion['coordinates']
): boolean {
  return (
    x >= region.x &&
    x <= region.x + region.width &&
    y >= region.y &&
    y <= region.y + region.height
  )
}

/**
 * Find which region contains a point
 */
export function findRegionAtPoint(
  x: number, 
  y: number, 
  regions: BodyRegion[]
): BodyRegion | null {
  return regions.find(region => isPointInRegion(x, y, region.coordinates)) || null
}

/**
 * Convert SVG click event to relative coordinates
 */
export function getSVGRelativeCoordinates(
  event: React.MouseEvent<SVGElement>,
  svgElement: SVGSVGElement
): { x: number; y: number } {
  const rect = svgElement.getBoundingClientRect()
  const viewBox = svgElement.viewBox.baseVal
  
  const scaleX = viewBox.width / rect.width
  const scaleY = viewBox.height / rect.height
  
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  }
}