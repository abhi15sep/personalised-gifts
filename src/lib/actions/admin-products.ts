'use server'

import { db } from '@/lib/db'
import { requireAdmin } from './admin'
import { cloudinary } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import type { ProductStatus, PersonalizationType } from '@prisma/client'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProductImageInput {
  url: string
  altText?: string
  sortOrder: number
  isPrimary: boolean
}

export interface PersonalisationOptionInput {
  label: string
  type: string
  required: boolean
  priceModifier: number
}

export interface ProductInput {
  name: string
  slug: string
  description: string
  basePrice: number
  compareAtPrice?: number | null
  categoryId: number | null
  status: ProductStatus
  productionDays: number
  isPersonalizable: boolean
  isFeatured: boolean
  images: ProductImageInput[]
  personalisationOptions: PersonalisationOptionInput[]
  occasionIds: number[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapOptionType(type: string): PersonalizationType {
  const map: Record<string, PersonalizationType> = {
    text: 'TEXT',
    textarea: 'TEXTAREA',
    image: 'IMAGE',
    select: 'DROPDOWN',
    dropdown: 'DROPDOWN',
    color: 'COLOUR',
    colour: 'COLOUR',
    font: 'FONT',
    toggle: 'TOGGLE',
  }
  return map[type.toLowerCase()] || 'TEXT'
}

function generateOptionKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '')
}

// ─── Create Product ─────────────────────────────────────────────────────────

export async function createProduct(data: ProductInput) {
  await requireAdmin()

  const product = await db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice ?? null,
        categoryId: data.categoryId,
        status: data.status,
        productionDays: data.productionDays,
        isPersonalizable: data.isPersonalizable,
        isFeatured: data.isFeatured,
      },
    })

    if (data.images.length > 0) {
      await tx.productImage.createMany({
        data: data.images.map((img) => ({
          productId: product.id,
          url: img.url,
          altText: img.altText || data.name,
          sortOrder: img.sortOrder,
          isPrimary: img.isPrimary,
        })),
      })
    }

    if (data.isPersonalizable && data.personalisationOptions.length > 0) {
      await tx.personalizationOption.createMany({
        data: data.personalisationOptions.map((opt, index) => ({
          productId: product.id,
          optionKey: generateOptionKey(opt.label),
          label: opt.label,
          optionType: mapOptionType(opt.type),
          isRequired: opt.required,
          priceModifier: opt.priceModifier,
          sortOrder: index,
        })),
      })
    }

    if (data.occasionIds.length > 0) {
      await tx.productOccasion.createMany({
        data: data.occasionIds.map((occasionId) => ({
          productId: product.id,
          occasionId,
        })),
      })
    }

    return product
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { success: true, productId: product.id }
}

// ─── Update Product ─────────────────────────────────────────────────────────

