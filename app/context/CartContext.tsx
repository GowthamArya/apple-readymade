'use client';
import { VariantCartItem } from '@/Entities/Variant';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface CartContextType {
  cart: VariantCartItem[];
  addToCart: (item: Partial<VariantCartItem> & { id: number }, quantityDelta?: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper for cookies
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<VariantCartItem[]>([]);
  const { data: session, status } = useSession();

  const hydrateCart = useCallback(async (items: { variant_id: number, quantity: number }[]) => {
    if (items.length === 0) {
      setCart([]);
      return;
    }

    try {
      const res = await fetch('/api/cart/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantIds: items.map(i => i.variant_id) })
      });
      if (res.ok) {
        const details: VariantCartItem[] = await res.json();
        const fullCart = details.map(detail => {
          const item = items.find(i => i.variant_id === detail.id);
          return { ...detail, quantity: item?.quantity || 1 };
        });
        setCart(fullCart);
      }
    } catch (err) {
      console.error('Failed to hydrate cart', err);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (status === 'authenticated') {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const dbItems = await res.json();
        await hydrateCart(dbItems.map((i: any) => ({ variant_id: i.variant_id, quantity: i.quantity })));
      }
    } else if (status === 'unauthenticated') {
      const savedCart = getCookie('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        await hydrateCart(items);
      } else {
        setCart([]);
      }
    }
  }, [status, hydrateCart]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Sync guest cart to DB on login
  useEffect(() => {
    if (status === 'authenticated') {
      const guestCart = getCookie('cart');
      if (guestCart) {
        const items = JSON.parse(guestCart);
        if (items.length > 0) {
          Promise.all(items.map((item: any) =>
            fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ variant_id: item.variant_id, quantity: item.quantity, action: 'add' })
            })
          )).then(() => {
            setCookie('cart', '', -1); // Clear guest cookie
            refreshCart();
          });
        }
      }
    }
  }, [status, refreshCart]);

  const addToCart = async (item: Partial<VariantCartItem> & { id: number }, quantityDelta: number = 1) => {
    if (status === 'authenticated') {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: item.id, quantity: quantityDelta, action: 'add' })
      });
      await refreshCart();
    } else {
      const currentItems = JSON.parse(getCookie('cart') || '[]');
      const existing = currentItems.find((i: any) => i.variant_id === item.id);
      if (existing) {
        existing.quantity += quantityDelta;
      } else {
        currentItems.push({ variant_id: item.id, quantity: Math.max(1, quantityDelta) });
      }
      setCookie('cart', JSON.stringify(currentItems));
      await refreshCart();
    }
  };

  const removeFromCart = async (id: number) => {
    if (status === 'authenticated') {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: id, action: 'remove' })
      });
      await refreshCart();
    } else {
      const currentItems = JSON.parse(getCookie('cart') || '[]');
      const filtered = currentItems.filter((i: any) => i.variant_id !== id);
      setCookie('cart', JSON.stringify(filtered));
      refreshCart();
    }
  };

  const clearCart = async () => {
    if (status === 'authenticated') {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      setCart([]);
    } else {
      setCookie('cart', '[]');
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
