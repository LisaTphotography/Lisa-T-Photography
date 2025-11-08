"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "lucide-react"
import Image from "next/image"

// Initial testimonials data - empty array as requested
const initialTestimonials = []

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newReview, setNewReview] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load testimonials from localStorage on component mount
  useEffect(() => {
    try {
      const savedTestimonials = localStorage.getItem("testimonials")
      if (savedTestimonials) {
        setTestimonials(JSON.parse(savedTestimonials))
      }
    } catch (error) {
      console.error("Error loading testimonials from localStorage:", error)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewReview((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call delay
    setTimeout(() => {
      const newTestimonial = {
        id: Date.now(), // Use timestamp for unique ID
        ...newReview,
        avatar: "/placeholder.svg?height=100&width=100", // Default avatar
      }

      // Add the new testimonial to the list
      setTestimonials((prev) => [newTestimonial, ...prev])

      // Reset form and close dialog
      setNewReview({
        name: "",
        role: "",
        content: "",
        rating: 5,
      })
      setIsSubmitting(false)
      setIsDialogOpen(false)

      // In a real app, you would save this to a database
      // For now, we'll just use localStorage to persist between page refreshes
      try {
        const savedTestimonials = JSON.parse(localStorage.getItem("testimonials") || "[]")
        localStorage.setItem("testimonials", JSON.stringify([newTestimonial, ...savedTestimonials]))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }, 1000)
  }

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">What Clients Say</h2>

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-muted p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star <= testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mb-12 py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Share your experience with Lisa JT Photography and help others discover the beauty of these unique prints.
        </p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Add Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
              <DialogDescription>
                Tell others about your experience with Lisa JT Photography. Your review will be displayed on our
                website.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" value={newReview.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Title/Role (optional)</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Home Owner, Designer, etc."
                  value={newReview.role}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Your Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          star <= newReview.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Review</Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={4}
                  value={newReview.content}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {testimonials.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="ml-4 bg-transparent"
            onClick={() => {
              if (confirm("Are you sure you want to delete all reviews? This cannot be undone.")) {
                setTestimonials([])
                localStorage.removeItem("testimonials")
              }
            }}
          >
            Clear All Reviews
          </Button>
        )}
      </div>
    </section>
  )
}
