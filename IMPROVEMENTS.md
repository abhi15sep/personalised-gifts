# PersonalisedGifts - Improvement Roadmap

> Analysis based on competitor research (NOTHS, Funky Pigeon, Make Memento, Snapfish, Keep It Personal) and a full audit of the current codebase.
>
> Live site: https://gift.devops-monk.com/

---

## Table of Contents

1. [Critical Fixes (Broken Features)](#1-critical-fixes---broken-features)
2. [Core UX Improvements](#2-core-ux-improvements)
3. [Product Discovery & Filtering](#3-product-discovery--filtering)
4. [Personalisation Engine](#4-personalisation-engine)
5. [Trust & Conversion](#5-trust--conversion)
6. [SEO & Performance](#6-seo--performance)
7. [Admin Dashboard](#7-admin-dashboard)
8. [Marketing & Growth](#8-marketing--growth)
9. [Advanced Features](#9-advanced-features)
10. [Priority Matrix](#10-priority-matrix)

---

## 1. Critical Fixes - Broken Features

~~These are features that exist in the UI but **do not work at all**. Must be fixed first.~~

**STATUS: COMPLETED** - All critical fixes shipped. Details below.

### 1.1 ~~Product Detail Pages Show Same Product for Every Slug~~ FIXED
- `src/app/products/[slug]/page.tsx` now calls `getProductBySlug(slug)` with `notFound()` fallback
- Displays real images, reviews, personalisation options, variants, related products from DB
- Added `generateMetadata` for SEO

### 1.2 ~~Category Pages Show Hardcoded Products~~ FIXED
- `src/app/category/[slug]/page.tsx` calls `getProducts({ categorySlug })` with real data
- Uses shared `ProductCard` component, shows product count

### 1.3 ~~Occasion Pages Show Hardcoded Products~~ FIXED
- `src/app/occasion/[slug]/page.tsx` calls `getProductsByOccasion(slug)` with real data
- Uses shared `ProductCard` component, keeps hero banner

### 1.4 ~~All Product Filters Are Non-Functional~~ FIXED
- New `src/components/product/product-filters.tsx` client component
- URL search params-based filtering (category, occasion, price range)
- Server-side data fetching with `getProducts()` enhanced with `categorySlug`, `priceMin`, `priceMax`

### 1.5 ~~Sort Dropdown Does Nothing~~ FIXED
- New `src/components/product/sort-select.tsx` client component
- Updates URL params and triggers server re-fetch

### 1.6 ~~Pagination Links Are All `href="#"`~~ FIXED
- Real pagination in `src/app/products/page.tsx` based on `totalPages` from server action
- URL param-based page navigation preserving all other filters

### 1.7 ~~Search Is Not Connected~~ FIXED
- Desktop + mobile search forms in site-header navigate to `/products?search=term`
- Products page reads `search` param and passes to `getProducts()`

### 1.8 Gift Finder Query Params Ignored
- **Status: Partially fixed** - Products page now reads `searchParams` but Gift Finder links still use `?recipient=` which isn't a supported filter yet
- **Remaining:** Add recipient-based filtering to `getProducts()` or map Gift Finder links to category/occasion params

### 1.9 ~~Cart-to-Checkout Personalisation Data Lost~~ FIXED
- `src/app/checkout/page.tsx` now reads `item.personalization` (matching cart store field name)

### 1.10 ~~Wishlist Button Has No Handler~~ FIXED
- `src/components/product/add-to-cart.tsx` now calls `toggleWishlist` server action
- Shows loading spinner, toggles heart icon, redirects to sign-in if unauthenticated

### Additional improvements shipped with Phase 1:
- **Shared ProductCard component** (`src/components/product/product-card.tsx`) - used across products, category, occasion pages; falls back to `PRODUCT_IMAGES` constants when no DB images
- **DB-based personalisation options** in AddToCart - dynamically renders TEXT, TEXTAREA, FONT, COLOUR, DROPDOWN inputs from product's `personalizationOptions`; calculates price modifiers
- **New server actions:** `getCategories()`, `getOccasions()` fetch real data from DB
- **`searchProducts()`** updated to use `contains` instead of fulltext search for broader compatibility
- **README** updated with Quick Start section

---

## 2. Core UX Improvements

Things that professional competitors all do well.

### 2.1 Sticky Header with Smart Hide/Show
- Header stays visible on scroll up, hides on scroll down
- Cart icon shows item count badge at all times
- Competitors: All major sites do this

### 2.2 Breadcrumb Navigation
- Every page should show: Home > Category > Product
- Helps users navigate back and improves SEO
- Competitors: NOTHS uses breadcrumbs on every page

### 2.3 Quick View Modal
- Hover/click on product card opens a modal with key details + "Add to Cart"
- Saves users from navigating away from listing pages
- Competitors: NOTHS, Funky Pigeon

### 2.4 Responsive Image Gallery on Product Pages
- Multiple product images with thumbnail strip
- Zoom on hover/pinch on mobile
- Show personalised preview as one of the images

### 2.5 Recently Viewed Products
- Show a "Recently Viewed" section on product pages and homepage
- Store in localStorage, display as horizontal carousel
- Competitors: All major sites

### 2.6 Better Mobile Navigation
- Bottom navigation bar on mobile (Home, Search, Cart, Account)
- Swipeable product image galleries
- Full-screen mobile filter drawer

### 2.7 Loading States & Skeletons
- Add skeleton loading cards for product grids
- Shimmer effect while data loads
- Competitors: NOTHS uses skeleton loading

---

## 3. Product Discovery & Filtering

The single biggest gap vs competitors. Professional sites live or die by filtering.

### 3.1 URL-Based Filtering System
```
/products?category=mugs&occasion=birthday&priceMin=10&priceMax=30&sort=price-asc&page=2
```
- All filter state lives in URL (shareable, back-button friendly)
- Server-side filtering with Prisma `where` clauses
- Instant filter updates with `useRouter` + `useSearchParams`

### 3.2 Faceted Filter Sidebar
- **Category** - checkboxes with product counts (e.g., "Mugs (12)")
- **Occasion** - checkboxes with counts
- **Price Range** - slider or predefined ranges (Under £10, £10-£25, £25-£50, £50+)
- **Personalisation Type** - Engraved, Printed, Embroidered
- **Rating** - star filter
- **Delivery** - "Next Day Available" toggle
- **Clear All / Clear Individual** filters
- Competitors: NOTHS has 12+ filter types

### 3.3 Active Filter Chips
- Show selected filters as removable chips above the product grid
- "Showing 24 of 156 results" count
- One-click "Clear All"

### 3.4 Sort Options
- Newest, Price Low-High, Price High-Low, Best Selling, Top Rated, Relevance
- Competitors: All sites offer 4-6 sort options

### 3.5 Smart Search with Autocomplete
- Debounced search input with dropdown suggestions
- Show product thumbnails + prices in suggestions
- "No results" state with alternative suggestions
- Search results page with filters
- Competitors: Make Memento uses Searchanise; NOTHS has full autocomplete

### 3.6 Gift Finder Quiz (Functional)
- Multi-step form: Recipient > Occasion > Budget > Interests
- Show personalised results based on answers
- "Start Over" option
- Competitors: Unique differentiator - most competitors don't have this

---

## 4. Personalisation Engine

This is the core value proposition. Currently it's just text inputs.

### 4.1 Live Preview Canvas (Fabric.js)
- Real-time preview showing text/images on the product
- Drag, resize, rotate text and uploaded images
- Font picker (10-15 curated fonts)
- Colour picker for text
- Competitors: Snapfish, Funky Pigeon both have live preview

### 4.2 Photo Upload & Cropping
- Drag-and-drop photo upload
- Built-in crop/rotate tool
- Image quality checker ("Image too small for best results")
- Multiple photo slots for collage products
- Cloudinary integration for storage
- Competitors: Snapfish is market leader here

### 4.3 Text Personalisation Options
- Character limit display with counter
- Multiple text fields (Line 1: Name, Line 2: Message)
- Font preview before selection
- Case formatting options (UPPERCASE, Title Case)

### 4.4 Personalisation Preview in Cart
- Show thumbnail of personalised product in cart
- Display personalisation details (text entered, photo used)
- Allow editing personalisation from cart

---

## 5. Trust & Conversion

What makes visitors actually buy.

### 5.1 Customer Reviews & Ratings
- Star ratings on product cards and detail pages
- Written reviews with photos
- "Verified Purchase" badges
- Review summary (4.8/5 from 234 reviews)
- Competitors: NOTHS, Make Memento (Stamped.io)

### 5.2 Payment Method Badges
- Show Visa, Mastercard, Apple Pay, PayPal, Klarna logos in footer
- "Secure Checkout" badge with lock icon
- Competitors: Funky Pigeon shows 6 payment logos

### 5.3 Delivery Information
- "Order by 2pm for Next Day Delivery" banner
- Delivery countdown timer on product pages
- Clear delivery pricing table
- Royal Mail / DPD tracking integration
- Competitors: Keep It Personal offers next-day delivery

### 5.4 Social Proof
- "X people are viewing this" (real or estimated)
- "Sold X times in the last 30 days"
- Trustpilot widget integration
- Competitors: Funky Pigeon uses Trustpilot

### 5.5 Buy Now, Pay Later
- Klarna or Clearpay integration
- "Pay in 3 instalments of £X.XX" on product pages
- Competitors: Funky Pigeon offers Klarna + Clearpay

### 5.6 Guest Checkout
- Don't force account creation to buy
- Offer account creation after purchase
- Competitors: Industry standard

### 5.7 Abandoned Cart Recovery
- Email reminder for items left in cart (via Resend)
- "Still thinking about it?" with product image
- Optional discount code after 24 hours

---

## 6. SEO & Performance

### 6.1 Structured Data (Schema.org)
- `Product` schema with price, availability, reviews
- `BreadcrumbList` schema
- `Organization` schema
- `FAQPage` schema on help pages
- Competitors: NOTHS uses extensive schema markup

### 6.2 Meta Tags & Open Graph
- Unique title/description per page
- Open Graph images for social sharing
- Twitter Card meta tags
- Canonical URLs

### 6.3 Sitemap & Robots
- Dynamic XML sitemap from product/category/occasion data
- Proper robots.txt
- Submit to Google Search Console

### 6.4 Image Optimisation
- WebP format with fallback
- Proper `alt` tags on all images
- Lazy loading below the fold
- Next.js Image component with proper `sizes` attribute

### 6.5 Core Web Vitals
- Minimise Largest Contentful Paint (LCP) - optimise hero image
- Reduce Cumulative Layout Shift (CLS) - set image dimensions
- Improve First Input Delay (FID) - minimise JS bundles

---

## 7. Admin Dashboard

Currently uses hardcoded data. Needs to be functional.

### 7.1 Product CRUD
- Create, edit, delete products from admin UI
- Image upload to Cloudinary
- Manage personalisation options per product
- Bulk actions (enable/disable, delete)
- Stock management

### 7.2 Order Management
- View all orders with status filters
- Update order status (Processing, Shipped, Delivered)
- View personalisation details per order
- Print packing slips / invoices
- Refund handling

### 7.3 Category & Occasion Management
- CRUD for categories and occasions
- Assign products to categories/occasions
- Reorder display priority

### 7.4 Analytics Dashboard
- Revenue chart (daily/weekly/monthly)
- Top selling products
- Conversion rate
- Average order value
- Competitors: Basic but essential for any e-commerce

### 7.5 Customer Management
- View customer list with order history
- Customer segments
- Export customer data (GDPR compliance)

---

## 8. Marketing & Growth

### 8.1 Discount Codes & Promotions
- Percentage or fixed amount discounts
- Minimum order value requirements
- Expiry dates
- Usage limits
- Auto-apply for specific campaigns

### 8.2 Email Marketing Integration
- Welcome email on signup
- Order confirmation with personalisation details
- Shipping confirmation with tracking link
- Review request after delivery
- Occasion reminders ("John's birthday is in 7 days!")
- Newsletter with new products
- Competitors: Funky Pigeon has comprehensive email flows

### 8.3 Cross-Selling & Upselling
- "Pair it with a Card!" on product pages (like Funky Pigeon)
- "Customers also bought" section
- Gift wrapping upsell in cart
- Bundle deals ("Mug + Coaster Set - Save 15%")

### 8.4 Loyalty / VIP Programme
- Points per purchase
- Birthday discount
- Early access to new products
- Competitors: Funky Pigeon has "Funky VIP"

### 8.5 Referral Programme
- "Give £5, Get £5" referral link
- Shareable discount codes

### 8.6 Social Media Integration
- Instagram feed on homepage
- "Share this product" buttons
- Pinterest "Pin it" on product images
- User-generated content gallery

---

## 9. Advanced Features (Phase 2+)

### 9.1 Corporate / Bulk Orders
- Bulk pricing tiers
- CSV upload for personalisation (100 mugs with different names)
- Invoice payment for businesses
- Competitors: Funky Pigeon offers bulk pricing

### 9.2 Gift Cards
- Digital gift cards (email delivery)
- Physical gift cards
- Balance checking
- Competitors: Industry standard

### 9.3 Occasion Reminder System
- Users save important dates
- Email/push notification reminders
- Suggested gifts based on occasion and past purchases

### 9.4 Subscription Gifts
- Monthly gift box subscription
- Recurring personalised gifts (e.g., monthly photo calendar page)

### 9.5 Mobile App (PWA)
- Progressive Web App for app-like experience
- Push notifications for offers and reminders
- Offline cart viewing
- Competitors: Funky Pigeon has iOS/Android apps

### 9.6 Multi-Currency Support
- Auto-detect location, show local currency
- GBP primary, EUR and USD secondary
- Competitors: Most UK sites are GBP only, this is a differentiator

### 9.7 AI-Powered Features
- Gift recommendation engine based on browsing history
- AI-generated personalisation suggestions
- Smart search with natural language ("blue mug for dad's 60th")

---

## 10. Priority Matrix

### Phase 1: Fix What's Broken - COMPLETED
| Task | Status |
|------|--------|
| Wire product detail to real data | Done |
| Wire category/occasion pages to real data | Done |
| Fix product filters (URL params + server fetch) | Done |
| Fix search functionality | Done |
| Fix cart-to-checkout data mismatch | Done |
| Fix pagination | Done |
| Fix sort dropdown | Done |
| Fix wishlist button | Done |
| DB-based personalisation options in AddToCart | Done |
| Shared ProductCard component | Done |
| Fix gift finder query params | Partial - needs recipient filter |

### Phase 2: Core Professional Features (Week 3-5)
| Task | Impact | Effort |
|------|--------|--------|
| Breadcrumbs on all pages | High | Low |
| Active filter chips | High | Low |
| Loading skeletons | High | Low |
| Product image gallery (multi-image) | High | Medium |
| Customer reviews system | High | Medium |
| Delivery countdown timer | Medium | Low |
| Recently viewed products | Medium | Low |
| Quick view modal | Medium | Medium |
| Payment method badges | Medium | Low |
| Structured data (Schema.org) | Medium | Low |

### Phase 3: Personalisation & Conversion (Week 6-8)
| Task | Impact | Effort |
|------|--------|--------|
| Fabric.js live preview canvas | Critical | High |
| Photo upload with cropping | High | Medium |
| Personalisation preview in cart | High | Medium |
| Wishlist functionality | Medium | Low |
| Guest checkout | High | Medium |
| Cross-selling ("Pair with a card") | Medium | Medium |
| Abandoned cart emails | High | Medium |
| Discount codes system | High | Medium |

### Phase 4: Admin & Marketing (Week 9-12)
| Task | Impact | Effort |
|------|--------|--------|
| Admin product CRUD (real) | Critical | Medium |
| Admin order management | Critical | Medium |
| Email flows (Resend templates) | High | Medium |
| Analytics dashboard | Medium | Medium |
| Social proof elements | Medium | Low |
| Gift finder quiz logic | Medium | Medium |
| Occasion reminder system | Medium | High |
| Corporate/bulk orders | Medium | High |
| Gift cards | Medium | Medium |

---

## Competitor Feature Comparison

| Feature | Your Site | NOTHS | Funky Pigeon | Make Memento | IGP |
|---------|-----------|-------|--------------|--------------|-----|
| Working filters | Yes | Yes | Yes | Yes | Yes |
| Search with autocomplete | Basic (no autocomplete) | Yes | Yes | Yes | Yes |
| Live personalisation preview | No | Partial | Yes | No | Yes (photo cakes) |
| Customer reviews | No | Yes | Yes (Trustpilot) | Yes (Stamped.io) | Yes |
| Multiple payment methods | Stripe only | Many | 6+ (inc Klarna) | Shopify Payments | Many |
| Breadcrumbs | Yes | Yes | Yes | Yes | Yes |
| Structured data | No | Yes | Yes | Yes | Yes |
| Email marketing flows | No | Yes | Yes | Yes | Yes |
| Mobile app | No | Yes | Yes (iOS/Android) | No | Yes |
| Gift cards | No | Yes | Yes | No | Yes (e-gift) |
| Bulk/corporate orders | No | No | Yes | No | Yes |
| Gift finder quiz | UI only | No | No | No | Personality-based |
| Occasion reminders | No | No | No | No | Yes |
| Same-day delivery badges | No | No | No | No | Yes |
| Multi-currency | No | No | No | No | Yes (9 currencies) |
| Loyalty/membership | No | No | Funky VIP | No | IGP Select |
| Gift hamper builder | No | No | No | No | Yes |
| Delivery date picker | No | No | No | No | Yes |
| International shipping | No | No | No | No | Yes (100+ countries) |

---

## 11. Inspired by IGP.com - Additional Feature Ideas

IGP.com ([igp.com](https://www.igp.com/)) is a discovery-based gift platform with several unique features worth adopting:

### 11.1 Personality-Based Gift Recommendations
- Categorise gifts by recipient personality: Romantic, Geek, Creative, Fashionable, Fitness Lover
- Add personality tags to products in the DB
- Show "Gifts for the Creative Type" collections
- Integrate into the Gift Finder quiz

### 11.2 Same-Day / Express Delivery Badges
- "60-Min Delivery" and "Same Day" badges on eligible products
- Delivery countdown timer: "Order in the next 2h 15m for same-day delivery"
- Midnight delivery option for special occasions
- Prominent "Free Shipping over £40" banner (you already have this text, make it more visible)

### 11.3 International Gifting
- "Send a gift to the UK from anywhere" messaging
- Multi-currency support with auto-detection (GBP, EUR, USD)
- Clear international shipping rates and timelines
- IGP serves 100+ countries - even supporting 2-3 would be a differentiator

### 11.4 Gift Hamper Builder
- Let users build custom gift hampers/boxes
- Pick 3-5 items from a curated selection
- Add a personalised card/message
- Show running total as items are added
- Premium packaging options

### 11.5 Premium / Luxe Collection
- Curated "Premium Gifts" section for higher-budget shoppers
- Better product photography and presentation for premium items
- Gift box mockup images

### 11.6 E-Gift Cards
- Digital gift cards delivered via email
- Customisable amount (£10 - £100)
- Personalised message and design
- Balance checking page
- Works as payment method at checkout

### 11.7 Delivery Date Picker at Product Level
- Calendar widget on product page: "When do you need this?"
- Show available delivery dates based on production time
- Price varies by urgency (standard vs express)
- "Arrives by [date]" confirmation

### 11.8 Membership / Loyalty Programme
- "PersonalisedGifts Select" membership
- X% cashback on all orders
- Free delivery for members
- Early access to new products and sales
- Birthday discount

### 11.9 Corporate Gifting Section
- Dedicated landing page for businesses
- Bulk order form with CSV upload
- Invoice payment option
- Custom branding on gifts
- Account manager for large orders

### 11.10 Scale & Trust Metrics
- Show real metrics: "X gifts delivered", "Y happy customers"
- Map of delivery coverage
- Counter animation on homepage

---

## Key Takeaway

The website has a **solid foundation** - good design, proper tech stack (Next.js + Prisma + Clerk + Stripe), and a well-structured codebase. ~~The biggest gap is that most features are UI-only with no backend wiring.~~ **Phase 1 is now complete** - all pages fetch real data from the database, filters/sort/pagination/search work end-to-end, and personalisation options are dynamically rendered from DB data.

### What to do next (recommended order):
1. **Admin product CRUD** (Phase 4, 7.1) - You need a way to add/edit/delete products without touching the DB directly
2. **Fabric.js live preview canvas** (Phase 3, 4.1) - The core differentiator for a personalisation site
3. **Photo upload with Cloudinary** (Phase 3, 4.2) - Currently product images use Unsplash placeholders
4. **Email flows with Resend** (Phase 4, 8.2) - Order confirmation, shipping updates
5. **Structured data / SEO** (Phase 2, 6.1) - Schema.org markup for Google rich results
6. **Gift Finder quiz logic** (Phase 4, 3.6) - Already have the UI, just needs to pass meaningful filters

The **unique differentiators** you can build that competitors lack:
1. **Gift Finder Quiz** - already have the UI, just needs logic
2. **Occasion Reminder System** - nobody does this well
3. **AI-powered gift suggestions** - emerging trend, early mover advantage

Sources for competitor research:
- [Not On The High Street](https://www.notonthehighstreet.com/gifts/personalised-gifts)
- [Funky Pigeon](https://www.funkypigeon.com/personalised-gifts)
- [Make Memento](https://www.makememento.com/)
- [Snapfish UK](https://www.snapfish.co.uk/personalised-gifts)
- [Keep It Personal](https://www.keepitpersonal.co.uk/personalised-gifts-c-112/)
- [Personalise.co.uk](https://www.personalise.co.uk/)
