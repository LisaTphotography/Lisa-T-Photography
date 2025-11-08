"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Package, Truck, MapPin, Calculator } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getDirectImageUrl } from "@/lib/image-utils"
import { calculateShippingByPostalCode, isValidCanadianPostalCode } from "@/lib/shipping-calculator"
import { sendOrderEmails } from "./send-order-email"
import { useToast } from "@/hooks/use-toast"

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

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
}

export default function CheckoutClientPage() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "delivery">("delivery")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "AB",
    postalCode: "",
    country: "Canada",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<{
    zone: any
    price: number
    freeShippingEligible: boolean
  } | null>(null)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(savedCart)
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    if (shippingMethod === "pickup") {
      setShippingInfo({ zone: null, price: 0, freeShippingEligible: true })
      return
    }

    if (isValidCanadianPostalCode(shippingAddress.postalCode)) {
      const result = calculateShippingByPostalCode(shippingAddress.postalCode, subtotal)
      setShippingInfo(result)
    } else {
      setShippingInfo(null)
    }
  }, [shippingMethod, shippingAddress.postalCode, subtotal])

  const shipping = shippingMethod === "pickup" ? 0 : shippingInfo ? shippingInfo.price : null
  const tax = subtotal * 0.05
  const total = shippingMethod === "pickup" || shipping !== null ? subtotal + (shipping || 0) + tax : null

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

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const shippingCalculated =
    shippingMethod === "pickup" ||
    (shippingInfo !== null && shippingInfo !== undefined && shippingInfo.price !== undefined)

  const validateStep = () => {
    if (shippingMethod === "pickup")
      return shippingAddress.firstName && shippingAddress.lastName && shippingAddress.email

    return (
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.email &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.postalCode &&
      isValidCanadianPostalCode(shippingAddress.postalCode) &&
      shippingCalculated
    )
  }

  const getDeliveryStatus = () => {
    if (shippingMethod === "pickup" || !shippingInfo) return null

    const { zone, price, freeShippingEligible } = shippingInfo

    if (price === 0) {
      return {
        type: "free",
        message:
          freeShippingEligible && subtotal >= 100
            ? "✓ Free shipping (order over $100)"
            : "✓ Free delivery to your area!",
        deliveryTime: zone.deliveryDays,
      }
    } else {
      return {
        type: "paid",
        message: `📦 Delivery: $${price.toFixed(2)} (${zone.name})`,
        deliveryTime: zone.deliveryDays,
      }
    }
  }

  const deliveryStatus = getDeliveryStatus()

  const handleSubmit = async () => {
    setIsProcessing(true)

    // Add this console log
    console.log("Starting order submission...")

    try {
      const orderNumber = `LT-${Date.now()}`

      console.log("Order number:", orderNumber)
      console.log("Customer email:", shippingAddress.email)

      // Prepare email data
      const emailData = {
        orderNumber,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        shippingMethod,
        shippingAddress:
          shippingMethod === "delivery"
            ? {
                address: shippingAddress.address,
                city: shippingAddress.city,
                province: shippingAddress.province,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
              }
            : undefined,
        items: cartItems.map((item) => ({
          title: item.title,
          size: getSizeDisplay(item.size),
          frame: getFrameDisplay(item.frame),
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping: shipping || 0,
        tax,
        total: total || subtotal + tax,
        shippingZone: shippingInfo?.zone || null,
      }

      // Send emails
      const result = await sendOrderEmails(emailData)

      if (!result.success) {
        toast({
          title: "Email Error",
          description: "Order placed but confirmation emails failed to send. We'll contact you shortly.",
          variant: "destructive",
        })
      }

      // Save order details
      const orderDetails = {
        ...emailData,
        items: cartItems,
      }
      localStorage.setItem("lastOrder", JSON.stringify(orderDetails))

      // Clear cart
      localStorage.removeItem("cart")

      // Redirect to success page
      window.location.href = "/checkout/success"
    } catch (error) {
      console.error("Detailed error:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process order. Please try again or contact us directly.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some photos to your cart before checking out.</p>
        <Button asChild>
          <Link href="/gallery">Browse Gallery</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 gap-2">
        <Link href="/cart">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Payment Method Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Payment Method: E-Transfer
                </CardTitle>
                <CardDescription>
                  We accept Interac e-transfer - a secure and convenient way to pay online in Canada
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2 text-blue-800">
                  <p className="font-medium">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Complete your order below</li>
                    <li>You'll receive payment instructions via email</li>
                    <li>
                      Send e-transfer to: <strong>LisaJTPhotography@gmail.com</strong>
                    </li>
                    <li>Your order will be processed once payment is received</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Method
                </CardTitle>
                <CardDescription>Choose how you'd like to receive your photos</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={(value) => setShippingMethod(value as "pickup" | "delivery")}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Pickup in Strathmore</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pick up your order in Strathmore, AB - No delivery charge
                      </p>
                    </Label>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">Courier Delivery</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Cost calculated by postal code and distance</p>
                    </Label>
                    <span className="font-semibold text-blue-600">
                      <Calculator className="h-4 w-4 inline mr-1" />
                      To be calculated
                    </span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>We need your contact details for order updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleShippingChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleShippingChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleShippingChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleShippingChange("phone", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address - Only show if delivery is selected */}
            {shippingMethod === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                  <CardDescription>Enter your address to calculate delivery cost</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleShippingChange("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select
                        value={shippingAddress.province}
                        onValueChange={(value) => handleShippingChange("province", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AB">Alberta</SelectItem>
                          <SelectItem value="BC">British Columbia</SelectItem>
                          <SelectItem value="SK">Saskatchewan</SelectItem>
                          <SelectItem value="MB">Manitoba</SelectItem>
                          <SelectItem value="ON">Ontario</SelectItem>
                          <SelectItem value="QC">Quebec</SelectItem>
                          <SelectItem value="NB">New Brunswick</SelectItem>
                          <SelectItem value="NS">Nova Scotia</SelectItem>
                          <SelectItem value="PE">Prince Edward Island</SelectItem>
                          <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                          <SelectItem value="NT">Northwest Territories</SelectItem>
                          <SelectItem value="NU">Nunavut</SelectItem>
                          <SelectItem value="YT">Yukon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleShippingChange("postalCode", e.target.value.toUpperCase())}
                        placeholder="A1A 1A1"
                        required
                      />
                      {shippingAddress.postalCode && !isValidCanadianPostalCode(shippingAddress.postalCode) && (
                        <p className="text-sm text-red-600 mt-1">Please enter a valid Canadian postal code</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={shippingAddress.country}
                        onValueChange={(value) => handleShippingChange("country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {deliveryStatus && (
                    <div
                      className={`mt-4 p-3 rounded-md ${deliveryStatus.type === "free" ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}
                    >
                      <p
                        className={`text-sm font-medium ${deliveryStatus.type === "free" ? "text-green-800" : "text-blue-800"}`}
                      >
                        {deliveryStatus.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${deliveryStatus.type === "free" ? "text-green-600" : "text-blue-600"}`}
                      >
                        Estimated delivery: {deliveryStatus.deliveryTime}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!validateStep() || isProcessing}
              size="lg"
              className="w-full gap-2"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Place Order (E-Transfer Instructions Will Be Sent)
                </>
              )}
            </Button>

            {!shippingCalculated && shippingMethod === "delivery" && (
              <p className="text-sm text-muted-foreground text-center">
                Enter your postal code above to see delivery cost and complete your order
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={getDirectImageUrl(item.image) || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{getSizeDisplay(item.size)}</p>
                      <p className="text-xs text-muted-foreground">{getFrameDisplay(item.frame)}</p>
                      <p className="text-sm font-medium">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{shippingMethod === "pickup" ? "Pickup" : "Delivery"}</span>
                  <span>
                    {shipping === null ? (
                      <span className="text-muted-foreground">To be calculated</span>
                    ) : shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {total !== null ? (
                      `$${total.toFixed(2)}`
                    ) : (
                      <span className="text-muted-foreground">To be calculated</span>
                    )}
                  </span>
                </div>
              </div>

              {total !== null && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 font-medium">💰 E-Transfer Payment</p>
                  <p className="text-xs text-green-600 mt-1">
                    Send ${total.toFixed(2)} to LisaJTPhotography@gmail.com after placing your order
                  </p>
                </div>
              )}

              {shippingMethod === "pickup" && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800 font-medium">📍 Pickup Location</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Strathmore, AB - Exact pickup details will be provided after payment
                  </p>
                </div>
              )}

              {shippingMethod === "delivery" && !shippingCalculated && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800 font-medium">📦 Delivery Cost</p>
                  <p className="text-xs text-yellow-600 mt-1">Enter your postal code to calculate delivery cost</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
