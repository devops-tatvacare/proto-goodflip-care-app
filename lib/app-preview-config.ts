export const PREVIEW_TABS = {
  onboarding: "Onboarding",
  appLogin: "App Login",
  app: "App",
  appZeroState: "App - Zero State",
} as const

export type PreviewTab = (typeof PREVIEW_TABS)[keyof typeof PREVIEW_TABS]

export type AppPreviewVariant = "default" | "zero-state"

export type AppFeatureKey = "home" | "insights" | "health-assistant" | "chats" | "social"

export const ZERO_STATE_FEATURE_FLAGS: Record<AppFeatureKey, boolean> = {
  home: false,
  insights: false,
  "health-assistant": false,
  chats: false,
  social: false,
}

export function getAppPreviewVariant(previewTab: PreviewTab): AppPreviewVariant {
  return previewTab === PREVIEW_TABS.appZeroState ? "zero-state" : "default"
}

export function isZeroStateFeatureEnabled(feature: AppFeatureKey): boolean {
  return ZERO_STATE_FEATURE_FLAGS[feature]
}
