"use client"

import type React from "react"

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  return (
    <div
      className={`flex gap-4 overflow-x-auto pb-2 ${className}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {children}
      <style jsx>{`
        .flex.gap-4.overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
