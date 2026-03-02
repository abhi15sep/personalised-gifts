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

const customers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    orders: 8,
    totalSpent: "\u00a3342.50",
    joined: "2025-06-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    orders: 3,
    totalSpent: "\u00a3129.97",
    joined: "2025-09-22",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@example.com",
    orders: 12,
    totalSpent: "\u00a3587.40",
    joined: "2025-03-10",
  },
  {
    id: "4",
    name: "James Brown",
    email: "james@example.com",
    orders: 1,
    totalSpent: "\u00a319.99",
    joined: "2026-02-01",
  },
  {
    id: "5",
    name: "Olivia Davis",
    email: "olivia@example.com",
    orders: 5,
    totalSpent: "\u00a3245.00",
    joined: "2025-11-08",
  },
  {
    id: "6",
    name: "William Taylor",
    email: "william@example.com",
    orders: 2,
    totalSpent: "\u00a364.98",
    joined: "2026-01-17",
  },
  {
    id: "7",
    name: "Sophie Martin",
    email: "sophie@example.com",
    orders: 6,
    totalSpent: "\u00a3298.50",
    joined: "2025-07-30",
  },
]

export default function CustomersPage() {
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
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
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
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>{customer.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
