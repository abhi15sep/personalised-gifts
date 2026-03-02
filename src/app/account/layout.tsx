import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Package, Heart, MapPin, Bell, Settings } from "lucide-react"

const accountLinks = [
  { href: "/account", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/reminders", label: "Occasion Reminders", icon: Bell },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
        <h1 className="font-heading text-3xl font-bold">My Account</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  )
}
