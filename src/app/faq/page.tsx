import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | PersonalisedGifts",
  description:
    "Frequently asked questions about PersonalisedGifts orders, delivery, and personalisation.",
}

const faqs = [
  {
    question: "How long does it take to receive my order?",
    answer:
      "As each item is personalised and made to order, production takes 1-3 working days. After that, delivery depends on your chosen shipping method: Standard (3-5 days), Express (1-2 days), or Next Day. See our Shipping page for full details.",
  },
  {
    question: "Can I cancel or change my order after placing it?",
    answer:
      "We begin production quickly, so please contact us as soon as possible if you need to make changes. If production hasn't started, we'll do our best to accommodate your request. Once production has begun, changes may not be possible.",
  },
  {
    question: "What if there's a mistake in my personalisation?",
    answer:
      "If the error was on our part, we'll replace the item free of charge. If the error was in the details you provided, we can offer a re-make at a discounted rate. Please contact us with your order number and photos.",
  },
  {
    question: "Can I return a personalised item?",
    answer:
      "Due to the bespoke nature of our products, we cannot accept returns for change of mind. However, if your item arrives damaged or with an error on our part, we'll make it right. See our Returns & Refunds page for full details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently ship across the United Kingdom only. We're working on expanding internationally — subscribe to our newsletter to be the first to know.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) via our secure Stripe payment gateway.",
  },
  {
    question: "Can I send a gift directly to someone?",
    answer:
      "Yes! During checkout, you can enter the recipient's address as the shipping address. You can also add a gift message and opt for gift wrapping at checkout.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order has been dispatched, you'll receive an email with a tracking number. You can also view your order status by signing in to your account.",
  },
  {
    question: "What if my item arrives damaged?",
    answer:
      "We're sorry to hear that! Please contact us within 14 days of receiving your order with your order number and photos of the damage. We'll arrange a replacement or refund.",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer:
      "Yes! We offer special pricing for bulk and corporate orders. Please contact us with your requirements and we'll put together a custom quote.",
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-charcoal">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Got a question? We&apos;ve got answers.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-5">
            <h3 className="font-medium text-charcoal mb-2">{faq.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="mt-12 rounded-xl bg-rose/5 p-8 text-center">
        <h2 className="font-heading text-xl font-semibold text-charcoal mb-2">
          Still have questions?
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Our team is happy to help with anything not covered here.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center rounded-md bg-rose px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-dark"
        >
          Contact Us
        </a>
      </div>
    </div>
  )
}
