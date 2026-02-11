// Primitives - Low-level design system components
export { Text } from './Text'
export type { TextProps, TextVariant, TextTone, TextWeight } from './Text'

export { Stack } from './Stack'
export type { StackProps, StackGap, StackAlign, StackJustify } from './Stack'

export { Inline } from './Inline'
export type { InlineProps, InlineGap, InlineAlign, InlineJustify } from './Inline'

export { Surface, CardSurface } from './Surface'
export type { 
  SurfaceProps, 
  SurfaceVariant, 
  SurfaceRadius, 
  SurfaceElevation, 
  SurfacePadding 
} from './Surface'

export { FocusRing, useFocusRing } from './FocusRing'
export type { FocusRingProps, FocusRingVariant, FocusRingSize } from './FocusRing'

export { Divider } from './Divider'
export type { 
  DividerProps, 
  DividerOrientation, 
  DividerVariant, 
  DividerSize 
} from './Divider'

export { VisuallyHidden, SkipLink } from './VisuallyHidden'
export type { VisuallyHiddenProps } from './VisuallyHidden'

export { FocusTrap, Portal, useFocusTrap } from './FocusTrap'
export type { FocusTrapProps, PortalProps } from './FocusTrap'

export { 
  SkipLinks, 
  MainContent, 
  NavigationLandmark, 
  SearchLandmark,
  useSkipLinkTarget 
} from './SkipLinks'
export type { 
  SkipLinksProps, 
  MainContentProps, 
  NavigationLandmarkProps, 
  SearchLandmarkProps 
} from './SkipLinks'

export { 
  AccessibleButton, 
  AccessibleIconButton, 
  HealthcareActionButton, 
  buttonVariants 
} from './AccessibleButton'
export type { 
  AccessibleButtonProps, 
  AccessibleIconButtonProps, 
  HealthcareActionButtonProps 
} from './AccessibleButton'

export { 
  AccessibleInput, 
  MedicalInput, 
  PatientSearchInput 
} from './AccessibleInput'
export type { 
  AccessibleInputProps, 
  MedicalInputProps, 
  PatientSearchInputProps 
} from './AccessibleInput'

export { 
  AccessibleIcon, 
  MedicalIcon, 
  StatusIcon, 
  InteractiveIcon,
  sizeClasses,
  colorClasses
} from './AccessibleIcon'
export type { 
  AccessibleIconProps, 
  MedicalIconProps, 
  StatusIconProps, 
  InteractiveIconProps 
} from './AccessibleIcon'

export {
  Motion,
  AnimatedContainer,
  PageTransition,
  MedicalAlert,
  DataLoadingContainer,
  InteractiveElement,
  useReducedMotion,
  useMotionPreferences
} from './Motion'
export type {
  MotionProps,
  MotionDuration,
  MotionEasing,
  MotionPreset,
  AnimatedContainerProps,
  PageTransitionProps
} from './Motion'