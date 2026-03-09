import type { Metadata } from "next"
import { Inter, DM_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CookieConsent } from "@/components/cookie-consent"
import { TawkTo } from "@/components/tawk-to"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: {
    default: "PersonalisedGifts | Unique Custom Gifts for Every Occasion",
    template: "%s | PersonalisedGifts",
  },
  description:
    "Discover unique personalised gifts handcrafted with love. Custom mugs, jewellery, photo gifts & more. Free UK delivery over £40.",
  keywords: [
    "personalised gifts",
    "custom gifts",
    "engraved gifts",
    "photo gifts",
    "UK gifts",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const body = (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <CookieConsent />
        <TawkTo />
        <Toaster />
      </body>
    </html>
  )

  // Only wrap with ClerkProvider when a valid publishable key is set
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (clerkKey && clerkKey.startsWith("pk_") && !clerkKey.includes("placeholder")) {
    return <ClerkProvider>{body}</ClerkProvider>
  }

  return body
}
