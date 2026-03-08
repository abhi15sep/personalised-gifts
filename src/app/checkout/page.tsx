// @ts-nocheck - zod v4 has type incompatibility with react-hook-form's resolver
"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check, CreditCard, Landmark, Loader2 } from "lucide-react"

import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/format"
import {
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_COST,
} from "@/lib/constants"
import { createCheckoutSession } from "@/lib/actions/checkout"
import { createTinkCheckoutSession } from "@/lib/actions/tink-checkout"
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'tink'>('stripe')
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
    setShippingData(data)
    setCurrentStep(2)
  }

  async function handlePayment() {
    if (!shippingData || items.length === 0) return
    setIsProcessing(true)

    const checkoutItems = items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? undefined,
      quantity: item.quantity,
      personalizationData: item.personalization ?? undefined,
    }))

    const address = {
      fullName: shippingData.fullName,
      line1: shippingData.addressLine1,
      line2: shippingData.addressLine2,
      city: shippingData.city,
      county: shippingData.county,
      postalCode: shippingData.postcode,
      country: shippingData.country,
    }

    const giftOpts = {
      isGift: shippingData.isGift,
      giftMessage: shippingData.giftMessage,
      giftWrap: shippingData.giftWrap,
    }

    try {
      if (paymentMethod === 'tink') {
        const result = await createTinkCheckoutSession(
          checkoutItems,
          address,
          giftOpts
        )
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl
        }
      } else {
        const result = await createCheckoutSession(
          checkoutItems,
          address,
          giftOpts
        )
        if (result.url) {
          window.location.href = result.url
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
    }
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
                        ? "bg-rose text-white"
                        : "bg-gray-200 text-gray-400"
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
                      ? "text-charcoal"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 sm:w-16 ${
                    currentStep > step.number ? "bg-green-600" : "bg-gray-200"
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
            <Card className="border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-charcoal">
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
                            <FormLabel className="text-gray-600">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Smith"
                                className="border-gray-200 bg-white"
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
                            <FormLabel className="text-gray-600">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="border-gray-200 bg-white"
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
                          <FormLabel className="text-gray-600">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="07700 900000"
                              className="border-gray-200 bg-white"
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
                          <FormLabel className="text-gray-600">
                            Address Line 1
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 High Street"
                              className="border-gray-200 bg-white"
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
                          <FormLabel className="text-gray-600">
                            Address Line 2 (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Flat 4, Building Name"
                              className="border-gray-200 bg-white"
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
                            <FormLabel className="text-gray-600">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="London"
                                className="border-gray-200 bg-white"
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
                            <FormLabel className="text-gray-600">
                              County
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Greater London"
                                className="border-gray-200 bg-white"
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
                            <FormLabel className="text-gray-600">
                              Postcode
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SW1A 1AA"
                                className="border-gray-200 bg-white"
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
                          <FormLabel className="text-gray-600">
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="United Kingdom"
                              defaultValue="United Kingdom"
                              className="border-gray-200 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-gray-200" />

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
                            <FormLabel className="text-sm font-normal text-gray-600 cursor-pointer">
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
                                <FormLabel className="text-gray-600">
                                  Gift Message
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Write a personal message..."
                                    className="border-gray-200 bg-[#f8f9fa]"
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
                                <FormLabel className="text-sm font-normal text-gray-600 cursor-pointer">
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
                      className="w-full h-11 bg-rose text-white hover:bg-rose-dark text-base font-semibold"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-charcoal">
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex items-center gap-3 rounded-xl p-4 text-left transition-colors ${
                      paymentMethod === 'stripe'
                        ? 'border-2 border-rose bg-rose/5'
                        : 'border border-gray-200 cursor-pointer hover:border-gray-300'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      paymentMethod === 'stripe' ? 'bg-rose text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal">
                        Card Payment
                      </p>
                      <p className="text-xs text-gray-400">
                        Secure payment via Stripe
                      </p>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <Check className="h-5 w-5 text-rose" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tink')}
                    className={`flex items-center gap-3 rounded-xl p-4 text-left transition-colors ${
                      paymentMethod === 'tink'
                        ? 'border-2 border-rose bg-rose/5'
                        : 'border border-gray-200 cursor-pointer hover:border-gray-300'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      paymentMethod === 'tink' ? 'bg-rose text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal">
                        Pay by Bank
                      </p>
                      <p className="text-xs text-gray-400">
                        Pay directly from your bank account
                      </p>
                    </div>
                    {paymentMethod === 'tink' && (
                      <Check className="h-5 w-5 text-rose" />
                    )}
                  </button>
                </div>

                <Separator className="bg-gray-200" />

                <Button
                  className="w-full h-11 bg-rose text-white hover:bg-rose-dark text-base font-semibold"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === 'tink' ? (
                    `Pay ${formatPrice(total)} via Bank`
                  ) : (
                    `Pay ${formatPrice(total)} with Card`
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-charcoal hover:bg-gray-100"
                  onClick={() => setCurrentStep(1)}
                  disabled={isProcessing}
                >
                  Back to Shipping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-charcoal">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              {items.map((item) => {
                const itemTotal =
                  (item.price + item.personalizationPrice) * item.quantity
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <div className="flex h-full items-center justify-center">
                        <span className="text-lg text-gray-300">
                          {"\uD83C\uDF81"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-charcoal">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>
                )
              })}

              <Separator className="bg-gray-200" />

              {/* Totals */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-charcoal">
                  {formatPrice(subtotal)}
                </span>
              </div>

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

              {giftWrapCost > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Gift wrap</span>
                  <span className="font-medium text-charcoal">
                    {formatPrice(giftWrapCost)}
                  </span>
                </div>
              )}

              <Separator className="bg-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-charcoal">
                  Total
                </span>
                <span className="text-lg font-bold text-charcoal">
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
