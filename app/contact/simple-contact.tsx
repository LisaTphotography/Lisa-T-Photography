import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleContact() {
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
              <a href="tel:+14039347262" className="text-primary hover:underline">
                (403) 934-7262
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Email</CardTitle>
              <CardDescription>We'll respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <a href="mailto:LisaJTPhotography@gmail.com" className="text-primary hover:underline">
                LisaJTPhotography@gmail.com
              </a>
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

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Click the button below to open your email client and send us a message.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <a href="mailto:LisaJTPhotography@gmail.com?subject=Photography Inquiry&body=Hi Lisa,%0D%0A%0D%0AI'm interested in your photography. Please tell me more about:%0D%0A%0D%0A[Your message here]%0D%0A%0D%0AThank you!">
                Send Email
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              This will open your default email app with a pre-filled message to LisaJTPhotography@gmail.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
