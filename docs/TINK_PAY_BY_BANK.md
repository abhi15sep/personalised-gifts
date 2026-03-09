# Tink Pay by Bank — Complete Integration Guide

## What is Tink Pay by Bank?

Tink Pay by Bank allows customers to pay directly from their bank account using open banking. Instead of entering card details, the customer selects their bank, authenticates via their banking app (FaceID/fingerprint/QR code), and the payment is sent instantly via Faster Payments.

**Key benefits:**
- No card details needed — customers pay with their existing bank account
- Lower fees than card payments
- Instant payment confirmation
- Strong Customer Authentication (SCA) built-in

---

## How It Works (User Perspective)

1. Customer selects **"Pay by Bank"** at checkout
2. Customer clicks **"Pay £XX.XX via Bank"**
3. Redirected to **Tink Link** (hosted by Tink)
4. Tink Link shows a list of UK banks (HSBC, NatWest, Barclays, Lloyds, etc.)
5. Customer selects their bank
6. **On desktop:** A QR code is shown — customer scans with their phone camera
7. Banking app opens on their phone
8. Customer authenticates (FaceID/fingerprint/PIN)
9. Customer confirms the payment
10. Redirected back to our site with a confirmation

> The QR code, bank selection, and mobile banking authentication are all handled by Tink Link — we don't build any of that UI.

---

## Architecture Overview

```
Our App                          Tink                           Customer's Bank
────────                         ────                           ───────────────

1. handlePayment()
   ↓
2. createTinkCheckoutSession()
   → POST /api/v1/oauth/token   → Returns access_token
   ↓
3. POST /api/v1/payments/requests → Returns payment_request_id
   ↓
4. Build Tink Link URL
   → Redirect customer ─────────→ Tink Link UI
                                    ↓
                                 5. Customer selects bank ──────→ Bank auth (QR/app)
                                    ↓                              ↓
                                 6. Customer confirms ←────────── Payment approved
                                    ↓
7. /checkout/tink-return ←────── Redirect back
   ↓
8. GET /transfers ───────────────→ Check payment status
   ↓
9. Show success/pending page
                                    ↓
10. /api/webhooks/tink ←──────── Webhook: payment:updated (EXECUTED/SETTLED)
    ↓
11. Update order → PAID
```

---

## File Structure

```
src/
├── lib/
│   ├── tink.ts                          # Tink API utility functions
│   └── actions/
│       └── tink-checkout.ts             # Server action for Tink checkout
├── app/
│   ├── checkout/
│   │   ├── page.tsx                     # Checkout page (payment method selector)
│   │   └── tink-return/
│   │       └── page.tsx                 # Return page after Tink Link
│   └── api/
│       └── webhooks/
│           └── tink/
│               └── route.ts             # Webhook handler
```

---

## API Flow — Step by Step

### Step 1: Get Access Token

Our server gets a client credentials token from Tink.

```
POST https://api.tink.com/api/v1/oauth/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID
client_secret=YOUR_CLIENT_SECRET
grant_type=client_credentials
scope=payment:write,payment:read
```

**Response:**
```json
{
  "token_type": "bearer",
  "expires_in": 1799,
  "access_token": "eyJhbG...",
  "scope": "payment:write,payment:read"
}
```

**Implementation:** `getTinkAccessToken()` in `src/lib/tink.ts`
- Tokens are cached in-memory for 29 minutes (30min expiry minus 60s buffer)
- Automatically refreshes when expired

---

### Step 2: Create Payment Request

Create a payment request that specifies where the money should go.

