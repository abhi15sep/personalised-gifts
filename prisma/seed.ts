import { PrismaClient, Prisma } from '@prisma/client';

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

  // ─── Products with Personalisation Options ──────────────────────────────

  const productsData = [
    {
      name: 'Personalised Ceramic Mug',
      slug: 'personalised-ceramic-mug',
      description: 'A beautiful ceramic mug personalised with your chosen name and design.',
      basePrice: 14.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 3,
      occasionSlugs: ['birthday', 'christmas', 'thank-you'],
      personalisationOptions: [
        { optionKey: 'name', label: 'Name', optionType: 'TEXT' as const, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 0 },
        { optionKey: 'font', label: 'Font Style', optionType: 'FONT' as const, isRequired: false, priceModifier: 0, constraints: null, sortOrder: 1 },
        { optionKey: 'colour', label: 'Text Colour', optionType: 'COLOUR' as const, isRequired: false, priceModifier: 0, constraints: null, sortOrder: 2 },
      ],
    },
    {
      name: 'Custom Photo Canvas Print',
      slug: 'custom-photo-canvas-print',
      description: 'Upload your favourite photo and we\'ll print it on a premium stretched canvas.',
      basePrice: 29.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 5,
      occasionSlugs: ['birthday', 'anniversary', 'wedding'],
      personalisationOptions: [
        { optionKey: 'photo', label: 'Your Photo', optionType: 'IMAGE' as const, isRequired: true, priceModifier: 0, constraints: { maxFileSizeMB: 10, allowedTypes: ['png', 'jpg', 'webp'] }, sortOrder: 0 },
        { optionKey: 'message', label: 'Caption', optionType: 'TEXTAREA' as const, isRequired: false, priceModifier: 0, constraints: { maxLength: 100 }, sortOrder: 1 },
      ],
    },
    {
      name: 'Engraved Silver Bracelet',
      slug: 'engraved-silver-bracelet',
      description: 'Sterling silver bracelet with custom engraving. A timeless keepsake.',
      basePrice: 39.99,
      categorySlug: 'jewellery',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 7,
      occasionSlugs: ['birthday', 'anniversary', 'valentines-day', 'mothers-day'],
      personalisationOptions: [
        { optionKey: 'initials', label: 'Initials', optionType: 'TEXT' as const, isRequired: true, priceModifier: 0, constraints: { maxLength: 4 }, sortOrder: 0 },
        { optionKey: 'size', label: 'Bracelet Size', optionType: 'DROPDOWN' as const, isRequired: true, priceModifier: 0, constraints: { options: ['Small (16cm)', 'Medium (18cm)', 'Large (20cm)'] }, sortOrder: 1 },
        { optionKey: 'font', label: 'Engraving Font', optionType: 'FONT' as const, isRequired: false, priceModifier: 0, constraints: null, sortOrder: 2 },
      ],
    },
    {
      name: 'Photo Memory Book',
      slug: 'photo-memory-book',
      description: 'A hardback photo book filled with your favourite memories. Perfect gift for any occasion.',
      basePrice: 24.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 5,
      occasionSlugs: ['birthday', 'anniversary', 'new-baby', 'graduation'],
      personalisationOptions: [
        { optionKey: 'cover_photo', label: 'Cover Photo', optionType: 'IMAGE' as const, isRequired: true, priceModifier: 0, constraints: { maxFileSizeMB: 10, allowedTypes: ['png', 'jpg'] }, sortOrder: 0 },
        { optionKey: 'title', label: 'Book Title', optionType: 'TEXT' as const, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 1 },
        { optionKey: 'dedication', label: 'Dedication Message', optionType: 'TEXTAREA' as const, isRequired: false, priceModifier: 0, constraints: { maxLength: 200 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Personalised Chopping Board',
      slug: 'personalised-chopping-board',
      description: 'Solid oak chopping board with laser-engraved personalisation.',
      basePrice: 34.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 4,
      occasionSlugs: ['wedding', 'anniversary', 'christmas', 'mothers-day', 'fathers-day'],
      personalisationOptions: [
        { optionKey: 'name', label: 'Family Name', optionType: 'TEXT' as const, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 0 },
        { optionKey: 'date', label: 'Special Date', optionType: 'TEXT' as const, isRequired: false, priceModifier: 0, constraints: { maxLength: 12 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font', optionType: 'FONT' as const, isRequired: false, priceModifier: 0, constraints: null, sortOrder: 2 },
      ],
    },
  ];

  for (const pData of productsData) {
    const category = categories.find((c) => c.slug === pData.categorySlug);
    const product = await prisma.product.upsert({
      where: { slug: pData.slug },
      update: {},
      create: {
        name: pData.name,
        slug: pData.slug,
        description: pData.description,
        basePrice: pData.basePrice,
        categoryId: category?.id ?? null,
        status: 'ACTIVE',
        isPersonalizable: pData.isPersonalizable,
        isFeatured: pData.isFeatured,
        productionDays: pData.productionDays,
      },
    });

    // Upsert personalisation options (delete + recreate to handle re-runs)
    await prisma.personalizationOption.deleteMany({ where: { productId: product.id } });
    if (pData.personalisationOptions.length > 0) {
      await prisma.personalizationOption.createMany({
        data: pData.personalisationOptions.map((opt) => ({
          productId: product.id,
          ...opt,
          constraints: opt.constraints === null ? Prisma.JsonNull : (opt.constraints as Prisma.InputJsonValue),
        })),
      });
    }

    // Link occasions
    const occasionRecords = occasions.filter((o) => pData.occasionSlugs.includes(o.slug));
    for (const occ of occasionRecords) {
      await prisma.productOccasion.upsert({
        where: { productId_occasionId: { productId: product.id, occasionId: occ.id } },
        update: {},
        create: { productId: product.id, occasionId: occ.id },
      });
    }
  }

  console.log(`✅ ${productsData.length} products seeded with personalisation options`);

  // ─── Summary ──────────────────────────────────────────────────────────
  console.log('\n📊 Database summary:');
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Occasions: ${occasions.length}`);
  console.log(`   Products: ${productsData.length}`);
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
