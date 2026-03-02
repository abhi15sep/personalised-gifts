import Link from "next/link"
import Image from "next/image"

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
      <span className="text-sm text-gray-500">({count} reviews)</span>
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
  const productImage = PRODUCT_IMAGES[product.slug]

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
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.isPersonalizable && (
              <Badge className="absolute left-3 top-3 z-10 bg-rose text-white border-0 text-xs font-semibold uppercase tracking-wide">
                Personalise
              </Badge>
            )}
            {productImage ? (
              <Image
                src={productImage}
                alt={product.name}
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
          <div className="mt-4 flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                  i === 0
                    ? "border-rose"
                    : "border-gray-200 hover:border-gray-400"
                } bg-gray-100`}
              >
                {productImage ? (
                  <Image
                    src={productImage}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                    {i + 1}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-2">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-charcoal">
              From {formatPrice(product.basePrice / 100)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice / 100)}
              </span>
            )}
          </div>

          <Separator className="my-5 bg-gray-200" />

          {/* Client Component: Variants, Personalisation, Quantity, Add to Cart, Wishlist */}
          <AddToCart
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={product.basePrice}
            isPersonalizable={product.isPersonalizable}
            variants={product.variants}
            imageUrl={productImage}
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
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none text-gray-600">
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
            <div className="text-gray-600">
              <p>{product.deliveryInfo}</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="text-gray-600">
              <div className="mb-4">
                <StarRating rating={product.rating} count={product.reviewCount} />
              </div>
              {[
                { author: "Sarah M.", rating: 5, text: "Absolutely beautiful! The quality is amazing and it arrived so quickly. My mum loved it!" },
                { author: "James R.", rating: 4, text: "Great gift, well made. The personalisation looked fantastic. Would buy again." },
                { author: "Emma T.", rating: 4, text: "Lovely quality and the packaging was gorgeous. Perfect birthday present." },
              ].map((review, i) => (
                <div key={i} className="border-b border-gray-200 py-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal">{review.author}</span>
                    <div className="flex text-gold text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= review.rating ? "\u2605" : "\u2606"}</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{review.text}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* You May Also Like */}
      <div className="mt-16">
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {SIMILAR_PRODUCTS.map((item) => {
            const imgUrl = PRODUCT_IMAGES[item.slug]
            return (
              <Link key={item.id} href={`/products/${item.slug}`} className="group">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-medium text-charcoal transition-colors group-hover:text-rose">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold text-charcoal">
                      {formatPrice(item.price / 100)}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
