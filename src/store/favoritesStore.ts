import { create } from 'zustand';
import { GalleryImage } from '@/types/gallery';
import { storage } from '@/services/storage/mmkvStorage';
import { CONSTANTS } from '@/utils/constants';

interface FavoritesState {
  favorites: GalleryImage[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

interface FavoritesStore extends FavoritesState {
  // Actions
  loadFavorites: () => Promise<void>;
  addFavorite: (image: GalleryImage) => Promise<void>;
  removeFavorite: (imageId: string) => Promise<void>;
  toggleFavorite: (image: GalleryImage) => Promise<void>;
  isFavorite: (imageId: string) => boolean;
  clearAllFavorites: () => Promise<void>;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
};

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  ...initialState,

  loadFavorites: async () => {
    set({ isLoading: true, hasError: false });

    try {
      const favorites = await storage.get<GalleryImage[]>(CONSTANTS.STORAGE.FAVORITES_KEY) || [];
      // console.log("😊",favorites);
      
      set({ favorites, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        hasError: true,
        errorMessage: 'Failed to load favorites',
      });
    } finally{
      set({
        isLoading: false,
      });
    }
  },

  addFavorite: async (image: GalleryImage) => {
    const state = get();
    const updatedFavorites = [...state.favorites, { ...image, isFavorite: true }];
    
    try {
      await storage.set(CONSTANTS.STORAGE.FAVORITES_KEY, updatedFavorites);
      set({ favorites: updatedFavorites });
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  },

  removeFavorite: async (imageId: string) => {
    const state = get();
    const updatedFavorites = state.favorites.filter(img => img.id !== imageId);
    
    try {
      await storage.set(CONSTANTS.STORAGE.FAVORITES_KEY, updatedFavorites);
      set({ favorites: updatedFavorites });
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },

  toggleFavorite: async (image: GalleryImage) => {
    const state = get();
    const isFavorite = state.favorites.some(fav => fav.id === image.id);
    
    if (isFavorite) {
      await get().removeFavorite(image.id);
    } else {
      await get().addFavorite(image);
    }
  },

  isFavorite: (imageId: string) => {
    const state = get();
    return state.favorites.some(fav => fav.id === imageId);
  },

  clearAllFavorites: async () => {
    try {
      await storage.set(CONSTANTS.STORAGE.FAVORITES_KEY, []);
      set({ favorites: [] });
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  },
}));