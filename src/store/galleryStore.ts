import { create } from 'zustand';
import { GalleryImage, GalleryState, SortOrder } from '@/types/gallery';
import { PaginationParams } from '@/types/api';
import { imageService } from '@/services/api/imageService';
import { handleApiError, logError } from '@/utils/errorHandling';
import { CONSTANTS } from '@/utils/constants';

interface GalleryStore extends GalleryState {
  // Actions
  loadImages: (refresh?: boolean) => Promise<void>;
  loadMoreImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  setSortOrder: (order: SortOrder) => void;
  clearError: () => void;
  resetGallery: () => void;
  
  // Internal state
  sortOrder: SortOrder;
}

const initialState: GalleryState = {
  images: [],
  isLoading: false,
  isRefreshing: false,
  hasError: false,
  errorMessage: undefined,
  hasReachedEnd: false,
  currentPage: 0,
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  ...initialState,
  sortOrder: 'date_desc',

  loadImages: async (refresh = false) => {
    const state = get();
    
    if (state.isLoading) return;

    set({ isLoading: true, hasError: false, errorMessage: undefined });

    try {
      const params: PaginationParams = {
        page: refresh ? 0 : state.currentPage,
        pageSize: CONSTANTS.API.DEFAULT_PAGE_SIZE,
        orderBy: CONSTANTS.API.DEFAULT_ORDER_BY,
        orderAsc: state.sortOrder.includes('asc'),
      };

      const response = await imageService.fetchImagesWithRetry(params);

      // Validate and extract images array from response
      let newImages: GalleryImage[] = [];
      
      if (response) {
        // Handle different possible response structures
        if (Array.isArray(response)) {
          newImages = response;
        } else if (response.data && Array.isArray(response.data)) {
          newImages = response.data;
        } else if (response.images && Array.isArray(response.images)) {
          newImages = response.images;
        } else if (response.results && Array.isArray(response.results)) {
          newImages = response.results;
        } else if (response.items && Array.isArray(response.items)) {
          newImages = response.items;
        } else {
          console.warn('Unexpected response structure:', response);
          newImages = [];
        }
      }

      // Ensure newImages is always an array
      if (!Array.isArray(newImages)) {
        console.error('newImages is not an array:', newImages);
        newImages = [];
      }

      set((state) => ({
        images: refresh ? newImages : [...(state.images || []), ...newImages],
        isLoading: false,
        currentPage: refresh ? 1 : state.currentPage + 1,
        hasReachedEnd: newImages.length < CONSTANTS.API.DEFAULT_PAGE_SIZE,
      }));

    } catch (error: any) {
      console.error('❌ Error in loadImages:', error);
      logError(error, 'GalleryStore.loadImages');
      
      set({
        isLoading: false,
        hasError: true,
        errorMessage: handleApiError(error),
        // Ensure images array is preserved even on error
        images: get().images || [],
      });
    }
  },

  loadMoreImages: async () => {
    const state = get();
    
    if (state.isLoading || state.hasReachedEnd || state.hasError) return;

    await get().loadImages(false);
  },

  refreshImages: async () => {
    set({ isRefreshing: true });
    await get().loadImages(true);
    set({ isRefreshing: false });
  },

  setSortOrder: (order: SortOrder) => {
    set({ sortOrder: order });
    get().refreshImages();
  },

  clearError: () => {
    set({ hasError: false, errorMessage: undefined });
  },

  resetGallery: () => {
    imageService.cancelRequests();
    set({ ...initialState, sortOrder: 'date_desc' });
  },
}));