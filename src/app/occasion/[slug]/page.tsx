import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Metadata } from "next"

import { getProductsByOccasion, getOccasions } from "@/lib/actions/products"
import { OCCASION_IMAGES } from "@/lib/constants"
import { ProductCard } from "@/components/product/product-card"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const occasions = await getOccasions()
    return occasions.map((occasion) => ({
      slug: occasion.slug,
    }))
  } catch {
    // DB unavailable at build time - return empty for on-demand generation
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const occasions = await getOccasions()
  const occasion = occasions.find((o) => o.slug === slug)
  if (!occasion) return {}
  return {
    title: `${occasion.name} Gifts | Personalised Gifts`,
    description: `Discover unique personalised gifts for ${occasion.name}. Handcrafted with love and delivered to your door.`,
  }
}

export default async function OccasionPage({ params }: PageProps) {
  const { slug } = await params
  const occasions = await getOccasions()
  const occasion = occasions.find((o) => o.slug === slug)

  if (!occasion) {
    notFound()
  }

  const products = await getProductsByOccasion(slug)
  const occasionImage = OCCASION_IMAGES[occasion.slug]

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span>Occasions</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{occasion.name}</span>
        </nav>

        {/* Hero Banner */}
        {occasionImage && (
          <div className="relative mb-10 h-48 overflow-hidden rounded-2xl md:h-64">
            <Image
              src={occasionImage}
              alt={`${occasion.name} gifts`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
                {occasion.name} Gifts
              </h1>
              <p className="mt-1 text-white/80">
                {products.length} {products.length === 1 ? "gift" : "gifts"} for {occasion.name.toLowerCase()}
              </p>
            </div>
          </div>
        )}

        {!occasionImage && (
          <div className="mb-10">
            <h1 className="font-heading text-3xl font-bold text-charcoal md:text-4xl">
              {occasion.name} Gifts
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find the perfect personalised gift for {occasion.name.toLowerCase()}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No products found for this occasion yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  basePrice: product.basePrice as unknown as number,
                  compareAtPrice: product.compareAtPrice as unknown as number | null,
                  images: product.images.map((img) => ({
                    url: img.url,
                    altText: img.altText,
                  })),
                  isPersonalizable: product.isPersonalizable,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
