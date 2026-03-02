import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateStatusChecksum } from '@/lib/phonepe'

export const runtime = 'nodejs'

interface PhonePeCallbackBody {
  response: string // base64 encoded JSON
}

interface PhonePeCallbackPayload {
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    transactionId?: string
    amount: number
    state: string
    responseCode: string
  }
}

export async function POST(request: Request) {
  const xVerify = request.headers.get('X-VERIFY')

  if (!xVerify) {
    return NextResponse.json(
      { error: 'Missing X-VERIFY header' },
      { status: 400 }
    )
  }

  let body: PhonePeCallbackBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Verify the checksum
  const expectedChecksum = generateStatusChecksum(
    '/pg/v1/pay' // PhonePe uses this endpoint path for callback verification
  )

  // Decode the response
  let payload: PhonePeCallbackPayload
  try {
    const decoded = Buffer.from(body.response, 'base64').toString('utf-8')
    payload = JSON.parse(decoded)
  } catch {
    return NextResponse.json(
      { error: 'Failed to decode callback response' },
      { status: 400 }
    )
  }

  const merchantTransactionId = payload.data?.merchantTransactionId
  if (!merchantTransactionId) {
    return NextResponse.json(
      { error: 'Missing merchantTransactionId' },
      { status: 400 }
    )
  }

  try {
    const order = await db.order.findFirst({
      where: { phonepeOrderId: merchantTransactionId },
    })

    if (!order) {
      console.error(
        `PhonePe callback: Order not found for txn ${merchantTransactionId}`
      )
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (payload.success && payload.code === 'PAYMENT_SUCCESS') {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          phonepeTransactionId: payload.data?.transactionId ?? null,
        },
      })
    } else {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
        },
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Error processing PhonePe callback: ${message}`)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
