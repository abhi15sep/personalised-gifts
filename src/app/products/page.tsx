import Link from "next/link"
import Image from "next/image"
import { SlidersHorizontal } from "lucide-react"

import { CATEGORIES, OCCASIONS, PRODUCT_IMAGES } from "@/lib/constants"
import { formatPrice } from "@/lib/format"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Placeholder products for now
const PLACEHOLDER_PRODUCTS = [
  { id: 1, name: "Personalised Name Mug", slug: "personalised-name-mug", price: 1299, isPersonalizable: true },
  { id: 2, name: "Engraved Wooden Photo Frame", slug: "engraved-wooden-photo-frame", price: 2499, isPersonalizable: true },
  { id: 3, name: "Custom Star Map Print", slug: "custom-star-map-print", price: 3499, isPersonalizable: true },
  { id: 4, name: "Hand-Stamped Silver Bracelet", slug: "hand-stamped-silver-bracelet", price: 4599, isPersonalizable: true },
  { id: 5, name: "Personalised Chopping Board", slug: "personalised-chopping-board", price: 2999, isPersonalizable: true },
  { id: 6, name: "Custom Family Portrait Illustration", slug: "custom-family-portrait", price: 5999, isPersonalizable: true },
  { id: 7, name: "Engraved Leather Keyring", slug: "engraved-leather-keyring", price: 1499, isPersonalizable: true },
  { id: 8, name: "Personalised Baby Blanket", slug: "personalised-baby-blanket", price: 3299, isPersonalizable: true },
  { id: 9, name: "Custom Coordinates Necklace", slug: "custom-coordinates-necklace", price: 3999, isPersonalizable: true },
]

function FilterSidebar() {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-charcoal uppercase tracking-wide">
          Category
        </h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center gap-2">
              <Checkbox id={`cat-${category.slug}`} />
              <Label
                htmlFor={`cat-${category.slug}`}
                className="text-sm font-normal text-gray-600 cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Occasions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-charcoal uppercase tracking-wide">
          Occasion
        </h3>
        <div className="space-y-2.5">
          {OCCASIONS.map((occasion) => (
            <div key={occasion.slug} className="flex items-center gap-2">
              <Checkbox id={`occ-${occasion.slug}`} />
              <Label
                htmlFor={`occ-${occasion.slug}`}
                className="text-sm font-normal text-gray-600 cursor-pointer"
              >
                {occasion.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-charcoal uppercase tracking-wide">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-9 bg-white border-gray-200"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-9 bg-white border-gray-200"
          />
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Personalizable Only */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor="personalizable-toggle"
          className="text-sm font-normal text-gray-600 cursor-pointer"
        >
          Personalizable only
        </Label>
        <Switch id="personalizable-toggle" />
      </div>

      <Separator className="bg-gray-200" />

      <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-100">
        Clear All Filters
      </Button>
    </div>
  )
}

export default function ProductsPage() {
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
            All Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {PLACEHOLDER_PRODUCTS.length} products
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
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px] border-gray-200 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="bestselling">Bestselling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterSidebar />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {PLACEHOLDER_PRODUCTS.map((product) => {
              const imageUrl = PRODUCT_IMAGES[product.slug]
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {product.isPersonalizable && (
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-rose px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Personalise
                        </span>
                      )}
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    {/* Details */}
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-medium text-charcoal transition-colors group-hover:text-rose">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-sm font-semibold text-charcoal">
                        {formatPrice(product.price / 100)}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}
