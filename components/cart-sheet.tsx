"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CartSheet() {
  const { cart, removeFromCart, clearCart, isOpen, setIsOpen } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [address, setAddress] = useState("")
  const { toast } = useToast()

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * (item.quantity || 1)
  }, 0)

  const handleCheckout = async () => {
    if (!address) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      })
      return
    }

    // Simulate order processing
    setIsCheckingOut(true)

    try {
      // In a real app, you would send this to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Order placed successfully!",
        description: `Your order will be delivered to ${address}. Payment: ${paymentMethod === "cash" ? "Cash on delivery" : "Paid online"}.`,
      })

      clearCart()
      setIsCheckingOut(false)
      setIsOpen(false)
      setAddress("")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">Your cart is empty</p>
              <SheetClose asChild>
                <Button variant="outline" className="mt-4">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[50vh]">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span>{formatPrice(5.99)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice + 5.99)}</span>
                </div>
              </div>

              {!isCheckingOut ? (
                <Button onClick={() => setIsCheckingOut(true)} className="w-full">
                  Checkout
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="payment">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash on Delivery</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsCheckingOut(false)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleCheckout} className="flex-1">
                      Place Order
                    </Button>
                  </div>
                </div>
              )}

              <SheetFooter>
                <Button variant="outline" onClick={clearCart} className="w-full">
                  Clear Cart
                </Button>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
