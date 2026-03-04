export const SITE_NAME = 'PersonalisedGifts'
export const SITE_DESCRIPTION = 'Unique personalised gifts, handcrafted with love. Find the perfect custom gift for every occasion.'
export const CURRENCY = 'GBP'
export const CURRENCY_INR = 'INR'
export const GBP_TO_INR_RATE = 105
export const SHIPPING_COST = 3.99
export const FREE_SHIPPING_THRESHOLD = 40
export const GIFT_WRAP_COST = 2.50
export const SHIPPING_COST_INR = Math.round(SHIPPING_COST * GBP_TO_INR_RATE)
export const FREE_SHIPPING_THRESHOLD_INR = Math.round(FREE_SHIPPING_THRESHOLD * GBP_TO_INR_RATE)
export const GIFT_WRAP_COST_INR = Math.round(GIFT_WRAP_COST * GBP_TO_INR_RATE)

export const PRODUCT_IMAGES: Record<string, string> = {
  // Mugs & Drinkware
  'personalised-name-mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
  'engraved-whisky-glass-set': 'https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=600&h=600&fit=crop',
  'custom-pet-portrait-mug': 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=600&h=600&fit=crop',
  'personalised-enamel-camping-mug': 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=600&h=600&fit=crop',
  // Jewellery
  'engraved-heart-necklace': 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=600&h=600&fit=crop',
  'custom-coordinates-bracelet': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop',
  'initial-signet-ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
  // Home Decor
  'custom-photo-cushion': 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&h=600&fit=crop',
  'personalised-star-map-print': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop',
  'personalised-map-print': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=600&fit=crop',
  'personalised-chopping-board': 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop',
  // Photo Gifts
  'custom-family-portrait': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
  'photo-memory-book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
  'personalised-photo-canvas': 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
  // Clothing & Accessories
  'engraved-wooden-watch': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop',
  'engraved-leather-keyring': 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop',
  'personalised-silk-scarf': 'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=600&h=600&fit=crop',
  // Stationery
  'personalised-recipe-book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
  'name-rose-gold-pen': 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&h=600&fit=crop',
  'personalised-leather-journal': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop',
  // Baby & Kids
  'baby-name-blanket': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=600&fit=crop',
  'personalised-childrens-story-book': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
  // Wedding
  'personalised-wedding-print': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=600&fit=crop',
  'mr-mrs-ring-dish': 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=600&h=600&fit=crop',
}

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238f939?w=1600&h=600&fit=crop'

export const OCCASION_IMAGES: Record<string, string> = {
  'birthday': 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop',
  'wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
  'anniversary': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
  'new-baby': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop',
  'christmas': 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=300&fit=crop',
  'graduation': 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&h=300&fit=crop',
  'valentines-day': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
  'mothers-day': 'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=400&h=300&fit=crop',
  'fathers-day': 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=300&fit=crop',
  'thank-you': 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=400&h=300&fit=crop',
}

export const OCCASIONS = [
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
] as const

export const RECIPIENTS = [
  { name: 'For Her', slug: 'for-her' },
  { name: 'For Him', slug: 'for-him' },
  { name: 'For Kids', slug: 'for-kids' },
  { name: 'For Couples', slug: 'for-couples' },
  { name: 'For Friends', slug: 'for-friends' },
  { name: 'For Pets', slug: 'for-pets' },
] as const

export const CATEGORIES = [
  { name: 'Mugs & Drinkware', slug: 'mugs-drinkware', icon: '☕' },
  { name: 'Jewellery', slug: 'jewellery', icon: '💍' },
  { name: 'Photo Gifts', slug: 'photo-gifts', icon: '📷' },
  { name: 'Home & Living', slug: 'home-living', icon: '🏠' },
  { name: 'Clothing & Accessories', slug: 'clothing-accessories', icon: '👕' },
  { name: 'Stationery', slug: 'stationery', icon: '📝' },
  { name: 'Keepsakes', slug: 'keepsakes', icon: '🎁' },
  { name: 'Prints & Wall Art', slug: 'prints-wall-art', icon: '🖼️' },
] as const

export const PERSONALISATION_FONTS = [
  'Georgia',
  'Dancing Script',
  'Montserrat',
  'Pacifico',
  'Playfair Display',
  'Lato',
  'Great Vibes',
  'Roboto Slab',
] as const

export const PERSONALISATION_COLOURS = [
  { name: 'Red', value: '#C0392B' },
  { name: 'Navy', value: '#2C3E50' },
  { name: 'Green', value: '#27AE60' },
  { name: 'Gold', value: '#F39C12' },
  { name: 'Purple', value: '#8E44AD' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
] as const
