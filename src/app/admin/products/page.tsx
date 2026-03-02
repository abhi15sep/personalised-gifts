import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const products = [
  {
    id: "1",
    name: "Personalised Wooden Chopping Board",
    image: "/placeholder-product.jpg",
    category: "Kitchen",
    price: "\u00a334.99",
    status: "Active" as const,
  },
  {
    id: "2",
    name: "Engraved Silver Necklace",
    image: "/placeholder-product.jpg",
    category: "Jewellery",
    price: "\u00a345.00",
    status: "Active" as const,
  },
  {
    id: "3",
    name: "Custom Photo Cushion",
    image: "/placeholder-product.jpg",
    category: "Home",
    price: "\u00a324.99",
    status: "Active" as const,
  },
  {
    id: "4",
    name: "Personalised Star Map Print",
    image: "/placeholder-product.jpg",
    category: "Prints",
    price: "\u00a329.99",
    status: "Draft" as const,
  },
  {
    id: "5",
    name: "Monogrammed Leather Wallet",
    image: "/placeholder-product.jpg",
    category: "Accessories",
    price: "\u00a339.99",
    status: "Active" as const,
  },
  {
    id: "6",
    name: "Vintage Name Candle Set",
    image: "/placeholder-product.jpg",
    category: "Home",
    price: "\u00a318.50",
    status: "Archived" as const,
  },
]

function getStatusBadge(status: "Active" | "Draft" | "Archived") {
  switch (status) {
    case "Active":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Active
        </Badge>
      )
    case "Draft":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Draft
        </Badge>
      )
    case "Archived":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Archived
        </Badge>
      )
  }
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalogue.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="size-10 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
