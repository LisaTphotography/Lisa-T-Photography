import type { Metadata } from "next"
import { getPhotoById } from "@/components/photo-data"
import PhotoDetailPageClient from "./PhotoDetailPageClient"

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const photo = getPhotoById(Number.parseInt(params.id))
  if (!photo) {
    return {
      title: "Photo Not Found | Lisa JT Photography",
      description: "The requested photo could not be found.",
    }
  }
  return {
    title: `${photo.title} | Lisa JT Photography`,
    description: photo.description || `${photo.title} - ${photo.category} photography by Lisa T`,
  }
}

export default function PhotoDetailPage() {
  return <PhotoDetailPageClient />
}
