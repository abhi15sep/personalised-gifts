# PersonalisedGifts - E-Commerce Platform

A full-featured personalised gifts e-commerce website built with Next.js 15, MySQL 8.0, Prisma, Clerk Auth, Stripe + PhonePe payments, and Tailwind CSS.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MySQL 8.0 |
| ORM | Prisma |
| Auth | Clerk |
| Payments (GBP) | Stripe Checkout |
| Payments (INR) | PhonePe (UPI, Cards, Wallets) |
| Styling | Tailwind CSS v4 + shadcn/ui |
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
│   ├── api/webhooks/       # Stripe, Clerk & PhonePe webhook handlers
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow + success + PhonePe return
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
│   └── ui/                 # shadcn/ui components (56 components)
├── lib/
│   ├── actions/            # Server actions (checkout, phonepe-checkout, products, user)
│   ├── db.ts               # Prisma client
│   ├── stripe.ts           # Stripe server SDK
│   ├── stripe-client.ts    # Stripe client SDK
│   ├── phonepe.ts          # PhonePe payment gateway helpers
│   ├── cloudinary.ts       # Cloudinary config
│   ├── resend.ts           # Resend email client
│   ├── constants.ts        # Site constants (GBP + INR)
│   └── format.ts           # Formatting utilities
├── stores/
│   └── cart-store.ts       # Zustand cart store
└── middleware.ts           # Auth middleware
prisma/
├── schema.prisma           # Database schema (15 tables)
└── seed.ts                 # Seed data (15 products)
```

---

## Hostinger VPS Deployment Guide

### Prerequisites

- Hostinger VPS with Ubuntu 22.04+ (KVM plan recommended, minimum 2GB RAM)
- SSH access to your VPS
- A domain name pointed to your VPS IP address
- Accounts for: [Clerk](https://clerk.com), [Stripe](https://stripe.com), [PhonePe Business](https://www.phonepe.com/business/), [Cloudinary](https://cloudinary.com), [Resend](https://resend.com)

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

This project uses 5 external services. Here's what each one does, whether it's free, and exactly how to get the API keys.

#### API Services Overview

| Service | What It Does | Free Tier | Cost After Free Tier |
|---|---|---|---|
| **Clerk** | User sign-up, sign-in, session management, social login | 10,000 monthly active users | $25/mo for 10K+ MAU |
| **Stripe** | Accepts card payments in GBP (Apple Pay, Google Pay, Klarna) | Free to set up, no monthly fee | 1.5% + 20p per UK card transaction |
| **PhonePe** | Accepts UPI, debit/credit cards, wallets in INR | Free to set up, no monthly fee | ~1.5-2% per transaction |
| **Cloudinary** | Stores and serves product images with auto-resize | 25 credits/mo (~25GB storage + 25GB bandwidth) | Pay-as-you-go from $89/mo |
| **Resend** | Sends transactional emails (order confirmation, shipping updates) | 3,000 emails/month, 100 emails/day | $20/mo for 50K emails |

> All services have generous free tiers that are more than enough for development, testing, and early-stage launch.

---

#### 5a. Clerk (Authentication)

**What it does:** Handles all user authentication - sign-up, sign-in, password reset, social login (Google, Facebook, Apple), email verification, and session management.

**How to get the keys:**

1. Go to [clerk.com](https://clerk.com) and click "Start building for free"
2. Sign up with your email or GitHub account
3. Create a new application - give it a name like "PersonalisedGifts"
4. Choose your sign-in methods (Email, Google, etc.)
5. Go to **Dashboard > API Keys**
   - Copy the **Publishable key** (starts with `pk_test_` for dev or `pk_live_` for production)
   - Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)

**Keys needed:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

---

#### 5b. Stripe (Card Payments - GBP)

**What it does:** Processes card payments in GBP. Customers are redirected to a Stripe-hosted payment page. Stripe handles PCI compliance, fraud detection (Radar), and 3D Secure.

**How to get the keys:**

1. Go to [stripe.com](https://stripe.com) and click "Start now"
2. Go to **Developers > API keys** ([dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys))
3. Copy the **Publishable key** (`pk_test_`) and **Secret key** (`sk_test_`)
4. The **webhook secret** is created in Step 11

**Keys needed:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

> Stripe charges **no monthly fees**. You only pay per transaction (1.5% + 20p for UK cards).

---

#### 5c. PhonePe (UPI Payments - INR)

**What it does:** Processes payments in INR via UPI, debit/credit cards, and wallets. Customers are redirected to PhonePe's payment page where they can pay using any UPI app (PhonePe, Google Pay, Paytm, etc.), cards, or net banking.

**How to get the keys:**

1. Go to [PhonePe Business](https://www.phonepe.com/business/) and sign up as a merchant
2. Complete KYC verification
3. Once approved, you'll get access to the merchant dashboard
4. Navigate to **Developer Settings > API Keys**
5. Copy the **Merchant ID**, **Salt Key**, and **Salt Index**
6. For testing, use PhonePe's **UAT (sandbox)** environment

**Keys needed:**
```
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=UAT
```

> Set `PHONEPE_ENV=PRODUCTION` when going live. UAT uses sandbox URLs for testing without real money.

**How PhonePe payment flow works:**
1. Customer selects "Pay with UPI (INR)" at checkout
2. Prices are converted from GBP to INR (at approximate rate of 1 GBP = 105 INR)
3. Server creates a payment order via PhonePe API and gets a redirect URL
4. Customer is redirected to PhonePe PayPage to complete payment
5. After payment, PhonePe redirects back to `/checkout/phonepe-return`
6. PhonePe also sends a server-to-server callback to `/api/webhooks/phonepe`
7. Order status is updated to PAID on success

---

#### 5d. Cloudinary (Image Storage & CDN)

**What it does:** Stores all product images. Automatically resizes, converts to modern formats (WebP/AVIF), and serves from a global CDN.

**How to get the keys:**

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. On the dashboard, copy **Cloud Name**, **API Key**, and **API Secret**

**Keys needed:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

#### 5e. Resend (Transactional Emails)

**What it does:** Sends automated emails - order confirmations, shipping notifications, delivery updates.

**How to get the keys:**

1. Go to [resend.com](https://resend.com) and sign up
2. Go to **API Keys** > **Create API Key**
3. Copy the key (starts with `re_`)
4. For production, add your domain under **Domains** and configure DNS records

**Keys needed:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

#### 5f. Create the .env File

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

# Stripe Payments - GBP (from Step 5b)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# PhonePe Payments - INR (from Step 5c)
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=PRODUCTION

# Cloudinary Images (from Step 5d)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend Emails (from Step 5e)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Your domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

### Step 6: Set Up the Database

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
| `Order` | Orders with Stripe/PhonePe integration, gift options, status tracking |
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

### Step 10: Set Up Domain with Porkbun (DNS)

This guide uses Porkbun as the domain registrar with a subdomain setup (e.g., `gift.devops-monk.com`). Adjust the domain/subdomain to your own.

#### 10a. Add DNS Records in Porkbun

1. Log in to [porkbun.com](https://porkbun.com)
2. Go to **Domain Management** > click your domain (e.g., `devops-monk.com`) > **DNS Records**
3. Add these two records:

| Type | Host | Answer | TTL |
|---|---|---|---|
| A | *(leave blank or `@`)* | `YOUR_VPS_IP_ADDRESS` | 600 |
| CNAME | `gift` | `devops-monk.com` | 600 |

> The A record points your root domain to the VPS IP. The CNAME record makes `gift.devops-monk.com` an alias for the root domain. If you already have an A record for the root domain, just add the CNAME.

#### 10b. Verify DNS Propagation (on VPS)

Wait a few minutes after adding records, then verify:

```bash
dig gift.devops-monk.com +short
```

This should return your VPS IP address. If it's empty, wait a few more minutes and try again. You can also check propagation at [dnschecker.org](https://dnschecker.org).

#### 10c. Update Nginx Config

Update the `server_name` in your Nginx config to match your subdomain:

```bash
nano /etc/nginx/sites-available/personalised-gifts
```

Change the `server_name` line to:

```nginx
server_name gift.devops-monk.com;
```

Test and reload:

```bash
nginx -t
systemctl reload nginx
```

#### 10d. Verify HTTP Access

At this point the site should be accessible via HTTP:

```bash
curl -I http://gift.devops-monk.com
```

You should see a `200 OK` response.

---

### Step 11: Set Up SSL (HTTPS)

```bash
certbot --nginx -d gift.devops-monk.com
```

Follow the prompts:
1. Enter your email address
2. Agree to terms of service
3. Certbot will auto-configure HTTPS in your Nginx config

Auto-renewal test:

```bash
certbot renew --dry-run
```

> Certbot auto-renews certificates via a systemd timer. No manual renewal needed. Certificates are valid for 90 days and renew automatically 30 days before expiry.

Verify HTTPS is working:

```bash
curl -I https://gift.devops-monk.com
```

---

### Step 12: Update .env with Domain

```bash
nano /var/www/personalised-gift/.env
```

Update these two values:

```env
NEXT_PUBLIC_BASE_URL=https://gift.devops-monk.com
NEXT_PUBLIC_APP_URL=https://gift.devops-monk.com
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

