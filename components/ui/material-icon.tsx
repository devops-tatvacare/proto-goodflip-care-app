"use client"

import { CSSProperties, forwardRef } from 'react'

export interface MaterialIconProps {
  icon: string
  variant?: 'filled' | 'outlined' 
  size?: 'small' | 'medium' | 'large' | 'xl' | number
  className?: string
  style?: CSSProperties
  color?: string
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  grade?: -25 | 0 | 200
  opticalSize?: 20 | 24 | 40 | 48
}

const SIZE_MAP = {
  small: 18,
  medium: 24,
  large: 36,
  xl: 48
} as const

export const MaterialIcon = forwardRef<HTMLSpanElement, MaterialIconProps>(
  function MaterialIcon(
    { 
      icon, 
      variant = 'outlined', 
      size = 'medium',
      className = '',
      style = {},
      color,
      weight = 400,
      grade = 0,
      opticalSize = 24
    },
    ref
  ) {
    const sizeValue = typeof size === 'string' ? SIZE_MAP[size as keyof typeof SIZE_MAP] : size
    const effectiveSize = sizeValue || SIZE_MAP.medium

    // Build font variation settings based on props
    const fontVariationSettings = [
      `'FILL' ${variant === 'filled' ? 1 : 0}`,
      `'wght' ${weight}`,
      `'GRAD' ${grade}`,
      `'opsz' ${opticalSize}`
    ].join(', ')

    const iconStyle: CSSProperties = {
      fontSize: `${effectiveSize}px`,
      lineHeight: 1,
      width: `${effectiveSize}px`,
      height: `${effectiveSize}px`,
      fontVariationSettings,
      color,
      ...style
    }

    return (
      <span 
        ref={ref}
        className={`material-symbols-outlined ${className}`.trim()}
        style={iconStyle}
        aria-hidden="true"
      >
        {icon}
      </span>
    )
  }
)

// Example usage:
// <MaterialIcon icon="favorite" />
// <MaterialIcon icon="home" variant="outlined" />
// <MaterialIcon icon="settings" size="large" color="#3B82F6" />
// <MaterialIcon icon="notifications" variant="round" size={32} />

// Available icons can be found at: https://fonts.google.com/icons
// Search for any icon name and use it directly, for example:
// - home, search, settings, favorite, star
// - person, account_circle, face, group
// - notifications, email, chat, message
// - add, remove, close, check, edit, delete
// - menu, more_vert, more_horiz, arrow_back
// - calendar_today, schedule, access_time
// - shopping_cart, store, payment
// - phone, call, video_call, location_on
// - info, help, warning, error
// - visibility, visibility_off, lock, lock_open
// - file_download, file_upload, cloud, folder
// - play_arrow, pause, stop, skip_next
// - camera, photo, image, videocam
// - mic, volume_up, volume_off
// - brightness_low, brightness_high, wb_sunny
// - wifi, bluetooth, battery_full, signal_cellular_4_bar
// And thousands more...