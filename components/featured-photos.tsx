"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getFeaturedPhotos } from "./photo-data"
import { getDirectImageUrl } from "@/lib/image-utils"

export default function FeaturedPhotos() {
  const [favorites, setFavorites] = useState<number[]>([])
  const featuredPhotos = getFeaturedPhotos()

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((photoId) => photoId !== id) : [...prev, id]))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredPhotos.map((photo) => (
        <div key={photo.id} className="group relative flex flex-col">
          <div className="relative aspect-square overflow-hidden rounded-md photo-watermark">
            <Link href={`/photo/${photo.id}`}>
              <Image
                src={getDirectImageUrl(photo.image) || "/placeholder.svg"}
                alt={photo.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                unoptimized
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => toggleFavorite(photo.id)}
            >
              <Heart className={cn("h-5 w-5", favorites.includes(photo.id) ? "fill-red-500 text-red-500" : "")} />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>
          <div className="mt-3 flex flex-col">
            <Link href={`/photo/${photo.id}`} className="font-medium hover:underline">
              {photo.title}
            </Link>
            <span className="text-sm text-muted-foreground">{photo.category}</span>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-semibold">From ${photo.price.toFixed(2)}</span>
              <Button size="sm" variant="outline" className="h-8 gap-1 bg-transparent">
                <ShoppingCart className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
