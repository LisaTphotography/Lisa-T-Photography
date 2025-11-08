import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { photos } from "@/components/photo-data"

export const metadata: Metadata = {
  title: "Gallery | Lisa JT Photography",
  description: "Browse Lisa T's collection of beautiful photography",
}

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Photo Gallery</h1>
          <p className="text-muted-foreground">Browse my collection of photography</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <Link href={`/photo/${photo.id}`} className="block relative aspect-square">
              <Image
                src={photo.image || "/placeholder.svg"}
                alt={photo.title}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </Link>
            <CardContent className="p-4">
              <Link href={`/photo/${photo.id}`} className="font-medium hover:underline">
                {photo.title}
              </Link>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">{photo.category}</span>
                <span className="font-semibold">From ${photo.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Looking for Something Special?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          If you're looking for a specific type of photo or have a custom request, I'd be happy to help you find the
          perfect image for your space.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Contact Me</Link>
        </Button>
      </div>
    </div>
  )
}
