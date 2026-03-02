import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"

import { checkPhonePePaymentStatus } from "@/lib/phonepe"
import { db } from "@/lib/db"
import { getDeliveryEstimate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export default async function PhonePeReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ txnId?: string }>
}) {
  const { txnId } = await searchParams

  if (!txnId) {
    redirect("/cart")
  }

  // Check payment status with PhonePe
  const statusResponse = await checkPhonePePaymentStatus(txnId)

  const isSuccess =
    statusResponse.success && statusResponse.code === "PAYMENT_SUCCESS"

  // Find the order
  const order = await db.order.findFirst({
    where: { phonepeOrderId: txnId },
    select: { id: true, orderNumber: true, status: true },
  })

  // Update order status if webhook hasn't already
  if (order && order.status === "PENDING") {
    if (isSuccess) {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          phonepeTransactionId: statusResponse.data?.transactionId ?? null,
        },
      })
    } else {
      await db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      })
    }
  }

  const deliveryEstimate = getDeliveryEstimate(5)

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-warm-200 bg-white text-center">
          <CardContent className="p-8 sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 font-heading text-3xl font-bold text-warm-900">
              Payment Successful!
            </h1>

            <p className="mt-3 text-warm-600">
              Your UPI payment has been confirmed. We&apos;ll start crafting
              your personalised gift right away.
            </p>

            <Separator className="my-6 bg-warm-200" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-warm-600">Order Number</span>
                <span className="font-semibold text-warm-900">
                  {order?.orderNumber ?? "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-warm-600">Transaction ID</span>
                <span className="font-semibold text-warm-900">
                  {statusResponse.data?.transactionId ?? txnId}
                </span>
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

  // Payment failed
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="border-warm-200 bg-white text-center">
        <CardContent className="p-8 sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold text-warm-900">
            Payment Failed
          </h1>

          <p className="mt-3 text-warm-600">
            Your UPI payment could not be completed. No money has been deducted
            from your account.
          </p>

          <Separator className="my-6 bg-warm-200" />

          <p className="text-sm text-warm-500">
            {statusResponse.message || "Please try again or use a different payment method."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="bg-warm-700 text-warm-50 hover:bg-warm-800 font-semibold"
            >
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-warm-300 text-warm-700 hover:bg-warm-100"
            >
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
