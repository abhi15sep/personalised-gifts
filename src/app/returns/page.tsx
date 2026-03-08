import { RotateCcw, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Refunds | PersonalisedGifts",
  description:
    "Our returns and refund policy. Learn about returns for personalised items.",
}

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-charcoal">
          Returns &amp; Refunds
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your satisfaction is our priority. Here&apos;s our policy for returns
          and refunds.
        </p>
      </div>

      <div className="space-y-8">
        {/* Important Notice */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-5">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900 mb-1">
                Important: Personalised Items
              </h3>
              <p className="text-sm text-amber-800">
                As our products are personalised and made to order, we cannot
                accept returns for change of mind. However, if your item is
                faulty or not as described, we will always make it right.
              </p>
            </div>
          </div>
        </div>

        {/* When we accept returns */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            When We Accept Returns
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">&#10003;</span>
              Item arrived damaged or broken
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">&#10003;</span>
              Personalisation is incorrect (spelling error on our part)
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">&#10003;</span>
              Item is significantly different from the product description
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">&#10003;</span>
              Wrong item delivered
            </li>
          </ul>
        </section>

        {/* When we cannot accept returns */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            When We Cannot Accept Returns
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&#10007;</span>
              Change of mind after ordering
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&#10007;</span>
              Personalisation error caused by incorrect details provided by you
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&#10007;</span>
              Item has been used or altered
            </li>
          </ul>
        </section>

        {/* How to return */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-rose" />
            How to Request a Return
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
            <li>
              Contact us within <strong>14 days</strong> of receiving your order
              via our{" "}
              <a href="/contact" className="text-rose underline">
                contact page
              </a>
              .
            </li>
            <li>
              Include your order number and photos of any damage or issues.
            </li>
            <li>
              Our team will review your request and respond within 24 hours.
            </li>
            <li>
              If approved, we&apos;ll arrange a free collection or provide a
              prepaid returns label.
            </li>
          </ol>
        </section>

        {/* Refund timeline */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-3">
            Refund Timeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Once we receive and inspect your returned item, refunds are processed
            within <strong>5-7 working days</strong>. The refund will be issued
            to your original payment method. You&apos;ll receive an email
            confirmation once your refund has been processed.
          </p>
        </section>

        {/* Contact */}
        <div className="rounded-lg border border-gray-200 p-6 text-center">
          <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our customer service team is here to help with any returns or refund
            queries.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center rounded-md bg-rose px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-dark"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
