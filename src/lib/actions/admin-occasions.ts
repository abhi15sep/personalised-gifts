'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/actions/admin'
import { revalidatePath } from 'next/cache'

export async function getAdminOccasions() {
  await requireAdmin()

  const occasions = await db.occasion.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  })

  return occasions.map((o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug,
    icon: o.icon,
    bannerUrl: o.bannerUrl,
    tagline: o.tagline,
    productCount: o._count.products,
  }))
}

export async function updateOccasion(
  id: number,
  data: { bannerUrl?: string | null; tagline?: string | null }
) {
  await requireAdmin()

  await db.occasion.update({
    where: { id },
    data: {
      bannerUrl: data.bannerUrl ?? undefined,
      tagline: data.tagline ?? undefined,
    },
  })

  const occasion = await db.occasion.findUnique({
    where: { id },
    select: { slug: true },
  })

  revalidatePath('/admin/occasions')
  revalidatePath(`/occasion/${occasion?.slug}`)
  revalidatePath('/occasions')

  return { success: true }
}
