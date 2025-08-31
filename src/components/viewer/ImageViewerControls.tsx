import React from "react"
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GalleryImage } from "@/types/gallery"
import { useFavorites } from "@/hooks/useFavorites"
import { THEME } from "@/utils/constants"

interface ImageViewerControlsProps {
  currentImage: GalleryImage
  currentIndex: number
  totalImages: number
  isVisible: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export const ImageViewerControls: React.FC<ImageViewerControlsProps> = ({
  currentImage,
  currentIndex,
  totalImages,
  isVisible,
  onClose,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
}) => {
  const insets = useSafeAreaInsets()
  const { onToggleFavorite, isFavorite } = useFavorites()

  const isImageFavorite = isFavorite(currentImage.id)

  const handleToggleFavorite = () => {
    onToggleFavorite(currentImage)
  }

  if (!isVisible) return null

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />

      {/* Top Controls */}
      <View style={[styles.topControls, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onClose}>
          <Ionicons
            name='close'
            size={24}
            color='white'
          />
        </TouchableOpacity>

        <Text style={styles.counter}>
          {currentIndex + 1} of {totalImages}
        </Text>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleToggleFavorite}>
          <Ionicons
            name={isImageFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isImageFavorite ? THEME.COLORS.ERROR : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Navigation Controls */}
      {canGoPrevious && (
        <TouchableOpacity
          style={[styles.navButton, styles.leftNav]}
          onPress={onPrevious}>
          <Ionicons
            name='chevron-back'
            size={32}
            color='white'
          />
        </TouchableOpacity>
      )}

      {canGoNext && (
        <TouchableOpacity
          style={[styles.navButton, styles.rightNav]}
          onPress={onNext}>
          <Ionicons
            name='chevron-forward'
            size={32}
            color='white'
          />
        </TouchableOpacity>
      )}

      {/* Bottom Controls */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom }]}>
        <View style={styles.imageInfo}>
          <Text
            style={styles.imageName}
            numberOfLines={1}>
            {currentImage.id}
          </Text>
          <Text style={styles.imageDetails}>
            {currentImage.width} × {currentImage.height}
            {currentImage.file_size &&
              ` • ${(currentImage.file_size / 1024 / 1024).toFixed(1)}MB`}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "box-none",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  counter: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transform: [{ translateY: -30 }],
  },
  leftNav: {
    left: THEME.SPACING.MD,
  },
  rightNav: {
    right: THEME.SPACING.MD,
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
  },
  imageInfo: {
    alignItems: "center",
  },
  imageName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  imageDetails: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
})
