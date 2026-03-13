"use client"

import { useState, useTransition } from "react"
import { Heart, ShoppingCart, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/format"
import {
  PERSONALISATION_FONTS,
  PERSONALISATION_COLOURS,
} from "@/lib/constants"
import { CloudinaryUploadWidget } from "@/components/product/cloudinary-upload-widget"
import { toggleWishlist } from "@/lib/actions/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Variant {
  label: string
  value: string
}

interface PersonalizationOption {
  id: number
  optionKey: string
  label: string
  optionType: string
  isRequired: boolean
  priceModifier: number
  constraints: Record<string, unknown> | null
}

interface AddToCartProps {
  productId: number
  name: string
  slug: string
  price: number // in pence (e.g., 1299 = £12.99)
  isPersonalizable: boolean
  variants: Variant[]
  imageUrl?: string
  personalizationOptions?: PersonalizationOption[]
}

export function AddToCart({
  productId,
  name,
  slug,
  price,
  isPersonalizable,
  variants,
  imageUrl,
  personalizationOptions = [],
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0].value : ""
  )
  const [personValues, setPersonValues] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [wishlistPending, startWishlistTransition] = useTransition()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const router = useRouter()

  const addItem = useCartStore((state) => state.addItem)

  // Determine if we have DB-based personalization options
  const hasDbOptions = personalizationOptions.length > 0

  function handlePersonValueChange(key: string, value: string) {
    setPersonValues((prev) => ({ ...prev, [key]: value }))
  }

  // Calculate extra price from personalization options
  const personalizationPrice = hasDbOptions
    ? personalizationOptions.reduce((total, opt) => {
        if (personValues[opt.optionKey]) {
          return total + opt.priceModifier
        }
        return total
      }, 0)
    : 0

  function handleAddToCart() {
    // Validate required fields
    if (isPersonalizable && hasDbOptions) {
      const errors: Record<string, string> = {}
      personalizationOptions.forEach((opt) => {
        const val = personValues[opt.optionKey]
        if (opt.isRequired && !val) {
          errors[opt.optionKey] = `${opt.label} is required`
        }
        if (val && (opt.optionType === "TEXT" || opt.optionType === "TEXTAREA")) {
          const maxLen = (opt.constraints as { maxLength?: number } | null)?.maxLength
          if (maxLen && val.length > maxLen) {
            errors[opt.optionKey] = `${opt.label} must be ${maxLen} characters or less`
          }
        }
      })
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }
      setValidationErrors({})
    }

    const personalization: Record<string, string> = {}
    let personalizationSummary = ""

    if (isPersonalizable && hasDbOptions) {
      personalizationOptions.forEach((opt) => {
        const val = personValues[opt.optionKey]
        if (val) {
          personalization[opt.optionKey] = val
          if (personalizationSummary) personalizationSummary += ", "
          if (opt.optionType === "IMAGE") {
            personalizationSummary += `${opt.label}: Uploaded`
          } else {
            personalizationSummary += `${opt.label}: ${val}`
          }
        }
      })
    }

    const cartItemId = `${productId}-${selectedVariant || "default"}-${JSON.stringify(personalization)}`

    addItem({
      id: cartItemId,
      productId,
      name,
      slug,
      price,
      personalizationPrice,
      quantity,
      imageUrl: imageUrl || "",
      personalization: isPersonalizable && Object.keys(personalization).length > 0 ? personalization : undefined,
      personalizationSummary: personalizationSummary || undefined,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleWishlist() {
    startWishlistTransition(async () => {
      try {
        const result = await toggleWishlist(productId)
        setIsWishlisted(result.added)
      } catch {
        // User is likely not authenticated
        router.push("/sign-in")
      }
    })
  }

  const totalUnitPrice = price + personalizationPrice

  return (
    <>
      {/* Variant Selector */}
      {variants.length > 0 && (
        <div className="mb-5">
          <Label className="mb-2 text-sm font-semibold text-charcoal">
            Size
          </Label>
          <RadioGroup
            value={selectedVariant}
            onValueChange={setSelectedVariant}
            className="mt-2 flex gap-3"
          >
            {variants.map((variant) => (
              <div key={variant.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={variant.value}
                  id={`variant-${variant.value}`}
                />
                <Label
                  htmlFor={`variant-${variant.value}`}
                  className="text-sm font-normal text-gray-600 cursor-pointer"
                >
                  {variant.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Personalisation Section */}
      {isPersonalizable && hasDbOptions && (
        <div className="rounded-lg border border-gray-200 bg-[#f8f9fa] p-4">
          <h3 className="mb-3 text-sm font-semibold text-charcoal uppercase tracking-wide">
            Personalisation
          </h3>

          <div className="space-y-3">
            {personalizationOptions.map((opt) => (
              <div key={opt.id}>
                <Label className="mb-1.5 text-sm text-gray-600">
                  {opt.label}
                  {opt.isRequired && <span className="text-rose ml-0.5">*</span>}
                  {opt.priceModifier > 0 && (
                    <span className="ml-1 text-xs text-gray-400">
                      (+{formatPrice(opt.priceModifier)})
                    </span>
                  )}
                </Label>

                {opt.optionType === "TEXT" && (
                  <Input
                    placeholder={`Enter ${opt.label.toLowerCase()}...`}
                    maxLength={
                      (opt.constraints as { maxLength?: number } | null)?.maxLength || 50
                    }
                    value={personValues[opt.optionKey] || ""}
                    onChange={(e) =>
                      handlePersonValueChange(opt.optionKey, e.target.value)
                    }
                    className="mt-1 border-gray-200 bg-white"
                  />
                )}

                {opt.optionType === "TEXTAREA" && (
                  <Textarea
                    placeholder={`Enter ${opt.label.toLowerCase()}...`}
                    maxLength={
                      (opt.constraints as { maxLength?: number } | null)?.maxLength || 200
                    }
                    value={personValues[opt.optionKey] || ""}
                    onChange={(e) =>
                      handlePersonValueChange(opt.optionKey, e.target.value)
                    }
                    className="mt-1 border-gray-200 bg-white"
                    rows={3}
                  />
                )}

                {opt.optionType === "FONT" && (
                  <Select
                    value={personValues[opt.optionKey] || PERSONALISATION_FONTS[0]}
                    onValueChange={(v) => handlePersonValueChange(opt.optionKey, v)}
                  >
                    <SelectTrigger className="mt-1 w-full border-gray-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PERSONALISATION_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {opt.optionType === "COLOUR" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PERSONALISATION_COLOURS.map((colour) => (
                      <button
                        key={colour.value}
                        title={colour.name}
                        onClick={() =>
                          handlePersonValueChange(opt.optionKey, colour.value)
                        }
                        className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:ring-offset-2 ${
                          personValues[opt.optionKey] === colour.value
                            ? "border-charcoal scale-110"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: colour.value }}
                      />
                    ))}
                  </div>
                )}

                {opt.optionType === "DROPDOWN" && (
                  <Select
                    value={personValues[opt.optionKey] || ""}
                    onValueChange={(v) => handlePersonValueChange(opt.optionKey, v)}
                  >
                    <SelectTrigger className="mt-1 w-full border-gray-200 bg-white">
                      <SelectValue placeholder={`Select ${opt.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {((opt.constraints as { options?: string[] } | null)?.options || []).map(
                        (item: string) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}

                {opt.optionType === "IMAGE" && (
                  <CloudinaryUploadWidget
                    value={personValues[opt.optionKey] || ""}
                    onUpload={(url) => handlePersonValueChange(opt.optionKey, url)}
                    onRemove={() => handlePersonValueChange(opt.optionKey, "")}
                    constraints={opt.constraints as { maxFileSizeMB?: number; allowedTypes?: string[] } | undefined}
                  />
                )}

                {validationErrors[opt.optionKey] && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors[opt.optionKey]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none text-gray-600 hover:bg-gray-100"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-charcoal border-x border-gray-200">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none text-gray-600 hover:bg-gray-100"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>

        <Button
          className={`flex-1 h-11 text-base font-semibold transition-colors ${
            added
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-rose text-white hover:bg-rose-dark"
          }`}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart - {formatPrice(totalUnitPrice * quantity)}
            </>
          )}
        </Button>
      </div>

      {/* Wishlist */}
      <Button
        variant="outline"
        className="mt-3 w-full border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-rose"
        onClick={handleWishlist}
        disabled={wishlistPending}
      >
        {wishlistPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-rose text-rose" : ""}`} />
        )}
        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </Button>
    </>
  )
}
