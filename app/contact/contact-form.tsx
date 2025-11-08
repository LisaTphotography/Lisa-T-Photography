"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ContactForm() {
  const [copied, setCopied] = useState("")

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Contact Lisa JT Photography</h2>
        <p className="text-muted-foreground">Ready to discuss your photography needs? Here's how to reach me:</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Card */}
        <Card>
          <CardHeader className="text-center">
            <Mail className="w-12 h-12 mx-auto mb-2 text-primary" />
            <CardTitle>Email</CardTitle>
            <CardDescription>Best way to reach me</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium">LisaJTPhotography@gmail.com</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => copyToClipboard("LisaJTPhotography@gmail.com", "email")}
              className="w-full"
            >
              {copied === "email" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Email Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Email Address
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Phone Card */}
        <Card>
          <CardHeader className="text-center">
            <Phone className="w-12 h-12 mx-auto mb-2 text-primary" />
            <CardTitle>Phone</CardTitle>
            <CardDescription>For immediate assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium">(403) 934-7262</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => copyToClipboard("(403) 934-7262", "phone")}
              className="w-full"
            >
              {copied === "phone" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Number Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Phone Number
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Location Card */}
      <Card>
        <CardHeader className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
          <CardTitle>Location</CardTitle>
          <CardDescription>Based in Strathmore, Alberta</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">Strathmore, Alberta</p>
          <p className="text-sm text-muted-foreground mt-2">
            Free shipping available in Strathmore and surrounding areas
          </p>
        </CardContent>
      </Card>

      {/* Simple Contact Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-center text-blue-900">Contact Information</h3>
        <div className="space-y-2 text-blue-800">
          <p>
            <strong>Email:</strong> LisaJTPhotography@gmail.com
          </p>
          <p>
            <strong>Phone:</strong> (403) 934-7262
          </p>
          <p>
            <strong>Location:</strong> Strathmore, Alberta
          </p>
          <p>
            <strong>Response Time:</strong> Within 24 hours
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          <strong>Business Hours:</strong> I typically respond to emails within 24 hours. For urgent inquiries, please
          call.
        </p>
      </div>
    </div>
  )
}
