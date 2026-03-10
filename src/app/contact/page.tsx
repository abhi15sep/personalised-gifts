"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitContactMessage } from "@/lib/actions/contact"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "hello@personalisedgifts.co.uk",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+44 (0) 800 123 4567",
    sub: "Mon-Fri 9am-5pm GMT",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "PersonalisedGifts HQ",
    sub: "London, United Kingdom",
  },
  {
    icon: Clock,
    title: "Business Hours",
    detail: "Monday - Friday",
    sub: "9:00 AM - 5:00 PM GMT",
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      orderNumber: (formData.get("orderNumber") as string) || undefined,
      message: formData.get("message") as string,
    }

    try {
      const result = await submitContactMessage(data)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-charcoal">
          Contact Us
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Have a question about an order or need help personalising your gift?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Info */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-6">
            Get in Touch
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-gray-200 p-5"
              >
                <item.icon className="h-6 w-6 text-rose mb-3" />
                <h3 className="font-medium text-charcoal">{item.title}</h3>
                <p className="text-sm text-charcoal mt-1">{item.detail}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-charcoal mb-6">
            Send a Message
          </h2>
          {submitted ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
              <Send className="mx-auto h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-sm text-green-700">
                Thank you for contacting us. We&apos;ll get back to you within
                24 hours.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Smith" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="Order enquiry" required />
              </div>
              <div>
                <Label htmlFor="orderNumber">
                  Order Number{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input id="orderNumber" name="orderNumber" placeholder="PG-XXXXXXXX" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  placeholder="How can we help you?"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-rose hover:bg-rose-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}