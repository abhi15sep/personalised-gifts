import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getWishlistedProductIds(): Promise<Set<number>> {
  try {
    const { userId } = await auth()
    if (!userId) return new Set()
    const user = await db.user.findUnique({ where: { clerkId: userId }, select: { id: true } })
    if (!user) return new Set()
    const items = await db.wishlist.findMany({ where: { userId: user.id }, select: { productId: true } })
    return new Set(items.map((i) => i.productId))
  } catch {
    return new Set()
  }
}