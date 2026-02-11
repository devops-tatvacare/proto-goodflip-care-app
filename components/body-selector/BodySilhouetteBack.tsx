import React from 'react'
import { BodySilhouetteProps } from './types'
import { SIZE_MULTIPLIERS, STANDARD_VIEWBOX } from './utils/coordinates'

export const BodySilhouetteBack: React.FC<BodySilhouetteProps> = ({ 
  view = 'back',
  size = 'medium', 
  className = '' 
}) => {
  const multiplier = SIZE_MULTIPLIERS[size]
  const width = STANDARD_VIEWBOX.width * multiplier
  const height = STANDARD_VIEWBOX.height * multiplier

  return (
    <svg
      width={width}
      height={height}
      viewBox={STANDARD_VIEWBOX.viewBoxString}
      className={`body-silhouette-back ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for realistic body shading - back view */}
        <linearGradient id="bodyGradientBack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: 'var(--gray-300)', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: 'var(--gray-200)', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'var(--gray-100)', stopOpacity: 1}} />
        </linearGradient>
        
        {/* Spine highlight */}
        <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: 'var(--gray-400)', stopOpacity: 0.2}} />
          <stop offset="50%" style={{stopColor: 'var(--gray-500)', stopOpacity: 0.4}} />
          <stop offset="100%" style={{stopColor: 'var(--gray-400)', stopOpacity: 0.2}} />
        </linearGradient>
      </defs>
      
      {/* Head - Back of head, more rounded */}
      <path 
        d="M 85 15 C 85 8, 92 5, 100 5 C 108 5, 115 8, 115 15 L 115 28 C 115 35, 108 38, 100 38 C 92 38, 85 35, 85 28 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Neck - Back of neck */}
      <path 
        d="M 94 38 C 94 38, 96 40, 100 40 C 104 40, 106 38, 106 38 L 106 47 C 106 47, 103 48, 100 48 C 97 48, 94 47, 94 47 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Upper Back and Shoulders - Natural shoulder blade area */}
      <path 
        d="M 65 55 C 70 50, 80 47, 94 47 L 106 47 C 120 47, 130 50, 135 55 C 135 65, 132 75, 128 85 C 125 95, 122 102, 120 108 L 125 108 C 120 110, 110 112, 100 112 C 90 112, 80 110, 75 108 L 80 108 C 78 102, 75 95, 72 85 C 68 75, 65 65, 65 55 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Lower Back and Buttocks - More realistic back curve */}
      <path 
        d="M 80 108 C 85 110, 92 112, 100 112 C 108 112, 115 110, 120 108 C 122 120, 125 135, 123 145 C 120 155, 115 160, 100 160 C 85 160, 80 155, 77 145 C 75 135, 78 120, 80 108 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Spine - Realistic spine indication */}
      <path 
        d="M 100 40 C 100 40, 99 50, 99 65 C 99 80, 100 95, 101 110 C 101 125, 100 140, 100 150" 
        fill="none" 
        stroke="url(#spineGradient)" 
        strokeWidth="1.5"
      />
      
      {/* Shoulder blade indications */}
      <path 
        d="M 85 60 C 88 65, 92 70, 95 75 C 92 70, 88 65, 85 60" 
        fill="none" 
        stroke="var(--gray-400)" 
        strokeWidth="0.5" 
        opacity="0.3"
      />
      <path 
        d="M 115 60 C 112 65, 108 70, 105 75 C 108 70, 112 65, 115 60" 
        fill="none" 
        stroke="var(--gray-400)" 
        strokeWidth="0.5" 
        opacity="0.3"
      />
      
      {/* Left Arm - Natural back arm position */}
      <path 
        d="M 65 55 C 60 58, 55 65, 52 75 C 50 85, 52 95, 48 105 C 45 115, 42 125, 40 130 C 38 132, 38 134, 40 135 C 45 135, 50 132, 52 125 C 54 115, 56 105, 58 95 C 60 85, 62 75, 65 65 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Right Arm - Mirror of left arm */}
      <path 
        d="M 135 55 C 140 58, 145 65, 148 75 C 150 85, 148 95, 152 105 C 155 115, 158 125, 160 130 C 162 132, 162 134, 160 135 C 155 135, 150 132, 148 125 C 146 115, 144 105, 142 95 C 140 85, 138 75, 135 65 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Left Leg - Back view with calf definition */}
      <path 
        d="M 85 160 C 85 160, 82 165, 82 175 C 82 190, 84 205, 85 220 C 86 230, 88 235, 90 237 C 92 238, 94 238, 96 237 C 98 235, 100 230, 101 220 C 102 205, 100 190, 100 175 C 100 165, 97 160, 97 160 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Right Leg - Mirror of left leg */}
      <path 
        d="M 115 160 C 115 160, 118 165, 118 175 C 118 190, 116 205, 115 220 C 114 230, 112 235, 110 237 C 108 238, 106 238, 104 237 C 102 235, 100 230, 99 220 C 98 205, 100 190, 100 175 C 100 165, 103 160, 103 160 Z" 
        fill="url(#bodyGradientBack)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Subtle back details */}
      {/* Lower back curve indication */}
      <path 
        d="M 85 130 C 92 128, 100 128, 115 130" 
        fill="none" 
        stroke="var(--gray-400)" 
        strokeWidth="0.5" 
        opacity="0.2"
      />
    </svg>
  )
}