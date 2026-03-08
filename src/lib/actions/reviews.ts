'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(data: {
  productId: number
  rating: number
  title: string
  body: string
}) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    throw new Error('You must be signed in to leave a review.')
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  })

  if (!user) {
    throw new Error('User not found. Please try signing out and back in.')
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5.')
  }

  if (!data.body.trim()) {
    throw new Error('Review body is required.')
  }

  // Check if user already reviewed this product
  const existing = await db.review.findFirst({
    where: {
      productId: data.productId,
      userId: user.id,
    },
  })

  if (existing) {
    throw new Error('You have already reviewed this product.')
  }

  const product = await db.product.findUnique({
    where: { id: data.productId },
    select: { slug: true },
  })

  if (!product) {
    throw new Error('Product not found.')
  }

  await db.review.create({
    data: {
      productId: data.productId,
      userId: user.id,
      rating: data.rating,
      title: data.title.trim() || null,
      body: data.body.trim(),
      status: 'APPROVED',
    },
  })

  revalidatePath(`/products/${product.slug}`)
  return { success: true }
}
