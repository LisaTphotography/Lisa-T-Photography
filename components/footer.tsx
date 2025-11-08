import Link from "next/link"
import { Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Lisa JT Photography</h3>
            <p className="text-muted-foreground mb-4">
              Capturing life's precious moments with artistic vision and professional quality.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/lisa_jt_photography_"
                className="text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p>Strathmore, Alberta</p>
              <p className="mt-2">Email: LisaJTPhotography@gmail.com</p>
              <p>Phone: (403) 934-7262</p>
            </address>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Follow us:</p>
              <Link
                href="https://instagram.com/lisa_jt_photography_"
                className="text-primary hover:underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                @lisa_jt_photography_
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Lisa JT Photography. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
