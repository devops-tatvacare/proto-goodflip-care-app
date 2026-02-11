"use client"

import { useEffect } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 1875)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="h-full w-full relative overflow-hidden">
      <img 
        src="/images/goodflip-care-splash.png" 
        alt="GoodFlip Care" 
        className="w-full h-full object-cover"
      />
    </div>
  )
}
