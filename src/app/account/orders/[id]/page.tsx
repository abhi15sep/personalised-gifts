export const dynamic = "force-dynamic"

import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { db } from "@/lib/db"
import { formatPrice, formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { id } = await params
  const orderId = BigInt(id)

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) notFound()

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      events: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!order || order.userId !== user.id) {
    notFound()
  }

  const shippingAddress = order.shippingAddress as Record<string, string> | null

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/account/orders">
          <ArrowLeft className="size-4 mr-1" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-semibold">
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
        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => {
              const snapshot = item.productSnapshot as Record<string, unknown> | null
              const name = (snapshot?.name as string) || item.product?.name || 'Deleted Product'
              const imageUrl = item.product?.images[0]?.url ?? null

              return (
                <div key={item.id.toString()} className="flex gap-4">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      width={64}
                      height={64}
                      className="size-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-16 rounded-md bg-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    {item.personalizationData && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(
                          item.personalizationData as Record<string, string>
                        ).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Order Timeline */}
        {order.events.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.events.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="size-3 rounded-full bg-primary mt-1" />
                      <div className="w-px flex-1 bg-border" />
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[event.status] || ""}>
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
                          alt="Status update"
                          width={200}
                          height={150}
                          className="mt-2 rounded-md object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary + Shipping */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {Number(order.shippingAmount) === 0
                    ? "Free"
                    : formatPrice(Number(order.shippingAmount))}
                </span>
              </div>
              {Number(order.giftWrapAmount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gift Wrap</span>
                  <span>{formatPrice(Number(order.giftWrapAmount))}</span>
                </div>
              )}
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(Number(order.discountAmount))}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(Number(order.totalAmount))}</span>
              </div>
            </CardContent>
          </Card>

          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {shippingAddress.fullName || shippingAddress.name}
                </p>
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                <p>
                  {shippingAddress.city}
                  {shippingAddress.county ? `, ${shippingAddress.county}` : ""}
                </p>
                <p>{shippingAddress.postalCode}</p>
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
        </div>
      </div>
    </div>
  )
}
