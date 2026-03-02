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

const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    items: 2,
    total: "\u00a345.99",
    status: "Paid",
    date: "2026-03-01",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    email: "michael@example.com",
    items: 1,
    total: "\u00a329.99",
    status: "Processing",
    date: "2026-03-01",
  },
  {
    id: "ORD-003",
    customer: "Emma Wilson",
    email: "emma@example.com",
    items: 3,
    total: "\u00a387.50",
    status: "Shipped",
    date: "2026-02-28",
  },
  {
    id: "ORD-004",
    customer: "James Brown",
    email: "james@example.com",
    items: 1,
    total: "\u00a319.99",
    status: "Delivered",
    date: "2026-02-28",
  },
  {
    id: "ORD-005",
    customer: "Olivia Davis",
    email: "olivia@example.com",
    items: 4,
    total: "\u00a3112.00",
    status: "Pending",
    date: "2026-02-27",
  },
  {
    id: "ORD-006",
    customer: "William Taylor",
    email: "william@example.com",
    items: 2,
    total: "\u00a364.98",
    status: "Paid",
    date: "2026-02-27",
  },
  {
    id: "ORD-007",
    customer: "Sophie Martin",
    email: "sophie@example.com",
    items: 1,
    total: "\u00a334.99",
    status: "Processing",
    date: "2026-02-26",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Paid":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Shipped":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function OrdersTable({ filteredOrders }: { filteredOrders: typeof orders }) {
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
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.customer}</div>
                <div className="text-xs text-muted-foreground">
                  {order.email}
                </div>
              </div>
            </TableCell>
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

export default function OrdersPage() {
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
          <CardTitle>All Orders</CardTitle>
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
              <OrdersTable
                filteredOrders={orders.filter((o) => o.status === "Pending")}
              />
            </TabsContent>
            <TabsContent value="paid" className="mt-4">
              <OrdersTable
                filteredOrders={orders.filter((o) => o.status === "Paid")}
              />
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <OrdersTable
                filteredOrders={orders.filter((o) => o.status === "Processing")}
              />
            </TabsContent>
            <TabsContent value="shipped" className="mt-4">
              <OrdersTable
                filteredOrders={orders.filter((o) => o.status === "Shipped")}
              />
            </TabsContent>
            <TabsContent value="delivered" className="mt-4">
              <OrdersTable
                filteredOrders={orders.filter((o) => o.status === "Delivered")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
