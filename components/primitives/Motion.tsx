"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type MotionDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower'
export type MotionEasing = 'linear' | 'in' | 'out' | 'in-out' | 'spring' | 'bounce' | 'smooth' | 'sharp'
export type MotionPreset = 'alert' | 'interaction' | 'modal' | 'page' | 'data'

export interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The HTML element to render. Defaults to 'div'.
   */
  as?: keyof JSX.IntrinsicElements
  
  /**
   * Motion duration preset
   */
  duration?: MotionDuration
  
  /**
   * Motion easing function
   */
  easing?: MotionEasing
  
  /**
   * Healthcare-specific motion preset
   */
  preset?: MotionPreset
  
  /**
   * Properties to animate (defaults to 'all')
   */
  properties?: string
  
  /**
   * Whether to reduce motion for accessibility
   */
  respectReducedMotion?: boolean
}

const motionDurationClasses: Record<MotionDuration, string> = {
  instant: 'duration-instant',
  fast: 'duration-fast',
  normal: 'duration-normal',
  slow: 'duration-slow',
  slower: 'duration-slower',
}

const motionEasingClasses: Record<MotionEasing, string> = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  'in-out': 'ease-in-out',
  spring: 'ease-spring',
  bounce: 'ease-bounce',
  smooth: 'ease-smooth',
  sharp: 'ease-sharp',
}

const motionPresetClasses: Record<MotionPreset, string> = {
  alert: 'duration-fast ease-out',
  interaction: 'duration-normal ease-out',
  modal: 'duration-normal ease-smooth',
  page: 'duration-slow ease-smooth',
  data: 'duration-slow ease-out',
}

/**
 * Motion - Provides consistent animation timing using design system tokens
 */
export const Motion = React.forwardRef<HTMLDivElement, MotionProps>(
  ({
    as: Component = 'div',
    duration = 'normal',
    easing = 'out',
    preset,
    properties = 'all',
    respectReducedMotion = true,
    className,
    children,
    style,
    ...props
  }, ref) => {
    const motionClasses = cn(
      // Base transition
      'transition-all',
      
      // Use preset if provided, otherwise use individual duration/easing
      preset ? motionPresetClasses[preset] : [
        motionDurationClasses[duration],
        motionEasingClasses[easing]
      ],
      
      // Respect reduced motion preference
      respectReducedMotion && 'motion-reduce:transition-none motion-reduce:transition-duration-[0.01ms]',
      
      className
    )

    const motionStyle = {
      transitionProperty: properties,
      ...style,
    }

    return React.createElement(
      Component,
      {
        ref: ref as any,
        className: motionClasses,
        style: motionStyle,
        ...props,
      },
      children
    )
  }
)

Motion.displayName = 'Motion'

/**
 * AnimatedContainer - Pre-configured container for animated content
 */
export interface AnimatedContainerProps extends Omit<MotionProps, 'preset'> {
  /**
   * Animation entrance preset
   */
  entrance?: 'fade' | 'slide' | 'scale' | 'bounce'
  
  /**
   * Whether the component is visible (controls animation)
   */
  show?: boolean
  
  /**
   * Animation direction for slide animations
   */
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const AnimatedContainer = React.forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({
    entrance = 'fade',
    show = true,
    direction = 'up',
    duration = 'normal',
    easing = 'smooth',
    className,
    children,
    ...props
  }, ref) => {
    const getAnimationClasses = () => {
      const base = show ? 'opacity-100' : 'opacity-0'
      
      switch (entrance) {
        case 'fade':
          return show ? 'opacity-100' : 'opacity-0'
          
        case 'slide':
          const slideDirection = {
            up: show ? 'translate-y-0' : 'translate-y-4',
            down: show ? 'translate-y-0' : '-translate-y-4',
            left: show ? 'translate-x-0' : 'translate-x-4',
            right: show ? 'translate-x-0' : '-translate-x-4',
          }[direction]
          return cn(base, slideDirection)
          
        case 'scale':
          return cn(base, show ? 'scale-100' : 'scale-95')
          
        case 'bounce':
          return cn(base, show ? 'scale-100' : 'scale-90')
          
        default:
          return base
      }
    }

    return (
      <Motion
        ref={ref}
        duration={duration}
        easing={entrance === 'bounce' ? 'bounce' : easing}
        className={cn(
          getAnimationClasses(),
          className
        )}
        {...props}
      >
        {children}
      </Motion>
    )
  }
)

AnimatedContainer.displayName = 'AnimatedContainer'

/**
 * Transition wrapper for page/route transitions
 */
export interface PageTransitionProps extends MotionProps {
  /**
   * Unique key for the page (triggers animation on change)
   */
  pageKey: string | number
  
  /**
   * Transition type
   */
  type?: 'fade' | 'slide' | 'scale'
  
  /**
   * Whether the page is entering or leaving
   */
  state?: 'entering' | 'leaving' | 'idle'
}

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({
    pageKey,
    type = 'fade',
    state = 'idle',
    duration = 'normal',
    easing = 'smooth',
    className,
    children,
    ...props
  }, ref) => {
    const getTransitionClasses = () => {
      switch (type) {
        case 'fade':
          return {
            idle: 'opacity-100',
            entering: 'opacity-100',
            leaving: 'opacity-0',
          }[state]
          
        case 'slide':
          return {
            idle: 'translate-x-0 opacity-100',
            entering: 'translate-x-0 opacity-100',
            leaving: 'translate-x-full opacity-0',
          }[state]
          
        case 'scale':
          return {
            idle: 'scale-100 opacity-100',
            entering: 'scale-100 opacity-100',
            leaving: 'scale-95 opacity-0',
          }[state]
          
        default:
          return 'opacity-100'
      }
    }

    return (
      <Motion
        key={pageKey}
        ref={ref}
        preset="page"
        duration={duration}
        easing={easing}
        className={cn(
          getTransitionClasses(),
          className
        )}
        {...props}
      >
        {children}
      </Motion>
    )
  }
)

PageTransition.displayName = 'PageTransition'

/**
 * Healthcare-specific animated components
 */

export const MedicalAlert = React.forwardRef<HTMLDivElement, MotionProps>(
  ({ className, children, ...props }, ref) => (
    <Motion
      ref={ref}
      preset="alert"
      className={cn(
        "animate-bounce-in",
        className
      )}
      {...props}
    >
      {children}
    </Motion>
  )
)

MedicalAlert.displayName = 'MedicalAlert'

export const DataLoadingContainer = React.forwardRef<HTMLDivElement, MotionProps>(
  ({ className, children, ...props }, ref) => (
    <Motion
      ref={ref}
      preset="data"
      className={cn(
        "animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
    </Motion>
  )
)

DataLoadingContainer.displayName = 'DataLoadingContainer'

export const InteractiveElement = React.forwardRef<HTMLDivElement, MotionProps>(
  ({ className, children, ...props }, ref) => (
    <Motion
      ref={ref}
      preset="interaction"
      properties="transform, opacity, box-shadow"
      className={cn(
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </Motion>
  )
)

InteractiveElement.displayName = 'InteractiveElement'

/**
 * Utility hooks for motion
 */

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

export const useMotionPreferences = () => {
  const prefersReducedMotion = useReducedMotion()
  
  return {
    prefersReducedMotion,
    getDuration: (duration: MotionDuration) => 
      prefersReducedMotion ? 'instant' as const : duration,
    shouldAnimate: !prefersReducedMotion,
  }
}
