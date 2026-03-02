import Link from "next/link"
import { Heart, Truck, Flag, ArrowRight, ShieldCheck, RotateCcw, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OCCASIONS } from "@/lib/constants"

const PLACEHOLDER_PRODUCTS = [
  { name: "Personalised Name Mug", price: "£14.99" },
  { name: "Engraved Silver Bracelet", price: "£29.99" },
  { name: "Custom Photo Canvas", price: "£24.99" },
  { name: "Embroidered Cushion", price: "£19.99" },
]

function ProductCard({ name, price }: { name: string; price: string }) {
  return (
    <Card className="group overflow-hidden border-warm-200 transition-shadow hover:shadow-md">
      <div className="aspect-square bg-gradient-to-br from-warm-100 to-warm-200" />
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-foreground">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{price}</p>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-warm-50 via-warm-100 to-gold/20 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Gifts as unique as they are
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Personalised with love, delivered to your door
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8 text-base">
            <Link href="/products">Shop Personalised Gifts</Link>
          </Button>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-center text-3xl font-bold text-foreground md:text-4xl">
            Shop by Occasion
          </h2>
          <div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4">
            {OCCASIONS.map((occasion) => (
              <Link
                key={occasion.slug}
                href={`/occasion/${occasion.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-warm-200 bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-md md:p-6"
              >
                <span className="text-3xl md:text-4xl">{occasion.icon}</span>
                <span className="text-xs font-medium text-foreground md:text-sm">
                  {occasion.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-warm-50/50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Bestsellers
            </h2>
            <Link
              href="/products?sort=bestselling"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {PLACEHOLDER_PRODUCTS.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Gift Finder CTA Banner */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-primary to-warm-700 px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Not sure what to get?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80 md:text-lg">
            Let us help you find the perfect personalised gift
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-8 rounded-full px-8 text-base"
          >
            <Link href="/gift-finder">Take the Quiz</Link>
          </Button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-warm-50/50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              New Arrivals
            </h2>
            <Link
              href="/products?sort=newest"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {PLACEHOLDER_PRODUCTS.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-center text-3xl font-bold text-foreground md:text-4xl">
            Why Choose Us
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-warm-100">
                <Heart className="size-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Handcrafted with Love
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every gift is carefully made and personalised just for you
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-warm-100">
                <Truck className="size-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Fast UK Delivery
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quick and reliable delivery across the United Kingdom
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-warm-100">
                <Flag className="size-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Made in Britain
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Proudly designed and crafted right here in the UK
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-warm-200 bg-warm-50 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <Package className="size-4" />
            <span>Free delivery over £40</span>
          </div>
          <div className="hidden h-4 w-px bg-warm-300 md:block" />
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4" />
            <span>30-day returns</span>
          </div>
          <div className="hidden h-4 w-px bg-warm-300 md:block" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            <span>Secure checkout</span>
          </div>
        </div>
      </section>
    </div>
  )
}
