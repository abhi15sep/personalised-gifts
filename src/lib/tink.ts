import crypto from 'crypto'

// ─── Config ─────────────────────────────────────────────────────────────────

const TINK_ENV = process.env.TINK_ENV || 'sandbox'
const TINK_CLIENT_ID = process.env.TINK_CLIENT_ID || ''
const TINK_CLIENT_SECRET = process.env.TINK_CLIENT_SECRET || ''
const TINK_PAYEE_NAME = process.env.TINK_PAYEE_NAME || 'PersonalisedGifts'
const TINK_MARKET = process.env.TINK_MARKET || 'GB'
const TINK_LOCALE = process.env.TINK_LOCALE || 'en_GB'
const TINK_REDIRECT_URI = process.env.TINK_REDIRECT_URI || ''
const TINK_WEBHOOK_SECRET = process.env.TINK_WEBHOOK_SECRET || ''

// Destination bank account — where customer funds are sent
const TINK_DEST_ACCOUNT_NUMBER = process.env.TINK_DEST_ACCOUNT_NUMBER || ''
const TINK_DEST_SORT_CODE = process.env.TINK_DEST_SORT_CODE || ''

const API_BASE_URL = 'https://api.tink.com'

const LINK_BASE_URL = 'https://link.tink.com/1.0/pay'

// ─── Token Cache ────────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Get a client_credentials access token from Tink.
 * Cached in memory with a 60s buffer before expiry.
 */
export async function getTinkAccessToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: TINK_CLIENT_ID,
      client_secret: TINK_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'payment:write,payment:read',
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Tink token request failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  const ttl = (data.expires_in ?? 1800) - 60

  cachedToken = {
    token: data.access_token,
    expiresAt: now + ttl * 1000,
  }

  return cachedToken.token
}

// ─── Create Payment Request ─────────────────────────────────────────────────

interface TinkPaymentRequestParams {
  amountInPence: number
  reference: string
  sourceMessage?: string
}

interface TinkPaymentRequestResult {
  success: boolean
  paymentRequestId?: string
  redirectUrl?: string
  error?: string
}

/**
 * Create a payment request using Tink Payment Initiation API.
 * Uses the standard /api/v1/payments/requests endpoint (no settlement account needed).
 * Funds are sent directly to the destination bank account.
 */
export async function createTinkPaymentRequest(
  params: TinkPaymentRequestParams
): Promise<TinkPaymentRequestResult> {
  const token = await getTinkAccessToken()

  // For UK, destination uses sort-code format: "SSSSSSNNNNNNNN" (6-digit sort code + 8-digit account number)
  const accountNumber = `${TINK_DEST_SORT_CODE}${TINK_DEST_ACCOUNT_NUMBER}`

  const body = {
    destinations: [
      {
        accountNumber,
        type: 'sort-code',
        reference: params.reference,
      },
    ],
    amount: params.amountInPence, // amount in minor units (pence)
    currency: 'GBP',
    market: TINK_MARKET,
    recipientName: TINK_PAYEE_NAME,
    sourceMessage: params.sourceMessage || `Payment ${params.reference}`,
    remittanceInformation: {
      type: 'UNSTRUCTURED',
      value: params.reference,
    },
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/payments/requests`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    return {
      success: false,
      error: `Tink payment request failed (${response.status}): ${text}`,
    }
  }

  const data = await response.json()
  const paymentRequestId = data.id

  return {
    success: true,
    paymentRequestId,
    redirectUrl: buildTinkLinkUrl(paymentRequestId),
  }
}

// ─── Tink Link URL ──────────────────────────────────────────────────────────

/**
 * Build the Tink Link redirect URL for a given payment request.
 * Uses /1.0/pay (standard PIS) instead of /1.0/pay/direct/ (settlement accounts).
 */
export function buildTinkLinkUrl(paymentRequestId: string): string {
  const params = new URLSearchParams({
    client_id: TINK_CLIENT_ID,
    redirect_uri: TINK_REDIRECT_URI,
    market: TINK_MARKET,
    locale: TINK_LOCALE,
    payment_request_id: paymentRequestId,
  })

  // In sandbox, add test=true so Demo Bank is available
  if (TINK_ENV === 'sandbox') {
    params.set('test', 'true')
  }

  return `${LINK_BASE_URL}?${params.toString()}`
}

// ─── Check Payment Status ───────────────────────────────────────────────────

interface TinkTransfer {
  id: string
  status: string
  amount?: number
  currency?: string
}

interface TinkPaymentStatus {
  id: string
  status: string
  transfers?: TinkTransfer[]
}

/**
 * Check the status of a Tink payment request by fetching its transfers.
 */
export async function checkTinkPaymentStatus(
  paymentRequestId: string
): Promise<TinkPaymentStatus> {
  const token = await getTinkAccessToken()

  const response = await fetch(
    `${API_BASE_URL}/api/v1/payments/requests/${paymentRequestId}/transfers`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Tink status check failed (${response.status})`)
  }

  const transfers: TinkTransfer[] = await response.json()

  // Determine overall status from transfers
  let status = 'PENDING'
  if (transfers.length > 0) {
    const latestTransfer = transfers[transfers.length - 1]
    if (latestTransfer.status === 'EXECUTED' || latestTransfer.status === 'SETTLED') {
      status = 'SETTLED'
    } else if (latestTransfer.status === 'FAILED') {
      status = 'FAILED'
    } else if (latestTransfer.status === 'CANCELLED') {
      status = 'CANCELLED'
    } else {
      status = latestTransfer.status
    }
  }

  return {
    id: paymentRequestId,
    status,
    transfers,
  }
}

// ─── Webhook Signature Verification ─────────────────────────────────────────

/**
 * Verify the HMAC-SHA256 signature on a Tink webhook request.
 */
export function verifyTinkWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!TINK_WEBHOOK_SECRET) return false

  const expected = crypto
    .createHmac('sha256', TINK_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signatureHeader, 'hex')
  )
}
