export const dynamic = "force-dynamic"

import { PoundSterling, ShoppingCart, Package, Users } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { getDashboardStats } from "@/lib/actions/admin-products"

function getStatusColor(status: string) {
  switch (status) {
    case "PAID":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200"
    case "PENDING":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Revenue",
      value: `\u00a3${stats.totalRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
      icon: PoundSterling,
    },
    {
      title: "Orders",
      value: stats.orderCount.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: stats.productCount.toLocaleString(),
      icon: Package,
    },
    {
      title: "Customers",
      value: stats.customerCount.toLocaleString(),
      icon: Users,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your store performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>
                      &pound;{order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
