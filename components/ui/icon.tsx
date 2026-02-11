"use client"

import React from 'react'
import { MaterialIcon, type MaterialIconProps } from './material-icon'

// Define all Material Symbols icon names used in the app
// This provides type safety and autocomplete
export const ICON_NAMES = {
  // Navigation & Layout
  home: 'home',
  chevronRight: 'chevron_right',
  chevronLeft: 'chevron_left',
  chevronDown: 'expand_more',
  chevronUp: 'expand_less',
  arrowLeft: 'arrow_back',
  arrowRight: 'arrow_forward',
  arrowUp: 'arrow_upward',
  menu: 'menu',
  moreHorizontal: 'more_horiz',
  moreVertical: 'more_vert',
  externalLink: 'open_in_new',
  panelLeft: 'side_navigation',
  
  // Basic Actions
  plus: 'add',
  minus: 'remove',
  close: 'close',
  check: 'check',
  search: 'search',
  edit: 'edit',
  delete: 'delete',
  settings: 'settings',
  filter: 'filter_list',
  
  // Status & Feedback
  checkCircle: 'check_circle',
  alertCircle: 'error',
  alertTriangle: 'warning',
  info: 'info',
  cancel: 'cancel',
  checkAll: 'done_all',
  help: 'help',
  
  // Media & Files
  upload: 'upload',
  download: 'download',
  camera: 'photo_camera',
  image: 'image',
  fileText: 'description',
  folderOpen: 'folder_open',
  attachFile: 'attach_file',
  eye: 'visibility',
  eyeOff: 'visibility_off',
  
  // Health & Medical
  heart: 'favorite',
  heartMonitor: 'glucose',
  medication: 'medication',
  science: 'science',
  vaccines: 'vaccines',
  stethoscope: 'stethoscope',
  cardiology: 'cardiology',
  medicalServices: 'medical_services',
  glucose: 'glucose',
  
  // Trends & Charts
  trendingUp: 'trending_up',
  trendingDown: 'trending_down',
  barChart: 'bar_chart',
  pieChart: 'pie_chart',
  target: 'center_focus_strong',
  trophy: 'trophy',
  
  // Communication
  forum: 'forum',
  chat: 'chat',
  video: 'videocam',
  send: 'send',
  notifications: 'notifications',
  phone: 'call',
  mic: 'mic',
  micOff: 'mic_off',
  
  // Time & Calendar
  calendar: 'calendar_month',
  clock: 'schedule',
  history: 'history',
  
  // User & Social
  person: 'person',
  group: 'group',
  personCheck: 'person_check',
  mood: 'mood',
  
  // Lifestyle & Health Metrics
  restaurant: 'restaurant',
  fitnessCenter: 'fitness_center',
  bedtime: 'bedtime',
  waterDrop: 'water_drop',
  thermostat: 'device_thermostat',
  scale: 'monitor_weight',
  
  // Technology & Devices
  sparkles: 'auto_awesome',
  brain: 'psychology',
  shield: 'security',
  locationOn: 'location_on',
  navigation: 'navigation',
  smartphone: 'smartphone',
  watch: 'watch',
  wifi: 'wifi',
  wifiOff: 'wifi_off',
  battery: 'battery_full',
  
  // Commerce & Shopping
  shoppingCart: 'shopping_cart',
  creditCard: 'credit_card',
  localShipping: 'local_shipping',
  wallet: 'account_balance_wallet',
  store: 'store',
  
  // Learning & Education
  book: 'menu_book',
  bookOpen: 'auto_stories',
  school: 'school',
  lightbulb: 'lightbulb',
  
  // Other
  star: 'star',
  flag: 'flag',
  bookmark: 'bookmark',
  share: 'share',
  circle: 'circle',
  leaf: 'eco',
  clipboardList: 'content_paste',
  award: 'emoji_events',
  zap: 'bolt',
  play: 'play_arrow',
  playCircle: 'play_circle',
  loader: 'hourglass_empty',
  refresh: 'refresh',
  link: 'link',
  beaker: 'science',
  wind: 'air',
  fileDown: 'file_download',
  microscope: 'biotech',
  bookmarked: 'bookmarks',
  scrollText: 'article',
  flask: 'science',
  package: 'inventory_2',
  coins: 'monetization_on',
  database: 'storage',
  unfoldVertical: 'unfold_more',
  footprints: 'directions_walk',
  goal: 'track_changes',
  handshake: 'handshake',
  fileUpload: 'upload_file',
  radioButtonUnchecked: 'radio_button_unchecked',
  zoom: 'zoom_in',
  zoomOut: 'zoom_out',
  rotate: 'rotate_right',
  rotateLeft: 'rotate_left',
  loop: 'loop',
  
  // Additional missing icons
  volume: 'volume_up',
  lock: 'lock',
  globe: 'language',
  browse: 'explore',
  stop: 'stop',
  imageUpload: 'add_photo_alternate',
  flaskRound: 'science',
} as const

export type IconName = keyof typeof ICON_NAMES

export interface IconProps extends Omit<MaterialIconProps, 'icon'> {
  name: IconName
}

/**
 * Type-safe icon component that uses Material Symbols
 * 
 * @example
 * <Icon name="home" />
 * <Icon name="settings" size="large" variant="filled" />
 * <Icon name="heart" color="red" />
 */
export function Icon({ name, ...props }: IconProps) {
  const iconSymbol = ICON_NAMES[name]
  
  if (!iconSymbol) {
    console.warn(`Icon name "${name}" not found in ICON_NAMES`)
    return <MaterialIcon icon="help_outline" {...props} />
  }
  
  return <MaterialIcon icon={iconSymbol} {...props} />
}