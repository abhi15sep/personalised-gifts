'use server'

import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

interface GetProductsParams {
  categoryId?: number
  occasionSlug?: string
  search?: string
  status?: string
  page?: number
  limit?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name' | 'popular'
}

export async function getProducts(params: GetProductsParams = {}) {
  const {
    categoryId,
    occasionSlug,
    search,
    status = 'ACTIVE',
    page = 1,
    limit = 12,
    sortBy = 'newest',
  } = params

  const where: Prisma.ProductWhereInput = {
    status: status as Prisma.EnumProductStatusFilter['equals'],
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if (occasionSlug) {
    where.occasions = {
      some: {
        occasion: {
          slug: occasionSlug,
        },
      },
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sortBy) {
      case 'price-asc':
        return { basePrice: 'asc' as const }
      case 'price-desc':
        return { basePrice: 'desc' as const }
      case 'name':
        return { name: 'asc' as const }
      case 'popular':
        return { createdAt: 'desc' as const }
      case 'newest':
      default:
        return { createdAt: 'desc' as const }
    }
  })()

  const skip = (page - 1) * limit

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return { products, totalCount, totalPages }
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
      variants: true,
      personalizationOptions: {
        orderBy: { sortOrder: 'asc' },
      },
      reviews: {
        where: { status: 'APPROVED' },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return product
}

export async function getFeaturedProducts() {
  const products = await db.product.findMany({
    where: {
      isFeatured: true,
      status: 'ACTIVE',
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    take: 8,
  })

  return products
}

export async function getProductsByOccasion(occasionSlug: string) {
  const products = await db.product.findMany({
    where: {
      status: 'ACTIVE',
      occasions: {
        some: {
          occasion: {
            slug: occasionSlug,
          },
        },
      },
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return products
}

export async function searchProducts(query: string) {
  const products = await db.product.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { name: { search: query } },
        { description: { search: query } },
      ],
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
    },
    orderBy: {
      _relevance: {
        fields: ['name', 'description'],
        search: query,
        sort: 'desc',
      },
    },
    take: 20,
  })

  return products
}
