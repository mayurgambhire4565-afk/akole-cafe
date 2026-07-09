import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {  Cart, CartItem  } from '@/types';

interface CartStore {
  cart: Cart | null;
  isOpen: boolean;
  itemCount: number;
  total: number;

  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;

  // Optimistic helpers
  getItemQuantity: (productId: string) => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
};

const calculateCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      itemCount: 0,
      total: 0,

      setCart: (cart) =>
        set({
          cart,
          itemCount: cart ? calculateCount(cart.items) : 0,
          total: cart ? calculateTotal(cart.items) : 0,
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ cart: null, itemCount: 0, total: 0 }),

      getItemQuantity: (productId) => {
        const cart = get().cart;
        if (!cart) return 0;
        const item = cart.items.find((i) => i.productId === productId);
        return item?.quantity ?? 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ itemCount: state.itemCount }),
    }
  )
);
