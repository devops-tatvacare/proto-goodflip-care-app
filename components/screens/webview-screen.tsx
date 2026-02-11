"use client"

import React, { useState, useRef } from "react"
import { Icon } from '@/components/ui/icon'
import { Button } from "@/components/ui/button"

interface WebViewScreenProps {
  url: string
  title?: string
  onBack: () => void
}

export function WebViewScreen({ url, title = "Web View", onBack }: WebViewScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Set a timeout to stop loading after 8 seconds
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        // Don't set error, just hide loading - let user see if content loads
      }
    }, 8000)
    
    return () => clearTimeout(timeout)
  }, [isLoading])
  
  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const openExternalLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  let displayUrl = url
  try {
    displayUrl = new URL(url).hostname
  } catch (e) {
    displayUrl = url
  }

  return (
    <div className="flex flex-col h-full bg-[var(--ds-surface-primary)]">
      {/* Header with back button */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-[var(--ds-border-default)]"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
              {title}
            </h1>
            <p className="text-xs text-[var(--ds-text-secondary)] truncate max-w-[200px]">
              {displayUrl}
            </p>
          </div>
        </div>
        
        {/* External link button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={openExternalLink}
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
        >
          <Icon name="externalLink" className="h-4 w-4" />
        </Button>
      </div>

      {/* Content container */}
      <div className="flex-1 relative">
        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          title={title}
          allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; payment; picture-in-picture; usb"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
          loading="eager"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '0',
            overflow: 'hidden'
          }}
        />
        
        {/* Loading overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-[var(--ds-surface-primary)] flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[var(--ds-status-success)] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[var(--ds-status-success)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[var(--ds-status-success)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-sm text-[var(--ds-text-secondary)]">Loading {title}...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-[var(--ds-surface-primary)] flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <Icon name="alertCircle" className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to Load Website
              </h3>
              <p className="text-sm text-[var(--ds-text-secondary)] mb-6">
                This website cannot be displayed within the app. You can open it in your browser instead.
              </p>
              <Button
                onClick={openExternalLink}
                className="bg-green-600 hover:bg-green-700 text-[var(--ds-text-inverse)]"
              >
                <Icon name="externalLink" className="w-4 h-4 mr-2" />
                Open in Browser
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}