"use client"

import { useState } from "react"
import Link from "next/link"

const aboutLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/about", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
]

const shopLinks = [
  { href: "/products", label: "All Gifts" },
  { href: "/occasions", label: "Occasions" },
  { href: "/products?sort=bestselling", label: "Bestsellers" },
  { href: "/products?sort=newest", label: "New Arrivals" },
  { href: "/gift-finder", label: "Gift Finder" },
]

const supportLinks = [
  { href: "/faq", label: "Help Centre" },
  { href: "/shipping", label: "Shipping & Delivery" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/contact", label: "Contact Us" },
]

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://pinterest.com", label: "Pinterest" },
  { href: "https://twitter.com", label: "Twitter" },
]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <footer className="border-t border-gray-200 bg-charcoal text-gray-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-rose">
              About
            </h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-rose">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-rose">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-rose">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="mx-auto max-w-md text-center">
            <h3 className="font-heading text-lg font-semibold text-white">
              Stay in the loop
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Subscribe for exclusive offers, gift ideas, and personalisation tips.
            </p>
            {status === "success" ? (
              <p className="mt-4 text-sm text-green-400 font-medium">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-4 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="flex-1 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-md bg-rose px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-dark disabled:opacity-50"
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 bg-[#12121f]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} PersonalisedGifts. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
