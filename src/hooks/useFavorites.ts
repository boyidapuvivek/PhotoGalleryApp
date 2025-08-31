import { useCallback, useEffect } from 'react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { GalleryImage } from '@/types/gallery';
import * as Haptics from 'expo-haptics';

export const useFavorites = () => {
  const {
    favorites,
    isLoading,
    hasError,
    errorMessage,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
  } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = useCallback(async (image: GalleryImage) => {
    // Haptic feedback for better UX
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleFavorite(image);
  }, [toggleFavorite]);

  const handleAddFavorite = useCallback(async (image: GalleryImage) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addFavorite(image);
  }, [addFavorite]);

  const handleRemoveFavorite = useCallback(async (imageId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await removeFavorite(imageId);
  }, [removeFavorite]);

  const handleClearAll = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await clearAllFavorites();
  }, [clearAllFavorites]);

  return {
    favorites,
    isLoading,
    hasError,
    errorMessage,
    isFavorite,
    onToggleFavorite: handleToggleFavorite,
    onAddFavorite: handleAddFavorite,
    onRemoveFavorite: handleRemoveFavorite,
    onClearAll: handleClearAll,
  };
};