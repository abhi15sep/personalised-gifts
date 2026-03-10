import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Metadata } from "next"

import { getProducts, getCategories } from "@/lib/actions/products"
import { ProductCard } from "@/components/product/product-card"
import { getWishlistedProductIds } from "@/lib/get-wishlisted-ids"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch {
    // DB unavailable at build time - return empty for on-demand generation
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}
  return {
    title: `${category.name} | Personalised Gifts`,
    description: `Browse our collection of personalised ${category.name.toLowerCase()}. Handcrafted with love and delivered to your door.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const [{ products }, wishlistedIds] = await Promise.all([
    getProducts({ categorySlug: slug }),
    getWishlistedProductIds(),
  ])

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
            {products.length} {products.length === 1 ? "product" : "products"} in {category.name.toLowerCase()}
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No products found in this category yet.
          </p>
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
  )
}
