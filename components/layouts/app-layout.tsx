"use client"

import type React from "react"
import { BaseLayout } from "@/components/ui/base-layout"
import { ScreenContainer } from "@/components/ui/screen-container"

interface AppLayoutProps {
  children: React.ReactNode
  navigation?: React.ReactNode
  className?: string
}

export function AppLayout({ children, navigation, className }: AppLayoutProps) {
  return (
    <BaseLayout className={className}>
      <ScreenContainer>{children}</ScreenContainer>
      {navigation}
    </BaseLayout>
  )
}
