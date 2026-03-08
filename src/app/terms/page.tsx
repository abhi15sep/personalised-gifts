import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PersonalisedGifts",
  description: "Terms of service for PersonalisedGifts.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: March 2026
      </p>

      <div className="prose prose-gray prose-sm max-w-none space-y-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-charcoal [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
        <section>
          <h2>1. General</h2>
          <p>
            These terms govern your use of the PersonalisedGifts website and
            services. By placing an order, you agree to these terms.
          </p>
        </section>

        <section>
          <h2>2. Orders &amp; Pricing</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>All prices are displayed in GBP and include VAT where applicable.</li>
            <li>
              We reserve the right to update prices at any time. The price at the
              time of order placement is the price you pay.
            </li>
            <li>
              Orders are confirmed via email. We reserve the right to cancel
              orders in exceptional circumstances (e.g. pricing errors), in which
              case a full refund will be issued.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Personalised Products</h2>
          <p>
            As our products are personalised and made to order, please
            double-check all personalisation details before confirming your
            order. We produce items exactly as specified and cannot be held
            responsible for errors in information you provide.
          </p>
        </section>

        <section>
          <h2>4. Delivery</h2>
          <p>
            Estimated delivery times are provided in good faith but are not
            guaranteed. We are not liable for delays caused by Royal Mail or
            third-party couriers. For full delivery information, see our{" "}
            <a href="/shipping" className="text-rose underline">
              Shipping &amp; Delivery
            </a>{" "}
            page.
          </p>
        </section>

        <section>
          <h2>5. Returns &amp; Refunds</h2>
          <p>
            Due to the bespoke nature of our products, we cannot accept returns
            for change of mind. For faulty or incorrect items, please see our{" "}
            <a href="/returns" className="text-rose underline">
              Returns &amp; Refunds
            </a>{" "}
            policy.
          </p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website, including images, text, logos, and
            designs, is the property of PersonalisedGifts and is protected by UK
            copyright law. You may not reproduce, distribute, or use our content
            without written permission.
          </p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, PersonalisedGifts shall not
            be liable for any indirect, incidental, or consequential damages
            arising from the use of our products or services.
          </p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any
            disputes will be subject to the exclusive jurisdiction of the courts
            of England and Wales.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            For questions about these terms, please{" "}
            <a href="/contact" className="text-rose underline">
              contact us
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
