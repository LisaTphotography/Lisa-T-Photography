import type { Metadata } from "next"
import ContactForm from "./contact-form"
import { Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact | Lisa JT Photography",
  description: "Get in touch with us for inquiries, custom orders, or any questions",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about a specific photo, need a custom size, or want to discuss a commission? I'd love to hear
            from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Phone</CardTitle>
              <CardDescription>Call us directly</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p>(403) 934-7262</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Email</CardTitle>
              <CardDescription>We'll respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p>dat210@telus.net</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Location</CardTitle>
              <CardDescription>Based in</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p>Strathmore, Alberta</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
