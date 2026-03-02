export const SITE_NAME = 'PersonalisedGifts'
export const SITE_DESCRIPTION = 'Unique personalised gifts, handcrafted with love. Find the perfect custom gift for every occasion.'
export const CURRENCY = 'GBP'
export const SHIPPING_COST = 3.99
export const FREE_SHIPPING_THRESHOLD = 40
export const GIFT_WRAP_COST = 2.50

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
