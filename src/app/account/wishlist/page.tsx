export const dynamic = "force-dynamic"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { PRODUCT_IMAGES } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"

export default async function WishlistPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  async function getWishlist(userId: bigint) {
    return db.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  const wishlistItems = user ? await getWishlist(user.id) : []

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold mb-6">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
            <p className="text-muted-foreground mb-4">
              Save your favourite items to find them later
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => {
            const imageUrl = item.product.images[0]?.url || PRODUCT_IMAGES[item.product.slug] || null
            return (
            <Card key={item.id} className="overflow-hidden">
              <Link href={`/products/${item.product.slug}`}>
                <div className="relative aspect-square bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.images[0]?.altText || item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-medium hover:text-rose transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.product.category?.name}
                </p>
                <p className="mt-1 font-semibold">
                  {formatPrice(Number(item.product.basePrice))}
                </p>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
