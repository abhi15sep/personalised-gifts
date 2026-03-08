# Tink Pay by Bank Integration

## Approach: Payment Initiation (Standard PIS)

This integration uses Tink's **Payment Initiation Service (PIS)** — the standard approach that sends payments directly from the customer's bank to your business bank account. **No settlement account needed.**

---

## Sandbox Setup — Step by Step

### Step 1: Create a Tink Console Account
1. Go to [console.tink.com](https://console.tink.com)
2. Click **Sign Up** — select "Developer" (free, no credit card)
3. Enter your email, name, password
4. Verify your email via the confirmation link sent to your inbox

### Step 2: Create an App
1. After logging in, you'll see a **getting started checklist**
2. Click **Create App**
3. Name it (e.g. `PersonalisedGifts Dev`)
4. Select market: **United Kingdom (GB)**
5. The app is created in **sandbox mode** by default

### Step 3: Get Your Client ID & Client Secret
1. Go to **App Settings** in the left sidebar
2. Navigate to **API Client > App details**
3. Copy your **Client ID** → `TINK_CLIENT_ID`
4. Click reveal on **Client Secret** → `TINK_CLIENT_SECRET`
5. **Never commit the secret to git**

### Step 4: Enable Payment Scopes
1. In **App Settings > Scopes**
2. Enable:
   - `payment:write` — create payment requests
   - `payment:read` — check payment status

### Step 5: Add Redirect URIs
1. Go to **App Settings > Redirect URIs**
2. Add your return page URLs:
   - Production: `https://gift.devops-monk.com/checkout/tink-return`
   - Local dev: `http://localhost:3000/checkout/tink-return`
3. Delete or ignore the defaults (`console.tink.com/callback`, `localhost:3000/callback`)
4. The URI must **exactly match** `TINK_REDIRECT_URI` in your `.env`

### Step 6: Configure Webhook (optional for sandbox)
1. Go to **App Settings > Webhooks**
2. Add endpoint: `https://gift.devops-monk.com/api/webhooks/tink`
3. For local dev, use [ngrok](https://ngrok.com): `ngrok http 3000` → use the ngrok URL
4. Copy the **Webhook Secret** → `TINK_WEBHOOK_SECRET`
5. Subscribe to `payment:updated` event

### Step 7: Get Your Destination Bank Account Details
Since we're using standard Payment Initiation (not settlement accounts), payments go directly to your bank account. You need:
- **Sort Code** (6 digits) → `TINK_DEST_SORT_CODE` (e.g. `040004`)
- **Account Number** (8 digits) → `TINK_DEST_ACCOUNT_NUMBER` (e.g. `12345678`)

For sandbox testing, you can use any valid-looking sort code/account number — Demo Bank will simulate the payment regardless.

### Step 8: Fill in Your `.env`
```env
TINK_CLIENT_ID=<from Step 3>
TINK_CLIENT_SECRET=<from Step 3>
TINK_DEST_ACCOUNT_NUMBER=12345678
TINK_DEST_SORT_CODE=040004
TINK_PAYEE_NAME=PersonalisedGifts
TINK_MARKET=GB
TINK_LOCALE=en_GB
TINK_REDIRECT_URI=https://gift.devops-monk.com/checkout/tink-return
TINK_WEBHOOK_SECRET=<from Step 6, optional for sandbox>
TINK_ENV=sandbox
```

### Step 9: Verify Credentials
Run this curl command to test your credentials work:
```bash
curl -X POST https://api.tink.com/api/v1/oauth/token \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials" \
  -d "scope=payment:write,payment:read"
```
If you get back an `access_token`, you're good to go.

### Step 10: Test End-to-End with Demo Bank
1. Start your app (`npm run dev`)
2. Add items to cart → checkout → fill shipping → select **Pay by Bank**
3. Click "Pay via Bank" → redirected to Tink Link
4. In Tink Link, select **Demo Bank** (sandbox test bank)
5. Complete the simulated bank authentication
6. Redirected back to `/checkout/tink-return` → order confirmed
7. Webhook fires (if configured) → order marked PAID

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. Customer clicks "Pay by Bank" on checkout page                 │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. Server action creates payment request via Tink API             │
│  POST /api/v1/payments/requests                                    │
│  Body: destinations (sort code + account), amount, currency, market│
│  Response: { id: "payment_request_id" }                            │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. Redirect customer to Tink Link                                 │
│  https://link.tink.com/1.0/pay?payment_request_id=...&test=true    │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. Customer completes payment in Tink Link (hosted by Tink)       │
│  - Selects bank (HSBC, NatWest, Barclays, Demo Bank...)            │
│  - On desktop: may show QR code to scan with phone                 │
│  - Opens banking app, authenticates (FaceID/fingerprint)           │
│  - Confirms payment                                                │
│  - Redirected back to /checkout/tink-return                        │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. Return page checks transfer status                             │
│  GET /api/v1/payments/requests/{id}/transfers                      │
│  Shows "Payment Initiated" or "Payment Successful"                 │
└─────────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│  6. Webhook confirms final status                                  │
│  Event: payment:updated                                            │
│  Status: EXECUTED/SETTLED → order marked PAID                      │
│  Status: FAILED/CANCELLED → order marked CANCELLED                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Details

### Create Payment Request

**Endpoint:** `POST https://api.tink.com/api/v1/payments/requests`

**Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Request Body (UK example):**
```json
{
  "destinations": [
    {
      "accountNumber": "04000412345678",
      "type": "sort-code",
      "reference": "PG-54321"
    }
  ],
  "amount": 5000,
  "currency": "GBP",
  "market": "GB",
  "recipientName": "PersonalisedGifts",
  "sourceMessage": "Order PG-54321",
  "remittanceInformation": {
    "type": "UNSTRUCTURED",
    "value": "PG-54321"
  }
}
```

**Key Fields:**

| Field | Description |
|-------|-------------|
| `destinations[].accountNumber` | Sort code (6 digits) + account number (8 digits) concatenated |
| `destinations[].type` | `sort-code` for UK payments |
| `destinations[].reference` | Payment reference shown in bank statement |
| `amount` | Amount in minor units (pence). 5000 = £50.00 |
| `currency` | `GBP` |
| `market` | `GB` |
| `recipientName` | Your business name shown to customer |

**Response:**
```json
{
  "id": "b0223349-65b3-4c8b-b500-74e33f2f643b"
}
```

### Check Payment Transfers

**Endpoint:** `GET https://api.tink.com/api/v1/payments/requests/{id}/transfers`

**Response:**
```json
[
  {
    "id": "transfer-uuid",
    "status": "EXECUTED",
    "amount": 5000,
    "currency": "GBP"
  }
]
```

**Transfer Status Values:**

| Status | Description | Action |
|--------|-------------|--------|
| `CREATED` | Transfer created | Wait |
| `SENT` | Awaiting bank processing | Wait |
| `EXECUTED` | Payment executed by bank | Mark order PAID |
| `SETTLED` | Funds received | Mark order PAID |
| `FAILED` | Payment failed | Mark order CANCELLED |
| `CANCELLED` | Payment cancelled | Mark order CANCELLED |

### Tink Link URL

**Format:**
```
https://link.tink.com/1.0/pay?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&market=GB&locale=en_GB&payment_request_id={ID}&test=true
```

**Note:** `test=true` enables Demo Bank in sandbox. Remove for production.

**Success callback:** `/checkout/tink-return?payment_request_id=...`
**Error callback:** `/checkout/tink-return?error=USER_CANCELLED&message=...`

---

## Files

### New Files
- `src/lib/tink.ts` — Token caching, payment request creation, Tink Link URL builder, transfer status check, webhook verification
- `src/lib/actions/tink-checkout.ts` — Server action: creates order + Tink payment request, returns redirect URL
- `src/app/api/webhooks/tink/route.ts` — Webhook handler: verifies signature, updates order on EXECUTED/SETTLED/FAILED/CANCELLED
- `src/app/checkout/tink-return/page.tsx` — Return page: shows success/pending/error states, clears cart

### Modified Files
- `prisma/schema.prisma` — Added `tinkPaymentRequestId` and `tinkTransferId` to Order model
- `.env.example` — Added Tink environment variables
- `src/app/checkout/page.tsx` — Added payment method selector (Card vs Pay by Bank)

---

## Differences from Settlement Account Approach

| | Standard PIS (what we use) | Settlement Accounts |
|---|---|---|
| **Endpoint** | `/api/v1/payments/requests` | `/payment/v1/settlement-account-payment-requests` |
| **Tink Link URL** | `/1.0/pay?...` | `/1.0/pay/direct/?...` |
| **Funds go to** | Your bank account directly | Tink-managed settlement account |
| **Setup needed** | Client ID + Secret only | Client ID + Secret + Settlement Account + Merchant |
| **Sandbox** | Works immediately with Demo Bank | Requires creating merchant + settlement account in Console |
| **Status check** | `GET .../requests/{id}/transfers` | `GET .../settlement-account-payment-requests/{id}` |