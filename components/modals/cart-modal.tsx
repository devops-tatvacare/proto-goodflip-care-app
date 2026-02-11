"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import type { CartItem } from "@/lib/hooks/use-cart"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  total: number
}

export function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, total }: CartModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-[var(--ds-surface-primary)] w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Icon name="shoppingCart" className="w-5 h-5" />
            Cart ({cart.length})
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="close" className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="shoppingCart" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[var(--ds-text-secondary)]">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-[var(--ds-text-secondary)]">{item.category}</p>
                  <p className="text-sm font-bold text-[var(--orange-primary)]">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Icon name="minus" className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Icon name="plus" className="w-3 h-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[var(--ds-status-error)] hover:text-red-700"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Icon name="close" className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>

        {cart.length > 0 && (
          <div className="border-t border-[var(--ds-border-default)] p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-[var(--orange-primary)]">₹{total}</span>
            </div>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
