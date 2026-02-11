"use client"

import { useToast } from "@/lib/hooks/use-toast"
import { Toast } from "@/components/ui/toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}
