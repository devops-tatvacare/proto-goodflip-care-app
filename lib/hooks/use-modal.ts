"use client"

import { useState } from "react"

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any>(null)

  const open = (modalData?: any) => {
    setData(modalData)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setData(null)
  }

  return { isOpen, data, open, close }
}
