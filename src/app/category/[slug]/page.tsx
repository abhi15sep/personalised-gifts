import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES, PRODUCT_IMAGES } from "@/lib/constants"

const PLACEHOLDER_PRODUCTS = [
  { name: "Personalised Name Mug", price: "£14.99", slug: "personalised-name-mug" },
  { name: "Engraved Heart Necklace", price: "£29.99", slug: "engraved-heart-necklace" },
  { name: "Custom Photo Cushion", price: "£24.99", slug: "custom-photo-cushion" },
  { name: "Star Map Print", price: "£34.99", slug: "custom-star-map-print" },
  { name: "Personalised Baby Blanket", price: "£32.99", slug: "personalised-baby-blanket" },
  { name: "Custom Family Portrait", price: "£59.99", slug: "custom-family-portrait" },
]

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) return {}
  return {
    title: `${category.name} | Personalised Gifts`,
    description: `Browse our collection of personalised ${category.name.toLowerCase()}. Handcrafted with love and delivered to your door.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span>Categories</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-charcoal md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse our personalised {category.name.toLowerCase()} collection
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {PLACEHOLDER_PRODUCTS.map((product) => {
            const imageUrl = PRODUCT_IMAGES[product.slug]
            return (
              <Link key={product.name} href={`/products/${product.slug}`} className="group">
                <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
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
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-charcoal group-hover:text-rose transition-colors">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-rose">{product.price}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
