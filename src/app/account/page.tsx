export const dynamic = "force-dynamic"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { formatPrice, formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Package } from "lucide-react"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export default async function OrdersPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  async function getOrders(userId: bigint) {
    return db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  const orders = user ? await getOrders(user.id) : []

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Link
              href="/products"
              className="text-primary underline underline-offset-4"
            >
              Browse Products
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id.toString()}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Order {order.orderNumber}
                  </CardTitle>
                  <Badge className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id.toString()}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {(item.productSnapshot as { name?: string })?.name ||
                          item.product?.name || 'Deleted Product'}{" "}
                        x {item.quantity}
                      </span>
                      <span>
                        {formatPrice(
                          Number(item.unitPrice) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="font-medium">
                    Total: {formatPrice(Number(order.totalAmount))}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-sm text-primary underline underline-offset-4"
                  >
                    View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
