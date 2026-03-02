import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

interface ClerkEmailAddress {
  id: string
  email_address: string
}

interface ClerkUserEventData {
  id: string
  email_addresses: ClerkEmailAddress[]
  primary_email_address_id: string
  first_name: string | null
  last_name: string | null
}

interface ClerkWebhookEvent {
  type: string
  data: ClerkUserEventData
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClerkWebhookEvent

    const { type, data } = body

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, primary_email_address_id, first_name, last_name } = data

      const primaryEmail = email_addresses.find(
        (e) => e.id === primary_email_address_id
      )?.email_address ?? email_addresses[0]?.email_address

      if (!primaryEmail) {
        return NextResponse.json(
          { error: 'No email address found' },
          { status: 400 }
        )
      }

      const name = [first_name, last_name].filter(Boolean).join(' ') || null

      await db.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          name,
        },
        create: {
          clerkId: id,
          email: primaryEmail,
          name,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Clerk webhook error: ${message}`)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
