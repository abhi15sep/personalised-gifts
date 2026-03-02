'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { createPhonePePayment } from '@/lib/phonepe'
import {
  SHIPPING_COST_INR,
  FREE_SHIPPING_THRESHOLD_INR,
  GIFT_WRAP_COST_INR,
  CURRENCY_INR,
  GBP_TO_INR_RATE,
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

function generateMerchantTransactionId(): string {
  return `MT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export async function createPhonePeCheckoutSession(
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

  // Fetch product and variant prices from DB
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

  // Calculate line items in INR
  let subtotalINR = 0
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

    let unitPriceGBP = Number(product.basePrice)

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId)
      if (!variant) {
        throw new Error(
          `Variant ${item.variantId} not found for product ${item.productId}`
        )
      }
      unitPriceGBP = Number(variant.price)
    }

    // Calculate personalization surcharge in GBP
    let personalizationPriceGBP = 0
    if (item.personalizationData && product.personalizationOptions.length > 0) {
      for (const option of product.personalizationOptions) {
        if (
          item.personalizationData[option.optionKey] !== undefined &&
          Number(option.priceModifier) > 0
        ) {
          personalizationPriceGBP += Number(option.priceModifier)
        }
      }
    }

    // Convert to INR
    const unitPriceINR = Math.round(unitPriceGBP * GBP_TO_INR_RATE * 100) / 100
    const personalizationPriceINR =
      Math.round(personalizationPriceGBP * GBP_TO_INR_RATE * 100) / 100

    const itemTotal = (unitPriceINR + personalizationPriceINR) * item.quantity
    subtotalINR += itemTotal

    const primaryImage = product.images[0]?.url

    lineItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: unitPriceINR,
      personalizationPrice: personalizationPriceINR,
      personalizationData: item.personalizationData,
      previewImageUrl: item.previewImageUrl,
      productSnapshot: {
        name: product.name,
        slug: product.slug,
        imageUrl: primaryImage,
      },
    })
  }

  // Calculate shipping in INR
  const shippingAmount =
    subtotalINR >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_COST_INR

  // Calculate gift wrap in INR
  const giftWrapAmount = giftOptions.giftWrap ? GIFT_WRAP_COST_INR : 0

  const totalAmount = subtotalINR + shippingAmount + giftWrapAmount
  const merchantTransactionId = generateMerchantTransactionId()

  // Create order in DB with PENDING status
  const order = await db.order.create({
    data: {
      userId: dbUserId,
      orderNumber: generateOrderNumber(),
      status: 'PENDING',
      subtotal: subtotalINR,
      shippingAmount,
      giftWrapAmount,
      discountAmount: 0,
      totalAmount,
      currency: CURRENCY_INR,
      paymentMethod: 'phonepe',
      phonepeOrderId: merchantTransactionId,
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

  // Create PhonePe payment
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const result = await createPhonePePayment({
    merchantTransactionId,
    amount: Math.round(totalAmount * 100), // Convert to paise
    redirectUrl: `${baseUrl}/checkout/phonepe-return?txnId=${merchantTransactionId}`,
    callbackUrl: `${baseUrl}/api/webhooks/phonepe`,
    merchantUserId: dbUserId ? dbUserId.toString() : 'GUEST',
  })

  if (!result.success) {
    // Mark order as cancelled if payment creation fails
    await db.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    })
    throw new Error(result.error || 'Failed to create PhonePe payment')
  }

  return {
    orderId: order.id.toString(),
    merchantTransactionId,
    redirectUrl: result.redirectUrl,
  }
}
