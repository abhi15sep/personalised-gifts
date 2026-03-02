"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductImage {
  url: string
  altText: string
}

interface Product {
  id: number
  name: string
  slug: string
  basePrice: number
  compareAtPrice?: number
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

  const primaryImage = product.images[0]

  return (
    <Card className="group relative overflow-hidden border-warm-200 p-0 shadow-sm transition-shadow hover:shadow-md">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-warm-600 hover:text-warm-900"
      >
        <Heart
          className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")}
        />
        <span className="sr-only">
          {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      </Button>

      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isPersonalizable && (
          <Badge className="bg-gold text-warm-900 border-0 text-[10px] font-semibold uppercase tracking-wide">
            Personalise
          </Badge>
        )}
        {hasDiscount && (
          <Badge variant="destructive" className="text-[10px] font-semibold">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-warm-100">
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
          <h3 className="line-clamp-2 text-sm font-medium text-warm-800 transition-colors group-hover:text-warm-900">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              hasDiscount ? "text-red-600" : "text-warm-800"
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
