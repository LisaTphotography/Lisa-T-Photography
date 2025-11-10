import Image from "next/image"

interface WatermarkedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  unoptimized?: boolean
  sizes?: string
}

export function WatermarkedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  priority,
  unoptimized = true,
  sizes,
}: WatermarkedImageProps) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes}
      />
      {/* Watermark overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="text-white/40 font-bold text-base sm:text-lg md:text-2xl lg:text-3xl rotate-[-15deg] select-none whitespace-nowrap px-4">
          Lisa JT Photography
        </div>
      </div>
    </div>
  )
}
