import { Gift, Heart, Truck, Award } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | PersonalisedGifts",
  description:
    "Learn about PersonalisedGifts — handcrafted, personalised gifts made with love in the UK.",
}

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every gift is carefully crafted and personalised by our skilled artisans, ensuring each piece is truly unique.",
  },
  {
    icon: Gift,
    title: "Thoughtful Gifting",
    description:
      "We believe that the best gifts are personal. Our products help you express your feelings in a meaningful way.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We use only the finest materials and printing techniques to ensure your personalised gift stands the test of time.",
  },
  {
    icon: Truck,
    title: "UK-Wide Delivery",
    description:
      "Fast, reliable delivery across the United Kingdom with tracked shipping on all orders.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl">
          Our Story
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          PersonalisedGifts was born from a simple idea: every gift should tell a
          story. We create beautiful, bespoke gifts that celebrate life&apos;s
          special moments.
        </p>
      </div>

      {/* Story */}
      <div className="prose prose-gray max-w-none mb-16">
        <h2 className="font-heading text-2xl font-semibold text-charcoal">
          How It All Began
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Founded in the heart of the UK, PersonalisedGifts started as a small
          workshop dedicated to creating meaningful, customised presents. What
          began as a passion project has grown into a trusted destination for
          thoughtful gifting, serving thousands of happy customers across the
          country.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We work with talented artisans and use cutting-edge personalisation
          technology to bring your ideas to life. From engraved jewellery to
          custom photo prints, every item is made to order with meticulous
          attention to detail.
        </p>

        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-12">
          How It Works
        </h2>
        <ol className="text-muted-foreground space-y-3">
          <li>
            <strong>Choose your gift</strong> — Browse our curated collection of
            personalisable products.
          </li>
          <li>
            <strong>Personalise it</strong> — Add names, dates, photos, or
            messages to make it uniquely theirs.
          </li>
          <li>
            <strong>Preview &amp; order</strong> — See exactly how your gift will
            look before placing your order.
          </li>
          <li>
            <strong>We craft &amp; deliver</strong> — Our team carefully creates
            your gift and ships it directly to you or the recipient.
          </li>
        </ol>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="font-heading text-2xl font-semibold text-charcoal text-center mb-8">
          What We Stand For
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-gray-200 p-6 text-center"
            >
              <value.icon className="mx-auto h-10 w-10 text-rose mb-4" />
              <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center rounded-xl bg-rose/5 p-8">
        <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">
          Ready to create something special?
        </h2>
        <p className="text-muted-foreground mb-6">
          Browse our collection and find the perfect personalised gift.
        </p>
        <a
          href="/products"
          className="inline-flex items-center rounded-md bg-rose px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-dark"
        >
          Shop Now
        </a>
      </div>
    </div>
  )
}