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
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warm-100">
            <ShoppingBag className="h-12 w-12 text-warm-400" />
          </div>
          <h1 className="mt-6 font-heading text-2xl font-bold text-warm-900">
            Your bag is empty
          </h1>
          <p className="mt-2 text-warm-600">
            Looks like you haven&apos;t added any gifts yet. Browse our
            collection to find the perfect personalised gift.
          </p>
          <Button
            asChild
            className="mt-6 bg-warm-700 text-warm-50 hover:bg-warm-800"
          >
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-warm-900 mb-8">
        Shopping Bag
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border border-warm-200 bg-white p-4"
              >
                {/* Product Image Placeholder */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-warm-100 via-warm-50 to-warm-200">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-3xl text-warm-300">
                      {"\uD83C\uDF81"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-warm-800 hover:text-warm-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.personalizationSummary && (
                      <p className="mt-0.5 text-xs text-warm-500">
                        {item.personalizationSummary}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-md border border-warm-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-none text-warm-700 hover:bg-warm-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-warm-800 border-x border-warm-200">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none text-warm-700 hover:bg-warm-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-warm-800">
                        {formatPrice(
                          (item.price + item.personalizationPrice) *
                            item.quantity
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-warm-500 hover:text-red-600 hover:bg-red-50"
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
          <Card className="border-warm-200 bg-white">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-warm-900">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-600">Subtotal</span>
                <span className="font-medium text-warm-800">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-600">Shipping</span>
                <span className="font-medium text-warm-800">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-warm-500">
                  Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </p>
              )}

              <Separator className="bg-warm-200" />

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
                    className="text-sm font-normal text-warm-700 cursor-pointer"
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
                    className="text-sm font-normal text-warm-700 cursor-pointer"
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
                    className="border-warm-200 bg-warm-50 text-sm"
                    rows={3}
                  />
                )}
              </div>

              {giftWrapCost > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-600">Gift wrap</span>
                  <span className="font-medium text-warm-800">
                    {formatPrice(giftWrapCost)}
                  </span>
                </div>
              )}

              <Separator className="bg-warm-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-warm-900">
                  Total
                </span>
                <span className="text-lg font-bold text-warm-900">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Actions */}
              <Button
                asChild
                className="w-full h-11 bg-warm-700 text-warm-50 hover:bg-warm-800 text-base font-semibold"
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full text-warm-600 hover:text-warm-800 hover:bg-warm-100"
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
