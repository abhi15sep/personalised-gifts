import { Truck, Clock, Package, MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping & Delivery | PersonalisedGifts",
  description:
    "Delivery information for PersonalisedGifts orders. UK-wide tracked shipping.",
}

const deliveryOptions = [
  {
    name: "Standard Delivery",
    time: "3-5 working days",
    price: "Free on orders over £30",
    priceBelow: "£3.99",
    icon: Package,
  },
  {
    name: "Express Delivery",
    time: "1-2 working days",
    price: "£6.99",
    priceBelow: "£6.99",
    icon: Truck,
  },
  {
    name: "Next Day Delivery",
    time: "Next working day",
    price: "£9.99",
    priceBelow: "£9.99",
    icon: Clock,
  },
]

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-charcoal">
          Shipping &amp; Delivery
        </h1>
        <p className="mt-3 text-muted-foreground">
          We deliver across the United Kingdom with tracked shipping on all
          orders.
        </p>
      </div>

      {/* Delivery Options */}
      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        {deliveryOptions.map((option) => (
          <div
            key={option.name}
            className="rounded-xl border border-gray-200 p-6 text-center"
          >
            <option.icon className="mx-auto h-8 w-8 text-rose mb-3" />
            <h3 className="font-heading font-semibold text-charcoal mb-1">
              {option.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{option.time}</p>
            <p className="text-sm font-medium text-charcoal">{option.price}</p>
          </div>
        ))}
      </div>

      {/* Important Info */}
      <div className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Production Times
          </h2>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              <strong>Please note:</strong> As all our products are personalised
              and made to order, production typically takes 1-3 working days
              before dispatch. Delivery times above are in addition to production
              time.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Order Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            All orders are dispatched with tracking. You&apos;ll receive a
            confirmation email with your tracking number once your order has been
            dispatched. You can also track your order from your{" "}
            <a href="/account" className="text-rose underline">
              account page
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Delivery Areas
          </h2>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-rose mt-0.5 shrink-0" />
            <p>
              We currently deliver across the entire United Kingdom including
              England, Scotland, Wales, and Northern Ireland. Deliveries to the
              Scottish Highlands and Islands, Channel Islands, and Isle of Man
              may take an additional 1-2 working days.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Need Help?
          </h2>
          <p className="text-sm text-muted-foreground">
            If you have any questions about shipping, please{" "}
            <a href="/contact" className="text-rose underline">
              contact our team
            </a>
            . We&apos;re happy to help.
          </p>
        </section>
      </div>
    </div>
  )
}
