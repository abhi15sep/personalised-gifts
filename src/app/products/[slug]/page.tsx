import Link from "next/link"

import { formatPrice, getDeliveryEstimate } from "@/lib/format"
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
import { AddToCart } from "@/components/product/add-to-cart"

// Placeholder product data
const PLACEHOLDER_PRODUCT = {
  id: 1,
  name: "Personalised Name Mug",
  slug: "personalised-name-mug",
  basePrice: 1299,
  compareAtPrice: 1599,
  rating: 4,
  reviewCount: 47,
  isPersonalizable: true,
  productionDays: 3,
  description:
    "A beautiful ceramic mug personalised with the name of your choice. Each mug is individually crafted using premium materials and printed with care. The perfect gift for birthdays, Christmas, or just because. Dishwasher and microwave safe.",
  deliveryInfo:
    "Standard delivery: 3-5 working days. Express delivery available at checkout for next-day dispatch. All items are carefully packaged to ensure safe arrival. Free delivery on orders over \u00a340.",
  variants: [
    { label: "Standard (330ml)", value: "standard" },
    { label: "Large (450ml)", value: "large" },
  ],
}

const SIMILAR_PRODUCTS = [
  { id: 1, name: "Engraved Wooden Photo Frame", slug: "engraved-wooden-photo-frame", price: 2499 },
  { id: 2, name: "Custom Star Map Print", slug: "custom-star-map-print", price: 3499 },
  { id: 3, name: "Hand-Stamped Silver Bracelet", slug: "hand-stamped-silver-bracelet", price: 4599 },
  { id: 4, name: "Personalised Chopping Board", slug: "personalised-chopping-board", price: 2999 },
]

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
      <span className="text-sm text-warm-600">({count} reviews)</span>
    </div>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = PLACEHOLDER_PRODUCT
  const deliveryEstimate = getDeliveryEstimate(product.productionDays)

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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Detail - Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Images */}
        <div>
          {/* Main Image Placeholder */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-warm-100 via-warm-50 to-warm-200">
            {product.isPersonalizable && (
              <Badge className="absolute left-3 top-3 bg-gold text-warm-900 border-0 text-xs font-semibold uppercase tracking-wide">
                Personalise
              </Badge>
            )}
            <div className="flex h-full items-center justify-center">
              <span className="text-8xl text-warm-300">{"\u2615"}</span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-4 flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors ${
                  i === 0
                    ? "border-warm-600"
                    : "border-warm-200 hover:border-warm-400"
                } bg-gradient-to-br from-warm-100 to-warm-200`}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="text-2xl text-warm-300">{"\u2615"}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-warm-900 sm:text-3xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-2">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-warm-800">
              From {formatPrice(product.basePrice / 100)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-lg text-warm-500 line-through">
                {formatPrice(product.compareAtPrice / 100)}
              </span>
            )}
          </div>

          <Separator className="my-5 bg-warm-200" />

          {/* Client Component: Variants, Personalisation, Quantity, Add to Cart, Wishlist */}
          <AddToCart
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={product.basePrice}
            isPersonalizable={product.isPersonalizable}
            variants={product.variants}
          />

          {/* Delivery Estimate */}
          <div className="mt-5 flex items-center gap-2 rounded-md bg-warm-100 px-3 py-2 text-sm text-warm-700">
            <span>{"\uD83D\uDCE6"}</span>
            <span>Est. delivery: {deliveryEstimate}</span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b border-warm-200 bg-transparent" variant="line">
            <TabsTrigger value="description" className="text-warm-700 data-[state=active]:text-warm-900">
              Description
            </TabsTrigger>
            <TabsTrigger value="delivery" className="text-warm-700 data-[state=active]:text-warm-900">
              Delivery Info
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-warm-700 data-[state=active]:text-warm-900">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose prose-warm max-w-none text-warm-700">
              <p>{product.description}</p>
              <ul className="mt-4 space-y-1 text-sm">
                <li>Premium ceramic material</li>
                <li>Dishwasher and microwave safe</li>
                <li>Individually hand-finished</li>
                <li>Comes gift-boxed</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-4">
            <div className="text-warm-700">
              <p>{product.deliveryInfo}</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="text-warm-700">
              <div className="mb-4">
                <StarRating rating={product.rating} count={product.reviewCount} />
              </div>
              {[
                { author: "Sarah M.", rating: 5, text: "Absolutely beautiful! The quality is amazing and it arrived so quickly. My mum loved it!" },
                { author: "James R.", rating: 4, text: "Great gift, well made. The personalisation looked fantastic. Would buy again." },
                { author: "Emma T.", rating: 4, text: "Lovely quality and the packaging was gorgeous. Perfect birthday present." },
              ].map((review, i) => (
                <div key={i} className="border-b border-warm-200 py-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-warm-800">{review.author}</span>
                    <div className="flex text-gold text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= review.rating ? "\u2605" : "\u2606"}</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-warm-600">{review.text}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* You May Also Like */}
      <div className="mt-16">
        <h2 className="font-heading text-2xl font-bold text-warm-900 mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {SIMILAR_PRODUCTS.map((item) => (
            <Link key={item.id} href={`/products/${item.slug}`} className="group">
              <div className="overflow-hidden rounded-lg border border-warm-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="aspect-square bg-gradient-to-br from-warm-100 via-warm-50 to-warm-200">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-4xl text-warm-300">{"\uD83C\uDF81"}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium text-warm-800 transition-colors group-hover:text-warm-900">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-warm-800">
                    {formatPrice(item.price / 100)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
