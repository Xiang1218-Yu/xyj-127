import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  favorites: string[];
  toggleFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
  favoriteCount: number;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (locationId: string) => {
        set((state) => {
          const exists = state.favorites.includes(locationId);
          if (exists) {
            return { favorites: state.favorites.filter((id) => id !== locationId) };
          }
          return { favorites: [...state.favorites, locationId] };
        });
      },

      isFavorite: (locationId: string) => {
        return get().favorites.includes(locationId);
      },

      get favoriteCount() {
        return get().favorites.length;
      },
    }),
    {
      name: 'favorite-storage',
    }
  )
);
