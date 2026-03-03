import Link from "next/link"
import type { Metadata } from "next"
import { Gift, Heart, Users, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OCCASIONS, RECIPIENTS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Gift Finder",
  description:
    "Not sure what to get? Use our gift finder to discover the perfect personalised gift for any occasion and recipient.",
}

const QUICK_PICKS = [
  {
    icon: Heart,
    title: "For Her",
    description: "Jewellery, photo gifts & keepsakes she'll treasure",
    href: "/products?recipient=for-her",
  },
  {
    icon: Users,
    title: "For Him",
    description: "Watches, engraved accessories & personalised drinkware",
    href: "/products?recipient=for-him",
  },
  {
    icon: Calendar,
    title: "Birthday",
    description: "Make their birthday extra special with a custom gift",
    href: "/occasion/birthday",
  },
  {
    icon: Sparkles,
    title: "Wedding",
    description: "Beautiful personalised gifts for the happy couple",
    href: "/occasion/wedding",
  },
]

export default function GiftFinderPage() {
  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose/10">
            <Gift className="h-8 w-8 text-rose" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-charcoal md:text-4xl">
            Find the Perfect Gift
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Not sure what to get? Browse by occasion or recipient to find a
            personalised gift they&apos;ll love.
          </p>
        </div>

        {/* Quick Picks */}
        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          {QUICK_PICKS.map((pick) => (
            <Link key={pick.title} href={pick.href}>
              <Card className="h-full border-gray-200 transition-all hover:shadow-lg hover:border-rose/30">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose/10">
                    <pick.icon className="h-6 w-6 text-rose" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{pick.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pick.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Browse by Occasion */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
            Browse by Occasion
          </h2>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occasion) => (
              <Link
                key={occasion.slug}
                href={`/occasion/${occasion.slug}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-rose hover:text-rose hover:bg-rose/5"
              >
                {occasion.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Browse by Recipient */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
            Browse by Recipient
          </h2>
          <div className="flex flex-wrap gap-2">
            {RECIPIENTS.map((recipient) => (
              <Link
                key={recipient.slug}
                href={`/products?recipient=${recipient.slug}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-rose hover:text-rose hover:bg-rose/5"
              >
                {recipient.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-rose to-rose-light p-8 text-center md:p-12">
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Still can&apos;t decide?
          </h2>
          <p className="mt-3 text-white/80 max-w-md mx-auto">
            Browse our full collection — every gift can be personalised to make
            it truly special.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 rounded-full bg-white px-8 text-rose hover:bg-gray-100"
          >
            <Link href="/products">Shop All Gifts</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
