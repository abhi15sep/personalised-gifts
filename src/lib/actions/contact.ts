'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { resend } from '@/lib/resend'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(2, 'Subject is required'),
  orderNumber: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL!

export async function submitContactMessage(data: {
  name: string
  email: string
  subject: string
  orderNumber?: string
  message: string
}) {
  const parsed = contactSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { name, email, subject, orderNumber, message } = parsed.data

  // Store in database
  await db.contactMessage.create({
    data: {
      name,
      email,
      subject,
      orderNumber: orderNumber || null,
      message,
    },
  })

  // Send notification email to support
  try {
    await resend.emails.send({
      from: `PersonalisedGifts <${process.env.RESEND_FROM_EMAIL || 'noreply@personalisedgifts.co.uk'}>`,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Message</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject}</td></tr>
          ${orderNumber ? `<tr><td style="padding:8px;font-weight:bold">Order #</td><td style="padding:8px">${orderNumber}</td></tr>` : ''}
        </table>
        <hr style="margin:16px 0" />
        <p style="white-space:pre-wrap">${message}</p>
      `,
    })
  } catch (err) {
    // Email failure shouldn't block the submission — message is already saved in DB
    console.error('Failed to send contact notification email:', err)
  }

  return { success: true }
}