// Symptom to Body Region Mapping System
// Maintains clean separation between symptom data and body region data

import { FRONT_BODY_REGIONS, BACK_BODY_REGIONS } from './data/body-regions'
import { BodyRegion, BodyView } from './types'

export interface SymptomBodyMapping {
  symptomId: string
  supportedViews: ('front' | 'back')[]
  regionFilters: {
    front?: string[]  // Region IDs that are relevant for this symptom
    back?: string[]   // Region IDs that are relevant for this symptom
  }
  displayName: string
  instructions: string
}

// Core symptom mappings - no hardcoded values, dynamically filterable
export const SYMPTOM_BODY_MAPPINGS: SymptomBodyMapping[] = [
  {
    symptomId: 'abdominal-pain',
    supportedViews: ['front'],
    regionFilters: {
      front: [
        'abdomen-upper-right', 'abdomen-upper-center', 'abdomen-upper-left',
        'abdomen-middle-right', 'abdomen-middle-center', 'abdomen-middle-left',
        'abdomen-lower-right', 'abdomen-lower-center', 'abdomen-lower-left'
      ]
    },
    displayName: 'Abdominal Pain Location',
    instructions: 'Select the area where you feel pain'
  },
  {
    symptomId: 'headache',
    supportedViews: ['front', 'back'],
    regionFilters: {
      front: ['head-front'],
      back: ['head-back']
    },
    displayName: 'Headache Location',
    instructions: 'Select where your headache is located'
  },
  {
    symptomId: 'heartburn',
    supportedViews: ['front'],
    regionFilters: {
      front: ['chest-upper', 'chest-lower']
    },
    displayName: 'Heartburn/GERD Location',
    instructions: 'Select where you feel the burning sensation'
  },
  {
    symptomId: 'injection-site',
    supportedViews: ['front', 'back'],
    regionFilters: {
      front: [
        'arm-left-upper', 'arm-right-upper',
        'abdomen-upper-right', 'abdomen-upper-left', 'abdomen-middle-right', 'abdomen-middle-left',
        'leg-left-upper', 'leg-right-upper'
      ],
      back: [
        'arm-left-back-upper', 'arm-right-back-upper',
        'leg-left-back-upper', 'leg-right-back-upper'
      ]
    },
    displayName: 'Injection Site Location',
    instructions: 'Select where you inject or have injection site reactions'
  },
  {
    symptomId: 'back-pain',
    supportedViews: ['back'],
    regionFilters: {
      back: [
        'back-upper', 'back-middle', 'back-lower',
        'spine-cervical', 'spine-thoracic', 'spine-lumbar'
      ]
    },
    displayName: 'Back Pain Location',
    instructions: 'Select where your back pain is located'
  },
  {
    symptomId: 'joint-pain',
    supportedViews: ['front', 'back'],
    regionFilters: {
      front: [
        'arm-left-upper', 'arm-right-upper', 'arm-left-lower', 'arm-right-lower',
        'leg-left-upper', 'leg-right-upper', 'leg-left-lower', 'leg-right-lower'
      ],
      back: [
        'arm-left-back-upper', 'arm-right-back-upper', 'arm-left-back-lower', 'arm-right-back-lower',
        'leg-left-back-upper', 'leg-right-back-upper', 'leg-left-back-lower', 'leg-right-back-lower'
      ]
    },
    displayName: 'Joint Pain Location',
    instructions: 'Select which joints are affected'
  },
  {
    symptomId: 'chest-pain',
    supportedViews: ['front'],
    regionFilters: {
      front: ['chest-upper', 'chest-lower']
    },
    displayName: 'Chest Pain Location',
    instructions: 'Select where you feel chest pain'
  },
  {
    symptomId: 'muscle-pain',
    supportedViews: ['front', 'back'],
    regionFilters: {
      front: [
        'neck-front', 'chest-upper', 'chest-lower',
        'arm-left-upper', 'arm-right-upper', 'arm-left-lower', 'arm-right-lower',
        'abdomen-upper-center', 'abdomen-middle-center',
        'leg-left-upper', 'leg-right-upper', 'leg-left-lower', 'leg-right-lower'
      ],
      back: [
        'neck-back', 'back-upper', 'back-middle', 'back-lower',
        'arm-left-back-upper', 'arm-right-back-upper', 'arm-left-back-lower', 'arm-right-back-lower',
        'leg-left-back-upper', 'leg-right-back-upper', 'leg-left-back-lower', 'leg-right-back-lower'
      ]
    },
    displayName: 'Muscle Pain Location',
    instructions: 'Select which muscles are sore or painful'
  },
  {
    symptomId: 'swelling',
    supportedViews: ['front', 'back'],
    regionFilters: {
      front: [
        'head-front', 'neck-front',
        'arm-left-upper', 'arm-right-upper', 'arm-left-lower', 'arm-right-lower',
        'abdomen-upper-center', 'abdomen-middle-center', 'abdomen-lower-center',
        'leg-left-upper', 'leg-right-upper', 'leg-left-lower', 'leg-right-lower'
      ],
      back: [
        'head-back', 'neck-back',
        'arm-left-back-upper', 'arm-right-back-upper', 'arm-left-back-lower', 'arm-right-back-lower',
        'leg-left-back-upper', 'leg-right-back-upper', 'leg-left-back-lower', 'leg-right-back-lower'
      ]
    },
    displayName: 'Swelling Location',
    instructions: 'Select where you notice swelling'
  },
  {
    symptomId: 'skin-reaction',
    supportedViews: ['front', 'back'],
    regionFilters: {
      front: [
        'head-front', 'neck-front', 'chest-upper', 'chest-lower',
        'arm-left-upper', 'arm-right-upper', 'arm-left-lower', 'arm-right-lower',
        'abdomen-upper-right', 'abdomen-upper-center', 'abdomen-upper-left',
        'abdomen-middle-right', 'abdomen-middle-center', 'abdomen-middle-left',
        'abdomen-lower-right', 'abdomen-lower-center', 'abdomen-lower-left',
        'leg-left-upper', 'leg-right-upper', 'leg-left-lower', 'leg-right-lower'
      ],
      back: [
        'head-back', 'neck-back', 'back-upper', 'back-middle', 'back-lower',
        'arm-left-back-upper', 'arm-right-back-upper', 'arm-left-back-lower', 'arm-right-back-lower',
        'buttocks-left', 'buttocks-right',
        'leg-left-back-upper', 'leg-right-back-upper', 'leg-left-back-lower', 'leg-right-back-lower'
      ]
    },
    displayName: 'Skin Reaction Location',
    instructions: 'Select where you see rash, redness, or skin changes'
  }
]

