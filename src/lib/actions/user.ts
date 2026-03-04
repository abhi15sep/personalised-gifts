'use server'

import { db } from '@/lib/db'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function syncUser() {
  const user = await currentUser()
  if (!user) return null

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress

  if (!email) return null

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null

  const dbUser = await db.user.upsert({
    where: { clerkId: user.id },
    update: {
      email,
      name,
    },
    create: {
      clerkId: user.id,
      email,
      name,
    },
  })

  return dbUser
}

export async function getOrCreateUser(
  clerkId: string,
  email: string,
  name?: string
) {
  const user = await db.user.upsert({
    where: { clerkId },
    update: {
      email,
      name: name ?? undefined,
    },
    create: {
      clerkId,
      email,
      name: name ?? null,
    },
  })

  return user
}

export async function getUserOrders() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
}

export async function toggleWishlist(productId: number) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    throw new Error('Unauthorized')
  }

  // Find or auto-create the DB user from Clerk
  let user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  })

  if (!user) {
    // User exists in Clerk but not in our DB (e.g. after DB reset) — create them
    user = await db.user.create({
      data: {
        clerkId: clerkUserId,
        email: `${clerkUserId}@placeholder.local`,
      },
      select: { id: true },
    })
  }

  const existing = await db.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  })

  if (existing) {
    await db.wishlist.delete({
      where: { id: existing.id },
    })
    return { added: false }
  }

  await db.wishlist.create({
    data: {
      userId: user.id,
      productId,
    },
  })

  return { added: true }
}

export async function getUserWishlist() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const wishlistItems = await db.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return wishlistItems
}
