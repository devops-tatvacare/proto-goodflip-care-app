"use client"

import { useMemo } from "react"
import { APP_CONFIG } from "@/lib/constants/app-config"
import type { StatusConfig } from "@/lib/types/common"

export function useStatusConfig(category: keyof typeof APP_CONFIG.status, status: string): StatusConfig {
  return useMemo(() => {
    const statusConfig = APP_CONFIG.status[category]
    return (
      statusConfig?.[status as keyof typeof statusConfig] || {
        label: status,
        variant: "default" as const,
      }
    )
  }, [category, status])
}
