import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

import { checkTinkPaymentStatus } from "@/lib/tink"
import { db } from "@/lib/db"
import { getDeliveryEstimate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ClearCart } from "@/components/checkout/clear-cart"

export const dynamic = "force-dynamic"

export default async function TinkReturnPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment_request_id?: string
    error?: string
    message?: string
  }>
}) {
  const params = await searchParams
  const { payment_request_id, error, message } = params

  // Error flow — user cancelled or authentication failed in Tink Link
  if (error) {
    // Try to find and cancel the order if we have a payment_request_id
    if (payment_request_id) {
      const order = await db.order.findFirst({
        where: { tinkPaymentRequestId: payment_request_id },
        select: { id: true, status: true },
      })
      if (order && order.status === "PENDING") {
        await db.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        })
      }
    }

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-gray-200 bg-white text-center">
          <CardContent className="p-8 sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="mt-6 font-heading text-3xl font-bold text-charcoal">
              Payment Failed
            </h1>

            <p className="mt-3 text-gray-500">
              Your bank payment could not be completed. No money has been
              deducted from your account.
            </p>

            <Separator className="my-6 bg-gray-200" />

            <p className="text-sm text-gray-400">
              {message || "Please try again or use a different payment method."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="bg-rose text-white hover:bg-rose-dark font-semibold"
              >
                <Link href="/checkout">Try Again</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                <Link href="/cart">Back to Cart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success flow — payment_request_id present
  if (!payment_request_id) {
    redirect("/cart")
  }

  // Look up order
  const order = await db.order.findFirst({
    where: { tinkPaymentRequestId: payment_request_id },
    select: { id: true, orderNumber: true, status: true },
  })

  if (!order) {
    redirect("/cart")
  }

  // Check Tink payment status (the callback doesn't confirm settlement)
  let paymentStatus = "PENDING"
  try {
    const statusResponse = await checkTinkPaymentStatus(payment_request_id)
    paymentStatus = statusResponse.status
  } catch {
    // If status check fails, we rely on the webhook
  }

  // If Tink says SETTLED and webhook hasn't updated yet, update now
  if (paymentStatus === "SETTLED" && order.status === "PENDING") {
    await db.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    })
  }

  const deliveryEstimate = getDeliveryEstimate(5)
  const isSettled = paymentStatus === "SETTLED" || order.status === "PAID"

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <ClearCart />
      <Card className="border-gray-200 bg-white text-center">
        <CardContent className="p-8 sm:p-12">
          {isSettled ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="mt-6 font-heading text-3xl font-bold text-charcoal">
                Payment Successful!
              </h1>

              <p className="mt-3 text-gray-500">
                Your bank payment has been confirmed. We&apos;ll start crafting
                your personalised gift right away.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-10 w-10 text-amber-600" />
              </div>

              <h1 className="mt-6 font-heading text-3xl font-bold text-charcoal">
                Payment Initiated
              </h1>

              <p className="mt-3 text-gray-500">
                Your bank payment has been initiated and is being processed.
                We&apos;ll confirm your order once the payment settles
                (usually within a few minutes).
              </p>
            </>
          )}

          <Separator className="my-6 bg-gray-200" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Order Number</span>
              <span className="font-semibold text-charcoal">
                {order.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-charcoal">
                Pay by Bank
              </span>
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
            A confirmation email will be sent once your payment is confirmed.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="bg-rose text-white hover:bg-rose-dark font-semibold"
            >
              <Link href="/account/orders">View Order</Link>
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
