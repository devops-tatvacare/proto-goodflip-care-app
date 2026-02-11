// Overlay System Configuration
// Defines consistent height constraints and behavior for all overlay levels

export const OVERLAY_CONFIG = {
  // Height constraints (leaving space from top of mobile frame)
  maxHeight: "80%", // Primary overlays stop at 80% of container height (20% from top)
  minHeight: "80%", // All overlays should open to 80% height regardless of content
  topOffset: "20%", // Space from top of frame (20% of container height)
  
  // Z-index layers for proper stacking
  zIndex: {
    primary: 100,    // Profile, Notifications, Devices overlays
    secondary: 200,  // Settings, nested views
    tertiary: 300,   // Deep nested overlays if needed
  },
  
  // Animation settings
  animation: {
    duration: 0.4,
    damping: 30,
    stiffness: 300,
    dragThreshold: 150, // Distance to drag for dismissal
    velocityThreshold: 500, // Velocity threshold for dismissal
  },
  
  // Common styles
  styles: {
    backdrop: "bg-black/50",
    panel: "bg-white rounded-t-3xl shadow-2xl",
    dragHandle: "w-12 h-1.5 bg-gray-300 rounded-full",
    gradient: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
  },
  
  // Behavior rules
  behavior: {
    primaryHasBackdropDismiss: true,
    secondaryHasBackdropDismiss: true, 
    tertiaryHasBackdropDismiss: true,
    secondaryHasBackButton: false, // Only slide-down dismissal
    tertiaryHasBackButton: false,  // Only slide-down dismissal
  }
} as const

// Helper function to get overlay style props
export function getOverlayStyles(level: 'primary' | 'secondary' | 'tertiary') {
  return {
    height: OVERLAY_CONFIG.maxHeight, // Use fixed height instead of maxHeight
    minHeight: OVERLAY_CONFIG.minHeight,
    zIndex: OVERLAY_CONFIG.zIndex[level],
    background: OVERLAY_CONFIG.styles.gradient,
  }
}

// Helper function for animation props
export function getOverlayAnimation() {
  return {
    type: "spring" as const,
    damping: OVERLAY_CONFIG.animation.damping,
    stiffness: OVERLAY_CONFIG.animation.stiffness,
    duration: OVERLAY_CONFIG.animation.duration,
  }
}

// Helper function for drag constraints
export function getDragConfig() {
  return {
    dragConstraints: { top: 0, bottom: 400 },
    dragElastic: { top: 0, bottom: 0.2 },
    dismissThreshold: OVERLAY_CONFIG.animation.dragThreshold,
    velocityThreshold: OVERLAY_CONFIG.animation.velocityThreshold,
  }
}