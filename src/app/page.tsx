export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { Heart, Truck, Flag, ArrowRight, ShieldCheck, RotateCcw, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HERO_IMAGE, DEFAULT_OCCASION_BANNER } from "@/lib/constants"
import { getOccasions, getProducts } from "@/lib/actions/products"
import { ProductCard } from "@/components/product/product-card"

export default async function HomePage() {
  const [occasions, { products: newestProducts }] = await Promise.all([
    getOccasions({ withProducts: true }),
    getProducts({ limit: 8, sortBy: 'newest' }),
  ])
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-charcoal px-4 py-24 md:py-36">
        <Image
          src={HERO_IMAGE}
          alt="Beautiful personalised gifts"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Gifts as unique as they are
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Personalised with love, delivered to your door
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full bg-rose px-8 text-base text-white hover:bg-rose-dark">
            <Link href="/products">Shop Personalised Gifts</Link>
          </Button>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-center text-3xl font-bold text-charcoal md:text-4xl">
            Shop by Occasion
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {occasions.map((occasion) => {
              const imgUrl = occasion.bannerUrl || DEFAULT_OCCASION_BANNER
              return (
                <Link
                  key={occasion.slug}
                  href={`/occasion/${occasion.slug}`}
                  className="group relative overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={occasion.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                      {occasion.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Products */}
      {newestProducts.length > 0 && (
        <section className="bg-[#f8f9fa] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl font-bold text-charcoal md:text-4xl">
                Our Products
              </h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-rose hover:underline"
              >
                View All <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {newestProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    basePrice: Number(product.basePrice),
                    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                    images: product.images.map((img) => ({ url: img.url, altText: img.altText })),
                    isPersonalizable: product.isPersonalizable,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift Finder CTA Banner */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-rose to-rose-light px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Not sure what to get?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80 md:text-lg">
            Let us help you find the perfect personalised gift
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-white px-8 text-base text-rose hover:bg-gray-100"
          >
            <Link href="/gift-finder">Take the Quiz</Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-center text-3xl font-bold text-charcoal md:text-4xl">
            Why Choose Us
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-rose/10">
                <Heart className="size-7 text-rose" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">
                Handcrafted with Love
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every gift is carefully made and personalised just for you
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-rose/10">
                <Truck className="size-7 text-rose" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">
                Fast UK Delivery
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quick and reliable delivery across the United Kingdom
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-rose/10">
                <Flag className="size-7 text-rose" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">
                Made in Britain
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Proudly designed and crafted right here in the UK
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-gray-200 bg-[#f8f9fa] px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <Package className="size-4" />
            <span>Free delivery over £40</span>
          </div>
          <div className="hidden h-4 w-px bg-gray-300 md:block" />
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4" />
            <span>30-day returns</span>
          </div>
          <div className="hidden h-4 w-px bg-gray-300 md:block" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            <span>Secure checkout</span>
          </div>
        </div>
      </section>
    </div>
  )
}
