// Design System Tokens
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  xxl: '2rem',      // 32px
} as const

export const SIZING = {
  icon: {
    xs: '0.75rem',  // 12px
    sm: '1rem',     // 16px  
    md: '1.25rem',  // 20px
    lg: '1.5rem',   // 24px
  },
  button: {
    sm: '2rem',     // 32px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
  },
  input: {
    minHeight: '2.5rem', // 40px
    maxHeight: '6rem',   // 96px
  }
} as const

export const RADIUS = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  full: '9999px',
} as const

export const LAYOUT = {
  chat: {
    containerMaxHeight: '70vh',
    messagesPadding: SPACING.lg,
    composerPadding: SPACING.md,
  },
  overlay: {
    zIndex: {
      backdrop: 150,
      panel: 175,
      toast: 200,
    }
  }
} as const

export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '250ms', 
    slow: '350ms',
  },
  timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: {
    damping: 25,
    stiffness: 300,
  }
} as const