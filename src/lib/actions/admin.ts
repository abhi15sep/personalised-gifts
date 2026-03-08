'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true, role: true },
  })

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }

  return user
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return false

    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { role: true },
    })

    return user?.role === 'ADMIN'
  } catch {
    return false
  }
}

export async function requireAdminOrRedirect() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/')
  }
}
