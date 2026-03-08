export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { getAdminOrder } from "@/lib/actions/admin-orders"
import { formatPrice, formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { StatusUpdateForm } from "./status-form"
import { RefundForm } from "./refund-form"

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getAdminOrder(id)

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/orders">
          <ArrowLeft className="size-4 mr-1" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Order {order.orderNumber}
          </h2>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge className={statusColors[order.status] || ""}>
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Items + Status Update + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="size-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-16 rounded-md bg-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    {item.personalizationData && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(item.personalizationData).map(
                          ([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status Update Form */}
          <StatusUpdateForm orderId={order.id} currentStatus={order.status} />

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {order.events.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No status updates yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {order.events.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-primary mt-1" />
                        <div className="w-px flex-1 bg-border" />
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={statusColors[event.status] || ""}
                          >
                            {event.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.createdAt)}
                          </span>
                        </div>
                        {event.comment && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {event.comment}
                          </p>
                        )}
                        {event.imageUrl && (
                          <Image
                            src={event.imageUrl}
                            alt="Event attachment"
                            width={200}
                            height={150}
                            className="mt-2 rounded-md object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Summary, Customer, Shipping */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shippingAmount === 0
                    ? "Free"
                    : formatPrice(order.shippingAmount)}
                </span>
              </div>
              {order.giftWrapAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gift Wrap</span>
                  <span>{formatPrice(order.giftWrapAmount)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(order.discountAmount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
              {order.customer.phone && (
                <p className="text-muted-foreground">{order.customer.phone}</p>
              )}
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.fullName || order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.county
                    ? `, ${order.shippingAddress.county}`
                    : ""}
                </p>
                <p>{order.shippingAddress.postalCode}</p>
              </CardContent>
            </Card>
          )}

          {order.isGift && order.giftMessage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gift Message</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground italic">
                &quot;{order.giftMessage}&quot;
              </CardContent>
            </Card>
          )}

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {order.notes}
              </CardContent>
            </Card>
          )}

          {order.status !== "PENDING" && order.status !== "REFUNDED" && order.status !== "CANCELLED" && (
            <RefundForm
              orderId={order.id}
              totalAmount={order.totalAmount}
              paymentMethod={order.paymentMethod}
              hasStripePaymentIntent={!!order.stripePaymentIntentId}
            />
          )}
        </div>
      </div>
    </div>
  )
}
