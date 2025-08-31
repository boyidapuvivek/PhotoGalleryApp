import React from "react"
import { View, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

import { ImageGrid } from "@/components/gallery/ImageGrid"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useImageGrid } from "@/hooks/useImageGrid"
import { useSettingsStore } from "@/store/settingsStore"
import { GalleryImage } from "@/types/gallery"
import { RootStackParamList } from "@/types/navigation"
import { THEME } from "@/utils/constants"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  const {
    images,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    onRefresh,
    onLoadMore,
    onRetry,
  } = useImageGrid()

  const handleImagePress = (image: GalleryImage, index: number) => {
    // Only pass essential data to prevent memory overflow
    const imageViewerData = {
      currentImage: image,
      currentIndex: index,
      // Don't pass the entire images array - let ImageViewer fetch as needed
    }

    navigation.navigate("ImageViewer", imageViewerData)
  }

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <ImageGrid
          images={images}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          hasError={hasError}
          errorMessage={errorMessage}
          onImagePress={handleImagePress}
          onRefresh={onRefresh}
          onLoadMore={onLoadMore}
          onRetry={onRetry}
        />
      </SafeAreaView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
