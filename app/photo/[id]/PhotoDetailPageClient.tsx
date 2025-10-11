"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, ShoppingCart, ZoomIn, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getPhotoById, photos, handlePurchase } from "@/components/photo-data"
import { getDirectImageUrl } from "@/lib/image-utils"
import { useParams, useRouter } from "next/navigation"

// Frame pricing by size
const framePricing = {
  black: {
    small: 15, // 5x7
    medium: 25, // 8x11
    large: 27, // 11x14
    extraLarge: 30, // 16x20
  },
  white: {
    small: 15,
    medium: 25,
    large: 27,
    extraLarge: 30,
  },
  natural: {
    small: 18,
    medium: 28,
    large: 30,
    extraLarge: 35,
  },
  none: {
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
  },
}

type FrameType = "none" | "black" | "white" | "natural"
type SizeType = "small" | "medium" | "large" | "extraLarge"

export default function PhotoDetailPageClient() {
  const params = useParams()
  const router = useRouter()
  const photo = getPhotoById(Number.parseInt(params.id as string))
  const [selectedSize, setSelectedSize] = useState<SizeType>("medium")
  const [selectedFrame, setSelectedFrame] = useState<FrameType>("none")
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  if (!photo) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Photo Not Found</h1>
        <p className="text-muted-foreground mb-6">The photo you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/gallery">Back to Gallery</Link>
        </Button>
      </div>
    )
  }

  // Get related photos from the same category
  const relatedPhotos = photos.filter((p) => p.category === photo.category && p.id !== photo.id).slice(0, 3)

  // Calculate total price based on selected size and frame
  const calculateTotalPrice = () => {
    if (!photo.dimensions) return 0
    const printPrice = photo.dimensions[selectedSize].price
    const framePrice = framePricing[selectedFrame][selectedSize]
    return printPrice + framePrice
  }

  const totalPrice = calculateTotalPrice()

  // Get frame description
  const getFrameDescription = () => {
    if (selectedFrame === "none") return ""
    return ` with ${selectedFrame} frame`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 gap-2">
        <Link href="/gallery">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative">
          {/* Main Image with Zoom Functionality */}
          <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
            <DialogTrigger asChild>
              <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-lg cursor-zoom-in group">
                <Image
                  src={getDirectImageUrl(photo.image) || "/placeholder.svg"}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                  unoptimized
                />
                {/* Zoom overlay indicator */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <ZoomIn className="h-6 w-6 text-gray-800" />
                  </div>
                </div>
                {/* Click to zoom text */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to zoom
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95">
              <div className="relative w-full h-[95vh] flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => setIsZoomOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <Image
                    src={getDirectImageUrl(photo.image) || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>
                {/* Photo info overlay */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white p-4 rounded-lg max-w-md">
                  <h3 className="font-semibold text-lg">{photo.title}</h3>
                  <p className="text-sm text-gray-300">{photo.category}</p>
                  {photo.description && <p className="text-sm text-gray-300 mt-2">{photo.description}</p>}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{photo.title}</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to favorites</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">{photo.category}</span>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Select Size & Price</h3>
            <Tabs
              defaultValue="medium"
              className="w-full"
              onValueChange={(value) => setSelectedSize(value as SizeType)}
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="small">5×7</TabsTrigger>
                <TabsTrigger value="medium">8×11</TabsTrigger>
                <TabsTrigger value="large">11×14</TabsTrigger>
                <TabsTrigger value="extraLarge">16×20</TabsTrigger>
              </TabsList>
              {photo.dimensions && (
                <>
                  <TabsContent value="small" className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {photo.dimensions.small.size} - Perfect for smaller spaces
                      </span>
                      <span className="text-2xl font-bold">${photo.dimensions.small.price.toFixed(2)}</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="medium" className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {photo.dimensions.medium.size} - Our most popular size
                      </span>
                      <span className="text-2xl font-bold">${photo.dimensions.medium.price.toFixed(2)}</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="large" className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {photo.dimensions.large.size} - Makes a statement
                      </span>
                      <span className="text-2xl font-bold">${photo.dimensions.large.price.toFixed(2)}</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="extraLarge" className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {photo.dimensions.extraLarge.size} - Premium wall art size
                      </span>
                      <span className="text-2xl font-bold">${photo.dimensions.extraLarge.price.toFixed(2)}</span>
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
            <p className="text-sm text-muted-foreground mt-2">Free shipping on orders over $50</p>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Select Frame</h3>
            <Select defaultValue="none" onValueChange={(value) => setSelectedFrame(value as FrameType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Frame</SelectItem>
                <SelectItem value="black">Black Frame (+${framePricing.black[selectedSize]})</SelectItem>
                <SelectItem value="white">White Frame (+${framePricing.white[selectedSize]})</SelectItem>
                <SelectItem value="natural">Natural Wood Frame (+${framePricing.natural[selectedSize]})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {photo.dimensions?.[selectedSize].size}
                  {getFrameDescription()}
                </p>
                {selectedFrame !== "none" && (
                  <div className="text-sm text-muted-foreground mt-1">
                    <p>Print: ${photo.dimensions?.[selectedSize].price.toFixed(2)}</p>
                    <p>Frame: ${framePricing[selectedFrame][selectedSize].toFixed(2)}</p>
                  </div>
                )}
              </div>
              <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => {
                // Create cart item with selected options
                const cartItem = {
                  id: `${photo.id}-${selectedSize}-${selectedFrame}`, // Unique ID for cart item
                  photoId: photo.id,
                  title: photo.title,
                  image: photo.image,
                  category: photo.category,
                  size: selectedSize,
                  frame: selectedFrame,
                  price: totalPrice,
                  quantity: 1,
                }

                // Get existing cart items from localStorage
                const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

                // Check if item already exists in cart
                const existingItemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id)

                if (existingItemIndex >= 0) {
                  // If item exists, increase quantity
                  existingCart[existingItemIndex].quantity += 1
                } else {
                  // If new item, add to cart
                  existingCart.push(cartItem)
                }

                // Save updated cart to localStorage
                localStorage.setItem("cart", JSON.stringify(existingCart))

                // Handle purchase tracking
                handlePurchase(photo.id)

                // Redirect to cart page
                router.push("/cart")
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              Buy Now
            </Button>
          </div>

          <Separator className="my-8" />

          {photo.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{photo.description}</p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>• Premium archival paper</li>
              <li>• Fade-resistant inks</li>
              <li>• Signed by Lisa T</li>
              <li>• Certificate of authenticity included</li>
              <li>• Ships within 3-5 business days</li>
              <li>• Click image above to view full size</li>
            </ul>
          </div>
        </div>
      </div>

      {relatedPhotos.length > 0 && (
        <>
          <Separator className="my-12" />
          <section>
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPhotos.map((relatedPhoto) => (
                <Card key={relatedPhoto.id} className="overflow-hidden">
                  <Link href={`/photo/${relatedPhoto.id}`} className="block relative aspect-square">
                    <Image
                      src={getDirectImageUrl(relatedPhoto.image) || "/placeholder.svg"}
                      alt={relatedPhoto.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      unoptimized
                    />
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/photo/${relatedPhoto.id}`} className="font-medium hover:underline">
                      {relatedPhoto.title}
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">{relatedPhoto.category}</span>
                      <span className="font-semibold">${relatedPhoto.price.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
