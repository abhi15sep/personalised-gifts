"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAdminProducts, deleteProduct } from "@/lib/actions/admin-products"

type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED"

interface AdminProduct {
  id: number
  name: string
  slug: string
  basePrice: number
  status: ProductStatus
  category: string
  imageUrl: string | null
  orderCount: number
  createdAt: Date
}

function getStatusBadge(status: ProductStatus) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Active
        </Badge>
      )
    case "DRAFT":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Draft
        </Badge>
      )
    case "ARCHIVED":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Archived
        </Badge>
      )
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const loadProducts = () => {
    startTransition(async () => {
      try {
        const result = await getAdminProducts({
          status: statusFilter !== "all" ? (statusFilter as ProductStatus) : undefined,
          search: search || undefined,
          page,
        })
        setProducts(result.products as AdminProduct[])
        setTotal(result.total)
        setTotalPages(result.totalPages)
      } catch (err) {
        console.error("Failed to load products:", err)
      }
    })
  }

  useEffect(() => {
    loadProducts()
  }, [statusFilter, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadProducts()
  }

  const handleDelete = async (id: number, force = false) => {
    setFeedback(null)
    try {
      const result = await deleteProduct(id, force)
      if (result.archived) {
        setFeedback({ type: "success", message: result.message ?? "Product archived." })
      } else {
        setFeedback({ type: "success", message: "Product deleted permanently." })
      }
      loadProducts()
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete product.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalogue. {total} product{total !== 1 ? "s" : ""} total.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {feedback && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            feedback.type === "error"
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {feedback.message}
          <button
            onClick={() => setFeedback(null)}
            className="ml-4 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Tabs
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setPage(1)
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="DRAFT">Draft</TabsTrigger>
            <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSearch} className="ml-auto flex gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="size-4" />
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    {isPending ? "Loading..." : "No products found."}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="size-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-md bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>&pound;{product.basePrice.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.orderCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {product.status === "ARCHIVED"
                                  ? "Permanently delete product?"
                                  : "Delete product?"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {product.status === "ARCHIVED"
                                  ? `This will permanently delete "${product.name}" and unlink it from any existing orders. Order history will be preserved via snapshots. This cannot be undone.`
                                  : `This will delete "${product.name}" and all its images. If it has orders, it will be archived instead.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(
                                    product.id,
                                    product.status === "ARCHIVED"
                                  )
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {product.status === "ARCHIVED"
                                  ? "Permanently Delete"
                                  : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
