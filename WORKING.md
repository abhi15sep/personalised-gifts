# PersonalisedGifts - How It Works

A comprehensive guide to how every part of this e-commerce platform works, covering architecture, features, data flow, and technical details.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Page-by-Page Breakdown](#page-by-page-breakdown)
3. [Authentication System](#authentication-system)
4. [Product Catalogue & Personalisation](#product-catalogue--personalisation)
5. [Shopping Cart](#shopping-cart)
6. [Checkout & Payment Flow](#checkout--payment-flow)
7. [Order Lifecycle](#order-lifecycle)
8. [Admin Dashboard](#admin-dashboard)
9. [User Account](#user-account)
10. [Database Schema](#database-schema)
11. [Server Actions](#server-actions)
12. [Webhook Handlers](#webhook-handlers)
13. [Styling & UI System](#styling--ui-system)
14. [State Management](#state-management)
15. [Image Handling](#image-handling)
16. [Email System](#email-system)
17. [SEO & Performance](#seo--performance)
18. [Deployment Architecture](#deployment-architecture)
19. [Currency & Pricing](#currency--pricing)
20. [Security](#security)

---

## Architecture Overview

### Tech Stack Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                     │
│  Next.js App Router  │  Zustand Store  │  Tailwind CSS   │
│  React 19            │  localStorage   │  shadcn/ui      │
└──────────────┬───────────────┬──────────────────────────┘
               │               │
               ▼               ▼
┌──────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                         │
│  Server Components   │  Server Actions  │  API Routes     │
│  Middleware (Auth)    │  Prisma ORM      │  Webhooks       │
└──────┬────────┬──────────┬──────────┬───────────────────┘
       │        │          │          │
       ▼        ▼          ▼          ▼
   ┌──────┐ ┌──────┐ ┌─────────┐ ┌─────────┐
   │MySQL │ │Clerk │ │ Stripe  │ │PhonePe  │
   │ 8.0  │ │ Auth │ │  (GBP)  │ │  (INR)  │
   └──────┘ └──────┘ └─────────┘ └─────────┘
                        │             │
                   ┌────┴─────┐  ┌────┴─────┐
                   │Cloudinary│  │  Resend   │
                   │ (Images) │  │ (Emails)  │
                   └──────────┘  └──────────┘
```

### Key Design Decisions

| Decision | Choice | Why |
|---|---|---|
| Rendering | Server Components (default) | Better SEO, faster initial load, less JS shipped |
| Client state | Zustand + localStorage | Cart persists across sessions without a backend |
| Auth | Clerk (hosted) | No custom auth code, handles OAuth/MFA/sessions |
| Payments | Stripe + PhonePe redirect | PCI compliant without handling card data ourselves |
| Build output | Standalone | Deploy anywhere (VPS, Docker) - not locked to Vercel |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with pre-built accessible components |

---

## Page-by-Page Breakdown

### Homepage (`src/app/page.tsx`)

The landing page is a server component that renders:

1. **Hero Section** - Large banner with headline, subtext, and CTA button linking to `/products`
2. **Shop by Occasion** - Grid of 10 occasion cards (Birthday, Wedding, Anniversary, etc.) each linking to `/occasion/[slug]`
3. **Bestsellers** - Horizontal scroll of featured product cards
4. **Gift Finder CTA** - Call-to-action block for the gift finder quiz
5. **Why Choose Us** - Feature cards (handcrafted, fast delivery, secure payment, 5-star reviews)
6. **Trust Bar** - Payment icons, secure checkout badge, satisfaction guarantee

All data is currently from constants/placeholder. No database queries on homepage yet.

---

### Products Listing (`src/app/products/page.tsx`)

Displays all products in a grid with filtering UI:

- **Filter sidebar** (left): Category checkboxes, price range slider, occasion filter, "personalizable only" toggle
- **Product grid** (right): Cards showing image, name, price, "Add to Cart" button
- **Sort dropdown**: Price low-high, price high-low, newest, bestselling
- **Pagination**: Page navigation at bottom

Each product card (`src/components/product/product-card.tsx`) shows:
- Product image with hover effect
- Product name and truncated description
- Price (with compare-at price struck through if on sale)
- Star rating (from reviews)
- "Personalizable" badge if applicable
- Link to product detail page

---

### Product Detail (`src/app/products/[slug]/page.tsx`)

Full product page with:

1. **Image Gallery** - Primary image + thumbnail strip (click to switch)
2. **Product Info** - Name, price, rating, description
3. **Personalisation Section** (if `isPersonalizable` is true):
   - Text inputs (name, message, custom text)
   - Textarea for longer text (e.g., poem, recipe)
   - Image upload field
   - Colour picker from predefined colours
   - Font selector from predefined fonts
   - Dropdown selections
   - Toggle options
   - Each option can have a price modifier (surcharge)
4. **Quantity Selector** - Plus/minus buttons
5. **Add to Cart Button** - Adds item with all personalisation data to Zustand store
6. **Delivery Estimate** - Calculated based on `productionDays` field, skipping weekends
7. **Product Tabs** - Description, specifications, reviews
8. **Related Products** - Products from the same category

---

### Category Pages (`src/app/category/[slug]/page.tsx`)

- Uses `generateStaticParams` to pre-build pages for all 8 categories at build time
- Shows category name, description, and filtered product grid
- Categories: Mugs & Drinkware, Jewellery, Photo Gifts, Home & Living, Clothing & Accessories, Stationery, Keepsakes, Prints & Wall Art

### Occasion Pages (`src/app/occasion/[slug]/page.tsx`)

- Uses `generateStaticParams` to pre-build pages for all 10 occasions
- Shows occasion name and products tagged with that occasion
- Occasions: Birthday, Wedding, Anniversary, New Baby, Christmas, Graduation, Valentine's Day, Mother's Day, Father's Day, Thank You

---

### Cart Page (`src/app/cart/page.tsx`)

Displays the shopping cart from Zustand store:

- **Item list**: Image, name, personalisation summary, quantity adjuster, unit price, line total, remove button
- **Gift options**: "This is a gift" checkbox, gift message textarea, gift wrap toggle (+cost)
- **Order summary sidebar**: Subtotal, shipping (free over threshold), gift wrap cost, total
- **Continue to checkout** button
- **Empty cart state**: Message with "Continue Shopping" link

Cart data persists in `localStorage` via Zustand's `persist` middleware - survives page refreshes and browser restarts.

---

### Checkout Page (`src/app/checkout/page.tsx`)

Three-step checkout flow with step indicator:

**Step 1: Shipping Details**
- Form fields: Full Name, Email, Phone, Address Line 1 & 2, City, County, Postcode, Country
- Gift options: Checkbox for "This is a gift", gift message, gift wrap
- Validated with Zod schema via react-hook-form
- On submit, saves shipping data to state and advances to Step 2

**Step 2: Payment Method Selection**
- Two payment option cards:
  - **Card Payment (GBP)** - Uses Stripe Checkout Sessions
  - **UPI / PhonePe (INR)** - Uses PhonePe Standard Checkout
- When PhonePe is selected:
  - All prices in the order summary convert to INR
  - Info banner shows the conversion rate
  - Button text shows INR amount
- On "Pay" click:
  - **Stripe**: Calls `createCheckoutSession` server action -> redirects to Stripe hosted page
  - **PhonePe**: Calls `createPhonePeCheckoutSession` server action -> redirects to PhonePe PayPage

**Step 3: Confirmation** (shown after successful payment return)

---

### Checkout Success (`src/app/checkout/success/page.tsx`)

Post-Stripe-payment confirmation page:
- Green checkmark icon
- "Order Confirmed!" heading
- Order number and estimated delivery date
- Link to view order in account
- Link to continue shopping

### PhonePe Return (`src/app/checkout/phonepe-return/page.tsx`)

Post-PhonePe-payment page:
- Checks payment status via PhonePe Status API
- Updates order status if webhook hasn't already processed it
- **Success**: Shows confirmation with order number, transaction ID, delivery estimate
- **Failure**: Shows error message with retry and back-to-cart links

---

## Authentication System

### How Clerk Works

Clerk is a hosted authentication service. No auth logic is written in our codebase.

```
User clicks "Sign In"
        │
        ▼
Clerk UI Component renders (src/app/sign-in/[[...sign-in]]/page.tsx)
        │
        ▼
User enters email + password (or clicks Google/Apple/etc.)
        │
        ▼
Clerk handles verification, MFA, sessions
        │
        ▼
Clerk sets session cookie → user is authenticated
        │
        ▼
Clerk sends webhook to /api/webhooks/clerk
        │
        ▼
Webhook handler creates/updates User in our MySQL database
```

### Middleware (`src/middleware.ts`)

The middleware runs on every request and:
1. Checks if the Clerk publishable key is valid (not placeholder)
2. If valid, loads Clerk middleware to enforce auth on protected routes
3. Protected routes: `/account/*`, `/admin/*`
4. Public routes: everything else (homepage, products, cart, checkout)
5. If Clerk key is invalid/placeholder, middleware is a no-op (graceful fallback for development)

### User Roles

Two roles defined in the database:
- **CUSTOMER** (default) - Can browse, buy, review, manage wishlist/addresses
- **ADMIN** - Can access `/admin/*` dashboard to manage products, orders, customers

---

## Product Catalogue & Personalisation

### Product Model

Each product has:
- **Base info**: name, slug, description, base price, compare-at price (for sales)
- **Category**: One-to-one relation (e.g., "Mugs & Drinkware")
- **Occasions**: Many-to-many relation (e.g., a mug can be for "Birthday" + "Christmas")
- **Status**: DRAFT, ACTIVE, ARCHIVED
- **Flags**: `isPersonalizable`, `isFeatured`
- **Production**: `productionDays` (used for delivery estimate)
- **SEO**: `metaTitle`, `metaDescription`
- **Images**: Multiple images, one marked as primary
- **Variants**: Size/colour variants with own price, SKU, stock quantity

### Personalisation Options

Each personalizable product has one or more `PersonalizationOption` records:

| Type | Example | How It Works |
|---|---|---|
| TEXT | "Enter name" | Single-line text input, max length constraint |
| TEXTAREA | "Enter message" | Multi-line text input |
| IMAGE | "Upload photo" | File upload with accepted types + max size constraints |
| COLOUR | "Choose colour" | Colour picker from predefined swatches |
| FONT | "Select font" | Font dropdown with preview |
| DROPDOWN | "Choose size" | Select from predefined options |
| TOGGLE | "Add gift box" | On/off switch |

Each option can have:
- `priceModifier`: Additional cost (e.g., +2.00 for custom engraving)
- `isRequired`: Whether the customer must fill it in
- `constraints`: JSON field with validation rules (maxLength, acceptedTypes, maxFileSize, options list)

### Seeded Products (15 items)

| Product | Price | Category | Personalisation |
|---|---|---|---|
| Personalised Name Mug | 14.99 | Mugs | Text (name), Colour, Font |
| Engraved Heart Necklace | 29.99 | Jewellery | Text (name), Font |
| Custom Photo Cushion | 24.99 | Home & Living | Image, Text |
| Personalised Star Map Print | 19.99 | Prints | Text (date), Text (location), Colour |
| Custom Family Portrait | 34.99 | Prints | Textarea (family names), Dropdown (style) |
| Engraved Wooden Watch | 49.99 | Jewellery | Text (message) |
| Baby Name Blanket | 22.99 | Keepsakes | Text (name), Colour |
| Personalised Recipe Book | 18.99 | Stationery | Text (name), Text (title) |
| Custom Coordinates Bracelet | 24.99 | Jewellery | Text (coordinates), Font |
| Photo Memory Book | 27.99 | Photo Gifts | Image (multiple), Text |
| Personalised Wedding Print | 21.99 | Prints | Text (names), Text (date) |
| Engraved Whisky Glass Set | 32.99 | Mugs | Text (name), Font |
| Custom Pet Portrait Mug | 16.99 | Mugs | Image (pet photo), Text (pet name) |
| Personalised Map Print | 19.99 | Prints | Text (location), Colour |
| Name Rose Gold Pen | 12.99 | Stationery | Text (name), Font |

---

## Shopping Cart

### Zustand Store (`src/stores/cart-store.ts`)

The cart uses Zustand with `persist` middleware for localStorage persistence.

**State shape:**
```typescript
interface CartState {
  items: CartItem[]           // Array of cart items
  isGift: boolean             // Whether this order is a gift
  giftMessage: string         // Gift message text
  giftWrap: boolean           // Gift wrap option
  addItem: (item) => void     // Add item (increments qty if exists)
  removeItem: (id) => void    // Remove item by ID
  updateQuantity: (id, qty) => void  // Change quantity
  setGiftOptions: (...) => void      // Set gift preferences
  clearCart: () => void       // Empty the cart
  getSubtotal: () => number   // Calculate subtotal
  getItemCount: () => number  // Total items count
}
```

**CartItem shape:**
```typescript
interface CartItem {
  id: string                  // Unique ID (productId + variantId + personalisation hash)
  productId: number
  variantId?: number
  name: string
  price: number               // Unit price in GBP
  personalizationPrice: number // Extra cost from personalisation
  quantity: number
  imageUrl?: string
  personalizationData?: Record<string, unknown>  // The actual personalisation values
}
```

### How Cart Persistence Works

1. User adds item to cart -> Zustand updates state
2. `persist` middleware serialises state to `localStorage` under key `cart-storage`
3. User closes browser -> data stays in localStorage
4. User returns -> Zustand hydrates from localStorage on app load
5. No database or API calls needed for cart operations

### Pricing Rules

| Rule | Value |
|---|---|
| Standard shipping | 3.99 GBP |
| Free shipping threshold | 40.00 GBP |
| Gift wrap surcharge | 2.50 GBP |

---

## Checkout & Payment Flow

### Stripe Flow (GBP)

```
Customer clicks "Pay with Card"
        │
        ▼
Client calls createCheckoutSession() server action
        │
        ▼
Server action:
  1. Authenticates user via Clerk (optional, guest checkout OK)
  2. Fetches product prices from DB (never trusts client prices)
  3. Calculates personalisation surcharges
  4. Calculates shipping (free if subtotal >= 40)
  5. Calculates gift wrap cost
  6. Creates Order record in DB (status: PENDING)
  7. Creates Stripe Checkout Session with line items
  8. Stores stripeCheckoutSessionId on the Order
  9. Returns Stripe session URL
        │
        ▼
Client redirects to Stripe hosted payment page
        │
        ▼
Customer pays (card, Apple Pay, Google Pay, Klarna)
        │
        ▼
Stripe sends webhook to /api/webhooks/stripe
        │
        ▼
Webhook handler:
  - Verifies signature with STRIPE_WEBHOOK_SECRET
  - On checkout.session.completed: Updates order to PAID
  - On payment_intent.payment_failed: Updates order to CANCELLED
        │
        ▼
Stripe redirects customer to /checkout/success?session_id=xxx
```

### PhonePe Flow (INR)

```
Customer clicks "Pay with UPI"
        │
        ▼
Client calls createPhonePeCheckoutSession() server action
        │
        ▼
Server action:
  1. Authenticates user via Clerk (optional)
  2. Fetches product prices from DB
  3. Converts all prices to INR (GBP price * 105)
  4. Calculates shipping/gift wrap in INR
  5. Creates Order record in DB (status: PENDING, currency: INR, paymentMethod: phonepe)
  6. Generates merchant transaction ID
  7. Calls PhonePe Pay API:
     - Builds payload with amount (in paise), redirect URL, callback URL
     - Base64-encodes payload
     - Generates X-VERIFY checksum (SHA256 of payload + endpoint + salt key)
     - POST to PhonePe API
  8. Stores phonepeOrderId on the Order
  9. Returns PhonePe redirect URL
        │
        ▼
Client redirects to PhonePe PayPage
        │
        ▼
Customer pays via UPI / Card / Wallet / Net Banking
        │
        ▼
Two things happen in parallel:

  A) PhonePe sends server-to-server callback to /api/webhooks/phonepe
     - Decodes base64 response
     - On PAYMENT_SUCCESS: Updates order to PAID, stores transactionId
     - On failure: Updates order to CANCELLED

  B) PhonePe redirects customer to /checkout/phonepe-return?txnId=xxx
     - Page calls PhonePe Status API to verify payment
     - Updates order if webhook hasn't already
     - Shows success or failure page
```

### PhonePe Checksum Generation

PhonePe requires cryptographic verification for all API calls:

```
For Payment Creation (POST):
  checksum = SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex

For Status Check (GET):
  checksum = SHA256("/pg/v1/status/{merchantId}/{txnId}" + saltKey) + "###" + saltIndex
```

---

## Order Lifecycle

```
PENDING ──────────► PAID ──────────► PROCESSING ──────────► SHIPPED ──────────► DELIVERED
   │                                                            │
   │                                                            ▼
   └──► CANCELLED                                           REFUNDED
```

| Status | Description |
|---|---|
| PENDING | Order created, awaiting payment |
| PAID | Payment confirmed via webhook |
| PROCESSING | Admin has started fulfilling the order |
| SHIPPED | Order dispatched, tracking available |
| DELIVERED | Order received by customer |
| CANCELLED | Payment failed or order cancelled |
| REFUNDED | Money returned to customer |

### Fulfillment Status (per OrderItem)

Each item in an order has its own fulfillment tracking:

| Status | Description |
|---|---|
| PENDING | Not yet started |
| IN_PRODUCTION | Being crafted/personalised |
| QUALITY_CHECK | Being inspected |
| COMPLETE | Ready to ship |

---

## Admin Dashboard

### Dashboard Home (`/admin`)

Overview cards showing:
- Total orders, revenue, customers, products (placeholder stats)
- Recent orders table
- Revenue chart (using Recharts)

### Product Management (`/admin/products`)

- Table listing all products with: image, name, category, price, status, stock
- Status badges: ACTIVE (green), DRAFT (yellow), ARCHIVED (grey)
- "Add Product" button links to creation form

### New Product Form (`/admin/products/new`)

Multi-section form:
1. **Basic Info**: Name, slug (auto-generated), description
2. **Pricing**: Base price, compare-at price
3. **Category & Occasions**: Dropdowns for category and occasion tags
4. **Status**: Draft/Active/Archived
5. **Personalisation**: Toggle isPersonalizable, add personalisation options
6. **Images**: Upload product images (Cloudinary integration planned)
7. **Variants**: Add size/colour variants with individual pricing and stock
8. **SEO**: Meta title and description

### Order Management (`/admin/orders`)

- Table with: order number, customer, date, status, total, payment method
- Status filter tabs: All, Pending, Paid, Processing, Shipped
- Click through to order detail

### Order Detail (`/admin/orders/[id]`)

- Full order info: customer, addresses, payment details
- Line items with personalisation data and preview images
- Status update buttons (advance to next status)
- Fulfillment status per item
- Notes field for internal use

### Customer Management (`/admin/customers`)

- Table with: name, email, orders count, total spent, join date
- Search by name or email

---

## User Account

All account pages are protected by Clerk auth and use `force-dynamic` to avoid SSG issues.

### Account Overview (`/account`)

- Welcome message with user name
- Quick links to orders, wishlist, addresses
- Recent order summary

### Order History (`/account/orders`)

- List of all user's orders
- Each shows: order number, date, status badge, total, item count
- Click to view full order details

### Wishlist (`/account/wishlist`)

- Grid of saved products
- Remove from wishlist button
- "Add to Cart" button on each item
- Server action: `toggleWishlist(productId)` adds/removes

### Addresses (`/account/addresses`)

- List of saved shipping addresses
- Add new address form
- Edit/delete existing addresses
- Set default address toggle
- Server actions: `addAddress()`, `updateAddress()`, `deleteAddress()`

---

## Database Schema

### Entity Relationship Summary

```
User ──┬── Address (1:many)
       ├── Order (1:many) ── OrderItem (1:many) ── Product
       ├── Review (1:many) ── Product
       ├── Wishlist (1:many) ── Product
       └── OccasionReminder (1:many)

Product ──┬── Category (many:1)
          ├── ProductOccasion (many:many) ── Occasion
          ├── ProductImage (1:many)
          ├── ProductVariant (1:many)
          └── PersonalizationOption (1:many)

Coupon (standalone)
```

### ID Types

- User, Order, OrderItem, Address: `BigInt` (auto-increment)
- Product, Category, Occasion, etc.: `Int` (auto-increment)
- All string IDs (Clerk, Stripe, PhonePe): regular `String`

### Indexes

Every foreign key has an index. Additional indexes on:
- `Product.status` (filter queries)
- `Order.status` (filter queries)
- `Order.orderNumber` (lookup by order number)
- `Product(name, description)` full-text index for search

---

## Server Actions

### Checkout Actions

**`src/lib/actions/checkout.ts`** - `createCheckoutSession()`
- Creates Stripe Checkout Session
- Validates all prices server-side
- Creates Order + OrderItems in a single Prisma transaction
- Returns Stripe session URL

**`src/lib/actions/phonepe-checkout.ts`** - `createPhonePeCheckoutSession()`
- Same validation logic as Stripe checkout
- Converts prices to INR
- Creates Order with `paymentMethod: 'phonepe'`, `currency: 'INR'`
- Calls PhonePe API to get redirect URL

### Product Actions

**`src/lib/actions/products.ts`**
- `searchProducts(query)` - Full-text search on name + description
- `getProductsByCategory(slug)` - Products in a category
- `getProductsByOccasion(slug)` - Products for an occasion
- `getFeaturedProducts()` - Products where `isFeatured = true`

### User Actions

**`src/lib/actions/user.ts`**
- `getUserOrders()` - All orders for current user
- `toggleWishlist(productId)` - Add/remove from wishlist
- `getWishlist()` - Get user's wishlist items
- `addAddress(data)` - Create shipping address
- `updateAddress(id, data)` - Update address
- `deleteAddress(id)` - Delete address
- `setDefaultAddress(id)` - Set as default shipping address

---

## Webhook Handlers

### Stripe Webhook (`/api/webhooks/stripe`)

Handles two event types:

1. **`checkout.session.completed`**: Payment successful
   - Extracts `orderId` from session metadata
   - Updates order status to `PAID`
   - Stores `stripePaymentIntentId`

2. **`payment_intent.payment_failed`**: Payment failed
   - Updates order status to `CANCELLED`

Security: Verifies webhook signature using `STRIPE_WEBHOOK_SECRET` to prevent spoofing.

### PhonePe Webhook (`/api/webhooks/phonepe`)

Handles server-to-server callback:
1. Reads `X-VERIFY` header for checksum verification
2. Base64-decodes the response body
3. Looks up order by `merchantTransactionId`
4. On `PAYMENT_SUCCESS`: Updates to `PAID`, stores `transactionId`
5. On failure: Updates to `CANCELLED`

### Clerk Webhook (`/api/webhooks/clerk`)

Handles user sync events:
1. **`user.created`**: Creates a User record in MySQL with Clerk ID, email, name
2. **`user.updated`**: Updates the corresponding User record

---

## Styling & UI System

### Tailwind CSS v4

- Uses the new v4 configuration via `@tailwindcss/postcss`
- Custom colour palette: `warm-*` (50-950) for the warm, gift-shop feel
- Custom fonts:
  - **Headings**: Playfair Display (serif)
  - **Body**: Inter (sans-serif)

### shadcn/ui Components (56 total)

Pre-built, accessible components used throughout the site:

**Forms**: Button, Input, Textarea, Checkbox, Select, Radio Group, Label, Form (with react-hook-form), Calendar, OTP Input

**Layout**: Card, Separator, Tabs, Accordion, Scroll Area, Resizable Panels, Sidebar, Aspect Ratio

**Feedback**: Alert, Badge, Progress, Skeleton, Spinner, Sonner (Toasts)

**Overlays**: Dialog, Sheet, Drawer, Dropdown Menu, Context Menu, Popover, Tooltip, Hover Card, Command Palette

**Navigation**: Navigation Menu, Breadcrumb, Pagination, Menubar

**Data Display**: Table, Chart (Recharts), Avatar, Carousel

### Component Library Config (`components.json`)

```json
{
  "style": "new-york",
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## State Management

### Client-Side State

| State | Tool | Persistence |
|---|---|---|
| Cart items, gift options | Zustand | localStorage |
| Form data | react-hook-form | In-memory (per page) |
| Checkout step | React useState | In-memory (per page) |
| Payment method | React useState | In-memory (per page) |
| UI state (modals, menus) | React useState | None |

### Server-Side State

All persistent data lives in MySQL via Prisma:
- User profiles (synced from Clerk via webhook)
- Products, categories, occasions
- Orders and order items
- Reviews, wishlists, addresses
- Coupons

---

## Image Handling

### Current Setup

- Product images stored as URLs in `ProductImage` table
- Next.js `<Image>` component handles optimization (resize, WebP conversion, lazy loading)
- Remote image patterns configured in `next.config.ts`:
  - `res.cloudinary.com` (Cloudinary CDN)
  - `placehold.co` (placeholder images)
  - `img.clerk.com` (Clerk user avatars)
- `sharp` package installed for server-side image optimization

### Planned: Cloudinary Upload Widget

Configuration exists in `src/lib/cloudinary.ts` but the upload widget UI is not yet integrated. Will allow:
- Admin product image uploads
- Customer photo uploads for personalisation

---

## Email System

### Current Setup

- Resend client configured in `src/lib/resend.ts`
- `@react-email/components` installed for building email templates
- Email sending is referenced in webhook handlers but not yet fully wired

### Planned Emails

| Trigger | Email |
|---|---|
| Order paid | Order confirmation with items, total, delivery estimate |
| Order shipped | Shipping notification with tracking link |
| Order delivered | Delivery confirmation + review request |
| Account created | Welcome email |
| Password reset | Reset link (handled by Clerk) |

---

## SEO & Performance

### Static Generation

- Homepage: Pre-rendered at build time
- Category pages: Pre-rendered via `generateStaticParams` (8 pages)
- Occasion pages: Pre-rendered via `generateStaticParams` (10 pages)
- Product listing: Pre-rendered at build time

### Dynamic Pages

- Product detail: Server-rendered on demand (slug-based)
- Account pages: Server-rendered with auth (`force-dynamic`)
- Admin pages: Server-rendered with auth
- Checkout: Client-side rendered (requires cart state)

### Performance Optimizations

- **Standalone build output**: Minimal Node.js server, no unnecessary dependencies
- **Image optimization**: Next.js `<Image>` with automatic WebP, lazy loading
- **Font optimization**: `next/font` for Inter and Playfair Display (self-hosted, no layout shift)
- **Static asset caching**: Nginx configured with immutable cache headers for `/_next/static`
- **Bundle splitting**: Next.js automatic code splitting per route

---

## Deployment Architecture

```
Internet
   │
   ▼
┌─────────┐     ┌───────────────┐     ┌──────────────┐
│  Nginx  │────►│  Next.js App  │────►│  MySQL 8.0   │
│  :443   │     │  (PM2, :3000) │     │  :3306       │
│  SSL    │     │  Standalone   │     │  Local only   │
└─────────┘     └───────────────┘     └──────────────┘
```

- **Nginx**: Reverse proxy, SSL termination, static file caching
- **PM2**: Process manager with clustering (`-i max`), auto-restart, log management
- **Standalone build**: Self-contained Node.js server, ~50MB vs full `node_modules`
- **MySQL**: Runs locally on the same VPS, not exposed to internet

### Deployment Commands

```bash
git pull origin main
npm install
npx prisma migrate deploy
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart personalised-gifts
```

---

## Currency & Pricing

### Dual Currency Support

The platform supports two currencies:

| Currency | Payment Gateway | Use Case |
|---|---|---|
| GBP (British Pounds) | Stripe | UK/international card payments |
| INR (Indian Rupees) | PhonePe | Indian UPI, card, and wallet payments |

### Conversion

- All product prices are stored in GBP in the database
- INR prices are calculated at checkout: `GBP price * 105` (fixed rate)
- The conversion rate is a constant (`GBP_TO_INR_RATE = 105` in `constants.ts`)
- Orders store the final currency used (`currency` field on Order)

### Price Display

- Product pages always show GBP prices
- Checkout page shows INR when PhonePe is selected as payment method
- `formatPrice(amount, currency)` handles locale-aware formatting:
  - GBP: `£14.99`
  - INR: `₹1,574.00`

### INR Equivalents

| GBP | INR |
|---|---|
| Shipping: £3.99 | ₹419 |
| Free shipping: £40+ | ₹4,200+ |
| Gift wrap: £2.50 | ₹263 |

---

## Security

### Payment Security

- **No card data touches our server**: Both Stripe and PhonePe use redirect-based checkout
- **Server-side price validation**: All prices re-fetched from DB during checkout, never trusting client-sent values
- **Webhook verification**: Stripe uses signature verification (`stripe.webhooks.constructEvent`), PhonePe uses SHA256 checksum in X-VERIFY header

### Authentication Security

- **Clerk handles all auth**: No passwords stored in our DB, no custom auth code
- **Session management**: Clerk handles session tokens, CSRF protection, rate limiting
- **Route protection**: Middleware blocks unauthenticated access to `/account/*` and `/admin/*`

### Data Security

- **Prisma ORM**: Parameterized queries prevent SQL injection
- **Environment variables**: All secrets in `.env` (not committed to git)
- **MySQL local only**: Database not exposed to internet, only accessible from localhost

### Input Validation

- **Zod schemas**: All form data validated server-side with Zod
- **Type safety**: Full TypeScript coverage with strict mode
- **File uploads**: Cloudinary handles file validation (type, size limits)

---

## Feature Summary

| Feature | Status |
|---|---|
| Product browsing (categories, occasions, search) | Complete |
| Product personalisation (text, image, colour, font) | Complete (UI) |
| Shopping cart with persistence | Complete |
| Guest + authenticated checkout | Complete |
| Stripe card payments (GBP) | Complete |
| PhonePe UPI payments (INR) | Complete |
| Dual currency display | Complete |
| User accounts (orders, wishlist, addresses) | Complete |
| Admin dashboard | Complete (placeholder data) |
| Admin product management | Complete (UI, server actions pending) |
| Admin order management | Complete (UI, status updates pending) |
| Webhook-based order updates | Complete |
| Email notifications | Configured, templates pending |
| Fabric.js personalisation canvas | Planned (Phase 2) |
| Cloudinary upload widget | Planned |
| Gift finder quiz | Planned |
| Occasion reminders | Planned |
| Full-text product search | Action exists, UI pending |
| Coupon/discount system | Schema ready, logic pending |
