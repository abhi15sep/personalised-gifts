"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Check } from "lucide-react"

import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/format"
import {
  PERSONALISATION_FONTS,
  PERSONALISATION_COLOURS,
} from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface AddToCartProps {
  productId: number
  name: string
  slug: string
  price: number // in pence (e.g., 1299 = £12.99)
  isPersonalizable: boolean
  variants: Variant[]
  imageUrl?: string
}

export function AddToCart({
  productId,
  name,
  slug,
  price,
  isPersonalizable,
  variants,
  imageUrl,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0].value : ""
  )
  const [personaliseName, setPersonaliseName] = useState("")
  const [selectedFont, setSelectedFont] = useState<string>(PERSONALISATION_FONTS[0])
  const [selectedColour, setSelectedColour] = useState<string>(
    PERSONALISATION_COLOURS[0].value
  )
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  function handleAddToCart() {
    const personalization: Record<string, string> = {}
    let personalizationSummary = ""

    if (isPersonalizable) {
      if (personaliseName) {
        personalization.name = personaliseName
        personalizationSummary += `Name: ${personaliseName}`
      }
      personalization.font = selectedFont
      personalization.colour = selectedColour
      if (personalizationSummary) {
        personalizationSummary += `, Font: ${selectedFont}`
      }
    }

    const cartItemId = `${productId}-${selectedVariant || "default"}-${personaliseName || "none"}`

    addItem({
      id: cartItemId,
      productId,
      name,
      slug,
      price: price / 100, // Convert pence to pounds
      personalizationPrice: 0,
      quantity,
      imageUrl: imageUrl || "",
      personalization: isPersonalizable ? personalization : undefined,
      personalizationSummary: personalizationSummary || undefined,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

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
      {isPersonalizable && (
        <div className="rounded-lg border border-gray-200 bg-[#f8f9fa] p-4">
          <h3 className="mb-3 text-sm font-semibold text-charcoal uppercase tracking-wide">
            Personalisation
          </h3>

          {/* Name Input */}
          <div className="mb-3">
            <Label
              htmlFor="personalise-name"
              className="mb-1.5 text-sm text-gray-600"
            >
              Your Name
            </Label>
            <Input
              id="personalise-name"
              placeholder="Enter name..."
              maxLength={20}
              value={personaliseName}
              onChange={(e) => setPersonaliseName(e.target.value)}
              className="mt-1 border-gray-200 bg-white"
            />
          </div>

          {/* Font Selector */}
          <div className="mb-3">
            <Label className="mb-1.5 text-sm text-gray-600">Font</Label>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
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
          </div>

          {/* Colour Swatches */}
          <div>
            <Label className="mb-1.5 text-sm text-gray-600">Colour</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PERSONALISATION_COLOURS.map((colour) => (
                <button
                  key={colour.value}
                  title={colour.name}
                  onClick={() => setSelectedColour(colour.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose/40 focus:ring-offset-2 ${
                    selectedColour === colour.value
                      ? "border-charcoal scale-110"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: colour.value }}
                />
              ))}
            </div>
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
              Add to Cart - {formatPrice((price / 100) * quantity)}
            </>
          )}
        </Button>
      </div>

      {/* Wishlist */}
      <Button
        variant="outline"
        className="mt-3 w-full border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-rose"
      >
        <Heart className="mr-2 h-4 w-4" />
        Add to Wishlist
      </Button>
    </>
  )
}
