"use client"

import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { ScreenHeader } from "@/components/ui/screen-header"
import { useCart } from "@/lib/hooks/use-cart"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface CartScreenProps {
  onBack: () => void
  onCheckout: () => void
}

export function CartScreen({ onBack, onCheckout }: CartScreenProps) {
  const { cart, updateQuantity, removeFromCart, getCartSubtotal, getTotalSavings } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <ScreenHeader title="Cart" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="shoppingCart" className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-[var(--ds-text-secondary)] mb-6">Add some products to get started</p>
            <Button onClick={onBack} className="px-8">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getCartSubtotal()
  const savings = getTotalSavings()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScreenHeader title={`Cart (${cart.length} ${cart.length === 1 ? "item" : "items"})`} onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        {/* Cart Items */}
        <div className="p-4 space-y-3">
          {cart.map((item) => (
            <Card key={item.id} className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="shoppingCart" className="w-6 h-6 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-[var(--ds-text-secondary)] mb-2">{item.category}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-[var(--orange-primary)]">₹{item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <>
                          <span className="text-sm text-[var(--ds-text-secondary)] line-through">₹{item.originalPrice}</span>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Save ₹{item.originalPrice - item.price}
                          </Badge>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-[var(--ds-surface-primary)]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Icon name="minus" className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-[var(--ds-surface-primary)]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Icon name="plus" className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[var(--ds-status-error)] hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Icon name="delete" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="p-4">
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Bill Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-[var(--ds-text-secondary)]">
                  <span>Subtotal ({cart.reduce((count, item) => count + item.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{savings}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--ds-text-secondary)]">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                {subtotal <= 500 && (
                  <p className="text-xs text-[var(--ds-text-secondary)]">Add ₹{500 - subtotal} more for free delivery</p>
                )}

                <div className="border-t border-[var(--ds-border-default)] pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-[var(--orange-primary)]">₹{total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="border-t border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] p-4">
        <Button className="w-full" size="lg" onClick={onCheckout}>
          <span>Proceed to Checkout</span>
          <Icon name="arrowRight" className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
