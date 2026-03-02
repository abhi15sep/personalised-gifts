"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Search, Menu, Heart, User } from "lucide-react"

import { useCartStore } from "@/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/occasions", label: "Occasions" },
  { href: "/gift-finder", label: "Gift Finder" },
]

function ClerkAuth() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useUser, UserButton, SignInButton } = require("@clerk/nextjs")
    const { isSignedIn, isLoaded } = useUser()

    if (!isLoaded) return null

    if (isSignedIn) {
      return (
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      )
    }

    return (
      <SignInButton mode="modal">
        <Button
          variant="ghost"
          size="icon"
          className="text-warm-700 hover:text-warm-900 hover:bg-warm-100"
        >
          <User className="h-5 w-5" />
          <span className="sr-only">Sign in</span>
        </Button>
      </SignInButton>
    )
  } catch {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-warm-700 hover:text-warm-900 hover:bg-warm-100"
        asChild
      >
        <Link href="/sign-in">
          <User className="h-5 w-5" />
          <span className="sr-only">Sign in</span>
        </Link>
      </Button>
    )
  }
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-200 bg-warm-50/95 backdrop-blur supports-[backdrop-filter]:bg-warm-50/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-heading text-xl font-bold tracking-tight text-warm-800 sm:text-2xl">
            Personalised<span className="text-gold">Gifts</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-100 hover:text-warm-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search - Desktop */}
        <div className="hidden max-w-sm flex-1 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search gifts..."
              className="h-9 pl-9 bg-white/80 border-warm-200 focus-visible:ring-gold/30"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-warm-700 hover:text-warm-900 hover:bg-warm-100"
            asChild
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-warm-700 hover:text-warm-900 hover:bg-warm-100 sm:inline-flex"
            asChild
          >
            <Link href="/account/wishlist">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-warm-700 hover:text-warm-900 hover:bg-warm-100"
            asChild
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px] bg-gold text-warm-900 border-0">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {/* User / Auth */}
          <ClerkAuth />

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-warm-700 hover:text-warm-900 hover:bg-warm-100"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-warm-50">
              <SheetHeader>
                <SheetTitle className="font-heading text-lg text-warm-800">
                  Personalised<span className="text-gold">Gifts</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-100 hover:text-warm-900"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/account/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-100 hover:text-warm-900"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
              </nav>
              {/* Mobile Search */}
              <div className="mt-4 px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search gifts..."
                    className="pl-9 bg-white/80 border-warm-200"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
