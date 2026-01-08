'use client';
import { VariantCartItem } from '@/Entities/Variant';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface FavoritesContextType {
  favorites: VariantCartItem[];
  addToFavorites: (item: Partial<VariantCartItem> & { id: number }) => void;
  removeFromFavorites: (id: number) => void;
  clearFavorites: () => void;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

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

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<VariantCartItem[]>([]);
  const { data: session, status } = useSession();

  const hydrateFavorites = useCallback(async (items: { variant_id: number }[]) => {
    if (items.length === 0) {
      setFavorites([]);
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
        setFavorites(details);
      }
    } catch (err) {
      console.error('Failed to hydrate favorites', err);
    }
  }, []);

  const refreshFavorites = useCallback(async () => {
    if (status === 'authenticated') {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const dbItems = await res.json();
        await hydrateFavorites(dbItems.map((i: any) => ({ variant_id: i.variant_id })));
      }
    } else if (status === 'unauthenticated') {
      const saved = getCookie('favorites');
      if (saved) {
        const items = JSON.parse(saved);
        await hydrateFavorites(items);
      } else {
        setFavorites([]);
      }
    }
  }, [status, hydrateFavorites]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Sync guest favorites to DB on login
  useEffect(() => {
    if (status === 'authenticated') {
      const guestFavs = getCookie('favorites');
      if (guestFavs) {
        const items = JSON.parse(guestFavs);
        if (items.length > 0) {
          Promise.all(items.map((item: any) =>
            fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ variant_id: item.variant_id, action: 'add' })
            })
          )).then(() => {
            setCookie('favorites', '', -1);
            refreshFavorites();
          });
        }
      }
    }
  }, [status, refreshFavorites]);

  const addToFavorites = async (item: Partial<VariantCartItem> & { id: number }) => {
    if (status === 'authenticated') {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: item.id, action: 'add' })
      });
      await refreshFavorites();
    } else {
      const currentItems = JSON.parse(getCookie('favorites') || '[]');
      if (!currentItems.find((i: any) => i.variant_id === item.id)) {
        currentItems.push({ variant_id: item.id });
        setCookie('favorites', JSON.stringify(currentItems));
        await refreshFavorites();
      }
    }
  };

  const removeFromFavorites = async (id: number) => {
    if (status === 'authenticated') {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: id, action: 'remove' })
      });
      await refreshFavorites();
    } else {
      const currentItems = JSON.parse(getCookie('favorites') || '[]');
      const filtered = currentItems.filter((i: any) => i.variant_id !== id);
      setCookie('favorites', JSON.stringify(filtered));
      await refreshFavorites();
    }
  };

  const clearFavorites = async () => {
    if (status === 'authenticated') {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      setFavorites([]);
    } else {
      setCookie('favorites', '[]');
      setFavorites([]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, clearFavorites, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
