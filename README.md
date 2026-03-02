# PersonalisedGifts - E-Commerce Platform

A full-featured personalised gifts e-commerce website built with Next.js 15, MySQL 8.0, Prisma, Clerk Auth, Stripe payments, and Tailwind CSS.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MySQL 8.0 |
| ORM | Prisma |
| Auth | Clerk |
| Payments | Stripe |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Image CDN | Cloudinary |
| Email | Resend |
| Canvas | Fabric.js |
| Deployment | Standalone Node.js (Hostinger VPS) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard (products, orders, customers)
│   ├── account/            # User account (orders, wishlist, addresses)
│   ├── api/webhooks/       # Stripe & Clerk webhook handlers
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow + success page
│   ├── category/[slug]/    # Category pages
│   ├── occasion/[slug]/    # Occasion pages
│   ├── products/           # Product listing + detail pages
│   ├── sign-in/            # Clerk sign-in
│   ├── sign-up/            # Clerk sign-up
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── layout/             # Header, footer
│   ├── product/            # Product card
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── actions/            # Server actions (checkout, products, user)
│   ├── db.ts               # Prisma client
│   ├── stripe.ts           # Stripe server SDK
│   ├── stripe-client.ts    # Stripe client SDK
│   ├── cloudinary.ts       # Cloudinary config
│   ├── resend.ts           # Resend email client
│   ├── constants.ts        # Site constants
│   └── format.ts           # Formatting utilities
├── stores/
│   └── cart-store.ts       # Zustand cart store
└── middleware.ts           # Auth middleware
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data (15 products)
```

---

## Hostinger VPS Deployment Guide

### Prerequisites

- Hostinger VPS with Ubuntu 22.04+ (KVM plan recommended, minimum 2GB RAM)
- SSH access to your VPS
- A domain name pointed to your VPS IP address
- Accounts for: [Clerk](https://clerk.com), [Stripe](https://stripe.com), [Cloudinary](https://cloudinary.com), [Resend](https://resend.com)

---

### Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
```

---

### Step 2: Install System Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node -v   # Should show v20.x
npm -v    # Should show 10.x

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx

# Install Git
apt install -y git
```

---

### Step 3: Install MySQL 8.0

```bash
# Install MySQL
apt install -y mysql-server

# Secure MySQL
mysql_secure_installation
# Follow prompts: set root password, remove anonymous users, etc.

# Log in to MySQL
mysql -u root -p
```

Inside MySQL, create the database and user:

```sql
CREATE DATABASE personalised_gifts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pgifts'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON personalised_gifts.* TO 'pgifts'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 4: Clone and Set Up the Application

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone YOUR_REPO_URL personalised-gift
cd personalised-gift

