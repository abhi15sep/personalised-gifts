import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItemPersonalization {
  [key: string]: string | number | boolean
}

export interface CartItem {
  id: string
  productId: number
  variantId?: number
  name: string
  slug: string
  price: number
  personalizationPrice: number
  quantity: number
  imageUrl: string
  previewImageUrl?: string
  personalization?: CartItemPersonalization
  personalizationSummary?: string
}

interface CartState {
  items: CartItem[]
  isGift: boolean
  giftMessage: string
  giftWrap: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setGiftOptions: (isGift: boolean, giftMessage?: string, giftWrap?: boolean) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isGift: false,
      giftMessage: '',
      giftWrap: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      setGiftOptions: (isGift, giftMessage = '', giftWrap = false) => {
        set({ isGift, giftMessage, giftWrap })
      },

      clearCart: () => {
        set({ items: [], isGift: false, giftMessage: '', giftWrap: false })
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.price + item.personalizationPrice) * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