// Utility functions for dynamic region filtering
export const getSymptomBodyMapping = (symptomId: string): SymptomBodyMapping | undefined => {
  return SYMPTOM_BODY_MAPPINGS.find(mapping => mapping.symptomId === symptomId)
}

export const getFilteredBodyView = (bodyView: BodyView, regionIds: string[]): BodyView => {
  return {
    ...bodyView,
    regions: bodyView.regions.filter(region => regionIds.includes(region.id))
  }
}

export const getSupportedViewsForSymptom = (symptomId: string): ('front' | 'back')[] => {
  const mapping = getSymptomBodyMapping(symptomId)
  return mapping?.supportedViews || []
}

export const getFilteredRegionsForSymptom = (
  symptomId: string, 
  view: 'front' | 'back'
): BodyRegion[] => {
  const mapping = getSymptomBodyMapping(symptomId)
  if (!mapping) return []
  
  const regionIds = mapping.regionFilters[view] || []
  const bodyView = view === 'front' ? FRONT_BODY_REGIONS : BACK_BODY_REGIONS
  
  return bodyView.regions.filter(region => regionIds.includes(region.id))
}

export const isSymptomLocationSpecific = (symptomId: string): boolean => {
  return SYMPTOM_BODY_MAPPINGS.some(mapping => mapping.symptomId === symptomId)
}

export const getSymptomRegionInstructions = (symptomId: string): string => {
  const mapping = getSymptomBodyMapping(symptomId)
  return mapping?.instructions || 'Select the affected area'
}

export const getSymptomDisplayName = (symptomId: string): string => {
  const mapping = getSymptomBodyMapping(symptomId)
  return mapping?.displayName || 'Body Location'
}