export async function updateProduct(id: number, data: ProductInput) {
  await requireAdmin()

  await db.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice ?? null,
        categoryId: data.categoryId,
        status: data.status,
        productionDays: data.productionDays,
        isPersonalizable: data.isPersonalizable,
        isFeatured: data.isFeatured,
      },
    })

    // Replace images: delete old ones not in new list, add new ones
    await tx.productImage.deleteMany({ where: { productId: id } })
    if (data.images.length > 0) {
      await tx.productImage.createMany({
        data: data.images.map((img) => ({
          productId: id,
          url: img.url,
          altText: img.altText || data.name,
          sortOrder: img.sortOrder,
          isPrimary: img.isPrimary,
        })),
      })
    }

    // Replace personalisation options
    await tx.personalizationOption.deleteMany({ where: { productId: id } })
    if (data.isPersonalizable && data.personalisationOptions.length > 0) {
      await tx.personalizationOption.createMany({
        data: data.personalisationOptions.map((opt, index) => ({
          productId: id,
          optionKey: generateOptionKey(opt.label),
          label: opt.label,
          optionType: mapOptionType(opt.type),
          isRequired: opt.required,
          priceModifier: opt.priceModifier,
          sortOrder: index,
        })),
      })
    }

    // Replace occasion links
    await tx.productOccasion.deleteMany({ where: { productId: id } })
    if (data.occasionIds.length > 0) {
      await tx.productOccasion.createMany({
        data: data.occasionIds.map((occasionId) => ({
          productId: id,
          occasionId,
        })),
      })
    }
  })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}/edit`)
  revalidatePath('/products')
  return { success: true }
}

// ─── Delete Product ─────────────────────────────────────────────────────────

export async function deleteProduct(id: number) {
  await requireAdmin()

  // Check if product has order items (can't delete due to Restrict constraint)
  const orderItemCount = await db.orderItem.count({
    where: { productId: id },
  })

  if (orderItemCount > 0) {
    // Archive instead of delete for products with orders
    await db.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return {
      success: true,
      archived: true,
      message: `Product has ${orderItemCount} order(s) and was archived instead of deleted.`,
    }
  }

  // Get images to delete from Cloudinary
  const images = await db.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  })

  await db.product.delete({ where: { id } })

  // Clean up Cloudinary images (best effort)
  for (const image of images) {
    try {
      const publicId = extractPublicId(image.url)
      if (publicId) {
        await cloudinary.uploader.destroy(publicId)
      }
    } catch {
      console.error('Failed to delete Cloudinary image:', image.url)
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { success: true, archived: false }
}

// ─── Delete Single Image ────────────────────────────────────────────────────

export async function deleteProductImage(imageId: number) {
  await requireAdmin()

  const image = await db.productImage.findUnique({
    where: { id: imageId },
    select: { url: true, productId: true },
  })

  if (!image) {
    throw new Error('Image not found')
  }

  await db.productImage.delete({ where: { id: imageId } })

  try {
    const publicId = extractPublicId(image.url)
    if (publicId) {
      await cloudinary.uploader.destroy(publicId)
    }
  } catch {
    console.error('Failed to delete Cloudinary image:', image.url)
  }

  revalidatePath(`/admin/products/${image.productId}/edit`)
  return { success: true }
}

// ─── Query: List Products ───────────────────────────────────────────────────

export async function getAdminProducts(filters?: {
  status?: ProductStatus
  search?: string
  page?: number
  pageSize?: number
}) {
  await requireAdmin()

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {}
  if (filters?.status) {
    where.status = filters.status
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { slug: { contains: filters.search } },
    ]
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    db.product.count({ where }),
  ])

  return {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: Number(p.basePrice),
      status: p.status,
      category: p.category?.name ?? 'Uncategorized',
      imageUrl: p.images[0]?.url ?? null,
      orderCount: p._count.orderItems,
      createdAt: p.createdAt,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// ─── Query: Single Product for Edit ─────────────────────────────────────────

export async function getAdminProduct(id: number) {
  await requireAdmin()

  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      personalizationOptions: { orderBy: { sortOrder: 'asc' } },
      occasions: { select: { occasionId: true } },
    },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    categoryId: product.categoryId,
    status: product.status,
    productionDays: product.productionDays ?? 3,
    isPersonalizable: product.isPersonalizable,
    isFeatured: product.isFeatured,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText ?? '',
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    personalisationOptions: product.personalizationOptions.map((opt) => ({
      label: opt.label,
      type: opt.optionType.toLowerCase(),
      required: opt.isRequired,
      priceModifier: Number(opt.priceModifier),
    })),
    occasionIds: product.occasions.map((o) => o.occasionId),
  }
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export async function getDashboardStats() {
  await requireAdmin()

  const [productCount, orderCount, customerCount, revenue, recentOrders] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count({ where: { role: 'CUSTOMER' } }),
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
    ])

  return {
    productCount,
    orderCount,
    customerCount,
    totalRevenue: Number(revenue._sum.totalAmount ?? 0),
    recentOrders: recentOrders.map((o) => ({
      id: o.orderNumber,
      customer: o.user?.name ?? o.guestEmail ?? 'Guest',
      items: o._count.items,
      total: Number(o.totalAmount),
      status: o.status,
      date: o.createdAt.toISOString().split('T')[0],
    })),
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractPublicId(url: string): string | null {
  try {
    // Cloudinary URLs: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}