```
POST https://api.tink.com/api/v1/payments/requests
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "destinations": [
    {
      "accountNumber": "04000412345678",
      "type": "sort-code",
      "reference": "PG-54321"
    }
  ],
  "amount": 13.99,
  "currency": "GBP",
  "market": "GB",
  "recipientName": "PersonalisedGifts",
  "paymentScheme": "FASTER_PAYMENTS",
  "sourceMessage": "Order PG-54321",
  "remittanceInformation": {
    "type": "UNSTRUCTURED",
    "value": "PG-54321"
  }
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `destinations[].accountNumber` | string | Yes | Sort code (6 digits) + account number (8 digits) concatenated. Example: `040004` + `12345678` = `04000412345678` |
| `destinations[].type` | string | Yes | `sort-code` for UK bank transfers |
| `destinations[].reference` | string | No | Reference shown on bank statement |
| `amount` | number | Yes | Amount in **pounds** (not pence). `13.99` = £13.99 |
| `currency` | string | Yes | `GBP` for UK |
| `market` | string | Yes | `GB` for UK |
| `recipientName` | string | No | Your business name shown to the customer |
| `paymentScheme` | string | Yes | `FASTER_PAYMENTS` for UK instant bank transfers |
| `sourceMessage` | string | No | Message shown in customer's bank statement |
| `remittanceInformation.type` | string | No | `UNSTRUCTURED` for free-text reference |
| `remittanceInformation.value` | string | No | Reference value |

**Response:**
```json
{
  "id": "72c46f6dee8a465d9c5f4cbd264d07e7",
  "destinations": [
    {
      "accountNumber": "04000412345678",
      "type": "sort-code"
    }
  ],
  "amount": 13.99,
  "currency": "GBP",
  "market": "GB",
  "recipientName": "PersonalisedGifts",
  "paymentScheme": "FASTER_PAYMENTS"
}
```

The `id` is the **payment_request_id** — used in the next step.

**Implementation:** `createTinkPaymentRequest()` in `src/lib/tink.ts`

---

### Step 3: Redirect to Tink Link

Build a URL and redirect the customer to Tink's hosted payment page.

**URL Format:**
```
https://link.tink.com/1.0/pay?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&market=GB&locale=en_GB&payment_request_id={PAYMENT_REQUEST_ID}&test=true
```

**Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `client_id` | Yes | Your Tink Client ID |
| `redirect_uri` | Yes | Where customer returns after payment. Must be registered in Tink Console |
| `market` | Yes | `GB` |
| `locale` | No | `en_GB` for English UK |
| `payment_request_id` | Yes | The `id` from Step 2 |
| `test` | No | `true` to enable Demo Bank in sandbox. **Remove in production** |

**Example:**
```
https://link.tink.com/1.0/pay?client_id=27263a9fdbc54c8e878325c984405682&redirect_uri=https://gift.devops-monk.com/checkout/tink-return&market=GB&locale=en_GB&payment_request_id=72c46f6dee8a465d9c5f4cbd264d07e7&test=true
```

**What the customer sees on Tink Link:**
1. Payment amount and merchant name
2. List of UK banks to choose from
3. After selecting a bank (e.g. HSBC):
   - **Desktop:** QR code to scan with phone → opens banking app
   - **Mobile:** Direct redirect to banking app
4. Customer authenticates and confirms in banking app
5. Redirected back to your `redirect_uri`

**Implementation:** `buildTinkLinkUrl()` in `src/lib/tink.ts`

---

### Step 4: Handle the Return

After the customer completes (or cancels) the Tink Link flow, they're redirected back to your app.

**Success callback:**
```
https://gift.devops-monk.com/checkout/tink-return?payment_request_id=72c46f6dee8a465d9c5f4cbd264d07e7
```

**Error/cancellation callback:**
```
https://gift.devops-monk.com/checkout/tink-return?error=USER_CANCELLED&message=User%20cancelled%20the%20flow
```

**Callback parameters:**

| Parameter | When | Description |
|-----------|------|-------------|
| `payment_request_id` | Success | Same ID from Step 2 |
| `error` | Failure | Error code (e.g. `USER_CANCELLED`, `AUTHENTICATION_FAILED`) |
| `message` | Failure | Human-readable error message |

**Important:** The callback only means the customer completed the flow. It does NOT confirm funds have been transferred. Always check the transfer status (Step 5) or wait for the webhook (Step 6).

**Implementation:** `src/app/checkout/tink-return/page.tsx`

---

### Step 5: Check Transfer Status

After the customer returns, check whether the payment has been executed.

```
GET https://api.tink.com/api/v1/payments/requests/{payment_request_id}/transfers
Authorization: Bearer {ACCESS_TOKEN}
```

**Response:**
```json
[
  {
    "id": "transfer-uuid-here",
    "status": "EXECUTED",
    "amount": 13.99,
    "currency": "GBP"
  }
]
```

**Transfer Status Values:**

| Status | Meaning | Our Action |
|--------|---------|------------|
| `CREATED` | Transfer created, waiting | Show "Payment Initiated" |
| `SENT` | Sent to bank, processing | Show "Payment Initiated" |
| `EXECUTED` | Bank executed the payment | Mark order **PAID** |
| `SETTLED` | Funds received in account | Mark order **PAID** |
| `FAILED` | Payment failed | Mark order **CANCELLED** |
| `CANCELLED` | Payment was cancelled | Mark order **CANCELLED** |

**Implementation:** `checkTinkPaymentStatus()` in `src/lib/tink.ts`

---

### Step 6: Webhook Notification

Tink sends a webhook when the payment status changes. This is the most reliable way to confirm payment.

**Webhook Payload:**
```json
{
  "event": "payment:updated",
  "content": {
    "id": "transfer-uuid-here",
    "paymentRequestId": "72c46f6dee8a465d9c5f4cbd264d07e7",
    "status": "EXECUTED",
    "amount": 13.99,
    "currency": "GBP"
  }
}
```

**Our webhook handler:**
- Verifies the HMAC-SHA256 signature (if `TINK_WEBHOOK_SECRET` is set)
- Finds the order by `tinkPaymentRequestId`
- `EXECUTED` or `SETTLED` → marks order as **PAID**, stores `tinkTransferId`
- `FAILED` or `CANCELLED` → marks order as **CANCELLED** (only if still PENDING)
- Idempotent: ignores webhooks for already-PAID orders

**Implementation:** `src/app/api/webhooks/tink/route.ts`

---

## Environment Variables

```env
# Required
TINK_CLIENT_ID=                    # From Tink Console → App Settings → API Client
TINK_CLIENT_SECRET=                # From Tink Console → App Settings → API Client
TINK_DEST_ACCOUNT_NUMBER=12345678  # Your bank account number (8 digits)
TINK_DEST_SORT_CODE=040004         # Your bank sort code (6 digits)
TINK_REDIRECT_URI=https://gift.devops-monk.com/checkout/tink-return

