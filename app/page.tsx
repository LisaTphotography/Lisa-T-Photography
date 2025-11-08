import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeaturedPhotos from "@/components/featured-photos"
import TestimonialSection from "@/components/testimonial-section"
import { photos } from "@/components/photo-data"
import { getDirectImageUrl } from "@/lib/image-utils"

export default function Home() {
  // Select one photo from each category for the category tiles
  const categoryPhotos = [
    {
      category: "Old Buildings",
      photo: photos.find((p) => p.id === 1), // Rustic Red
    },
    {
      category: "Old Buildings at Night",
      photo: photos.find((p) => p.id === 33), // Evening glow
    },
    {
      category: "Old Elevators in AB",
      photo: photos.find((p) => p.id === 51), // Sharples at Sunset
    },
    {
      category: "Animals",
      photo: photos.find((p) => p.id === 26), // Silent Witness
    },
    {
      category: "Old Cars & Trains",
      photo: photos.find((p) => p.id === 58), // Snowbound Package
    },
    {
      category: "Nature & Sky",
      photo: photos.find((p) => p.id === 43), // Whispers of Frost
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.imgur.com/WBBaeRj.jpg"
            alt="Beautiful train coming around Morant's Curve in winter"
            fill
            className="object-contain brightness-[0.85]"
            priority
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-black/20 z-5"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">Lisa JT Photography</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Capturing life's precious moments with artistic vision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/gallery">View Gallery</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Photos Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Photos</h2>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/gallery">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <FeaturedPhotos />
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Photo Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categoryPhotos.map(({ category, photo }) => (
              <Link
                href={`/gallery?category=${encodeURIComponent(category)}`}
                key={category}
                className="group relative h-64 overflow-hidden rounded-lg transition-all hover:shadow-lg"
              >
                <Image
                  src={getDirectImageUrl(photo?.image) || "/placeholder.svg?height=600&width=800"}
                  alt={`${category} photography - ${photo?.title || "Sample photo"}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-white text-lg font-bold mb-1">{category}</h3>
                    {photo && <p className="text-white/80 text-sm">{photo.title}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Own a Piece of Art?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse my collection and find the perfect photo for your space.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link href="/gallery">
              Shop Now <ShoppingCart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
