'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/actions/admin'
import { OrderStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function getAdminOrders(filters?: {
  status?: OrderStatus
  search?: string
  page?: number
  perPage?: number
}) {
  await requireAdmin()

  const page = filters?.page ?? 1
  const perPage = filters?.perPage ?? 20
  const skip = (page - 1) * perPage

  const where: Record<string, unknown> = {}

  if (filters?.status) {
    where.status = filters.status
  }

  if (filters?.search) {
    where.OR = [
      { orderNumber: { contains: filters.search } },
      { user: { name: { contains: filters.search } } },
      { user: { email: { contains: filters.search } } },
      { guestEmail: { contains: filters.search } },
    ]
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    db.order.count({ where }),
  ])

  return {
    orders: orders.map((o) => ({
      id: o.id.toString(),
      orderNumber: o.orderNumber,
      customer: o.user?.name || o.guestEmail || 'Guest',
      email: o.user?.email || o.guestEmail || '',
      items: o._count.items,
      total: Number(o.totalAmount),
      status: o.status,
      date: o.createdAt,
    })),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function getAdminOrder(id: string) {
  await requireAdmin()

  const orderId = BigInt(id)

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      events: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!order) return null

  return {
    id: order.id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    customer: {
      name: order.user?.name || order.guestEmail || 'Guest',
      email: order.user?.email || order.guestEmail || '',
      phone: order.user?.phone || null,
    },
    items: order.items.map((item) => {
      const snapshot = item.productSnapshot as Record<string, unknown> | null
      return {
        id: item.id.toString(),
        name: (snapshot?.name as string) || item.product?.name || 'Deleted Product',
        imageUrl: item.product?.images[0]?.url ?? null,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        personalizationData: item.personalizationData as Record<string, string> | null,
        fulfillmentStatus: item.fulfillmentStatus,
      }
    }),
    subtotal: Number(order.subtotal),
    shippingAmount: Number(order.shippingAmount),
    giftWrapAmount: Number(order.giftWrapAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress as Record<string, string> | null,
    isGift: order.isGift,
    giftMessage: order.giftMessage,
    giftWrap: order.giftWrap,
    notes: order.notes,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    createdAt: order.createdAt,
    events: order.events.map((e) => ({
      id: e.id,
      status: e.status,
      comment: e.comment,
      imageUrl: e.imageUrl,
      createdAt: e.createdAt,
    })),
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  comment?: string,
  imageUrl?: string
) {
  await requireAdmin()

  const id = BigInt(orderId)

  const timestamps: Record<string, Date> = {}
  if (newStatus === 'SHIPPED') timestamps.shippedAt = new Date()
  if (newStatus === 'DELIVERED') timestamps.deliveredAt = new Date()

  await db.$transaction([
    db.order.update({
      where: { id },
      data: {
        status: newStatus,
        ...timestamps,
      },
    }),
    db.orderEvent.create({
      data: {
        orderId: id,
        status: newStatus,
        comment: comment || null,
        imageUrl: imageUrl || null,
      },
    }),
  ])

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath(`/account/orders/${orderId}`)

  return { success: true }
}
