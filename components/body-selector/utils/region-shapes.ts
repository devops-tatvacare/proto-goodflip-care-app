// Region Shape Utilities - Advanced overlay shapes for better body contour matching
// Provides custom shapes for regions that don't fit well in rectangles

export interface RegionShape {
  type: 'rect' | 'ellipse' | 'polygon' | 'path'
  coordinates: any // Flexible for different shape types
}

// Custom shapes for specific body regions that need better contour matching
export const CUSTOM_REGION_SHAPES: Record<string, RegionShape> = {
  // Head regions - elliptical shapes
  'head-front': {
    type: 'ellipse',
    coordinates: { cx: 100, cy: 22, rx: 15, ry: 18 }
  },
  'head-back': {
    type: 'ellipse', 
    coordinates: { cx: 100, cy: 22, rx: 15, ry: 18 }
  },
  
  // Shoulder regions - curved to match shoulder slope
  'chest-upper': {
    type: 'path',
    coordinates: 'M 70 47 C 75 45, 85 45, 100 47 C 115 45, 125 45, 130 47 L 130 72 L 70 72 Z'
  },
  
  // Arm regions - elliptical for natural arm shape  
  'arm-left-upper': {
    type: 'ellipse',
    coordinates: { cx: 57, cy: 75, rx: 8, ry: 20 }
  },
  'arm-right-upper': {
    type: 'ellipse',
    coordinates: { cx: 142, cy: 75, rx: 8, ry: 20 }
  },
  'arm-left-lower': {
    type: 'ellipse',
    coordinates: { cx: 49, cy: 112, rx: 9, ry: 17 }
  },
  'arm-right-lower': {
    type: 'ellipse',
    coordinates: { cx: 151, cy: 112, rx: 9, ry: 17 }
  },
  
  // Back arm regions
  'arm-left-back-upper': {
    type: 'ellipse',
    coordinates: { cx: 61, cy: 75, rx: 12, ry: 22 }
  },
  'arm-right-back-upper': {
    type: 'ellipse',
    coordinates: { cx: 139, cy: 75, rx: 12, ry: 22 }
  },
  'arm-left-back-lower': {
    type: 'ellipse',
    coordinates: { cx: 49, cy: 115, rx: 10, ry: 20 }
  },
  'arm-right-back-lower': {
    type: 'ellipse',
    coordinates: { cx: 151, cy: 115, rx: 10, ry: 20 }
  },
  
  // Leg regions - elliptical for natural leg shape
  'leg-left-upper': {
    type: 'ellipse',
    coordinates: { cx: 91, cy: 172, rx: 9, ry: 17 }
  },
  'leg-right-upper': {
    type: 'ellipse',
    coordinates: { cx: 108, cy: 172, rx: 9, ry: 17 }
  },
  'leg-left-lower': {
    type: 'ellipse',
    coordinates: { cx: 91, cy: 211, rx: 9, ry: 21 }
  },
  'leg-right-lower': {
    type: 'ellipse',
    coordinates: { cx: 108, cy: 211, rx: 9, ry: 21 }
  },
  
  // Back leg regions
  'leg-left-back-upper': {
    type: 'ellipse',
    coordinates: { cx: 91, cy: 179, rx: 11, ry: 20 }
  },
  'leg-right-back-upper': {
    type: 'ellipse',
    coordinates: { cx: 109, cy: 179, rx: 11, ry: 20 }
  },
  'leg-left-back-lower': {
    type: 'ellipse',
    coordinates: { cx: 91, cy: 219, rx: 9, ry: 22 }
  },
  'leg-right-back-lower': {
    type: 'ellipse',
    coordinates: { cx: 109, cy: 219, rx: 9, ry: 22 }
  },
  
  // Spine regions - narrow rectangles
  'spine-cervical': {
    type: 'rect',
    coordinates: { x: 97, y: 40, width: 6, height: 25, rx: 3 }
  },
  'spine-thoracic': {
    type: 'rect',
    coordinates: { x: 97, y: 65, width: 6, height: 45, rx: 3 }
  },
  'spine-lumbar': {
    type: 'rect',
    coordinates: { x: 97, y: 110, width: 6, height: 25, rx: 3 }
  }
}

export const getRegionShape = (regionId: string): RegionShape | null => {
  return CUSTOM_REGION_SHAPES[regionId] || null
}

export const hasCustomShape = (regionId: string): boolean => {
  return regionId in CUSTOM_REGION_SHAPES
}