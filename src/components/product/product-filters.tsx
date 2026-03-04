"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface FilterCategory {
  id: number
  name: string
  slug: string
}

interface FilterOccasion {
  id: number
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: FilterCategory[]
  occasions: FilterOccasion[]
}

export function ProductFilters({ categories, occasions }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || ""
  const currentOccasion = searchParams.get("occasion") || ""
  const currentPriceMin = searchParams.get("priceMin") || ""
  const currentPriceMax = searchParams.get("priceMax") || ""

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 when filters change
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function handleCategoryChange(slug: string, checked: boolean) {
    updateParams("category", checked ? slug : "")
  }

  function handleOccasionChange(slug: string, checked: boolean) {
    updateParams("occasion", checked ? slug : "")
  }

  function handlePriceChange(key: "priceMin" | "priceMax", value: string) {
    updateParams(key, value)
  }

  function clearAll() {
    router.push(pathname)
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-charcoal uppercase tracking-wide">
          Category
        </h3>
        <div className="space-y-2.5">
          {categories.map((category) => (
            <div key={category.slug} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={currentCategory === category.slug}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.slug, !!checked)
                }
              />
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
          {occasions.map((occasion) => (
            <div key={occasion.slug} className="flex items-center gap-2">
              <Checkbox
                id={`occ-${occasion.slug}`}
                checked={currentOccasion === occasion.slug}
                onCheckedChange={(checked) =>
                  handleOccasionChange(occasion.slug, !!checked)
                }
              />
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
            defaultValue={currentPriceMin}
            onBlur={(e) => handlePriceChange("priceMin", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePriceChange("priceMin", e.currentTarget.value)
              }
            }}
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-9 bg-white border-gray-200"
            defaultValue={currentPriceMax}
            onBlur={(e) => handlePriceChange("priceMax", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePriceChange("priceMax", e.currentTarget.value)
              }
            }}
          />
        </div>
      </div>

      <Separator className="bg-gray-200" />

      <Button
        variant="outline"
        className="w-full border-gray-300 text-gray-600 hover:bg-gray-100"
        onClick={clearAll}
      >
        Clear All Filters
      </Button>
    </div>
  )
}
