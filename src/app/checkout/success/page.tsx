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
      <Card className="border-gray-200 bg-white text-center">
        <CardContent className="p-8 sm:p-12">
          {/* Checkmark Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-heading text-3xl font-bold text-charcoal">
            Order Confirmed!
          </h1>

          {/* Message */}
          <p className="mt-3 text-gray-500">
            Thank you for your order. We&apos;ll start crafting your
            personalised gift right away.
          </p>

          <Separator className="my-6 bg-gray-200" />

          {/* Order Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Order Number</span>
              <span className="font-semibold text-charcoal">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Est. Delivery</span>
              <span className="font-semibold text-charcoal">
                {deliveryEstimate}
              </span>
            </div>
          </div>

          <Separator className="my-6 bg-gray-200" />

          <p className="text-sm text-gray-400">
            A confirmation email has been sent with your order details.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="bg-rose text-white hover:bg-rose-dark font-semibold"
            >
              <Link href="/account">View Order</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
