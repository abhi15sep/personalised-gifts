export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getOccasions } from "@/lib/actions/products"
import { OCCASION_IMAGES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Shop by Occasion",
  description:
    "Find the perfect personalised gift for every occasion — birthdays, weddings, anniversaries, Christmas and more.",
}

export default async function OccasionsPage() {
  const occasions = await getOccasions()

  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl font-bold text-charcoal md:text-4xl">
            Shop by Occasion
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Whatever you&apos;re celebrating, we&apos;ve got the perfect
            personalised gift to make it unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
          {occasions.map((occasion) => {
            const imgUrl = occasion.bannerUrl || OCCASION_IMAGES[occasion.slug]
            return (
              <Link
                key={occasion.slug}
                href={`/occasion/${occasion.slug}`}
                className="group relative overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={occasion.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-2xl">
                      {occasion.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                    {occasion.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
