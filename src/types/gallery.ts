import { FotoOwlImage } from './api';

export interface GalleryImage extends FotoOwlImage {
  isFavorite?: boolean;
  isLoaded?: boolean;
  aspectRatio: number;
}

export interface GalleryState {
  images: GalleryImage[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  errorMessage?: string;
  hasReachedEnd: boolean;
  currentPage: number;
}

export interface ViewerState {
  currentIndex: number;
  isVisible: boolean;
  isImmersive: boolean;
}

export type SortOrder = 'date_asc' | 'date_desc' | 'size_asc' | 'size_desc';

export interface GallerySettings {
  theme: 'light' | 'dark' | 'system';
  gridColumns: number;
  autoCache: boolean;
  sortOrder: SortOrder;
}
