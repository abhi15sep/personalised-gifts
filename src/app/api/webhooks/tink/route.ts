import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyTinkWebhookSignature } from '@/lib/tink'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-tink-signature') ?? ''

  // Verify webhook signature
  if (process.env.TINK_WEBHOOK_SECRET) {
    const isValid = verifyTinkWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('Tink webhook signature verification failed')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
  }

  let payload: {
    event: string
    content: {
      id: string
      paymentRequestId: string
      status: string
      amount?: number
      currency?: string
      metadata?: Record<string, string>
      [key: string]: unknown
    }
  }

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.event !== 'payment:updated') {
    return NextResponse.json({ received: true })
  }

  const { paymentRequestId, status, id: transferId } = payload.content

  if (!paymentRequestId) {
    return NextResponse.json(
      { error: 'Missing paymentRequestId' },
      { status: 400 }
    )
  }

  try {
    // Find the order by tinkPaymentRequestId
    const order = await db.order.findFirst({
      where: { tinkPaymentRequestId: paymentRequestId },
      select: { id: true, status: true },
    })

    if (!order) {
      console.error(`No order found for Tink paymentRequestId: ${paymentRequestId}`)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Idempotency: skip if order already PAID
    if (order.status === 'PAID') {
      return NextResponse.json({ received: true })
    }

    if (status === 'SETTLED' || status === 'EXECUTED') {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          tinkTransferId: transferId ?? null,
        },
      })
      // TODO: Send order confirmation email
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      if (order.status === 'PENDING') {
        await db.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        })
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Error processing Tink webhook: ${message}`)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
