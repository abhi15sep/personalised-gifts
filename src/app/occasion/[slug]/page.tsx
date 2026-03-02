import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { OCCASIONS } from "@/lib/constants"

const PLACEHOLDER_PRODUCTS = [
  { name: "Personalised Name Mug", price: "£14.99" },
  { name: "Engraved Silver Bracelet", price: "£29.99" },
  { name: "Custom Photo Canvas", price: "£24.99" },
  { name: "Embroidered Cushion", price: "£19.99" },
  { name: "Personalised Keyring", price: "£9.99" },
  { name: "Custom Family Print", price: "£22.99" },
]

export async function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({
    slug: occasion.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const occasion = OCCASIONS.find((o) => o.slug === slug)
  if (!occasion) return {}
  return {
    title: `${occasion.name} Gifts`,
    description: `Discover unique personalised gifts for ${occasion.name}. Handcrafted with love and delivered to your door.`,
  }
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const occasion = OCCASIONS.find((o) => o.slug === slug)

  if (!occasion) {
    notFound()
  }

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span>Occasions</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{occasion.name}</span>
        </nav>

        {/* Heading */}
        <div className="mb-10">
          <span className="text-4xl">{occasion.icon}</span>
          <h1 className="font-heading mt-2 text-3xl font-bold text-foreground md:text-4xl">
            {occasion.name} Gifts
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find the perfect personalised gift for {occasion.name.toLowerCase()}
          </p>
        </div>

        {/* Product Grid (placeholder) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <Card
              key={product.name}
              className="group overflow-hidden border-warm-200 transition-shadow hover:shadow-md"
            >
              <div className="aspect-square bg-gradient-to-br from-warm-100 to-warm-200" />
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
