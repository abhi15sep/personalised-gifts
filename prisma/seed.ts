import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mugs-drinkware' },
      update: {},
      create: { name: 'Mugs & Drinkware', slug: 'mugs-drinkware', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'jewellery' },
      update: {},
      create: { name: 'Jewellery', slug: 'jewellery', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'home-decor' },
      update: {},
      create: { name: 'Home Decor', slug: 'home-decor', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'photo-gifts' },
      update: {},
      create: { name: 'Photo Gifts', slug: 'photo-gifts', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing-accessories' },
      update: {},
      create: { name: 'Clothing & Accessories', slug: 'clothing-accessories', sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: 'stationery' },
      update: {},
      create: { name: 'Stationery', slug: 'stationery', sortOrder: 6 },
    }),
    prisma.category.upsert({
      where: { slug: 'baby-kids' },
      update: {},
      create: { name: 'Baby & Kids', slug: 'baby-kids', sortOrder: 7 },
    }),
    prisma.category.upsert({
      where: { slug: 'wedding' },
      update: {},
      create: { name: 'Wedding', slug: 'wedding', sortOrder: 8 },
    }),
  ]);

  console.log(`✅ ${categories.length} categories seeded`);

  // ─── Occasions ────────────────────────────────────────────────────────────
  const occasionsData = [
    { name: 'Birthday', slug: 'birthday', icon: '🎂', bannerUrl: null, tagline: null },
    { name: 'Wedding', slug: 'wedding', icon: '💒', bannerUrl: null, tagline: null },
    { name: 'Anniversary', slug: 'anniversary', icon: '❤️', bannerUrl: null, tagline: null },
    { name: 'New Baby', slug: 'new-baby', icon: '👶', bannerUrl: null, tagline: null },
    { name: 'Christmas', slug: 'christmas', icon: '🎄', bannerUrl: null, tagline: null },
    { name: 'Graduation', slug: 'graduation', icon: '🎓', bannerUrl: null, tagline: null },
    { name: "Valentine's Day", slug: 'valentines-day', icon: '💝', bannerUrl: '/images/banners/valentines-day.jpg', tagline: 'Show them how much you care with a gift made just for them' },
    { name: "Mother's Day", slug: 'mothers-day', icon: '💐', bannerUrl: null, tagline: null },
    { name: "Father's Day", slug: 'fathers-day', icon: '👔', bannerUrl: null, tagline: null },
    { name: 'Thank You', slug: 'thank-you', icon: '🙏', bannerUrl: null, tagline: null },
  ];

  const occasions = await Promise.all(
    occasionsData.map((o) =>
      prisma.occasion.upsert({
        where: { slug: o.slug },
        update: {},
        create: o,
      })
    )
  );

  console.log(`✅ ${occasions.length} occasions seeded`);

  // ─── Summary ──────────────────────────────────────────────────────────
  console.log('\n📊 Database summary:');
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Occasions: ${occasions.length}`);
  console.log('\nNo products seeded — create products via the admin dashboard.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
