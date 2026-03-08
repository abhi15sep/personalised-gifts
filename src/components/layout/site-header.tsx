"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  User,
  LogOut,
  Package,
  MapPin,
  Settings,
} from "lucide-react"
import { useUser, useClerk, SignInButton } from "@clerk/nextjs"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/occasions", label: "Occasions" },
  { href: "/gift-finder", label: "Gift Finder" },
]

function ClerkAuth() {
  const { isSignedIn, isLoaded, user } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) return null

  if (isSignedIn) {
    const initials = user?.firstName
      ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
      : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full bg-rose/10 text-rose hover:bg-rose/20"
          >
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">{initials}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : "My Account"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/wishlist" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/addresses" className="cursor-pointer">
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ redirectUrl: "/" })}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <SignInButton mode="modal">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-charcoal hover:bg-gray-100"
      >
        <User className="h-5 w-5" />
        <span className="sr-only">Sign in</span>
      </Button>
    </SignInButton>
  )
}

function MobileClerkAuth({ onClose }: { onClose: () => void }) {
  const { isSignedIn, isLoaded, user } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) return null

  if (isSignedIn) {
    return (
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="px-3 pb-3">
          <p className="text-sm font-medium text-charcoal">
            {user?.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : "My Account"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
        >
          <Package className="h-4 w-4" />
          My Orders
        </Link>
        <Link
          href="/account/addresses"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
        >
          <MapPin className="h-4 w-4" />
          Addresses
        </Link>
        <button
          onClick={() => {
            signOut({ redirectUrl: "/" })
            onClose()
          }}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <SignInButton mode="modal">
        <button
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
        >
          <User className="h-4 w-4" />
          Sign In
        </button>
      </SignInButton>
    </div>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const itemCount = useCartStore((s) => s.getItemCount())

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`)
      setSearchQuery("")
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-heading text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
            Personalised<span className="text-rose">Gifts</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="hidden max-w-sm flex-1 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 bg-gray-50 border-gray-200 focus-visible:ring-rose/30"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 hover:text-charcoal hover:bg-gray-100"
            asChild
          >
            <Link href="/products">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-gray-600 hover:text-charcoal hover:bg-gray-100 sm:inline-flex"
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
            className="relative text-gray-600 hover:text-charcoal hover:bg-gray-100"
            asChild
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px] bg-rose text-white border-0">
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
                className="md:hidden text-gray-600 hover:text-charcoal hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white">
              <SheetHeader>
                <SheetTitle className="font-heading text-lg text-charcoal">
                  Personalised<span className="text-rose">Gifts</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/account/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
              </nav>
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4 px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search gifts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50 border-gray-200"
                  />
                </div>
              </form>
              {/* Mobile Auth Section */}
              <div className="px-4">
                <MobileClerkAuth onClose={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
