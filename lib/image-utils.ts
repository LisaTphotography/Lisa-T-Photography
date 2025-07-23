// Tiny helper that guarantees <Image> gets a real image URL
export function getDirectImageUrl(src?: string): string {
  if (!src) return "/placeholder.svg"

  // --- Google Drive share links ------------------------------------------
  // Formats seen:
  //   https://drive.google.com/file/d/<ID>/view?usp=sharing
  //   https://drive.google.com/open?id=<ID>
  //   https://drive.google.com/uc?export=view&id=<ID>  (already OK)
  if (src.includes("drive.google.com") && !src.includes("/uc?export=")) {
    // 1) /file/d/<ID>/...
    const bySlash = src.match(/\/d\/([a-zA-Z0-9_-]+)\//)
    if (bySlash?.[1]) return `https://drive.google.com/uc?export=view&id=${bySlash[1]}`

    // 2) ?id=<ID>
    const byQuery = src.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (byQuery?.[1]) return `https://drive.google.com/uc?export=view&id=${byQuery[1]}`
  }

  // Other hosts → return unchanged.  If it’s not an image, the browser will
  // still error, but at least Next.js isn’t blocking it.
  return src
}
