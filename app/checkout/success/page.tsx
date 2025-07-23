import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Download, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Order Confirmed | Lisa T Photography",
  description: "Your order has been successfully placed",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
            <CardDescription>Here's what you can expect from Lisa T Photography</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Order Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email confirmation with your order details within the next few minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Processing & Printing</h3>
                <p className="text-sm text-muted-foreground">
                  Your photos will be professionally printed on premium archival paper and carefully packaged.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will ship within 3-5 business days. You'll receive tracking information once shipped.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/gallery">Continue Shopping</Link>
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Questions about your order?</p>
            <Link href="/contact" className="text-primary hover:underline">
              Contact Lisa T Photography
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
