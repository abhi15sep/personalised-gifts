import Link from "next/link"
import { SlidersHorizontal } from "lucide-react"

import { getProducts, getCategories, getOccasions } from "@/lib/actions/products"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ProductCard } from "@/components/product/product-card"
import { ProductFilters } from "@/components/product/product-filters"
import { SortSelect } from "@/components/product/sort-select"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    occasion?: string
    sort?: string
    page?: string
    priceMin?: string
    priceMax?: string
    search?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const sortBy = (params.sort as 'newest' | 'price-asc' | 'price-desc' | 'name') || 'newest'
  const priceMin = params.priceMin ? Number(params.priceMin) * 100 : undefined
  const priceMax = params.priceMax ? Number(params.priceMax) * 100 : undefined

  const [{ products, totalCount, totalPages }, categories, occasions] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      occasionSlug: params.occasion,
      sortBy,
      page,
      priceMin,
      priceMax,
      search: params.search,
    }),
    getCategories(),
    getOccasions(),
  ])

  function buildPageUrl(pageNum: number) {
    const p = new URLSearchParams()
    if (params.category) p.set("category", params.category)
    if (params.occasion) p.set("occasion", params.occasion)
    if (params.sort) p.set("sort", params.sort)
    if (params.priceMin) p.set("priceMin", params.priceMin)
    if (params.priceMax) p.set("priceMax", params.priceMax)
    if (params.search) p.set("search", params.search)
    if (pageNum > 1) p.set("page", String(pageNum))
    const qs = p.toString()
    return `/products${qs ? `?${qs}` : ""}`
  }

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
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal">
            {params.search ? `Results for "${params.search}"` : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-heading text-charcoal">
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 px-4 pb-6">
                <ProductFilters categories={categories} occasions={occasions} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <SortSelect />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <ProductFilters categories={categories} occasions={occasions} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-charcoal">No products found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or search term
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/products">Clear all filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={buildPageUrl(page - 1)} />
                    </PaginationItem>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink href={buildPageUrl(p)} isActive={p === page}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={buildPageUrl(page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