# Install dependencies
npm install
```

---

### Step 5: Set Up Third-Party Services & API Keys

This project uses 4 external services. Here's what each one does, whether it's free, and exactly how to get the API keys.

#### API Services Overview

| Service | What It Does | Free Tier | Cost After Free Tier |
|---|---|---|---|
| **Clerk** | User sign-up, sign-in, session management, social login (Google, etc.) | 10,000 monthly active users | $25/mo for 10K+ MAU |
| **Stripe** | Accepts card payments, Apple Pay, Google Pay, Klarna (buy now pay later) | Free to set up, no monthly fee | 1.5% + 20p per UK card transaction |
| **Cloudinary** | Stores and serves product images and user-uploaded photos with auto-resize | 25 credits/mo (~25GB storage + 25GB bandwidth) | Pay-as-you-go from $89/mo |
| **Resend** | Sends transactional emails (order confirmation, shipping updates) | 3,000 emails/month, 100 emails/day | $20/mo for 50K emails |

> All 4 services have generous free tiers that are more than enough for development, testing, and early-stage launch.

---

#### 5a. Clerk (Authentication)

**What it does:** Handles all user authentication - sign-up, sign-in, password reset, social login (Google, Facebook, Apple), email verification, and session management. Users see a professional sign-in modal/page without you writing any auth code.

**How to get the keys:**

1. Go to [clerk.com](https://clerk.com) and click "Start building for free"
2. Sign up with your email or GitHub account
3. Create a new application - give it a name like "PersonalisedGifts"
4. Choose your sign-in methods (Email, Google, etc.)
5. Clerk will show you your API keys immediately:
   - On the dashboard home page, you'll see **"API Keys"** in the left sidebar
   - Or go directly to: **Dashboard > API Keys**
   - Copy the **Publishable key** (starts with `pk_test_` for dev or `pk_live_` for production)
   - Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)
6. For production, go to **Dashboard > Settings > Domains** and add your domain

**Keys needed:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

> Use `pk_test_` / `sk_test_` keys for development. Switch to `pk_live_` / `sk_live_` for production.

---

#### 5b. Stripe (Payments)

**What it does:** Processes all payments on the site. When a customer checks out, they're redirected to a Stripe-hosted payment page where they can pay by card, Apple Pay, Google Pay, or Klarna. Stripe handles all PCI compliance, fraud detection (Stripe Radar), and 3D Secure authentication. You receive money directly in your bank account.

**How to get the keys:**

1. Go to [stripe.com](https://stripe.com) and click "Start now"
2. Sign up with your email
3. You'll land on the Stripe Dashboard in **test mode** (toggle at the top says "Test mode")
4. Go to **Developers > API keys** (or visit [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys))
5. You'll see:
   - **Publishable key** (starts with `pk_test_`) - safe for frontend
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key" to see it. Keep this private!
6. For the **webhook secret** (needed in Step 11), you'll get this when you create a webhook endpoint later
7. To go live, complete Stripe's business verification (requires business details, bank account, ID)

**Keys needed:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx   (set this up in Step 11)
```

> Stripe charges **no monthly fees**. You only pay per transaction (1.5% + 20p for UK cards, 2.5% + 20p for EU cards, 3.25% + 20p for international). Payouts arrive in your bank account in 2-7 days.

---

#### 5c. Cloudinary (Image Storage & CDN)

**What it does:** Stores all product images and customer-uploaded photos (for personalisation). Automatically resizes images for different screen sizes, converts to modern formats (WebP/AVIF), and serves them from a global CDN so images load fast worldwide. Also handles image cropping and transformations.

**How to get the keys:**

