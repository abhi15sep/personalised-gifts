export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { getAdminProduct } from "@/lib/actions/admin-products"
import { getCategories, getOccasions } from "@/lib/actions/products"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productId = parseInt(id)

  if (isNaN(productId)) {
    notFound()
  }

  let product
  try {
    product = await getAdminProduct(productId)
  } catch {
    notFound()
  }

  const [categories, occasions] = await Promise.all([
    getCategories(),
    getOccasions(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground">
          Update &quot;{product.name}&quot;.
        </p>
      </div>

      <ProductForm
        mode="edit"
        productId={productId}
        categories={categories}
        occasions={occasions}
        defaultValues={product}
      />
    </div>
  )
}
