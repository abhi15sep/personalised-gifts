import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
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
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
