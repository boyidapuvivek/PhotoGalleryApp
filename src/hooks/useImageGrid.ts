import { useEffect, useCallback, useRef } from 'react';
import { useGalleryStore } from '@/store/galleryStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { GalleryImage } from '@/types/gallery';
import { useFocusEffect } from '@react-navigation/native';

export const useImageGrid = () => {
  const {
    images,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    hasReachedEnd,
    loadImages,
    loadMoreImages,
    refreshImages,
    clearError,
    resetGallery,
  } = useGalleryStore();

  const { loadFavorites, isFavorite } = useFavoritesStore();
  
  const isInitialized = useRef(false);

  // Load data on mount and when screen focuses
  useFocusEffect(
    useCallback(() => {
      if (!isInitialized.current) {
        loadFavorites();
        loadImages(true);
        isInitialized.current = true;
      }
    }, [loadFavorites, loadImages])
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetGallery();
    };
  }, [resetGallery]);

  // Add favorite status to images
  const imagesWithFavorites = images.map((image): GalleryImage => ({
    ...image,
    isFavorite: isFavorite(image.id),
  }));

  const handleRefresh = useCallback(async () => {
    await refreshImages();
  }, [refreshImages]);

  const handleLoadMore = useCallback(async () => {
    if (!isLoading && !hasReachedEnd && !hasError) {
      await loadMoreImages();
    }
  }, [isLoading, hasReachedEnd, hasError, loadMoreImages]);

  const handleRetry = useCallback(async () => {
    clearError();
    await loadImages(true);
  }, [clearError, loadImages]);

  return {
    images: imagesWithFavorites,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    hasReachedEnd,
    onRefresh: handleRefresh,
    onLoadMore: handleLoadMore,
    onRetry: handleRetry,
  };
};