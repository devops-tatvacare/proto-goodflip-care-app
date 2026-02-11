// Body Region Data - Anatomically correct regions for pain/symptom tracking
// Coordinates mapped to standard body silhouette proportions

import { BodyView } from '../types'

// Front view regions - Updated to match realistic silhouette
export const FRONT_BODY_REGIONS: BodyView = {
  id: 'front',
  name: 'Front View',
  regions: [
    // Head/Neck - Aligned with realistic head shape
    { id: 'head-front', name: 'Head', coordinates: { x: 85, y: 5, width: 30, height: 33 } },
    { id: 'neck-front', name: 'Neck', coordinates: { x: 94, y: 38, width: 12, height: 10 } },
    
    // Chest/Upper Torso - Matching shoulder and chest paths (y: 47-95)
    { id: 'chest-upper', name: 'Upper Chest', coordinates: { x: 70, y: 47, width: 60, height: 25 } },
    { id: 'chest-lower', name: 'Lower Chest', coordinates: { x: 75, y: 72, width: 50, height: 23 } },
    
    // Abdomen (9 regions) - Matching abdomen path (y: 95-155, x: 75-125)
    { id: 'abdomen-upper-right', name: 'Right Upper Abdomen', coordinates: { x: 75, y: 95, width: 17, height: 20 } },
    { id: 'abdomen-upper-center', name: 'Upper Center Abdomen', coordinates: { x: 92, y: 95, width: 16, height: 20 } },
    { id: 'abdomen-upper-left', name: 'Left Upper Abdomen', coordinates: { x: 108, y: 95, width: 17, height: 20 } },
    
    { id: 'abdomen-middle-right', name: 'Right Middle Abdomen', coordinates: { x: 76, y: 115, width: 16, height: 20 } },
    { id: 'abdomen-middle-center', name: 'Center Abdomen', coordinates: { x: 92, y: 115, width: 16, height: 20 } },
    { id: 'abdomen-middle-left', name: 'Left Middle Abdomen', coordinates: { x: 108, y: 115, width: 16, height: 20 } },
    
    { id: 'abdomen-lower-right', name: 'Right Lower Abdomen', coordinates: { x: 77, y: 135, width: 15, height: 20 } },
    { id: 'abdomen-lower-center', name: 'Lower Center Abdomen', coordinates: { x: 92, y: 135, width: 16, height: 20 } },
    { id: 'abdomen-lower-left', name: 'Left Lower Abdomen', coordinates: { x: 108, y: 135, width: 15, height: 20 } },
    
    // Arms - Matching arm paths (Left: x: 40-65, Right: x: 135-160)  
    { id: 'arm-left-upper', name: 'Left Upper Arm', coordinates: { x: 50, y: 55, width: 15, height: 40 } },
    { id: 'arm-right-upper', name: 'Right Upper Arm', coordinates: { x: 135, y: 55, width: 15, height: 40 } },
    { id: 'arm-left-lower', name: 'Left Lower Arm', coordinates: { x: 40, y: 95, width: 18, height: 35 } },
    { id: 'arm-right-lower', name: 'Right Lower Arm', coordinates: { x: 142, y: 95, width: 18, height: 35 } },
    
    // Legs - Matching leg paths (Left: x: 82-101, Right: x: 99-118, y: 155-232)
    { id: 'leg-left-upper', name: 'Left Upper Leg', coordinates: { x: 82, y: 155, width: 19, height: 35 } },
    { id: 'leg-right-upper', name: 'Right Upper Leg', coordinates: { x: 99, y: 155, width: 19, height: 35 } },
    { id: 'leg-left-lower', name: 'Left Lower Leg', coordinates: { x: 82, y: 190, width: 19, height: 42 } },
    { id: 'leg-right-lower', name: 'Right Lower Leg', coordinates: { x: 99, y: 190, width: 19, height: 42 } },
  ]
}

// Back view regions - Updated to match realistic back silhouette
export const BACK_BODY_REGIONS: BodyView = {
  id: 'back',
  name: 'Back View',
  regions: [
    // Head/Neck - Aligned with realistic back head shape
    { id: 'head-back', name: 'Back of Head', coordinates: { x: 85, y: 5, width: 30, height: 35 } },
    { id: 'neck-back', name: 'Back of Neck', coordinates: { x: 94, y: 38, width: 12, height: 10 } },
    
    // Back regions - Matching back silhouette paths (y: 47-160)
    { id: 'back-upper', name: 'Upper Back', coordinates: { x: 70, y: 47, width: 60, height: 35 } },
    { id: 'back-middle', name: 'Middle Back', coordinates: { x: 75, y: 82, width: 50, height: 26 } },
    { id: 'back-lower', name: 'Lower Back', coordinates: { x: 80, y: 108, width: 40, height: 27 } },
    
    // Spine regions - Following spine path (x: 99-101, y: 40-150)
    { id: 'spine-cervical', name: 'Cervical Spine', coordinates: { x: 97, y: 40, width: 6, height: 25 } },
    { id: 'spine-thoracic', name: 'Thoracic Spine', coordinates: { x: 97, y: 65, width: 6, height: 45 } },
    { id: 'spine-lumbar', name: 'Lumbar Spine', coordinates: { x: 97, y: 110, width: 6, height: 25 } },
    
    // Buttocks/Hip - Matching lower back path (y: 135-160)
    { id: 'buttocks-left', name: 'Left Buttocks', coordinates: { x: 80, y: 135, width: 20, height: 25 } },
    { id: 'buttocks-right', name: 'Right Buttocks', coordinates: { x: 100, y: 135, width: 20, height: 25 } },
    
    // Arms (back view) - Aligned with realistic arm positioning
    { id: 'arm-left-back-upper', name: 'Left Upper Arm (Back)', coordinates: { x: 52, y: 55, width: 18, height: 40 } },
    { id: 'arm-right-back-upper', name: 'Right Upper Arm (Back)', coordinates: { x: 130, y: 55, width: 18, height: 40 } },
    { id: 'arm-left-back-lower', name: 'Left Lower Arm (Back)', coordinates: { x: 40, y: 95, width: 18, height: 40 } },
    { id: 'arm-right-back-lower', name: 'Right Lower Arm (Back)', coordinates: { x: 142, y: 95, width: 18, height: 40 } },
    
    // Legs (back view) - Matching back leg paths (Left: x: 82-101, Right: x: 99-118, y: 160-237)
    { id: 'leg-left-back-upper', name: 'Left Upper Leg (Back)', coordinates: { x: 82, y: 160, width: 19, height: 35 } },
    { id: 'leg-right-back-upper', name: 'Right Upper Leg (Back)', coordinates: { x: 99, y: 160, width: 19, height: 35 } },
    { id: 'leg-left-back-lower', name: 'Left Lower Leg (Back)', coordinates: { x: 82, y: 195, width: 19, height: 42 } },
    { id: 'leg-right-back-lower', name: 'Right Lower Leg (Back)', coordinates: { x: 99, y: 195, width: 19, height: 42 } },
  ]
}

export const BODY_VIEWS: BodyView[] = [FRONT_BODY_REGIONS, BACK_BODY_REGIONS]