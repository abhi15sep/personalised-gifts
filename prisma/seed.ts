import { PrismaClient } from '@prisma/client';

// Use enum values as strings since Prisma generates these at runtime
const PersonalizationType = {
  TEXT: 'TEXT' as const,
  TEXTAREA: 'TEXTAREA' as const,
  IMAGE: 'IMAGE' as const,
  COLOUR: 'COLOUR' as const,
  FONT: 'FONT' as const,
  DROPDOWN: 'DROPDOWN' as const,
  TOGGLE: 'TOGGLE' as const,
};

const ProductStatus = {
  ACTIVE: 'ACTIVE' as const,
  DRAFT: 'DRAFT' as const,
  ARCHIVED: 'ARCHIVED' as const,
};

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

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log(`✅ ${categories.length} categories seeded`);

  // ─── Occasions ────────────────────────────────────────────────────────────
  const occasionsData = [
    { name: 'Birthday', slug: 'birthday', icon: '🎂' },
    { name: 'Wedding', slug: 'wedding', icon: '💒' },
    { name: 'Anniversary', slug: 'anniversary', icon: '❤️' },
    { name: 'New Baby', slug: 'new-baby', icon: '👶' },
    { name: 'Christmas', slug: 'christmas', icon: '🎄' },
    { name: 'Graduation', slug: 'graduation', icon: '🎓' },
    { name: "Valentine's Day", slug: 'valentines-day', icon: '💝' },
    { name: "Mother's Day", slug: 'mothers-day', icon: '💐' },
    { name: "Father's Day", slug: 'fathers-day', icon: '👔' },
    { name: 'Thank You', slug: 'thank-you', icon: '🙏' },
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

  const occasionMap = Object.fromEntries(occasions.map((o) => [o.slug, o.id]));
  console.log(`✅ ${occasions.length} occasions seeded`);

  // ─── Products ─────────────────────────────────────────────────────────────
  const productsData = [
    {
      name: 'Personalised Name Mug',
      slug: 'personalised-name-mug',
      description: 'A beautifully crafted ceramic mug personalised with any name. Perfect for everyday use or as a thoughtful gift.',
      basePrice: 14.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 2,
      occasions: ['birthday', 'christmas', 'thank-you'],
      personalization: [
        { optionKey: 'name', label: 'Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: { options: ['Classic', 'Modern', 'Script'] }, sortOrder: 2 },
      ],
    },
    {
      name: 'Engraved Heart Necklace',
      slug: 'engraved-heart-necklace',
      description: 'A stunning sterling silver heart necklace with custom engraving. A timeless piece that makes the perfect gift for someone special.',
      basePrice: 29.99,
      compareAtPrice: 39.99,
      categorySlug: 'jewellery',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 3,
      occasions: ['valentines-day', 'anniversary', 'mothers-day'],
      personalization: [
        { optionKey: 'engraving', label: 'Engraving Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 1.00, constraints: { options: ['Elegant', 'Classic', 'Handwritten'] }, sortOrder: 2 },
      ],
    },
    {
      name: 'Custom Photo Cushion',
      slug: 'custom-photo-cushion',
      description: 'A soft, plush cushion printed with your favourite photo. Made with premium fabric for lasting comfort and vivid colour reproduction.',
      basePrice: 24.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['birthday', 'christmas'],
      personalization: [
        { optionKey: 'photo', label: 'Upload Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 2.00, constraints: { maxFileSize: '5MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'message', label: 'Add Message', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Personalised Star Map Print',
      slug: 'personalised-star-map-print',
      description: 'A beautiful print showing the exact star alignment on any special date and location. A unique and meaningful keepsake.',
      basePrice: 19.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 2,
      occasions: ['anniversary', 'wedding', 'new-baby'],
      personalization: [
        { optionKey: 'date', label: 'Special Date', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'location', label: 'Location', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
        { optionKey: 'message', label: 'Custom Message', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 3 },
      ],
    },
    {
      name: 'Custom Family Portrait',
      slug: 'custom-family-portrait',
      description: 'A hand-illustrated digital family portrait created from your photos. Captures your family in a charming, artistic style.',
      basePrice: 34.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 5,
      occasions: ['birthday', 'christmas', 'mothers-day', 'fathers-day'],
      personalization: [
        { optionKey: 'photo', label: 'Upload Family Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 2.00, constraints: { maxFileSize: '10MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'names', label: 'Family Names', optionType: PersonalizationType.TEXTAREA, isRequired: false, priceModifier: 0, constraints: { maxLength: 100 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Engraved Wooden Watch',
      slug: 'engraved-wooden-watch',
      description: 'A handcrafted wooden watch with a personalised engraving on the back. Made from sustainable bamboo with a genuine leather strap.',
      basePrice: 49.99,
      categorySlug: 'clothing-accessories',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 4,
      occasions: ['birthday', 'fathers-day', 'graduation', 'anniversary'],
      personalization: [
        { optionKey: 'engraving', label: 'Back Engraving', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Strap Colour', optionType: PersonalizationType.COLOUR, isRequired: false, priceModifier: 0, constraints: { options: ['Brown', 'Black', 'Tan'] }, sortOrder: 2 },
      ],
    },
    {
      name: 'Baby Name Blanket',
      slug: 'baby-name-blanket',
      description: 'A super-soft cotton blanket embroidered with the baby\'s name. Available in a range of pastel colours, perfect for newborns.',
      basePrice: 22.99,
      categorySlug: 'baby-kids',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['new-baby', 'christmas'],
      personalization: [
        { optionKey: 'name', label: 'Baby Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Blanket Colour', optionType: PersonalizationType.COLOUR, isRequired: false, priceModifier: 0, constraints: { options: ['Pink', 'Blue', 'Cream', 'Mint'] }, sortOrder: 2 },
      ],
    },
    {
      name: 'Personalised Recipe Book',
      slug: 'personalised-recipe-book',
      description: 'A beautifully bound recipe book with a personalised cover. The perfect place to collect and treasure family recipes.',
      basePrice: 18.99,
      categorySlug: 'stationery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['birthday', 'mothers-day', 'christmas'],
      personalization: [
        { optionKey: 'name', label: 'Name on Cover', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 1 },
        { optionKey: 'subtitle', label: 'Subtitle', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Custom Coordinates Bracelet',
      slug: 'custom-coordinates-bracelet',
      description: 'A delicate bracelet engraved with the coordinates of a special place. Available in gold, silver, and rose gold finishes.',
      basePrice: 24.99,
      categorySlug: 'jewellery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['valentines-day', 'anniversary', 'wedding'],
      personalization: [
        { optionKey: 'coordinates', label: 'Coordinates', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Metal Finish', optionType: PersonalizationType.COLOUR, isRequired: false, priceModifier: 1.00, constraints: { options: ['Gold', 'Silver', 'Rose Gold'] }, sortOrder: 2 },
      ],
    },
    {
      name: 'Photo Memory Book',
      slug: 'photo-memory-book',
      description: 'A premium hardback photo book with a personalised cover. Upload your favourite memories and we\'ll create a beautiful keepsake.',
      basePrice: 27.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 3,
      occasions: ['birthday', 'anniversary', 'wedding', 'thank-you'],
      personalization: [
        { optionKey: 'photo', label: 'Cover Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 2.00, constraints: { maxFileSize: '5MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'title', label: 'Book Title', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Personalised Wedding Print',
      slug: 'personalised-wedding-print',
      description: 'A stunning typographic print celebrating a couple\'s wedding day. Features names, date, and venue in an elegant design.',
      basePrice: 21.99,
      categorySlug: 'wedding',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['wedding', 'anniversary'],
      personalization: [
        { optionKey: 'names', label: 'Couple Names', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 1 },
        { optionKey: 'date', label: 'Wedding Date', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 2 },
        { optionKey: 'venue', label: 'Venue', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 3 },
      ],
    },
    {
      name: 'Engraved Whisky Glass Set',
      slug: 'engraved-whisky-glass-set',
      description: 'A set of two premium crystal whisky glasses with custom engraving. Presented in an elegant gift box.',
      basePrice: 32.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['birthday', 'fathers-day', 'christmas', 'thank-you'],
      personalization: [
        { optionKey: 'engraving', label: 'Engraving Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 1.00, constraints: { options: ['Classic', 'Modern', 'Serif'] }, sortOrder: 2 },
      ],
    },
    {
      name: 'Custom Pet Portrait Mug',
      slug: 'custom-pet-portrait-mug',
      description: 'A ceramic mug featuring a hand-drawn portrait of your beloved pet. Upload a photo and our artists will create a unique illustration.',
      basePrice: 16.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['birthday', 'christmas', 'thank-you'],
      personalization: [
        { optionKey: 'photo', label: 'Upload Pet Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 2.00, constraints: { maxFileSize: '5MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'name', label: 'Pet Name', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Personalised Map Print',
      slug: 'personalised-map-print',
      description: 'A beautiful vintage-style map print centred on any location. Mark the spot where you met, got married, or call home.',
      basePrice: 19.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['anniversary', 'wedding', 'new-baby'],
      personalization: [
        { optionKey: 'location', label: 'Location', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 1 },
        { optionKey: 'message', label: 'Custom Message', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 2 },
      ],
    },
    {
      name: 'Name Rose Gold Pen',
      slug: 'name-rose-gold-pen',
      description: 'An elegant rose gold ballpoint pen engraved with any name. Comes in a luxury gift box, perfect for the stationery lover.',
      basePrice: 12.99,
      categorySlug: 'stationery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 1,
      occasions: ['birthday', 'graduation', 'thank-you'],
      personalization: [
        { optionKey: 'name', label: 'Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
      ],
    },
  ];

  const createdProducts = [];

  for (const p of productsData) {
    const encodedName = encodeURIComponent(p.name).replace(/%20/g, '+');
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice ?? null,
        categoryId: categoryMap[p.categorySlug],
        isPersonalizable: p.isPersonalizable,
        isFeatured: p.isFeatured,
        status: ProductStatus.ACTIVE,
        productionDays: p.productionDays,
        metaTitle: p.name,
        metaDescription: p.description,
        images: {
          createMany: {
            data: [
              {
                url: `https://placehold.co/800x800/e6dac6/5c4431?text=${encodedName}`,
                altText: p.name,
                sortOrder: 0,
                isPrimary: true,
              },
              {
                url: `https://placehold.co/800x800/d4c5a9/5c4431?text=${encodedName}+Detail`,
                altText: `${p.name} - Detail`,
                sortOrder: 1,
                isPrimary: false,
              },
            ],
          },
        },
        personalizationOptions: {
          createMany: {
            data: p.personalization.map((opt) => ({
              optionKey: opt.optionKey,
              label: opt.label,
              optionType: opt.optionType,
              isRequired: opt.isRequired,
              priceModifier: opt.priceModifier,
              constraints: opt.constraints as object,
              sortOrder: opt.sortOrder,
            })),
          },
        },
      },
    });

    createdProducts.push({ product, occasionSlugs: p.occasions });
  }

  console.log(`✅ ${createdProducts.length} products seeded`);

  // ─── Product-Occasion Links ───────────────────────────────────────────────
  let linkCount = 0;
  for (const { product, occasionSlugs } of createdProducts) {
    for (const slug of occasionSlugs) {
      await prisma.productOccasion.create({
        data: {
          productId: product.id,
          occasionId: occasionMap[slug],
        },
      });
      linkCount++;
    }
  }

  console.log(`✅ ${linkCount} product-occasion links seeded`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  const counts = {
    categories: await prisma.category.count(),
    occasions: await prisma.occasion.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    personalizationOptions: await prisma.personalizationOption.count(),
    productOccasions: await prisma.productOccasion.count(),
  };

  console.log('\n📊 Database summary:');
  console.log(`   Categories: ${counts.categories}`);
  console.log(`   Occasions: ${counts.occasions}`);
  console.log(`   Products: ${counts.products}`);
  console.log(`   Product Images: ${counts.images}`);
  console.log(`   Personalization Options: ${counts.personalizationOptions}`);
  console.log(`   Product-Occasion Links: ${counts.productOccasions}`);
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
