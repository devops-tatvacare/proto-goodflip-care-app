"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  category: string
  image?: string
  description?: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("health-app-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("health-app-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setIsLoading(true)
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
    setIsLoading(false)
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("health-app-cart")
  }

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalSavings = () => {
    return cart.reduce((savings, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return savings + (item.originalPrice - item.price) * item.quantity
      }
      return savings
    }, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
    getCartSubtotal,
    getTotalSavings,
    isLoading,
  }
}
