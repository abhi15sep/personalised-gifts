'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { createTinkPaymentRequest } from '@/lib/tink'
import {
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_COST,
  CURRENCY,
} from '@/lib/constants'

interface CheckoutItem {
  productId: number
  variantId?: number
  quantity: number
  personalizationData?: Record<string, unknown>
  previewImageUrl?: string
}

interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  county?: string
  postalCode: string
  country?: string
}

interface GiftOptions {
  isGift?: boolean
  giftMessage?: string
  giftWrap?: boolean
}

function generateOrderNumber(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString()
  return `PG-${randomDigits}`
}

export async function createTinkCheckoutSession(
  items: CheckoutItem[],
  shippingAddress: ShippingAddress,
  giftOptions: GiftOptions = {}
) {
  const { userId: clerkUserId } = await auth()

  let dbUserId: bigint | null = null
  if (clerkUserId) {
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    })
    dbUserId = user?.id ?? null
  }

  // Fetch product and variant prices from DB - never trust client prices
  const productIds = items.map((item) => item.productId)
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    include: {
      variants: true,
      personalizationOptions: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  })

  const productMap = new Map(products.map((p) => [p.id, p]))

  // Calculate line items in GBP (no conversion needed unlike PhonePe)
  let subtotal = 0
  const lineItems: {
    productId: number
    variantId?: number
    quantity: number
    unitPrice: number
    personalizationPrice: number
    personalizationData?: Record<string, unknown>
    previewImageUrl?: string
    productSnapshot: Record<string, unknown>
  }[] = []

  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`)
    }

    let unitPrice = Number(product.basePrice)

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId)
      if (!variant) {
        throw new Error(
          `Variant ${item.variantId} not found for product ${item.productId}`
        )
      }
      unitPrice = Number(variant.price)
    }

    // Calculate personalization surcharge
    let personalizationPrice = 0
    if (item.personalizationData && product.personalizationOptions.length > 0) {
      for (const option of product.personalizationOptions) {
        if (
          item.personalizationData[option.optionKey] !== undefined &&
          Number(option.priceModifier) > 0
        ) {
          personalizationPrice += Number(option.priceModifier)
        }
      }
    }

    const itemTotal = (unitPrice + personalizationPrice) * item.quantity
    subtotal += itemTotal

    const primaryImage = product.images[0]?.url

    lineItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice,
      personalizationPrice,
      personalizationData: item.personalizationData,
      previewImageUrl: item.previewImageUrl,
      productSnapshot: {
        name: product.name,
        slug: product.slug,
        imageUrl: primaryImage,
      },
    })
  }

  // Calculate shipping
  const shippingAmount =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  // Calculate gift wrap
  const giftWrapAmount = giftOptions.giftWrap ? GIFT_WRAP_COST : 0

  const totalAmount = subtotal + shippingAmount + giftWrapAmount
  const orderNumber = generateOrderNumber()

  // Create order in DB with PENDING status
  const order = await db.order.create({
    data: {
      userId: dbUserId,
      orderNumber,
      status: 'PENDING',
      subtotal,
      shippingAmount,
      giftWrapAmount,
      discountAmount: 0,
      totalAmount,
      currency: CURRENCY,
      paymentMethod: 'tink',
      shippingAddress: shippingAddress as object,
      isGift: giftOptions.isGift ?? false,
      giftMessage: giftOptions.giftMessage,
      giftWrap: giftOptions.giftWrap ?? false,
      items: {
        create: lineItems.map((li) => ({
          productId: li.productId,
          variantId: li.variantId,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          personalizationPrice: li.personalizationPrice,
          personalizationData: li.personalizationData
            ? (li.personalizationData as object)
            : undefined,
          previewImageUrl: li.previewImageUrl,
          productSnapshot: li.productSnapshot as object,
        })),
      },
    },
  })

  // Create Tink payment request — amount in pence
  const totalInPence = Math.round(totalAmount * 100)

  const result = await createTinkPaymentRequest({
    amountInPence: totalInPence,
    reference: orderNumber,
    sourceMessage: `Order ${orderNumber}`,
  })

  if (!result.success || !result.paymentRequestId) {
    await db.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    })
    throw new Error(result.error || 'Failed to create Tink payment request')
  }

  // Store Tink payment request ID on the order
  await db.order.update({
    where: { id: order.id },
    data: { tinkPaymentRequestId: result.paymentRequestId },
  })

  return {
    orderId: order.id.toString(),
    paymentRequestId: result.paymentRequestId,
    redirectUrl: result.redirectUrl!,
  }
}
