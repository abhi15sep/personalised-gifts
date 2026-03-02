import crypto from 'crypto'

const PHONEPE_ENV = process.env.PHONEPE_ENV || 'UAT'
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || ''
const SALT_KEY = process.env.PHONEPE_SALT_KEY || ''
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1'

const BASE_URL =
  PHONEPE_ENV === 'PRODUCTION'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox'

/**
 * Generate the X-VERIFY checksum header for PhonePe API requests.
 * Formula: SHA256(base64Payload + apiEndpoint + saltKey) + "###" + saltIndex
 */
export function generateChecksum(
  base64Payload: string,
  apiEndpoint: string
): string {
  const data = base64Payload + apiEndpoint + SALT_KEY
  const hash = crypto.createHash('sha256').update(data).digest('hex')
  return hash + '###' + SALT_INDEX
}

/**
 * Generate checksum for status check API (GET request).
 * Formula: SHA256(apiEndpoint + saltKey) + "###" + saltIndex
 */
export function generateStatusChecksum(apiEndpoint: string): string {
  const data = apiEndpoint + SALT_KEY
  const hash = crypto.createHash('sha256').update(data).digest('hex')
  return hash + '###' + SALT_INDEX
}

interface PhonePePaymentRequest {
  merchantTransactionId: string
  amount: number // in paise
  redirectUrl: string
  callbackUrl: string
  mobileNumber?: string
  merchantUserId?: string
}

interface PhonePePaymentResponse {
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    instrumentResponse?: {
      type: string
      redirectInfo?: {
        url: string
        method: string
      }
    }
  }
}

/**
 * Create a PhonePe payment order and get the redirect URL.
 */
export async function createPhonePePayment(
  request: PhonePePaymentRequest
): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
  const apiEndpoint = '/pg/v1/pay'

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: request.merchantTransactionId,
    merchantUserId: request.merchantUserId || 'GUEST',
    amount: request.amount,
    redirectUrl: request.redirectUrl,
    redirectMode: 'REDIRECT',
    callbackUrl: request.callbackUrl,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  }

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const checksum = generateChecksum(base64Payload, apiEndpoint)

  const response = await fetch(`${BASE_URL}${apiEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
    },
    body: JSON.stringify({ request: base64Payload }),
  })

  const data: PhonePePaymentResponse = await response.json()

  if (
    data.success &&
    data.data?.instrumentResponse?.redirectInfo?.url
  ) {
    return {
      success: true,
      redirectUrl: data.data.instrumentResponse.redirectInfo.url,
    }
  }

  return {
    success: false,
    error: data.message || 'Failed to create PhonePe payment',
  }
}

interface PhonePeStatusResponse {
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
    paymentInstrument?: {
      type: string
      utr?: string
    }
  }
}

/**
 * Check the status of a PhonePe payment.
 */
export async function checkPhonePePaymentStatus(
  merchantTransactionId: string
): Promise<PhonePeStatusResponse> {
  const apiEndpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`
  const checksum = generateStatusChecksum(apiEndpoint)

  const response = await fetch(`${BASE_URL}${apiEndpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      accept: 'application/json',
    },
  })

  return response.json()
}
