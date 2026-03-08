"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ProductImage {
  id: number
  url: string
  altText: string | null
}

export function ImageGallery({
  images,
  productName,
  isPersonalizable,
}: {
  images: ProductImage[]
  productName: string
  isPersonalizable: boolean
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex]

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {isPersonalizable && (
          <Badge className="absolute left-3 top-3 z-10 bg-rose text-white border-0 text-xs font-semibold uppercase tracking-wide">
            Personalise
          </Badge>
        )}
        {currentImage ? (
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                i === selectedIndex
                  ? "border-rose"
                  : "border-gray-200 hover:border-gray-400"
              } bg-gray-100`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productName} view ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}