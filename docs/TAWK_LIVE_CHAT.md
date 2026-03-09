# Tawk.to Live Chat Integration

## What is Tawk.to?

Tawk.to is a free live chat widget that lets you provide real-time customer support directly on your website. Customers see a chat bubble in the bottom-right corner and can send messages instantly. You respond from the Tawk.to dashboard or mobile app.

**Key features (all free):**
- Unlimited agents and chat history
- Customisable chat widget (colours, position, greeting)
- Visitor monitoring — see who's on your site in real-time
- Ticketing system for offline messages
- Knowledge base / help centre
- Mobile app (iOS & Android) for replying on the go
- Canned responses / shortcuts for common answers

---

## Setup — Step by Step

### Step 1: Create a Tawk.to Account
1. Go to [tawk.to](https://www.tawk.to) and click **Sign Up Free**
2. Enter your name, email, and password
3. Verify your email

### Step 2: Create a Property
1. After signing in, you'll be prompted to create a **Property**
2. Name it (e.g. `PersonalisedGifts`)
3. Enter your site URL: `https://gift.devops-monk.com`

### Step 3: Get Your Widget IDs
1. Go to **Administration** (gear icon) → **Channels** → **Chat Widget**
2. You'll see a script snippet containing a URL like:
   ```
   https://embed.tawk.to/69ae17cdb43ee91c/1jj80
                          ^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^
                          PROPERTY_ID               WIDGET_ID
   ```
3. Copy the two IDs from the URL

### Step 4: Add to `.env`
```env
NEXT_PUBLIC_TAWK_PROPERTY_ID=69ae17cdb43ee91c
NEXT_PUBLIC_TAWK_WIDGET_ID=1jj80
```

### Step 5: Deploy
```bash
npm run build
# Deploy to VPS as usual
```

The chat widget will appear automatically on all pages.

---

## How It's Integrated

### Component: `src/components/tawk-to.tsx`

A simple client component that loads the Tawk.to script using Next.js `<Script>` with `lazyOnload` strategy (loads after page is interactive — no impact on page load performance).

```tsx
"use client"
import Script from "next/script"

export function TawkTo() {
  // Loads https://embed.tawk.to/{PROPERTY_ID}/{WIDGET_ID}
  // Only renders if env vars are set
}
```

### Layout: `src/app/layout.tsx`

The `<TawkTo />` component is added to the root layout, so the chat widget appears on every page:

```tsx
<CookieConsent />
<TawkTo />
<Toaster />
```

---

## Customisation

All customisation is done in the Tawk.to dashboard — no code changes needed:

### Chat Widget Appearance
- **Administration** → **Chat Widget** → **Widget Appearance**
- Change colour to match your brand (e.g. rose/pink)
- Set position (bottom-right is default)
- Add your logo

### Greeting Message
- **Administration** → **Chat Widget** → **Content**
- Set a welcome message like: "Hi! Need help finding the perfect gift? We're here to help."

### Operating Hours
- **Administration** → **Chat Widget** → **Scheduler**
- Set your available hours
- Offline messages go to the ticketing system

### Canned Responses
- **Administration** → **Shortcuts**
- Create templates for common questions (shipping times, returns policy, etc.)

### Knowledge Base
- **Administration** → **Knowledge Base**
- Create help articles that customers can browse without chatting

---

## Managing Conversations

### Dashboard
- Go to [dashboard.tawk.to](https://dashboard.tawk.to) to see all active and past conversations

### Mobile App
- Download the Tawk.to app from App Store or Google Play
- Get push notifications for new customer messages
- Reply on the go

### Email Notifications
- By default, Tawk.to emails you when a customer sends a message while you're offline
- Configure in **Administration** → **Notifications**

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TAWK_PROPERTY_ID` | Your Tawk.to property ID (from the widget script URL) |
| `NEXT_PUBLIC_TAWK_WIDGET_ID` | Your Tawk.to widget ID (from the widget script URL) |

If either variable is missing or empty, the chat widget will not render (graceful fallback).

---

## Troubleshooting

### Chat widget not appearing
- Check that both `NEXT_PUBLIC_TAWK_PROPERTY_ID` and `NEXT_PUBLIC_TAWK_WIDGET_ID` are set in `.env`
- `NEXT_PUBLIC_` prefix is required — without it, the vars won't be available in the browser
- Rebuild after changing env vars (`npm run build`)

### Widget appears but no notifications
- Check **Administration** → **Notifications** in Tawk.to dashboard
- Download the mobile app for push notifications
- Check email spam folder for offline messages