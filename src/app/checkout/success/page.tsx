import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { getDeliveryEstimate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams
  const orderNumber = order ?? "PG-000000"
  const deliveryEstimate = getDeliveryEstimate(5)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="border-warm-200 bg-white text-center">
        <CardContent className="p-8 sm:p-12">
          {/* Checkmark Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-heading text-3xl font-bold text-warm-900">
            Order Confirmed!
          </h1>

          {/* Message */}
          <p className="mt-3 text-warm-600">
            Thank you for your order. We&apos;ll start crafting your
            personalised gift right away.
          </p>

          <Separator className="my-6 bg-warm-200" />

          {/* Order Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-warm-600">Order Number</span>
              <span className="font-semibold text-warm-900">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-warm-600">Est. Delivery</span>
              <span className="font-semibold text-warm-900">
                {deliveryEstimate}
              </span>
            </div>
          </div>

          <Separator className="my-6 bg-warm-200" />

          <p className="text-sm text-warm-500">
            A confirmation email has been sent with your order details.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="bg-warm-700 text-warm-50 hover:bg-warm-800 font-semibold"
            >
              <Link href="/account/orders">View Order</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-warm-300 text-warm-700 hover:bg-warm-100"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
