import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getAdminOrders } from "@/lib/actions/admin-orders"
import { formatPrice, formatDate } from "@/lib/format"
import { OrderStatus } from "@prisma/client"

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-800 border-orange-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
}

type OrderRow = {
  id: string
  orderNumber: string
  customer: string
  email: string
  items: number
  total: number
  status: OrderStatus
  date: Date
}

function OrdersTable({ filteredOrders }: { filteredOrders: OrderRow[] }) {
  if (filteredOrders.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">No orders found.</p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.customer}</div>
                <div className="text-xs text-muted-foreground">
                  {order.email}
                </div>
              </div>
            </TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{formatPrice(order.total)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={statusColors[order.status] || ""}
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(order.date)}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/orders/${order.id}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default async function OrdersPage() {
  const { orders } = await getAdminOrders()

  const filterByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage and track customer orders.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <OrdersTable filteredOrders={orders} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <OrdersTable filteredOrders={filterByStatus("PENDING")} />
            </TabsContent>
            <TabsContent value="paid" className="mt-4">
              <OrdersTable filteredOrders={filterByStatus("PAID")} />
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <OrdersTable filteredOrders={filterByStatus("PROCESSING")} />
            </TabsContent>
            <TabsContent value="shipped" className="mt-4">
              <OrdersTable filteredOrders={filterByStatus("SHIPPED")} />
            </TabsContent>
            <TabsContent value="delivered" className="mt-4">
              <OrdersTable filteredOrders={filterByStatus("DELIVERED")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
