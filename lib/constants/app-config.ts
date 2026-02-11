import type { NavigationItem, StatusConfig } from "@/lib/types/common"

export const APP_CONFIG = {
  navigation: {
    tabs: [
      { id: "home", label: "Home", icon: "Home" },
      { id: "health-assistant", label: "Assistant", icon: "Sparkles" },
      { id: "insights", label: "Insights", icon: "PieChart" },
      { id: "records", label: "Records", icon: "FileText" },
    ] as NavigationItem[],
  },

  status: {
    success: {
      type: "success",
      label: "Success",
      color: "var(--status-success)",
      bgColor: "var(--status-success-light)",
    },
    warning: {
      type: "warning",
      label: "Warning",
      color: "var(--status-warning)",
      bgColor: "var(--status-warning-light)",
    },
    error: { type: "error", label: "Error", color: "var(--status-error)", bgColor: "var(--status-error-light)" },
    info: { type: "info", label: "Info", color: "var(--status-info)", bgColor: "var(--status-info-light)" },
  } as Record<string, StatusConfig>,

  spacing: {
    xs: "var(--space-1)",
    sm: "var(--space-2)",
    md: "var(--space-3)",
    lg: "var(--space-4)",
    xl: "var(--space-6)",
  },

  components: {
    card: {
      padding: "var(--card-padding)",
      radius: "var(--card-radius)",
    },
    button: {
      height: "var(--button-height)",
    },
    header: {
      height: "var(--header-height)",
    },
    navigation: {
      height: "var(--nav-height)",
    },
  },
} as const
