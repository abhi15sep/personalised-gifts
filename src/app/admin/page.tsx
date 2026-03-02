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

const stats = [
  {
    title: "Total Revenue",
    value: "\u00a312,845.00",
    icon: PoundSterling,
    description: "+18% from last month",
  },
  {
    title: "Orders",
    value: "284",
    icon: ShoppingCart,
    description: "+12% from last month",
  },
  {
    title: "Products",
    value: "64",
    icon: Package,
    description: "8 added this month",
  },
  {
    title: "Customers",
    value: "1,429",
    icon: Users,
    description: "+32 this week",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    items: 2,
    total: "\u00a345.99",
    status: "Paid",
    date: "2026-03-01",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    items: 1,
    total: "\u00a329.99",
    status: "Processing",
    date: "2026-03-01",
  },
  {
    id: "ORD-003",
    customer: "Emma Wilson",
    items: 3,
    total: "\u00a387.50",
    status: "Shipped",
    date: "2026-02-28",
  },
  {
    id: "ORD-004",
    customer: "James Brown",
    items: 1,
    total: "\u00a319.99",
    status: "Delivered",
    date: "2026-02-28",
  },
  {
    id: "ORD-005",
    customer: "Olivia Davis",
    items: 4,
    total: "\u00a3112.00",
    status: "Pending",
    date: "2026-02-27",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Paid":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Shipped":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your store performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
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
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
