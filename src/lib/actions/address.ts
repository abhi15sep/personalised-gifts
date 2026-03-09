'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

async function getAuthenticatedUser() {
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

  return user
}

export async function getUserAddresses() {
  const user = await getAuthenticatedUser()

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { id: 'desc' }],
  })

  return addresses
}

export async function addAddress(data: {
  label: string | null
  fullName: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  county: string | null
  postalCode: string
  country: string
  isDefault: boolean
}) {
  const user = await getAuthenticatedUser()

  // If setting as default, unset other defaults first
  if (data.isDefault) {
    await db.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    })
  }

  const address = await db.address.create({
    data: {
      userId: user.id,
      label: data.label,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      county: data.county,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault,
    },
  })

  return address
}

export async function updateAddress(
  addressId: bigint,
  data: {
    label: string | null
    fullName: string
    phone: string | null
    line1: string
    line2: string | null
    city: string
    county: string | null
    postalCode: string
    country: string
    isDefault: boolean
  }
) {
  const user = await getAuthenticatedUser()

  // Verify the address belongs to the user
  const existing = await db.address.findFirst({
    where: { id: addressId, userId: user.id },
  })

  if (!existing) {
    throw new Error('Address not found')
  }

  // If setting as default, unset other defaults first
  if (data.isDefault) {
    await db.address.updateMany({
      where: { userId: user.id, isDefault: true, id: { not: addressId } },
      data: { isDefault: false },
    })
  }

  const address = await db.address.update({
    where: { id: addressId },
    data: {
      label: data.label,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      county: data.county,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault,
    },
  })

  return address
}

export async function deleteAddress(addressId: bigint) {
  const user = await getAuthenticatedUser()

  // Verify the address belongs to the user
  const existing = await db.address.findFirst({
    where: { id: addressId, userId: user.id },
  })

  if (!existing) {
    throw new Error('Address not found')
  }

  await db.address.delete({
    where: { id: addressId },
  })

  return { success: true }
}
