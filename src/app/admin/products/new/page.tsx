import { ProductForm } from "@/components/admin/product-form"
import { getCategories, getOccasions } from "@/lib/actions/products"

export default async function NewProductPage() {
  const [categories, occasions] = await Promise.all([
    getCategories(),
    getOccasions(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        <p className="text-muted-foreground">
          Create a new product for your store.
        </p>
      </div>

      <ProductForm
        mode="create"
        categories={categories}
        occasions={occasions}
      />
    </div>
  )
}