# Optional (have defaults)
TINK_PAYEE_NAME=PersonalisedGifts  # Business name shown to customer
TINK_MARKET=GB                     # Country code
TINK_LOCALE=en_GB                  # Language
TINK_WEBHOOK_SECRET=               # For webhook signature verification
TINK_ENV=sandbox                   # "sandbox" or "production"
```

---

## Sandbox Setup — Step by Step

### 1. Create Tink Console Account
- Go to [console.tink.com](https://console.tink.com) → Sign Up → Developer (free)
- Verify your email

### 2. Create an App
- Follow the getting started checklist → Create App
- Name: `PersonalisedGifts Dev`, Market: `United Kingdom (GB)`
- App is in **sandbox mode** by default

### 3. Get Credentials
- App Settings → API Client → App details
- Copy **Client ID** and **Client Secret**

### 4. Enable Scopes
- App Settings → Scopes
- Enable: `payment:write`, `payment:read`

### 5. Add Redirect URIs
- App Settings → Redirect URIs
- Add: `https://gift.devops-monk.com/checkout/tink-return`
- Add: `http://localhost:3000/checkout/tink-return` (for local dev)
- Delete the defaults (`console.tink.com/callback`, etc.)

### 6. Configure Webhook (optional for sandbox)
- App Settings → Webhooks → Add endpoint
- URL: `https://gift.devops-monk.com/api/webhooks/tink`
- Event: `payment:updated`
- Copy the signing secret → `TINK_WEBHOOK_SECRET`

