// @ts-nocheck - zod v4 has type incompatibility with react-hook-form's resolver
"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  addressLine1: z.string().min(3, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  county: z.string().optional(),
  postcode: z.string().min(5, "Postcode is required"),
  country: z.string().default("GB"),
  isGift: z.boolean().default(false),
  giftMessage: z.string().optional(),
  giftWrap: z.boolean().default(false),
})

type ShippingFormValues = z.infer<typeof shippingSchema>

const STEPS = [
  { number: 1, label: "Shipping" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Confirmation" },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const {
    items,
    isGift,
    giftMessage,
    giftWrap,
    getSubtotal,
    setGiftOptions,
  } = useCartStore()

  const subtotal = getSubtotal()
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const giftWrapCost = giftWrap ? GIFT_WRAP_COST : 0
  const total = subtotal + shippingCost + giftWrapCost

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      county: "",
      postcode: "",
      country: "GB",
      isGift: isGift,
      giftMessage: giftMessage,
      giftWrap: giftWrap,
    },
  })

  function onShippingSubmit(data: ShippingFormValues) {
    setGiftOptions(data.isGift, data.giftMessage ?? "", data.giftWrap)
    setCurrentStep(2)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    currentStep > step.number
                      ? "bg-green-600 text-white"
                      : currentStep === step.number
                        ? "bg-warm-700 text-warm-50"
                        : "bg-warm-200 text-warm-500"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:block ${
                    currentStep >= step.number
                      ? "text-warm-900"
                      : "text-warm-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 sm:w-16 ${
                    currentStep > step.number ? "bg-green-600" : "bg-warm-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card className="border-warm-200 bg-white">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-warm-900">
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onShippingSubmit)}
                    className="space-y-4"
                  >
                    {/* Name & Email */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warm-700">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Smith"
                                className="border-warm-200 bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warm-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="border-warm-200 bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-warm-700">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="07700 900000"
                              className="border-warm-200 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-warm-700">
                            Address Line 1
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 High Street"
                              className="border-warm-200 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-warm-700">
                            Address Line 2 (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Flat 4, Building Name"
                              className="border-warm-200 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warm-700">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="London"
                                className="border-warm-200 bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="county"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warm-700">
                              County
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Greater London"
                                className="border-warm-200 bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warm-700">
                              Postcode
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SW1A 1AA"
                                className="border-warm-200 bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-warm-700">
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="United Kingdom"
                              defaultValue="United Kingdom"
                              className="border-warm-200 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-warm-200" />

                    {/* Gift Options */}
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="isGift"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-warm-700 cursor-pointer">
                              This is a gift
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {form.watch("isGift") && (
                        <>
                          <FormField
                            control={form.control}
                            name="giftMessage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-warm-700">
                                  Gift Message
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Write a personal message..."
                                    className="border-warm-200 bg-warm-50"
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="giftWrap"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal text-warm-700 cursor-pointer">
                                  Add gift wrap (+{formatPrice(GIFT_WRAP_COST)})
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-warm-700 text-warm-50 hover:bg-warm-800 text-base font-semibold"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-warm-200 bg-white">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-warm-900">
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed border-warm-300 bg-warm-50 p-8 text-center">
                  <p className="text-warm-600 mb-4">
                    Stripe Payment Element will be integrated here.
                  </p>
                  <Button
                    className="w-full h-11 bg-warm-700 text-warm-50 hover:bg-warm-800 text-base font-semibold"
                    onClick={() => {
                      // Placeholder - will wire up Stripe later
                      window.location.href = `/checkout/success?order=${Date.now()}`
                    }}
                  >
                    Pay with Stripe
                  </Button>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full text-warm-600 hover:text-warm-800 hover:bg-warm-100"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Shipping
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="border-warm-200 bg-white">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-warm-900">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-warm-100 to-warm-200">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-lg text-warm-300">
                        {"\uD83C\uDF81"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-warm-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-warm-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-warm-800">
                    {formatPrice(
                      (item.price + item.personalizationPrice) * item.quantity
                    )}
                  </span>
                </div>
              ))}

              <Separator className="bg-warm-200" />

              {/* Totals */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-600">Subtotal</span>
                <span className="font-medium text-warm-800">
                  {formatPrice(subtotal)}
                </span>
              </div>

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

              {giftWrapCost > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-600">Gift wrap</span>
                  <span className="font-medium text-warm-800">
                    {formatPrice(giftWrapCost)}
                  </span>
                </div>
              )}

              <Separator className="bg-warm-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-warm-900">
                  Total
                </span>
                <span className="text-lg font-bold text-warm-900">
                  {formatPrice(total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
