import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Camera, Clock, Globe, Medal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About | Lisa T Photography",
  description: "Learn about the photographer behind Lisa T Photography",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-3xl font-bold mb-4">About Lisa T</h1>
            <p className="text-muted-foreground mb-4">
              Hi, I'm Lisa — a nature and rural landscape photographer based in Strathmore, Alberta.
            </p>
            <p className="text-muted-foreground mb-4">
              Photography started as a fun creative outlet while raising my four kids, and over the years, it's become a
              way for me to slow down and reconnect with the world around me. I've been photographing on and off for
              about five years, always drawn to the quiet beauty of old buildings, weathered barns, and the timeless
              silhouettes of grain elevators on the prairie skyline.
            </p>
            <p className="text-muted-foreground mb-4">
              My work is inspired by the charm of the past and the peace of wide open spaces. Every photo is a
              reflection of Alberta's rural spirit — still, strong, and full of character.
            </p>
            <p className="text-muted-foreground mb-6">
              Whether you're here to explore or looking for a print to bring a bit of prairie calm into your space, I'm
              so glad you stopped by. Thank you for supporting local, independent photography.
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://i.imgur.com/mJQWRoG.jpg"
              alt="Lisa T - Photographer"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        <Separator className="my-16" />

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">My Approach</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I find myself drawn to the stories that old buildings and rural landscapes tell. There's something deeply
            peaceful about capturing these quiet moments — the way morning light hits a weathered barn, or how a grain
            elevator stands proud against an endless sky. My photography is about finding beauty in simplicity and
            preserving the character of Alberta's rural heritage.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <Camera className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentic Captures</h3>
              <p className="text-muted-foreground">
                I photograph subjects as they are, embracing their weathered character and authentic details.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Globe className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Alberta Focus</h3>
              <p className="text-muted-foreground">
                My work celebrates the unique landscapes and historical structures of rural Alberta.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Clock className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Patience & Timing</h3>
              <p className="text-muted-foreground">
                I often revisit locations multiple times to capture them in the perfect light and conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Medal className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Heritage Preservation</h3>
              <p className="text-muted-foreground">
                My photography serves as a visual record of Alberta's disappearing rural heritage.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">My Process</h2>
          <p className="text-muted-foreground mb-4">
            My photography journey begins with research and exploration. I spend hours driving rural roads, searching
            for forgotten structures and unique landscapes that tell Alberta's story.
          </p>
          <p className="text-muted-foreground mb-4">I'm particularly drawn to:</p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Historic grain elevators - the "prairie sentinels" that once defined our rural skyline</li>
            <li>• Abandoned farmhouses and barns with their weathered character</li>
            <li>• Rural churches and schoolhouses that served as community anchors</li>
            <li>• Vintage vehicles left to rest in fields and farmyards</li>
            <li>• The dramatic skies and weather that define prairie life</li>
          </ul>
        </div>

        <Separator className="my-16" />

        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Preserving Our Prairie Heritage</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            From my home base in Strathmore, I explore the back roads and forgotten corners of Alberta, always with my
            camera ready. Each print you choose helps support this passion project and brings a piece of prairie
            tranquility into your home.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Me</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
