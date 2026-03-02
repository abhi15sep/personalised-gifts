import Link from "next/link"

const aboutLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
]

const shopLinks = [
  { href: "/shop", label: "All Gifts" },
  { href: "/occasions", label: "Occasions" },
  { href: "/shop/bestsellers", label: "Bestsellers" },
  { href: "/shop/new-arrivals", label: "New Arrivals" },
  { href: "/gift-finder", label: "Gift Finder" },
]

const supportLinks = [
  { href: "/help", label: "Help Centre" },
  { href: "/shipping", label: "Shipping & Delivery" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
]

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://pinterest.com", label: "Pinterest" },
  { href: "https://twitter.com", label: "Twitter" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-warm-200 bg-warm-800 text-warm-100">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              About
            </h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-warm-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-warm-700 pt-8">
          <div className="mx-auto max-w-md text-center">
            <h3 className="font-heading text-lg font-semibold text-white">
              Stay in the loop
            </h3>
            <p className="mt-1 text-sm text-warm-300">
              Subscribe for exclusive offers, gift ideas, and personalisation tips.
            </p>
            <form className="mt-4 flex gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                className="flex-1 rounded-md border border-warm-600 bg-warm-700 px-3 py-2 text-sm text-white placeholder:text-warm-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-warm-900 transition-colors hover:bg-gold/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-warm-700 bg-warm-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-warm-400 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} PersonalisedGifts. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-warm-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-warm-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