### 7. Fill in `.env`
```env
TINK_CLIENT_ID=<your client id>
TINK_CLIENT_SECRET=<your client secret>
TINK_DEST_ACCOUNT_NUMBER=12345678
TINK_DEST_SORT_CODE=040004
TINK_PAYEE_NAME=PersonalisedGifts
TINK_MARKET=GB
TINK_LOCALE=en_GB
TINK_REDIRECT_URI=https://gift.devops-monk.com/checkout/tink-return
TINK_WEBHOOK_SECRET=
TINK_ENV=sandbox
```

> For sandbox, dummy bank details (`12345678`/`040004`) are fine — Demo Bank simulates everything.

### 8. Verify Credentials Work
```bash
curl -X POST https://api.tink.com/api/v1/oauth/token \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials" \
  -d "scope=payment:write,payment:read"
```
Should return an `access_token`.

---

## Testing with Demo Bank

### Demo Bank Credentials

Demo Bank credentials are **not** generic — you get them from Tink Console:

1. Go to [console.tink.com](https://console.tink.com)
2. Click **Demo Bank** in the left sidebar
3. Select **Product: Payments**, **Market: United Kingdom**
4. Find a test user, for example:
   - **Username:** `u83646180`
   - **Name:** Mr Payment
   - **Password:** `rlf446`

### Test Flow

1. Add items to cart → Checkout → Fill shipping details
2. Select **"Pay by Bank"** → Click **"Pay £XX.XX via Bank"**
3. Redirected to Tink Link → Select **Demo Bank**
4. Enter Demo Bank credentials (from Console)
5. Select an account → Confirm payment
6. Redirected back to `/checkout/tink-return`
7. See "Payment Initiated" or "Payment Successful"

### Test Error Flow

1. In Tink Link, click cancel/back
2. Redirected to `/checkout/tink-return?error=USER_CANCELLED&message=...`
3. See "Payment Failed" page
4. Order status updated to CANCELLED

---

## Database Fields

Two fields added to the `Order` model in `prisma/schema.prisma`:

```prisma
tinkPaymentRequestId   String?   // The payment_request_id from Tink API
tinkTransferId         String?   // The transfer id once payment is executed
```

- `tinkPaymentRequestId` — set when the payment request is created (Step 2), used to match webhooks and return page lookups
- `tinkTransferId` — set when payment is confirmed (via webhook or status check)

---

## Troubleshooting

### "Payment scheme can not be null or empty"
The `paymentScheme: "FASTER_PAYMENTS"` field is required in the payment request body.

### Amount shows wrong (e.g. £1399 instead of £13.99)
Tink expects amount in **pounds** (major units), not pence. Send `13.99`, not `1399`.

### "Bad credentials" on Demo Bank login
Don't use generic credentials. Get the test username/password from Tink Console → Demo Bank → Payments → United Kingdom.

### No accounts shown in Demo Bank
Make sure the Tink Link URL uses `/1.0/pay` (not `/1.0/pay/direct`). The `/pay/direct` URL is for settlement accounts, which is a different flow.

### 500 error when clicking "Pay via Bank"
Check server logs (`pm2 logs`). Common causes:
- Missing `TINK_CLIENT_ID` or `TINK_CLIENT_SECRET` in `.env`
- Prisma client not regenerated after schema change (`npx prisma generate`)
- Database columns not created (`npx prisma db push`)

### Webhook not firing locally
Tink can't reach `localhost`. Use [ngrok](https://ngrok.com) (`ngrok http 3000`) or skip webhook testing and rely on the return page status check.