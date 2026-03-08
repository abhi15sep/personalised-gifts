export const dynamic = "force-dynamic"

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
import { db } from "@/lib/db"
import { formatPrice, formatDate } from "@/lib/format"

async function getCustomers() {
  const customers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: {
          totalAmount: true,
        },
      },
    },
  })

  return customers.map((customer) => ({
    id: customer.id.toString(),
    name: customer.name || "—",
    email: customer.email,
    role: customer.role,
    orderCount: customer.orders.length,
    totalSpent: customer.orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    ),
    joined: customer.createdAt,
  }))
}

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          View and manage your customer base.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No customers yet. Customers will appear here once they sign up.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.role === "ADMIN" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {customer.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.orderCount}</TableCell>
                    <TableCell>{formatPrice(customer.totalSpent)}</TableCell>
                    <TableCell>{formatDate(customer.joined)}</TableCell>
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
