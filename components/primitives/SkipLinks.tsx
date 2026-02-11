"use client"

import React from 'react'
import { SkipLink } from '@/components/primitives/VisuallyHidden'
import { cn } from '@/lib/utils'

export interface SkipLinksProps {
  /**
   * Main content target ID
   */
  mainContentId?: string
  
  /**
   * Navigation target ID
   */
  navigationId?: string
  
  /**
   * Search target ID
   */
  searchId?: string
  
  /**
   * Additional skip links
   */
  additionalLinks?: Array<{
    href: string
    label: string
  }>
  
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * SkipLinks - Provides keyboard navigation shortcuts for accessibility
 * Should be the first focusable element on the page
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({
  mainContentId = 'main-content',
  navigationId,
  searchId,
  additionalLinks = [],
  className
}) => {
  const allLinks = [
    { href: `#${mainContentId}`, label: 'Skip to main content' },
    ...(navigationId ? [{ href: `#${navigationId}`, label: 'Skip to navigation' }] : []),
    ...(searchId ? [{ href: `#${searchId}`, label: 'Skip to search' }] : []),
    ...additionalLinks
  ]

  if (allLinks.length === 0) return null

  return (
    <div className={cn('skip-links', className)} role="navigation" aria-label="Skip links">
      {allLinks.map((link, index) => (
        <SkipLink key={index} href={link.href}>
          {link.label}
        </SkipLink>
      ))}
    </div>
  )
}

/**
 * Hook to manage skip link targets and ensure they have proper focus management
 */
export const useSkipLinkTarget = (id: string) => {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    // Ensure the element has a tabindex for focusing
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1')
    }

    // Add focus handling for skip links
    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [id])

  return ref
}

/**
 * MainContent - Wrapper component that automatically handles skip link targeting
 */
export interface MainContentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The ID for skip link targeting
   */
  id?: string
  
  /**
   * Whether to add visual focus indicator
   */
  showFocusRing?: boolean
}

export const MainContent = React.forwardRef<HTMLElement, MainContentProps>(
  ({ 
    id = 'main-content',
    showFocusRing = true,
    className,
    children,
    ...props
  }, forwardedRef) => {
    const skipLinkRef = useSkipLinkTarget(id)
    
    // Combine refs
    const ref = React.useMemo(() => {
      if (typeof forwardedRef === 'function') {
        return (element: HTMLElement | null) => {
          ;(skipLinkRef as React.MutableRefObject<HTMLElement | null>).current = element
          forwardedRef(element)
        }
      } else if (forwardedRef) {
        return (element: HTMLElement | null) => {
          ;(skipLinkRef as React.MutableRefObject<HTMLElement | null>).current = element
          ;(forwardedRef as React.MutableRefObject<HTMLElement | null>).current = element
        }
      }
      return skipLinkRef
    }, [forwardedRef, skipLinkRef])

    return (
      <main
        ref={ref}
        id={id}
        className={cn(
          'focus:outline-none',
          showFocusRing && 'focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-surface-primary)]',
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {children}
      </main>
    )
  }
)

MainContent.displayName = 'MainContent'

/**
 * NavigationLandmark - Wrapper for navigation sections with skip link support
 */
export interface NavigationLandmarkProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The ID for skip link targeting
   */
  id?: string
  
  /**
   * Accessible label for the navigation
   */
  'aria-label'?: string
  
  /**
   * Whether to add visual focus indicator
   */
  showFocusRing?: boolean
}

export const NavigationLandmark = React.forwardRef<HTMLElement, NavigationLandmarkProps>(
  ({ 
    id = 'main-navigation',
    showFocusRing = true,
    className,
    children,
    ...props
  }, forwardedRef) => {
    const skipLinkRef = useSkipLinkTarget(id)
    
    // Combine refs
    const ref = React.useMemo(() => {
      if (typeof forwardedRef === 'function') {
        return (element: HTMLElement | null) => {
          ;(skipLinkRef as React.MutableRefObject<HTMLElement | null>).current = element
          forwardedRef(element)
        }
      } else if (forwardedRef) {
        return (element: HTMLElement | null) => {
          ;(skipLinkRef as React.MutableRefObject<HTMLElement | null>).current = element
          ;(forwardedRef as React.MutableRefObject<HTMLElement | null>).current = element
        }
      }
      return skipLinkRef
    }, [forwardedRef, skipLinkRef])

    return (
      <nav
        ref={ref}
        id={id}
        className={cn(
          'focus:outline-none',
          showFocusRing && 'focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-surface-primary)]',
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {children}
      </nav>
    )
  }
)

NavigationLandmark.displayName = 'NavigationLandmark'

/**
 * SearchLandmark - Wrapper for search sections with skip link support
 */
export interface SearchLandmarkProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The ID for skip link targeting
   */
  id?: string
  
  /**
   * Whether to add visual focus indicator
   */
  showFocusRing?: boolean
}

export const SearchLandmark = React.forwardRef<HTMLElement, SearchLandmarkProps>(
  ({ 
    id = 'search',
    showFocusRing = true,
    className,
    children,
    ...props
  }, forwardedRef) => {
    const skipLinkRef = useSkipLinkTarget(id)
    
    // Combine refs
    const ref = React.useMemo(() => {
      if (typeof forwardedRef === 'function') {
        return (element: HTMLElement | null) => {
          ;(skipLinkRef as React.MutableRefObject<HTMLElement | null>).current = element
          forwardedRef(element)
        }
      } else if (forwardedRef) {
        return (element: HTMLElement | null) => {
          ;(skipLinkRef as React.MutableRefObject<HTMLElement | null>).current = element
          ;(forwardedRef as React.MutableRefObject<HTMLElement | null>).current = element
        }
      }
      return skipLinkRef
    }, [forwardedRef, skipLinkRef])

    return (
      <div
        ref={ref}
        id={id}
        role="search"
        className={cn(
          'focus:outline-none',
          showFocusRing && 'focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-surface-primary)]',
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SearchLandmark.displayName = 'SearchLandmark'