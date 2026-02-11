"use client"

import React from "react"
import { Icon } from '@/components/ui/icon'

interface VideoPlayerProps {
  videoId: string
  title: string
  onClose?: () => void
  embedded?: boolean
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  onClose,
  embedded = false
}) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  if (embedded) {
    return (
      <div className="w-full">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={videoSrc}
            title={title}
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[var(--ds-surface-inverse)] bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--ds-surface-primary)] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--ds-surface-secondary)] rounded-full transition-colors"
              type="button"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={videoSrc}
              title={title}
              className="absolute inset-0 w-full h-full rounded"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  )
}