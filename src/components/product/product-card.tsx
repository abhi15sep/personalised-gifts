"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { PRODUCT_IMAGES } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductImage {
  url: string
  altText: string | null
}

interface Product {
  id: number
  name: string
  slug: string
  basePrice: number
  compareAtPrice?: number | null
  images: ProductImage[]
  isPersonalizable: boolean
}

interface ProductCardProps {
  product: Product
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price / 100)
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100
      )
    : 0

  const dbImage = product.images[0]
  const fallbackUrl = PRODUCT_IMAGES[product.slug]
  const primaryImage = dbImage || (fallbackUrl ? { url: fallbackUrl, altText: product.name } : null)

  return (
    <Card className="group relative overflow-hidden border-gray-200 p-0 shadow-sm transition-all hover:shadow-lg">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 hover:text-charcoal"
      >
        <Heart
          className={cn("h-4 w-4", isWishlisted && "fill-rose text-rose")}
        />
        <span className="sr-only">
          {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      </Button>

      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isPersonalizable && (
          <Badge className="bg-rose text-white border-0 text-[10px] font-semibold uppercase tracking-wide">
            Personalise
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-gold text-white border-0 text-[10px] font-semibold">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-3 pt-2">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-sm font-medium text-charcoal transition-colors group-hover:text-rose">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              hasDiscount ? "text-rose" : "text-charcoal"
            )}
          >
            {formatPrice(product.basePrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
