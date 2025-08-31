import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { GalleryImage } from "@/types/gallery"
import { ImageSkeleton } from "./ImageSkeleton"
import { useFavorites } from "@/hooks/useFavorites"
import { useSettingsStore } from "@/store/settingsStore"
import { THEME } from "@/utils/constants"

interface ImageGridItemProps {
  image: GalleryImage
  itemSize: number
  onPress: () => void
}

export const ImageGridItem: React.FC<ImageGridItemProps> = ({
  image,
  itemSize,
  onPress,
}) => {
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [hasError, setHasError] = useState(false)
  const { onToggleFavorite, isFavorite } = useFavorites()
  const { effectiveTheme } = useSettingsStore()

  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]
  const isImageFavorite = isFavorite(image.id)

  // Reset loading state when image changes
  useEffect(() => {
    if (image?.url) {
      setIsLoading(false)
      setHasError(false)
    }
  }, [image?.url])

  const handleFavoritePress = (e: any) => {
    e.stopPropagation()
    onToggleFavorite(image)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleLoadStart = () => {
    try {
      setIsLoading(true)
      setHasError(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show skeleton while loading or if there's an error
  if (isLoading || hasError) {
    return (
      <View style={[styles.container, { width: itemSize, height: itemSize }]}>
        <ImageSkeleton
          width={itemSize}
          height={itemSize}
        />
        {hasError && (
          <TouchableOpacity
            style={styles.errorOverlay}
            onPress={() => {
              // Retry loading the image
              setHasError(false)
              setIsLoading(true)
            }}>
            <Ionicons
              name='refresh-circle'
              size={32}
              color={THEME.COLORS.ERROR}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={[styles.container, { width: itemSize, height: itemSize }]}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onPress}
        activeOpacity={0.8}>
        <Image
          source={{ uri: image?.url }}
          style={[styles.image, { width: itemSize, height: itemSize }]}
          contentFit='cover'
          // onLoad={handleImageLoad}
          onError={handleImageError}
          onLoadStart={handleLoadStart}
          cachePolicy='memory-disk'
          transition={200}
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }} // Optional: add a blurhash placeholder
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: colors.SURFACE + "80" },
          ]}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={isImageFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isImageFavorite ? THEME.COLORS.ERROR : colors.TEXT_PRIMARY}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: THEME.SPACING.XS / 2,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    borderRadius: THEME.BORDER_RADIUS.SM,
  },
  favoriteButton: {
    position: "absolute",
    top: THEME.SPACING.SM,
    right: THEME.SPACING.SM,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2, // Add slight shadow on Android
    shadowColor: "#000", // Add shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  errorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: THEME.BORDER_RADIUS.SM,
  },
})
