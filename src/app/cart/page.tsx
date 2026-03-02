"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/format"
import {
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_COST,
} from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function CartPage() {
  const {
    items,
    isGift,
    giftMessage,
    giftWrap,
    updateQuantity,
    removeItem,
    setGiftOptions,
    getSubtotal,
  } = useCartStore()

  const subtotal = getSubtotal()
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const giftWrapCost = giftWrap ? GIFT_WRAP_COST : 0
  const total = subtotal + shippingCost + giftWrapCost

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="mt-6 font-heading text-2xl font-bold text-charcoal">
            Your bag is empty
          </h1>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added any gifts yet. Browse our
            collection to find the perfect personalised gift.
          </p>
          <Button
            asChild
            className="mt-6 bg-rose text-white hover:bg-rose-dark"
          >
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-charcoal mb-8">
        Shopping Bag
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                {/* Product Image Placeholder */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-3xl text-gray-300">
                      {"\uD83C\uDF81"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-charcoal hover:text-rose transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.personalizationSummary && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {item.personalizationSummary}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-none text-gray-600 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-charcoal border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none text-gray-600 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-charcoal">
                        {formatPrice(
                          (item.price + item.personalizationPrice) *
                            item.quantity
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-charcoal">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-charcoal">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-charcoal">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-gray-400">
                  Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </p>
              )}

              <Separator className="bg-gray-200" />

              {/* Gift Wrap */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="gift-wrap"
                    checked={giftWrap}
                    onCheckedChange={(checked) =>
                      setGiftOptions(isGift, giftMessage, checked === true)
                    }
                  />
                  <Label
                    htmlFor="gift-wrap"
                    className="text-sm font-normal text-gray-600 cursor-pointer"
                  >
                    Add gift wrap (+{formatPrice(GIFT_WRAP_COST)})
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is-gift"
                    checked={isGift}
                    onCheckedChange={(checked) =>
                      setGiftOptions(checked === true, giftMessage, giftWrap)
                    }
                  />
                  <Label
                    htmlFor="is-gift"
                    className="text-sm font-normal text-gray-600 cursor-pointer"
                  >
                    This is a gift
                  </Label>
                </div>

                {isGift && (
                  <Textarea
                    placeholder="Write a gift message..."
                    value={giftMessage}
                    onChange={(e) =>
                      setGiftOptions(isGift, e.target.value, giftWrap)
                    }
                    className="border-gray-200 bg-[#f8f9fa] text-sm"
                    rows={3}
                  />
                )}
              </div>

              {giftWrapCost > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Gift wrap</span>
                  <span className="font-medium text-charcoal">
                    {formatPrice(giftWrapCost)}
                  </span>
                </div>
              )}

              <Separator className="bg-gray-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-charcoal">
                  Total
                </span>
                <span className="text-lg font-bold text-charcoal">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Actions */}
              <Button
                asChild
                className="w-full h-11 bg-rose text-white hover:bg-rose-dark text-base font-semibold"
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full text-gray-500 hover:text-charcoal hover:bg-gray-100"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
