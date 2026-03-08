'use server'

import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { auth } from '@clerk/nextjs/server'
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

export async function createCheckoutSession(
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

  // Calculate line items and subtotal
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

  const stripeLineItems: {
    price_data: {
      currency: string
      product_data: {
        name: string
        images?: string[]
      }
      unit_amount: number
    }
    quantity: number
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

    stripeLineItems.push({
      price_data: {
        currency: CURRENCY.toLowerCase(),
        product_data: {
          name: product.name,
          ...(primaryImage ? { images: [primaryImage] } : {}),
        },
        unit_amount: Math.round((unitPrice + personalizationPrice) * 100),
      },
      quantity: item.quantity,
    })
  }

  // Calculate shipping
  const shippingAmount =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  // Calculate gift wrap
  const giftWrapAmount =
    giftOptions.giftWrap ? GIFT_WRAP_COST : 0

  const totalAmount = subtotal + shippingAmount + giftWrapAmount

  // Add shipping as a line item if applicable
  if (shippingAmount > 0) {
    stripeLineItems.push({
      price_data: {
        currency: CURRENCY.toLowerCase(),
        product_data: {
          name: 'Shipping',
        },
        unit_amount: Math.round(shippingAmount * 100),
      },
      quantity: 1,
    })
  }

  // Add gift wrap as a line item if applicable
  if (giftWrapAmount > 0) {
    stripeLineItems.push({
      price_data: {
        currency: CURRENCY.toLowerCase(),
        product_data: {
          name: 'Gift Wrap',
        },
        unit_amount: Math.round(giftWrapAmount * 100),
      },
      quantity: 1,
    })
  }

  // Create order in DB with PENDING status
  const order = await db.order.create({
    data: {
      userId: dbUserId,
      orderNumber: generateOrderNumber(),
      status: 'PENDING',
      subtotal,
      shippingAmount,
      giftWrapAmount,
      discountAmount: 0,
      totalAmount,
      currency: CURRENCY,
      paymentMethod: 'stripe',
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

  // Create Stripe Checkout Session
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${order.orderNumber}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      orderId: order.id.toString(),
    },
  })

  // Store Stripe session id on the order
  await db.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSessionId: session.id },
  })

  return {
    sessionId: session.id,
    url: session.url,
  }
}
