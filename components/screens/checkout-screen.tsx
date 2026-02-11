"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Icon } from '@/components/ui/icon'
import { ScreenHeader } from "@/components/ui/screen-header"
import { useCart } from "@/lib/hooks/use-cart"
import { AddressSelector } from "@/components/ui/address-selector"

interface CheckoutScreenProps {
  onBack: () => void
  onOrderComplete: () => void
}

interface DeliveryAddress {
  id?: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  coordinates?: { lat: number; lng: number }
  type: "home" | "work" | "other"
}

export function CheckoutScreen({ onBack, onOrderComplete }: CheckoutScreenProps) {
  const { cart, getCartSubtotal, getTotalSavings, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cod">("card")
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const subtotal = getCartSubtotal()
  const savings = getTotalSavings()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  const handleAddressSelect = (address: DeliveryAddress) => {
    setSelectedAddress(address)
    setShowAddressSelector(false)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address")
      return
    }

    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const orderId = `ORD${Date.now().toString().slice(-6)}`
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2)

    setOrderDetails({
      orderId,
      estimatedDelivery: estimatedDelivery.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      items: cart.length,
      total,
      address: selectedAddress,
      paymentMethod,
    })

    setIsProcessing(false)
    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <ScreenHeader title="Order Confirmed" onBack={onOrderComplete} />

        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="checkCircle" className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-[var(--ds-text-secondary)]">Your order has been confirmed and is being processed.</p>
          </div>

          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl mb-4">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--ds-text-secondary)]">Order ID</span>
                  <span className="font-semibold text-[var(--orange-primary)]">#{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--ds-text-secondary)]">Items</span>
                  <span className="font-medium">{orderDetails.items} items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--ds-text-secondary)]">Total Amount</span>
                  <span className="font-bold text-lg">₹{orderDetails.total}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[var(--ds-text-secondary)]">Delivery Address</span>
                  <div className="text-right text-sm">
                    <p className="font-medium">{orderDetails.address.name}</p>
                    <p className="text-[var(--ds-text-secondary)]">{orderDetails.address.addressLine1}</p>
                    <p className="text-[var(--ds-text-secondary)]">
                      {orderDetails.address.city}, {orderDetails.address.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-blue-50 rounded-xl mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="localShipping" className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Estimated Delivery</h3>
                  <p className="text-blue-700">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button onClick={onOrderComplete} className="w-full">
              Continue Shopping
            </Button>
            <Button variant="outline" className="w-full">
              Track Order
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showAddressSelector) {
    return (
      <AddressSelector
        onBack={() => setShowAddressSelector(false)}
        onAddressSelect={handleAddressSelect}
        selectedAddress={selectedAddress}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScreenHeader title="Checkout" onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        {/* Order Summary */}
        <div className="p-4">
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-[var(--ds-text-secondary)]">
                      Qty: {item.quantity} • {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[var(--orange-primary)]">₹{item.price * item.quantity}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-xs text-[var(--ds-text-secondary)] line-through">₹{item.originalPrice * item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save</span>
                    <span>-₹{savings}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[var(--orange-primary)]">₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Icon name="locationOn" className="w-5 h-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAddress ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon name="home" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{selectedAddress.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {selectedAddress.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--ds-text-secondary)] mb-1">{selectedAddress.phone}</p>
                      <p className="text-sm text-gray-700">
                        {selectedAddress.addressLine1}
                        {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      {selectedAddress.landmark && (
                        <p className="text-sm text-[var(--ds-text-secondary)]">Near {selectedAddress.landmark}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAddressSelector(true)} className="w-full">
                    Change Address
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAddressSelector(true)} className="w-full flex items-center gap-2">
                  <Icon name="navigation" className="w-4 h-4" />
                  Select Delivery Address
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-xl mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex items-center justify-start gap-3 h-12"
                >
                  <Icon name="creditCard" className="w-5 h-5" />
                  <span>Credit/Debit Card</span>
                </Button>

                <Button
                  variant={paymentMethod === "wallet" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("wallet")}
                  className="flex items-center justify-start gap-3 h-12"
                >
                  <Icon name="wallet" className="w-5 h-5" />
                  <span>Digital Wallet</span>
                </Button>

                <Button
                  variant={paymentMethod === "cod" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cod")}
                  className="flex items-center justify-start gap-3 h-12"
                >
                  <Icon name="clock" className="w-5 h-5" />
                  <span>Cash on Delivery</span>
                </Button>
              </div>

              {paymentMethod === "wallet" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="wallet" className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Wallet Balance</span>
                  </div>
                  <p className="text-sm text-orange-700">Available: ₹2,500</p>
                  {total <= 2500 && (
                    <Badge className="bg-green-100 text-green-700 mt-2">Sufficient balance available</Badge>
                  )}
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">Pay ₹{total} in cash when your order is delivered.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="border-t border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] p-4">
        <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing || !selectedAddress}>
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Order...
            </div>
          ) : (
            `Place Order - ₹${total}`
          )}
        </Button>
        {!selectedAddress && (
          <p className="text-xs text-[var(--ds-text-secondary)] text-center mt-2">Please select a delivery address to continue</p>
        )}
      </div>
    </div>
  )
}
