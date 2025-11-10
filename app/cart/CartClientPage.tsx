"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { WatermarkedImage } from "@/components/watermarked-image"

interface CartItem {
  id: string
  photoId: number
  title: string
  image: string
  category: string
  size: string
  frame: string
  price: number
  quantity: number
}

export default function CartClientPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(savedCart)
  }, [])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Remove fixed shipping calculation - will be calculated at checkout
  const tax = subtotal * 0.05 // 5% GST

  const getSizeDisplay = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      small: "5×7 in",
      medium: "8×11 in",
      large: "11×14 in",
      extraLarge: "16×20 in",
    }
    return sizeMap[size] || size
  }

  const getFrameDisplay = (frame: string) => {
    if (frame === "none") return "No Frame"
    return `${frame.charAt(0).toUpperCase() + frame.slice(1)} Frame`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 sm:gap-6">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-md overflow-hidden">
                    <WatermarkedImage
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/photo/${item.photoId}`} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        <p>{getSizeDisplay(item.size)}</p>
                        <p>{getFrameDisplay(item.frame)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[240px]">
                <Input placeholder="Coupon code" />
              </div>
              <Button variant="outline">Apply Coupon</Button>
            </div>
          </div>

          <div>
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">To be calculated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-muted-foreground">To be calculated</span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Secure checkout powered by e-transfer</p>
                <p className="mt-2">Shipping calculated at checkout</p>
                <p className="mt-1">Free pickup available in Strathmore, AB</p>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" asChild className="w-full gap-2 bg-transparent">
                <Link href="/gallery">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold mt-4">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added any photos to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/gallery">Browse Gallery</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
