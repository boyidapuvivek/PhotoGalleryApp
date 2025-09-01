import React from "react"
import { View, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

import { ImageGrid } from "@/components/gallery/ImageGrid"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useFavorites } from "@/hooks/useFavorites"
import { useSettingsStore } from "@/store/settingsStore"
import { GalleryImage } from "@/types/gallery"
import { RootStackParamList } from "@/types/navigation"
import { THEME } from "@/utils/constants"

type FavoritesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Favorites"
>

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>()
  const { effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  const { favorites, isLoading, hasError, errorMessage, onClearAll } =
    useFavorites()

  const handleImagePress = (image: GalleryImage, index: number) => {
    navigation.navigate("ImageViewer", {
      images: favorites,
      currentIndex: index,
    })
  }

  const handleRefresh = () => {
    // Favorites don't need refresh from API - they're loaded from local storage
  }

  const handleClearAll = () => {
    if (favorites.length === 0) return

    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorite images?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: onClearAll,
        },
      ]
    )
  }

  // Only show loading if we're actually loading AND don't have any favorites yet
  // Favorites should load synchronously from storage, so this should be brief
  if (isLoading && favorites.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <LoadingSpinner message='Loading favorites...' />
      </SafeAreaView>
    )
  }

  if (hasError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <EmptyState
          title='Error loading favorites'
          message={errorMessage || "Failed to load your favorite images."}
          actionLabel='Try Again'
          onAction={() => {}}
          iconName='alert-circle-outline'
        />
      </SafeAreaView>
    )
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <EmptyState
          title='No favorites yet'
          message='Tap the heart icon on any image to add it to your favorites.'
          iconName='heart-outline'
        />
      </SafeAreaView>
    )
  }

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <View style={styles.content}>
          <ImageGrid
            images={favorites}
            isLoading={false}
            isRefreshing={false}
            hasError={false}
            onImagePress={handleImagePress}
            onRefresh={handleRefresh}
            onLoadMore={() => {}}
            onRetry={() => {}}
            // Add a way to clear all favorites if needed
            // You might want to add this to your ImageGrid component or add a header button
          />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})
