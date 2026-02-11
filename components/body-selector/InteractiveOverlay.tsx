import React, { useRef } from 'react'
import { InteractiveOverlayProps } from './types'
import { getSVGRelativeCoordinates, findRegionAtPoint, scaleCoordinates } from './utils/coordinates'
import { getRegionShape, hasCustomShape } from './utils/region-shapes'

export const InteractiveOverlay: React.FC<InteractiveOverlayProps> = ({
  regions,
  selectedRegions,
  onRegionClick,
  viewBox,
  size = 'medium',
  disabled = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const handleClick = (event: React.MouseEvent<SVGElement>) => {
    if (disabled || !svgRef.current) return

    const coords = getSVGRelativeCoordinates(event, svgRef.current)
    const region = findRegionAtPoint(coords.x, coords.y, regions)
    
    if (region) {
      onRegionClick(region.id, region.name)
    }
  }

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
      onClick={handleClick}
    >
      {regions.map((region) => {
        const coords = scaleCoordinates(region.coordinates, size)
        const isSelected = selectedRegions.includes(region.id)
        const customShape = getRegionShape(region.id)
        
        // Common styles for all shapes
        const fillColor = isSelected ? 'var(--red-alpha-40)' : 'var(--blue-alpha-15)'
        const strokeColor = isSelected ? 'var(--chart-red)' : 'var(--chart-blue)'
        const strokeWidth = isSelected ? '2.5' : '1.5'
        const commonProps = {
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: isSelected ? '5,3' : 'none',
          className: "transition-all duration-300 hover:fill-opacity-60 hover:stroke-width-2 cursor-pointer",
          style: {
            filter: isSelected ? 'drop-shadow(0 2px 4px var(--red-alpha-30))' : 'none'
          }
        }
        
        // Label positioning - adjust based on shape
        let labelX = coords.x + coords.width / 2
        let labelY = coords.y + coords.height / 2
        
        if (customShape?.type === 'ellipse') {
          labelX = customShape.coordinates.cx
          labelY = customShape.coordinates.cy
        }
        
        return (
          <g key={region.id}>
            {/* Interactive Area - Shape-aware rendering */}
            {customShape ? (
              // Custom shape rendering
              customShape.type === 'ellipse' ? (
                <ellipse
                  cx={customShape.coordinates.cx}
                  cy={customShape.coordinates.cy}
                  rx={customShape.coordinates.rx}
                  ry={customShape.coordinates.ry}
                  {...commonProps}
                />
              ) : customShape.type === 'path' ? (
                <path
                  d={customShape.coordinates}
                  {...commonProps}
                />
              ) : (
                <rect
                  x={customShape.coordinates.x}
                  y={customShape.coordinates.y}
                  width={customShape.coordinates.width}
                  height={customShape.coordinates.height}
                  rx={customShape.coordinates.rx || 4}
                  {...commonProps}
                />
              )
            ) : (
              // Default rectangular shape
              <rect
                x={coords.x}
                y={coords.y}
                width={coords.width}
                height={coords.height}
                rx="4"
                {...commonProps}
              />
            )}
            
            {/* Hover highlight ring - shape-aware */}
            {customShape?.type === 'ellipse' ? (
              <ellipse
                cx={customShape.coordinates.cx}
                cy={customShape.coordinates.cy}
                rx={customShape.coordinates.rx + 2}
                ry={customShape.coordinates.ry + 2}
                fill="none"
                stroke="var(--blue-alpha-60)"
                strokeWidth="1"
                className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              />
            ) : (
              <rect
                x={coords.x - 1}
                y={coords.y - 1}
                width={coords.width + 2}
                height={coords.height + 2}
                fill="none"
                stroke="var(--blue-alpha-60)"
                strokeWidth="1"
                rx="5"
                className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              />
            )}
            
            {/* Region Label - Improved positioning and styling */}
            {isSelected && (
              <g className="pointer-events-none">
                {/* Label background */}
                <rect
                  x={labelX - (region.name.length * 3)}
                  y={labelY - 8}
                  width={region.name.length * 6}
                  height={16}
                  fill="var(--white-alpha-95)"
                  stroke="var(--chart-red)"
                  strokeWidth="1"
                  rx="8"
                />
                {/* Label text */}
                <text
                  x={labelX}
                  y={labelY + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight="600"
                  fill="var(--chart-red)"
                >
                  {region.name.length > 15 ? region.name.slice(0, 13) + '...' : region.name}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}