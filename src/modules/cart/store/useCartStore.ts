"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  variant?: string;
  image: string;
  slug: string;
  isCodAvailable?: boolean;
}

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockStatus: string;
}

interface CartStore {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getCartTotal: () => number;
  getSubtotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (item) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(
          (i) => i.productId === item.productId && (i.variant || "") === (item.variant || "")
        );
        const quantityToAdd = Math.max(1, Math.min(10, Math.floor(item.quantity ?? 1)));

        if (existingIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingIndex].quantity = Math.min(10, updatedCart[existingIndex].quantity + quantityToAdd);
          set({ cart: updatedCart });
        } else {
          set({
            cart: [...currentCart, { ...item, quantity: quantityToAdd }],
          });
        }
      },

      removeFromCart: (productId, variant) => {
        set({
          cart: get().cart.filter((item) => item.productId !== productId || item.variant !== variant),
        });
      },

      updateQuantity: (productId, quantity, variant) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variant);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.productId === productId && item.variant === variant ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (item) => {
        const currentWishlist = get().wishlist;
        const exists = currentWishlist.some((i) => i.productId === item.productId);

        if (exists) {
          set({
            wishlist: currentWishlist.filter((i) => i.productId !== item.productId),
          });
        } else {
          set({ wishlist: [...currentWishlist, item] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().getCartTotal();
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "kiddio-bag-v2",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useCartStore;
