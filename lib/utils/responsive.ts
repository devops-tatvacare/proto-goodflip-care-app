export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export function getResponsiveValue<T>(
  values: Partial<Record<keyof typeof BREAKPOINTS | "base", T>>,
  currentWidth: number,
): T {
  const sortedBreakpoints = Object.entries(BREAKPOINTS).sort(([, a], [, b]) => b - a)

  for (const [key, breakpoint] of sortedBreakpoints) {
    if (currentWidth >= breakpoint && values[key as keyof typeof BREAKPOINTS]) {
      return values[key as keyof typeof BREAKPOINTS]!
    }
  }

  return values.base || values.sm || Object.values(values)[0]!
}

export function useResponsiveValue<T>(values: Partial<Record<keyof typeof BREAKPOINTS | "base", T>>): T {
  // For SSR compatibility, we'll use a default value
  // In a real app, you'd use a hook to get window width
  return values.base || values.sm || Object.values(values)[0]!
}
