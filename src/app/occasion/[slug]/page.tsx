export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, Gift } from "lucide-react"
import { Metadata } from "next"

import { getProductsByOccasion, getOccasions } from "@/lib/actions/products"
import { DEFAULT_OCCASION_BANNER, DEFAULT_OCCASION_TAGLINE } from "@/lib/constants"
import { ProductCard } from "@/components/product/product-card"
import { getWishlistedProductIds } from "@/lib/get-wishlisted-ids"
import { Button } from "@/components/ui/button"

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

  const [products, wishlistedIds] = await Promise.all([
    getProductsByOccasion(slug),
    getWishlistedProductIds(),
  ])

  // Priority: DB bannerUrl (set via admin) > generic placeholder
  const bannerUrl = occasion.bannerUrl || DEFAULT_OCCASION_BANNER
  const tagline = occasion.tagline || DEFAULT_OCCASION_TAGLINE

  return (
    <div>
      {/* Hero Banner — full-width, Photobox-style */}
      <div className="relative w-full overflow-hidden bg-charcoal">
        {bannerUrl ? (
          <div className="relative h-[280px] sm:h-[360px] md:h-[420px]">
            <Image
              src={bannerUrl}
              alt={`${occasion.name} gifts`}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                <div className="max-w-lg">
                  <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                    {occasion.icon} {occasion.name}
                  </span>
                  <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                    {occasion.name} Gifts
                  </h1>
                  <p className="mt-3 text-base text-white/90 sm:text-lg md:max-w-md">
                    {tagline}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-rose hover:bg-rose/90 text-white"
                      asChild
                    >
                      <a href="#products">
                        <Gift className="mr-2 size-4" />
                        Shop {occasion.name} Gifts
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-rose/10 to-gold/10 py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
              <h1 className="font-heading text-3xl font-bold text-charcoal md:text-5xl">
                {occasion.name} Gifts
              </h1>
              <p className="mt-3 text-muted-foreground md:text-lg">
                {tagline}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <Link href="/occasions" className="hover:text-foreground">
              Occasions
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{occasion.name}</span>
          </nav>

          {/* Product count */}
          <div className="mb-6" id="products">
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "gift" : "gifts"} for {occasion.name.toLowerCase()}
            </p>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <Gift className="mx-auto size-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                No products found for this occasion yet.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon — we&apos;re adding new gifts all the time!
              </p>
              <Button variant="outline" className="mt-6" asChild>
                <Link href="/products">Browse All Gifts</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  initialWishlisted={wishlistedIds.has(product.id)}
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
    </div>
  )
}
