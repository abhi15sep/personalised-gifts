import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { getProductBySlug, getProducts } from "@/lib/actions/products"
import { formatPrice, getDeliveryEstimate } from "@/lib/format"
import { PRODUCT_IMAGES } from "@/lib/constants"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ImageGallery } from "@/components/product/image-gallery"
import { AddToCart } from "@/components/product/add-to-cart"
import { ProductCard } from "@/components/product/product-card"
import { getWishlistedProductIds } from "@/lib/get-wishlisted-ids"
import { ReviewForm } from "@/components/product/review-form"

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-gold">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-lg">
            {star <= rating ? "\u2605" : "\u2606"}
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-500">({count} {count === 1 ? "review" : "reviews"})</span>
    </div>
  )
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Personalised Gifts`,
    description: product.description?.slice(0, 160) || `Buy ${product.name} - unique personalised gift.`,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const deliveryEstimate = getDeliveryEstimate(product.productionDays ?? 3)

  // Get product image - prefer DB images, fall back to constants
  const dbImages = product.images
  const fallbackUrl = PRODUCT_IMAGES[product.slug]
  const hasImages = dbImages.length > 0 || fallbackUrl
  const primaryImageUrl = dbImages[0]?.url || fallbackUrl || null

  // Compute average rating from real reviews
  const reviewCount = product.reviews.length
  const avgRating = reviewCount > 0
    ? Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount)
    : 0

  // Build variants for AddToCart
  const variants = product.variants.map((v) => ({
    label: v.name,
    value: v.sku || String(v.id),
  }))

  // Fetch related products from same category + wishlist state
  const [{ products: relatedProducts }, wishlistedIds] = await Promise.all([
    getProducts({ categorySlug: product.category?.slug, limit: 4 }),
    getWishlistedProductIds(),
  ])
  const similarProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          {product.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/category/${product.category.slug}`}>
                  {product.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Detail - Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Images */}
        <ImageGallery
          images={
            dbImages.length > 0
              ? dbImages.map((img) => ({ id: img.id, url: img.url, altText: img.altText }))
              : fallbackUrl
                ? [{ id: 0, url: fallbackUrl, altText: product.name }]
                : []
          }
          productName={product.name}
          isPersonalizable={product.isPersonalizable}
        />

        {/* Right: Details */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
            {product.name}
          </h1>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="mt-2">
              <StarRating rating={avgRating} count={reviewCount} />
            </div>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-charcoal">
              From {formatPrice(Number(product.basePrice))}
            </span>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.basePrice) && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(Number(product.compareAtPrice))}
              </span>
            )}
          </div>

          <Separator className="my-5 bg-gray-200" />

          {/* Client Component: Variants, Personalisation, Quantity, Add to Cart, Wishlist */}
          <AddToCart
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={Number(product.basePrice)}
            isPersonalizable={product.isPersonalizable}
            variants={variants}
            imageUrl={primaryImageUrl || undefined}
            personalizationOptions={product.personalizationOptions.map((opt) => ({
              id: opt.id,
              optionKey: opt.optionKey,
              label: opt.label,
              optionType: opt.optionType,
              isRequired: opt.isRequired,
              priceModifier: Number(opt.priceModifier),
              constraints: opt.constraints as Record<string, unknown> | null,
            }))}
          />

          {/* Delivery Estimate */}
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#f8f9fa] px-3 py-2 text-sm text-gray-600">
            <span>{"\uD83D\uDCE6"}</span>
            <span>Est. delivery: {deliveryEstimate}</span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent" variant="line">
            <TabsTrigger value="description" className="text-gray-600 data-[state=active]:text-charcoal">
              Description
            </TabsTrigger>
            <TabsTrigger value="delivery" className="text-gray-600 data-[state=active]:text-charcoal">
              Delivery Info
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-gray-600 data-[state=active]:text-charcoal">
              Reviews ({reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none text-gray-600">
              <p>{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-4">
            <div className="text-gray-600">
              <p>
                Standard delivery: 3-5 working days. Express delivery available at checkout for next-day dispatch. All items are carefully packaged to ensure safe arrival. Free delivery on orders over £40.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="text-gray-600">
              {reviewCount > 0 ? (
                <>
                  <div className="mb-4">
                    <StarRating rating={avgRating} count={reviewCount} />
                  </div>
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 py-4 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-charcoal">
                          {review.user?.name || "Anonymous"}
                        </span>
                        <div className="flex text-gold text-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>{star <= review.rating ? "\u2605" : "\u2606"}</span>
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <p className="mt-1 text-sm font-medium text-charcoal">{review.title}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">{review.body}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
              )}
              <div className="mt-6">
                <ReviewForm productId={product.id} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* You May Also Like */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {similarProducts.map((item) => (
              <ProductCard
                key={item.id}
                initialWishlisted={wishlistedIds.has(item.id)}
                product={{
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  basePrice: item.basePrice as unknown as number,
                  compareAtPrice: item.compareAtPrice as unknown as number | null,
                  images: item.images.map((img) => ({
                    url: img.url,
                    altText: img.altText,
                  })),
                  isPersonalizable: item.isPersonalizable,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
