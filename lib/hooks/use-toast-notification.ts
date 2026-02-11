"use client"

import { useState } from "react"

interface Toast {
  message: string
  type: "success" | "error"
}

export function useToastNotification() {
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const hideToast = () => setToast(null)

  return { toast, showToast, hideToast }
}