### Step 13: Configure Webhooks

Now that your domain is live with HTTPS, set up webhook endpoints for each service.

#### Stripe Webhooks

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL to: `https://gift.devops-monk.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy the webhook signing secret and update `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

#### Clerk Webhooks

1. Go to [Clerk Dashboard > Webhooks](https://dashboard.clerk.com/last-active?path=webhooks)
2. Add endpoint: `https://gift.devops-monk.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`
4. Also go to **Clerk Dashboard > Settings > Domains** and add `gift.devops-monk.com`

#### PhonePe Callback

PhonePe's server-to-server callback is configured automatically via the `callbackUrl` parameter when creating a payment. It uses `NEXT_PUBLIC_BASE_URL` from your `.env`, so it will automatically point to `https://gift.devops-monk.com/api/webhooks/phonepe`. No manual webhook setup is needed.

#### After updating webhook secrets, rebuild:

```bash
cd /var/www/personalised-gift
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart personalised-gifts
```

---

### Using a Different Domain/Subdomain

To use a different domain or subdomain, replace `gift.devops-monk.com` in all the steps above:

| Where | What to Change |
|---|---|
| Porkbun DNS | Add A record for root + CNAME for subdomain |
| Nginx config | `server_name your-subdomain.yourdomain.com;` |
| Certbot | `certbot --nginx -d your-subdomain.yourdomain.com` |
| `.env` | `NEXT_PUBLIC_BASE_URL=https://your-subdomain.yourdomain.com` |
| Stripe webhook | Update endpoint URL |
| Clerk webhook | Update endpoint URL + add domain |

---

## VPS: First-Time Setup (Fresh Database)

If this is your first time deploying or you have a fresh/empty database, run these steps in order on your VPS:

```bash
cd /var/www/personalised-gift

# Step 1: Install dependencies
npm install

# Step 2: Generate Prisma client
npx prisma generate

# Step 3: Create all database tables from schema
npx prisma db push

# Step 4: Seed the database with sample data (15 products, categories, occasions)
npx prisma db seed

# Step 5: Build the app
npm run build

# Step 6: Copy static assets to standalone build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Step 7: Start the app with PM2 (first time)
pm2 start .next/standalone/server.js --name "personalised-gifts" -i max

# Step 8: Save PM2 config so it auto-restarts on VPS reboot
pm2 save
pm2 startup
```

Verify everything is running:

```bash
pm2 status                  # Should show "personalised-gifts" as online
curl http://localhost:3000   # Should return HTML
```

> **Note:** `npx prisma db push` creates tables directly from the schema without migration files. This is fine for the initial setup. For all future schema changes, use the migration workflow below.

---

## VPS: Deploying Schema Changes (Migrations)

When you change `prisma/schema.prisma` (e.g., adding new fields or tables), follow this two-part workflow:

### Part A: On your local dev machine

```bash
# 1. Make your schema changes in prisma/schema.prisma

# 2. Create a migration file (this needs shadow DB access, only works locally)
npx prisma migrate dev --name describe-your-change

# 3. Commit the new migration files to git
git add prisma/migrations
git commit -m "Add migration: describe-your-change"
git push origin main
```

This creates a SQL migration file in `prisma/migrations/` that can be replayed on any database.

### Part B: On the VPS

```bash
cd /var/www/personalised-gift

# 1. Pull the latest code (includes new migration files)
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Apply pending migrations to the database
npx prisma migrate deploy

# 4. Regenerate Prisma client (picks up schema changes)
npx prisma generate

# 5. Build the app
npm run build

# 6. Copy static assets
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 7. Restart the app
pm2 restart personalised-gifts
```

> **Important:** Always use `migrate deploy` on the VPS, never `migrate dev`. The `dev` command needs shadow DB permissions and is meant for local development only.

---

## VPS: Deploying Code Changes (No Schema Changes)

For code-only changes (UI, server actions, bug fixes) where the database schema hasn't changed:

```bash
cd /var/www/personalised-gift

# 1. Pull latest code
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Build the app
npm run build

# 4. Copy static assets
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 5. Restart
pm2 restart personalised-gifts
```

---

## VPS: Resetting the Database (Start Fresh)

If you need to wipe everything and start over:

```bash
cd /var/www/personalised-gift

# 1. Drop and recreate all tables
npx prisma db push --force-reset

# 2. Re-seed with sample data
npx prisma db seed

# 3. Rebuild and restart
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart personalised-gifts
```

> **Warning:** This deletes ALL data (orders, users, products). Only use in development/staging.

---

## Common Operations

### Viewing Logs

```bash
pm2 logs personalised-gifts             # Live log stream
pm2 logs personalised-gifts --lines 100  # Last 100 lines
pm2 logs personalised-gifts --err        # Errors only
```

### Database Management

```bash
# Open Prisma Studio (visual DB browser - runs on port 5555)
npx prisma studio

# Check migration status
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy

# Reset database (DESTRUCTIVE - drops all data and re-seeds)
npx prisma migrate reset
```

### PM2 Commands

```bash
pm2 status                        # Check app status
pm2 restart personalised-gifts    # Restart app
pm2 stop personalised-gifts       # Stop app
pm2 delete personalised-gifts     # Remove from PM2
pm2 monit                         # Real-time CPU/memory monitoring
pm2 logs personalised-gifts       # View logs
```

### Quick Reference: Which Prisma Command to Use

| Scenario | Command | Where to Run |
|---|---|---|
| First-time setup (no migrations exist) | `npx prisma db push` | VPS |
| Create a new migration | `npx prisma migrate dev --name name` | Local only |
| Apply existing migrations | `npx prisma migrate deploy` | VPS |
| Seed sample data | `npx prisma db seed` | VPS or Local |
| Wipe and recreate tables | `npx prisma db push --force-reset` | VPS (careful!) |
| Browse data visually | `npx prisma studio` | VPS or Local |
| Regenerate client after schema change | `npx prisma generate` | VPS or Local |

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

# Run database migrations (creates tables + shadow DB)
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Test Credentials

### Stripe Test Cards

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0027 6000 3184` | 3DS2 required |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date, any 3-digit CVC, and any postcode.

### PhonePe UAT Testing

When `PHONEPE_ENV=UAT`, payments use PhonePe's sandbox environment. No real money is charged. The PhonePe test page will simulate various payment outcomes (success, failure, pending).
