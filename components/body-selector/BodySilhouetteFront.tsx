import React from 'react'
import { BodySilhouetteProps } from './types'
import { SIZE_MULTIPLIERS, STANDARD_VIEWBOX } from './utils/coordinates'

export const BodySilhouetteFront: React.FC<BodySilhouetteProps> = ({ 
  view = 'front',
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
      className={`body-silhouette-front ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for realistic body shading */}
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: 'var(--gray-100)', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: 'var(--gray-200)', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'var(--gray-300)', stopOpacity: 1}} />
        </linearGradient>
        
        {/* Shadow gradient */}
        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: 'var(--gray-300)', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: 'var(--gray-400)', stopOpacity: 0.1}} />
        </linearGradient>
      </defs>
      
      {/* Head - More realistic oval shape */}
      <path 
        d="M 85 15 C 85 8, 92 5, 100 5 C 108 5, 115 8, 115 15 L 115 25 C 115 32, 108 38, 100 38 C 92 38, 85 32, 85 25 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Neck - Natural connection */}
      <path 
        d="M 94 38 C 94 38, 96 40, 100 40 C 104 40, 106 38, 106 38 L 106 47 C 106 47, 103 48, 100 48 C 97 48, 94 47, 94 47 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Shoulders and Upper Torso - Natural shoulder slope */}
      <path 
        d="M 65 55 C 70 50, 80 47, 94 47 L 106 47 C 120 47, 130 50, 135 55 C 135 65, 132 75, 128 85 L 125 95 C 120 96, 110 97, 100 97 C 90 97, 80 96, 75 95 L 72 85 C 68 75, 65 65, 65 55 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Abdomen and Waist - Realistic torso shape */}
      <path 
        d="M 75 95 C 80 93, 90 92, 100 92 C 110 92, 120 93, 125 95 C 126 110, 125 125, 123 140 C 120 150, 115 155, 100 155 C 85 155, 80 150, 77 140 C 75 125, 74 110, 75 95 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Left Arm - More natural arm shape */}
      <path 
        d="M 65 55 C 60 58, 55 65, 52 75 C 50 85, 52 95, 48 105 C 45 115, 42 125, 40 130 C 38 132, 38 134, 40 135 C 45 135, 50 132, 52 125 C 54 115, 56 105, 58 95 C 60 85, 62 75, 65 65 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Right Arm - Mirror of left arm */}
      <path 
        d="M 135 55 C 140 58, 145 65, 148 75 C 150 85, 148 95, 152 105 C 155 115, 158 125, 160 130 C 162 132, 162 134, 160 135 C 155 135, 150 132, 148 125 C 146 115, 144 105, 142 95 C 140 85, 138 75, 135 65 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Left Leg - Natural leg proportions */}
      <path 
        d="M 85 155 C 85 155, 82 160, 82 170 C 82 185, 84 200, 85 215 C 86 225, 88 230, 90 232 C 92 233, 94 233, 96 232 C 98 230, 100 225, 101 215 C 102 200, 100 185, 100 170 C 100 160, 97 155, 97 155 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Right Leg - Mirror of left leg */}
      <path 
        d="M 115 155 C 115 155, 118 160, 118 170 C 118 185, 116 200, 115 215 C 114 225, 112 230, 110 232 C 108 233, 106 233, 104 232 C 102 230, 100 225, 99 215 C 98 200, 100 185, 100 170 C 100 160, 103 155, 103 155 Z" 
        fill="url(#bodyGradient)" 
        stroke="var(--gray-400)" 
        strokeWidth="0.8"
      />
      
      {/* Subtle body details */}
      {/* Collar bone indication */}
      <line x1="88" y1="52" x2="112" y2="52" stroke="var(--gray-400)" strokeWidth="0.5" opacity="0.3"/>
      
      {/* Waist indication */}
      <line x1="80" y1="115" x2="120" y2="115" stroke="var(--gray-400)" strokeWidth="0.5" opacity="0.2"/>
    </svg>
  )
}