export interface BaseComponent {
  id: string
  className?: string
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
}

export interface StatusConfig {
  type: "success" | "warning" | "error" | "info" | "neutral"
  label: string
  color: string
  bgColor: string
}

export interface CardVariant {
  type: "default" | "elevated" | "outlined" | "filled"
  padding?: "sm" | "md" | "lg"
  radius?: "sm" | "md" | "lg"
}

export interface ButtonVariant {
  variant: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

export interface ScreenProps {
  onNavigateToRecords?: () => void
  onNavigateToAssistant?: (action: string) => void
  initialAction?: string
}