1. Go to [cloudinary.com](https://cloudinary.com) and click "Sign Up for Free"
2. Sign up with email, Google, or GitHub
3. After signing up, you'll land on the **Dashboard**
4. Your keys are displayed right on the dashboard homepage:
   - **Cloud Name** (e.g., `dxyz1abc2`) - shown at the top
   - **API Key** (a number like `123456789012345`)
   - **API Secret** (click the eye icon to reveal it)
5. Or go to **Settings (gear icon) > API Keys**

**Keys needed:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

> Free tier includes 25 credits/month which translates to roughly 25GB storage + 25GB bandwidth. More than enough for a starting store with a few hundred products.

---

#### 5d. Resend (Transactional Emails)

**What it does:** Sends automated emails to customers - order confirmations, shipping notifications, delivery updates, and abandoned cart reminders. Unlike marketing email tools (Mailchimp), Resend is built for transactional emails triggered by user actions.

**How to get the keys:**

1. Go to [resend.com](https://resend.com) and click "Start building"
2. Sign up with email or GitHub
3. Go to **API Keys** in the left sidebar (or visit [resend.com/api-keys](https://resend.com/api-keys))
4. Click **"Create API Key"**
5. Give it a name (e.g., "PersonalisedGifts Production")
6. Choose permission: **"Sending access"** is sufficient
7. Copy the key (starts with `re_`) - it's only shown once!
8. **Important for production:** Go to **Domains** and add your domain, then add the DNS records Resend gives you (SPF, DKIM, DMARC). Without this, emails will be sent from `onboarding@resend.dev` (fine for testing).

**Keys needed:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

> Free tier: 3,000 emails/month, max 100/day. Paid plans start at $20/mo for 50,000 emails.

---

#### 5e. Create the .env File

Now that you have all your keys, create the environment file:

```bash
cp .env.example .env
nano .env
```

Fill in everything:

```env
# Database (from Step 3)
DATABASE_URL="mysql://pgifts:YOUR_STRONG_PASSWORD_HERE@localhost:3306/personalised_gifts"

# Clerk Authentication (from Step 5a)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe Payments (from Step 5b)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Cloudinary Images (from Step 5c)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend Emails (from Step 5d)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Your domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter` in nano).

---

### Step 6: Set Up the Database (Create Tables + Seed Data)

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate deploy

# Seed the database with sample data (15 products, categories, occasions)
npx prisma db seed
```

**Tables Created:**

| Table | Description |
|---|---|
| `User` | Customer and admin accounts (synced with Clerk) |
| `Address` | Saved shipping addresses |
| `Category` | Product categories (Mugs, Jewellery, Home Decor, etc.) |
| `Occasion` | Gift occasions (Birthday, Wedding, Christmas, etc.) |
| `Product` | Product catalogue with pricing, status, SEO fields |
| `ProductImage` | Product images (primary + gallery) |
| `ProductVariant` | Size/colour variants with SKU and stock |
| `PersonalizationOption` | Per-product personalisation config (text, image, font, colour) |
| `ProductOccasion` | Product-to-occasion mapping (many-to-many) |
| `Order` | Orders with Stripe integration, gift options, status tracking |
| `OrderItem` | Line items with personalisation data and preview snapshots |
| `Review` | Product reviews with ratings and photos |
| `Wishlist` | User wishlists |
| `OccasionReminder` | Date reminders for recurring occasions |
| `Coupon` | Discount codes (percentage or fixed) |

---

### Step 7: Build the Application

```bash
npm run build
```

This creates a production-optimised standalone build in `.next/standalone/`.

---

### Step 8: Start with PM2

```bash
# Copy static assets to standalone
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Start with PM2
pm2 start .next/standalone/server.js --name "personalised-gifts" \
  --env production \
  -i max

# Save PM2 config (auto-restart on reboot)
pm2 save
pm2 startup
```

Verify the app is running:

```bash
pm2 status
curl http://localhost:3000
```

---

### Step 9: Configure Nginx Reverse Proxy

```bash
nano /etc/nginx/sites-available/personalised-gifts
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files cache
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimisation cache
    location /_next/image {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    client_max_body_size 10M;
}
```

Enable the site and restart Nginx:

```bash
ln -s /etc/nginx/sites-available/personalised-gifts /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

### Step 10: Set Up SSL (HTTPS)

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts to get a free Let's Encrypt SSL certificate. Certbot will auto-configure Nginx for HTTPS.

Auto-renewal is set up automatically. Test it:

```bash
certbot renew --dry-run
```

---

### Step 11: Configure Stripe Webhooks

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy the webhook signing secret and update `.env`:

```bash
nano /var/www/personalised-gift/.env
# Update: STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Then rebuild and restart:

```bash
cd /var/www/personalised-gift
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart personalised-gifts
```

---

### Step 12: Configure Clerk Webhooks

1. Go to [Clerk Dashboard > Webhooks](https://dashboard.clerk.com/last-active?path=webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`

---

## Common Operations

### Updating the Application

```bash
cd /var/www/personalised-gift
git pull origin main
npm install
npx prisma migrate deploy
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart personalised-gifts
```

### Viewing Logs

```bash
pm2 logs personalised-gifts
pm2 logs personalised-gifts --lines 100
```

### Database Management

```bash
# Open Prisma Studio (visual DB browser)
npx prisma studio

# Run new migrations after schema changes
npx prisma migrate deploy

# Reset database (DESTRUCTIVE - drops all data)
npx prisma migrate reset
```

### PM2 Commands

```bash
pm2 status                        # Check status
pm2 restart personalised-gifts    # Restart app
pm2 stop personalised-gifts       # Stop app
pm2 delete personalised-gifts     # Remove from PM2
pm2 monit                         # Real-time monitoring
```

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Stripe Test Cards

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0027 6000 3184` | 3DS2 required |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date, any 3-digit CVC, and any postcode.
