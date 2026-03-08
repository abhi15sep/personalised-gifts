import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | PersonalisedGifts",
  description: "Privacy policy for PersonalisedGifts.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: March 2026
      </p>

      <div className="prose prose-gray prose-sm max-w-none space-y-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-charcoal [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an
            account, place an order, subscribe to our newsletter, or contact us.
            This includes:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Name, email address, phone number</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely by Stripe)</li>
            <li>Personalisation details you provide for your orders</li>
            <li>Communications you send to us</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations and delivery updates</li>
            <li>To respond to your enquiries and provide customer support</li>
            <li>
              To send marketing communications (only with your consent, and you
              can opt out at any time)
            </li>
            <li>To improve our products and services</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share information only with
            trusted service providers necessary to operate our business:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Stripe</strong> — for secure payment processing
            </li>
            <li>
              <strong>Clerk</strong> — for authentication and account management
            </li>
            <li>
              <strong>Royal Mail / courier partners</strong> — for order delivery
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            personal data. Payment information is encrypted and processed
            securely through Stripe — we never store your full card details on
            our servers.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>
            Under UK GDPR, you have the right to access, correct, or delete your
            personal data. You can also object to processing or request data
            portability. To exercise these rights, please{" "}
            <a href="/contact" className="text-rose underline">
              contact us
            </a>
            .
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            We use essential cookies to make our website work and analytics
            cookies to help us improve your experience. You can manage your
            cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            If you have any questions about this privacy policy, please contact
            us at{" "}
            <a
              href="mailto:hello@personalisedgifts.co.uk"
              className="text-rose underline"
            >
              hello@personalisedgifts.co.uk
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
