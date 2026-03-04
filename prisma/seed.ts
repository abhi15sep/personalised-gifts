import { PrismaClient } from '@prisma/client';

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
  // Each product has curated Unsplash images
  const productsData = [
    // ── Mugs & Drinkware ──────────────────────────────────────────────────
    {
      name: 'Personalised Name Mug',
      slug: 'personalised-name-mug',
      description: 'A beautifully crafted ceramic mug personalised with any name of your choice. Made from premium white ceramic with a glossy finish and comfortable handle. Dishwasher and microwave safe. Capacity: 330ml. The perfect everyday gift that will bring a smile with every sip.',
      basePrice: 14.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 2,
      occasions: ['birthday', 'christmas', 'thank-you'],
      images: [
        { url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop', alt: 'White ceramic mug with personalised name' },
        { url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop', alt: 'Personalised mug close-up detail' },
        { url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&h=800&fit=crop', alt: 'Personalised mug on desk' },
      ],
      personalization: [
        { optionKey: 'name', label: 'Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 2 },
        { optionKey: 'colour', label: 'Text Colour', optionType: PersonalizationType.COLOUR, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 3 },
      ],
      variants: [
        { name: 'Standard (330ml)', sku: 'MUG-STD', price: 14.99, stockQty: 50 },
        { name: 'Large (450ml)', sku: 'MUG-LRG', price: 17.99, stockQty: 30 },
      ],
    },
    {
      name: 'Engraved Whisky Glass Set',
      slug: 'engraved-whisky-glass-set',
      description: 'A set of two premium crystal whisky glasses with bespoke engraving. Each glass is hand-finished with a weighted base for the perfect drinking experience. Presented in a luxury black gift box lined with satin. The ultimate gift for whisky lovers.',
      basePrice: 34.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 3,
      occasions: ['birthday', 'fathers-day', 'christmas', 'thank-you'],
      images: [
        { url: 'https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=800&h=800&fit=crop', alt: 'Engraved whisky glass set in gift box' },
        { url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&h=800&fit=crop', alt: 'Crystal whisky glass close-up' },
        { url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&h=800&fit=crop', alt: 'Whisky glass in use' },
      ],
      personalization: [
        { optionKey: 'engraving', label: 'Engraving Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Custom Pet Portrait Mug',
      slug: 'custom-pet-portrait-mug',
      description: 'A ceramic mug featuring a hand-drawn illustration of your beloved pet. Simply upload a clear photo and our artists will create a charming watercolour-style portrait. Each mug is individually crafted and makes a wonderfully unique gift for any animal lover.',
      basePrice: 18.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 4,
      occasions: ['birthday', 'christmas', 'thank-you'],
      images: [
        { url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&h=800&fit=crop', alt: 'Pet portrait printed on ceramic mug' },
        { url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop', alt: 'Cat portrait illustration style' },
      ],
      personalization: [
        { optionKey: 'photo', label: 'Upload Pet Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 3.00, constraints: { maxFileSize: '5MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'name', label: 'Pet Name', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Enamel Camping Mug',
      slug: 'personalised-enamel-camping-mug',
      description: 'A vintage-style enamel camping mug with custom text. Durable and lightweight, perfect for outdoor adventures, festivals, or as a charming desk accessory. Hand-finished with a rolled steel rim. Capacity: 350ml.',
      basePrice: 12.99,
      categorySlug: 'mugs-drinkware',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['birthday', 'fathers-day', 'thank-you'],
      images: [
        { url: 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=800&h=800&fit=crop', alt: 'Enamel camping mug outdoors' },
        { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop', alt: 'Camping mug in nature setting' },
      ],
      personalization: [
        { optionKey: 'text', label: 'Custom Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 2 },
      ],
      variants: [],
    },

    // ── Jewellery ─────────────────────────────────────────────────────────
    {
      name: 'Engraved Heart Necklace',
      slug: 'engraved-heart-necklace',
      description: 'A stunning sterling silver heart pendant with delicate custom engraving. Hangs on an 18-inch sterling silver chain with a secure lobster clasp. Each piece is hand-engraved by our skilled craftspeople, making every necklace truly one-of-a-kind. Presented in a velvet jewellery box.',
      basePrice: 32.99,
      compareAtPrice: 42.99,
      categorySlug: 'jewellery',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 3,
      occasions: ['valentines-day', 'anniversary', 'mothers-day', 'birthday'],
      images: [
        { url: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=800&h=800&fit=crop', alt: 'Sterling silver heart necklace' },
        { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', alt: 'Heart pendant close-up' },
        { url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop', alt: 'Necklace in gift box' },
      ],
      personalization: [
        { optionKey: 'engraving', label: 'Engraving Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 15 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Engraving Font', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 2 },
      ],
      variants: [
        { name: 'Silver', sku: 'HN-SLV', price: 32.99, stockQty: 25 },
        { name: 'Rose Gold', sku: 'HN-RG', price: 37.99, stockQty: 20 },
        { name: 'Gold', sku: 'HN-GLD', price: 39.99, stockQty: 15 },
      ],
    },
    {
      name: 'Custom Coordinates Bracelet',
      slug: 'custom-coordinates-bracelet',
      description: 'A delicate bracelet engraved with the GPS coordinates of any meaningful location. Whether it\'s where you first met, got married, or simply call home — carry that special place with you always. Available in three elegant metal finishes with an adjustable chain.',
      basePrice: 27.99,
      categorySlug: 'jewellery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['valentines-day', 'anniversary', 'wedding'],
      images: [
        { url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop', alt: 'Coordinates bracelet on wrist' },
        { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', alt: 'Gold bracelet close-up' },
      ],
      personalization: [
        { optionKey: 'coordinates', label: 'Coordinates or Location', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 1 },
        { optionKey: 'finish', label: 'Metal Finish', optionType: PersonalizationType.DROPDOWN, isRequired: true, priceModifier: 0, constraints: { options: ['Silver', 'Gold', 'Rose Gold'] }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Initial Signet Ring',
      slug: 'initial-signet-ring',
      description: 'A classic signet ring hand-engraved with your chosen initial. Crafted from solid sterling silver with a brushed matte finish. A timeless piece of personalised jewellery that makes a bold yet elegant statement.',
      basePrice: 44.99,
      categorySlug: 'jewellery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 4,
      occasions: ['birthday', 'graduation', 'fathers-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop', alt: 'Silver signet ring with initial' },
        { url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop', alt: 'Signet ring on hand' },
      ],
      personalization: [
        { optionKey: 'initial', label: 'Initial Letter', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 1 }, sortOrder: 1 },
        { optionKey: 'font', label: 'Engraving Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 2 },
      ],
      variants: [
        { name: 'Small (L-O)', sku: 'SR-SM', price: 44.99, stockQty: 15 },
        { name: 'Medium (P-S)', sku: 'SR-MD', price: 44.99, stockQty: 15 },
        { name: 'Large (T-W)', sku: 'SR-LG', price: 44.99, stockQty: 15 },
      ],
    },

    // ── Home Decor ────────────────────────────────────────────────────────
    {
      name: 'Custom Photo Cushion',
      slug: 'custom-photo-cushion',
      description: 'A luxuriously soft cushion printed with your favourite photograph. Made from premium faux suede with a hidden zip closure and plump polyester filling. The vivid, full-colour print won\'t fade with washing. Size: 45cm x 45cm.',
      basePrice: 26.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['birthday', 'christmas', 'mothers-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=800&h=800&fit=crop', alt: 'Custom photo cushion on sofa' },
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', alt: 'Decorative cushions on couch' },
      ],
      personalization: [
        { optionKey: 'photo', label: 'Upload Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 2.00, constraints: { maxFileSize: '5MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'message', label: 'Add Message (optional)', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Star Map Print',
      slug: 'personalised-star-map-print',
      description: 'A stunning art print showing the exact constellation of stars as they appeared on any date and location you choose. Printed on 300gsm museum-quality art paper with archival inks. Perfect for commemorating birthdays, anniversaries, or the night you met.',
      basePrice: 24.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 2,
      occasions: ['anniversary', 'wedding', 'new-baby', 'valentines-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop', alt: 'Star map print on wall' },
        { url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=800&fit=crop', alt: 'Night sky constellation artwork' },
        { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=800&fit=crop', alt: 'Framed art print in room setting' },
      ],
      personalization: [
        { optionKey: 'date', label: 'Special Date', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'location', label: 'Location', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
        { optionKey: 'message', label: 'Custom Message', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 40 }, sortOrder: 3 },
      ],
      variants: [
        { name: 'A4 Print', sku: 'SM-A4', price: 24.99, stockQty: 40 },
        { name: 'A3 Print', sku: 'SM-A3', price: 34.99, stockQty: 30 },
        { name: 'A3 Framed', sku: 'SM-A3F', price: 54.99, stockQty: 15 },
      ],
    },
    {
      name: 'Personalised Map Print',
      slug: 'personalised-map-print',
      description: 'A beautiful vintage-style ordnance map print centred on any location of your choice. Mark the spot where you met, got married, or call home. Printed on heavyweight art paper with a subtle aged finish. Comes unframed for you to display your way.',
      basePrice: 22.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['anniversary', 'wedding', 'new-baby'],
      images: [
        { url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop', alt: 'Vintage map print' },
        { url: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=800&h=800&fit=crop', alt: 'Map print detail showing streets' },
      ],
      personalization: [
        { optionKey: 'location', label: 'Location / Postcode', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 40 }, sortOrder: 1 },
        { optionKey: 'message', label: 'Caption Text', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Chopping Board',
      slug: 'personalised-chopping-board',
      description: 'A solid oak chopping board laser-engraved with your chosen text. Made from sustainably sourced wood with a food-safe mineral oil finish. Perfect as a kitchen display piece or for everyday use. Size: 30cm x 20cm.',
      basePrice: 29.99,
      categorySlug: 'home-decor',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 3,
      occasions: ['wedding', 'christmas', 'mothers-day', 'fathers-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=800&fit=crop', alt: 'Engraved wooden chopping board' },
        { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=800&fit=crop', alt: 'Wooden board with food styling' },
      ],
      personalization: [
        { optionKey: 'text', label: 'Engraving Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 1 },
        { optionKey: 'subtitle', label: 'Subtitle (e.g. Est. 2024)', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 2 },
        { optionKey: 'font', label: 'Font Style', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 3 },
      ],
      variants: [],
    },

    // ── Photo Gifts ───────────────────────────────────────────────────────
    {
      name: 'Custom Family Portrait Illustration',
      slug: 'custom-family-portrait',
      description: 'A bespoke hand-illustrated digital portrait of your family, drawn from your photographs. Our artists capture each family member in a charming, modern illustration style. Printed on premium 300gsm art paper. Processing takes 5-7 days as each portrait is individually drawn.',
      basePrice: 39.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 5,
      occasions: ['birthday', 'christmas', 'mothers-day', 'fathers-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=800&fit=crop', alt: 'Custom family portrait illustration' },
        { url: 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?w=800&h=800&fit=crop', alt: 'Illustrated portrait style example' },
      ],
      personalization: [
        { optionKey: 'photo', label: 'Upload Family Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 0, constraints: { maxFileSize: '10MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
        { optionKey: 'names', label: 'Family Member Names', optionType: PersonalizationType.TEXTAREA, isRequired: false, priceModifier: 0, constraints: { maxLength: 100 }, sortOrder: 2 },
        { optionKey: 'style', label: 'Art Style', optionType: PersonalizationType.DROPDOWN, isRequired: false, priceModifier: 0, constraints: { options: ['Modern Minimalist', 'Watercolour', 'Cartoon', 'Line Art'] }, sortOrder: 3 },
      ],
      variants: [
        { name: 'Digital Only', sku: 'FP-DIG', price: 39.99, stockQty: 999 },
        { name: 'A4 Print', sku: 'FP-A4', price: 49.99, stockQty: 30 },
        { name: 'A3 Framed', sku: 'FP-A3F', price: 69.99, stockQty: 15 },
      ],
    },
    {
      name: 'Photo Memory Book',
      slug: 'photo-memory-book',
      description: 'A premium linen-bound photo book with a personalised foil-stamped cover. Upload your favourite photos and we\'ll arrange them in a beautiful layout across 20 thick, lay-flat pages. A timeless keepsake to treasure forever.',
      basePrice: 34.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 5,
      occasions: ['birthday', 'anniversary', 'wedding', 'thank-you'],
      images: [
        { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop', alt: 'Premium photo memory book' },
        { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop', alt: 'Open photo book with memories' },
      ],
      personalization: [
        { optionKey: 'title', label: 'Cover Title', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 1 },
        { optionKey: 'subtitle', label: 'Subtitle', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Photo Canvas',
      slug: 'personalised-photo-canvas',
      description: 'Turn your favourite photo into gallery-quality wall art. Printed on premium 380gsm cotton canvas with fade-resistant inks, stretched over a solid pine frame. Ready to hang straight out of the box. A meaningful way to display your most precious memories.',
      basePrice: 29.99,
      categorySlug: 'photo-gifts',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['birthday', 'anniversary', 'christmas'],
      images: [
        { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop', alt: 'Photo canvas print on wall' },
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop', alt: 'Canvas print in living room' },
      ],
      personalization: [
        { optionKey: 'photo', label: 'Upload Photo', optionType: PersonalizationType.IMAGE, isRequired: true, priceModifier: 0, constraints: { maxFileSize: '10MB', acceptedTypes: ['image/jpeg', 'image/png'] }, sortOrder: 1 },
      ],
      variants: [
        { name: '20x20cm', sku: 'CV-20', price: 29.99, stockQty: 30 },
        { name: '30x30cm', sku: 'CV-30', price: 39.99, stockQty: 25 },
        { name: '50x40cm', sku: 'CV-50', price: 54.99, stockQty: 20 },
      ],
    },

    // ── Clothing & Accessories ────────────────────────────────────────────
    {
      name: 'Engraved Wooden Watch',
      slug: 'engraved-wooden-watch',
      description: 'A handcrafted watch made from sustainably sourced walnut wood with a genuine leather strap. The caseback is laser-engraved with your personalised message. Features Japanese quartz movement for reliable timekeeping. Presented in a handmade wooden gift box.',
      basePrice: 54.99,
      compareAtPrice: 69.99,
      categorySlug: 'clothing-accessories',
      isPersonalizable: true,
      isFeatured: true,
      productionDays: 4,
      occasions: ['birthday', 'fathers-day', 'graduation', 'anniversary'],
      images: [
        { url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', alt: 'Wooden watch with leather strap' },
        { url: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&h=800&fit=crop', alt: 'Watch caseback with engraving' },
        { url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', alt: 'Wooden watch on wrist' },
      ],
      personalization: [
        { optionKey: 'engraving', label: 'Back Engraving', optionType: PersonalizationType.TEXTAREA, isRequired: true, priceModifier: 0, constraints: { maxLength: 60 }, sortOrder: 1 },
        { optionKey: 'strap', label: 'Strap Colour', optionType: PersonalizationType.DROPDOWN, isRequired: false, priceModifier: 0, constraints: { options: ['Brown Leather', 'Black Leather', 'Tan Leather'] }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Engraved Leather Keyring',
      slug: 'engraved-leather-keyring',
      description: 'A premium full-grain leather keyring with custom text engraved in gold foil. Made from Italian vegetable-tanned leather that develops a beautiful patina over time. A small but meaningful gift that they\'ll carry every day.',
      basePrice: 14.99,
      categorySlug: 'clothing-accessories',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['birthday', 'fathers-day', 'christmas', 'graduation'],
      images: [
        { url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop', alt: 'Leather keyring with gold engraving' },
        { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop', alt: 'Leather keyring close-up' },
      ],
      personalization: [
        { optionKey: 'text', label: 'Engraving Text', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Leather Colour', optionType: PersonalizationType.DROPDOWN, isRequired: false, priceModifier: 0, constraints: { options: ['Tan', 'Dark Brown', 'Black'] }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Silk Scarf',
      slug: 'personalised-silk-scarf',
      description: 'A luxurious 100% mulberry silk scarf with hand-rolled edges. Choose from our beautiful designs and add a monogram or personal message elegantly embroidered in the corner. Size: 90cm x 90cm. A truly special gift she\'ll treasure.',
      basePrice: 49.99,
      categorySlug: 'clothing-accessories',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 4,
      occasions: ['birthday', 'mothers-day', 'christmas', 'valentines-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=800&h=800&fit=crop', alt: 'Silk scarf with elegant pattern' },
        { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop', alt: 'Scarf styling detail' },
      ],
      personalization: [
        { optionKey: 'monogram', label: 'Monogram Initials', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 3 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Thread Colour', optionType: PersonalizationType.COLOUR, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 2 },
      ],
      variants: [],
    },

    // ── Stationery ────────────────────────────────────────────────────────
    {
      name: 'Personalised Recipe Book',
      slug: 'personalised-recipe-book',
      description: 'A beautifully bound hardback recipe book with a personalised foil-stamped cover. Contains 100 guided recipe pages with space for ingredients, method, notes, and a photo. The perfect place to collect and treasure family recipes for generations.',
      basePrice: 21.99,
      categorySlug: 'stationery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['birthday', 'mothers-day', 'christmas', 'wedding'],
      images: [
        { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop', alt: 'Personalised recipe book' },
        { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop', alt: 'Recipe book open on kitchen counter' },
      ],
      personalization: [
        { optionKey: 'name', label: 'Name on Cover', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 25 }, sortOrder: 1 },
        { optionKey: 'subtitle', label: 'Subtitle', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 2 },
      ],
      variants: [],
    },
    {
      name: 'Name Rose Gold Pen',
      slug: 'name-rose-gold-pen',
      description: 'An elegant rose gold ballpoint pen with your name laser-engraved in a refined script. Writes with a smooth black ink cartridge (replaceable). Presented in a luxury gift box with a satin lining. The perfect gift for graduates, colleagues, or stationery lovers.',
      basePrice: 14.99,
      categorySlug: 'stationery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 1,
      occasions: ['birthday', 'graduation', 'thank-you'],
      images: [
        { url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop', alt: 'Rose gold pen with engraving' },
        { url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&h=800&fit=crop', alt: 'Pen in gift box' },
      ],
      personalization: [
        { optionKey: 'name', label: 'Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Leather Journal',
      slug: 'personalised-leather-journal',
      description: 'A hand-stitched genuine leather journal with custom debossed initials on the cover. Contains 200 pages of premium 120gsm cream paper, suitable for fountain pens. Features a wrap-around leather tie closure. A journal that gets more beautiful with age.',
      basePrice: 34.99,
      categorySlug: 'stationery',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['birthday', 'graduation', 'christmas'],
      images: [
        { url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop', alt: 'Leather journal with embossed initials' },
        { url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=800&fit=crop', alt: 'Open journal with pen' },
      ],
      personalization: [
        { optionKey: 'initials', label: 'Initials (up to 3)', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 3 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Leather Colour', optionType: PersonalizationType.DROPDOWN, isRequired: false, priceModifier: 0, constraints: { options: ['Tan', 'Dark Brown', 'Black', 'Burgundy'] }, sortOrder: 2 },
      ],
      variants: [],
    },

    // ── Baby & Kids ───────────────────────────────────────────────────────
    {
      name: 'Baby Name Blanket',
      slug: 'baby-name-blanket',
      description: 'A super-soft organic cotton blanket lovingly embroidered with baby\'s name. Made from GOTS-certified organic cotton in a luxurious waffle weave. Machine washable at 40°C. Size: 80cm x 100cm. Available in a range of gentle pastel colours.',
      basePrice: 24.99,
      categorySlug: 'baby-kids',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['new-baby', 'christmas'],
      images: [
        { url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop', alt: 'Personalised baby blanket' },
        { url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=800&fit=crop', alt: 'Baby wrapped in blanket' },
      ],
      personalization: [
        { optionKey: 'name', label: 'Baby Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'colour', label: 'Blanket Colour', optionType: PersonalizationType.DROPDOWN, isRequired: true, priceModifier: 0, constraints: { options: ['Blush Pink', 'Sky Blue', 'Cream', 'Sage Green', 'Lavender'] }, sortOrder: 2 },
        { optionKey: 'font', label: 'Embroidery Font', optionType: PersonalizationType.FONT, isRequired: false, priceModifier: 0, constraints: {}, sortOrder: 3 },
      ],
      variants: [],
    },
    {
      name: 'Personalised Children\'s Story Book',
      slug: 'personalised-childrens-story-book',
      description: 'A magical story book where your child is the star! Enter their name, age, and hair colour, and we\'ll create a beautifully illustrated adventure just for them. 24 pages of hardback wonder. A gift that sparks imagination and a love of reading.',
      basePrice: 22.99,
      categorySlug: 'baby-kids',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 4,
      occasions: ['birthday', 'christmas', 'new-baby'],
      images: [
        { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop', alt: 'Personalised children story book' },
        { url: 'https://images.unsplash.com/photo-1629992101753-56d196c8adf7?w=800&h=800&fit=crop', alt: 'Child reading illustrated book' },
      ],
      personalization: [
        { optionKey: 'name', label: 'Child\'s Name', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 15 }, sortOrder: 1 },
        { optionKey: 'age', label: 'Child\'s Age', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 2 }, sortOrder: 2 },
        { optionKey: 'dedication', label: 'Dedication Message', optionType: PersonalizationType.TEXTAREA, isRequired: false, priceModifier: 0, constraints: { maxLength: 100 }, sortOrder: 3 },
      ],
      variants: [],
    },

    // ── Wedding ───────────────────────────────────────────────────────────
    {
      name: 'Personalised Wedding Print',
      slug: 'personalised-wedding-print',
      description: 'A stunning typographic art print celebrating a couple\'s special day. Features the couple\'s names, wedding date, and venue beautifully arranged in an elegant design. Printed on heavyweight 300gsm art paper. A cherished keepsake they\'ll display forever.',
      basePrice: 24.99,
      categorySlug: 'wedding',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 2,
      occasions: ['wedding', 'anniversary'],
      images: [
        { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop', alt: 'Wedding typography print' },
        { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop', alt: 'Wedding gift display' },
      ],
      personalization: [
        { optionKey: 'names', label: 'Couple\'s Names', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 1 },
        { optionKey: 'date', label: 'Wedding Date', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 2 },
        { optionKey: 'venue', label: 'Venue', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 30 }, sortOrder: 3 },
      ],
      variants: [
        { name: 'A4 Print', sku: 'WP-A4', price: 24.99, stockQty: 30 },
        { name: 'A3 Print', sku: 'WP-A3', price: 34.99, stockQty: 20 },
        { name: 'A3 Framed', sku: 'WP-A3F', price: 49.99, stockQty: 15 },
      ],
    },
    {
      name: 'Mr & Mrs Ring Dish',
      slug: 'mr-mrs-ring-dish',
      description: 'A beautiful ceramic ring dish hand-painted with "Mr & Mrs" and the couple\'s surname. Finished with real gold lustre detail. The perfect wedding gift or engagement present for keeping precious rings safe. Diameter: 10cm.',
      basePrice: 19.99,
      categorySlug: 'wedding',
      isPersonalizable: true,
      isFeatured: false,
      productionDays: 3,
      occasions: ['wedding', 'anniversary', 'valentines-day'],
      images: [
        { url: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&h=800&fit=crop', alt: 'Ceramic ring dish with gold detail' },
        { url: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800&h=800&fit=crop', alt: 'Wedding rings on dish' },
      ],
      personalization: [
        { optionKey: 'surname', label: 'Surname', optionType: PersonalizationType.TEXT, isRequired: true, priceModifier: 0, constraints: { maxLength: 20 }, sortOrder: 1 },
        { optionKey: 'date', label: 'Wedding Date', optionType: PersonalizationType.TEXT, isRequired: false, priceModifier: 0, constraints: { maxLength: 15 }, sortOrder: 2 },
      ],
      variants: [],
    },
  ];

  const createdProducts = [];

  for (const p of productsData) {
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
        metaDescription: p.description.slice(0, 160),
        images: {
          createMany: {
            data: p.images.map((img, i) => ({
              url: img.url,
              altText: img.alt,
              sortOrder: i,
              isPrimary: i === 0,
            })),
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
        ...(p.variants && p.variants.length > 0
          ? {
              variants: {
                createMany: {
                  data: p.variants.map((v) => ({
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    stockQty: v.stockQty,
                  })),
                },
              },
            }
          : {}),
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

  // ─── Summary ──────────────────────────────────────────────────────────
  const counts = {
    categories: await prisma.category.count(),
    occasions: await prisma.occasion.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    variants: await prisma.productVariant.count(),
    personalizationOptions: await prisma.personalizationOption.count(),
    productOccasions: await prisma.productOccasion.count(),
  };

  console.log('\n📊 Database summary:');
  console.log(`   Categories: ${counts.categories}`);
  console.log(`   Occasions: ${counts.occasions}`);
  console.log(`   Products: ${counts.products}`);
  console.log(`   Product Images: ${counts.images}`);
  console.log(`   Product Variants: ${counts.variants}`);
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
