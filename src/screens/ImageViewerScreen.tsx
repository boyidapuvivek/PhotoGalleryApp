import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { View, StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import PagerView from "react-native-pager-view"

import { ImageViewer } from "@/components/viewer/ImageViewer"
import { ImageViewerControls } from "@/components/viewer/ImageViewerControls"
import { RootStackParamList } from "@/types/navigation"
import { GalleryImage } from "@/types/gallery"
import { useGalleryStore } from "@/store/galleryStore"

// Updated navigation params - only pass essential data
type ImageViewerScreenRouteProp = RouteProp<RootStackParamList, "ImageViewer">
type ImageViewerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ImageViewer"
>

export const ImageViewerScreen: React.FC = () => {
  const route = useRoute<ImageViewerScreenRouteProp>()
  const navigation = useNavigation<ImageViewerScreenNavigationProp>()
  const pagerRef = useRef<PagerView>(null)

  // Get images from store instead of navigation params
  const { images } = useGalleryStore()

  const { currentImage, currentIndex } = route.params
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isImmersive, setIsImmersive] = useState(false)

  // Create a windowed subset of images around current position
  const WINDOW_SIZE = 5 // Only keep 5 images in memory at a time
  const windowedImages = useMemo(() => {
    if (!images.length) return []

    const startIndex = Math.max(0, activeIndex - Math.floor(WINDOW_SIZE / 2))
    const endIndex = Math.min(images.length, startIndex + WINDOW_SIZE)

    return images.slice(startIndex, endIndex).map((img, index) => ({
      ...img,
      originalIndex: startIndex + index,
    }))
  }, [images, activeIndex, WINDOW_SIZE])

  // Find current image in windowed array
  const windowedCurrentIndex = windowedImages.findIndex(
    (img) => img.originalIndex === activeIndex
  )
  const displayCurrentImage =
    windowedImages[windowedCurrentIndex] || currentImage

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    const timer = setTimeout(() => {
      if (!isImmersive) {
        setControlsVisible(false)
        setIsImmersive(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [controlsVisible, isImmersive])

  // Reset controls visibility when index changes
  useEffect(() => {
    setControlsVisible(true)
    setIsImmersive(false)
  }, [activeIndex])

  const handleSingleTap = useCallback(() => {
    setControlsVisible(!controlsVisible)
    setIsImmersive(!controlsVisible)
  }, [controlsVisible])

  const handleClose = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handlePageSelected = useCallback(
    (event: any) => {
      const newWindowedIndex = event.nativeEvent.position
      const newOriginalIndex = windowedImages[newWindowedIndex]?.originalIndex

      if (newOriginalIndex !== undefined) {
        setActiveIndex(newOriginalIndex)
      }
    },
    [windowedImages]
  )

  const goToPrevious = useCallback(() => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1
      setActiveIndex(newIndex)

      // Update windowed view
      setTimeout(() => {
        const newWindowedIndex = windowedImages.findIndex(
          (img) => img.originalIndex === newIndex
        )
        if (newWindowedIndex >= 0) {
          pagerRef.current?.setPage(newWindowedIndex)
        }
      }, 100)
    }
  }, [activeIndex, windowedImages])

  const goToNext = useCallback(() => {
    if (activeIndex < images.length - 1) {
      const newIndex = activeIndex + 1
      setActiveIndex(newIndex)

      // Update windowed view
      setTimeout(() => {
        const newWindowedIndex = windowedImages.findIndex(
          (img) => img.originalIndex === newIndex
        )
        if (newWindowedIndex >= 0) {
          pagerRef.current?.setPage(newWindowedIndex)
        }
      }, 100)
    }
  }, [activeIndex, images.length, windowedImages])

  const canGoPrevious = activeIndex > 0
  const canGoNext = activeIndex < images.length - 1

  // Cleanup function to free memory
  useEffect(() => {
    return () => {
      // Force garbage collection when leaving screen
      if (global.gc) {
        global.gc()
      }
    }
  }, [])

  if (!displayCurrentImage || windowedImages.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style='light' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isImmersive ? "hidden" : "light"} />

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={windowedCurrentIndex >= 0 ? windowedCurrentIndex : 0}
        onPageSelected={handlePageSelected}
        offscreenPageLimit={1} // Limit pages in memory
      >
        {windowedImages.map((image) => (
          <View
            key={`${image.id}-${image.originalIndex}`}
            style={styles.pageContainer}>
            <ImageViewer
              image={image}
              onSingleTap={handleSingleTap}
            />
          </View>
        ))}
      </PagerView>

      <ImageViewerControls
        currentImage={displayCurrentImage}
        currentIndex={activeIndex}
        totalImages={images.length}
        isVisible={controlsVisible}
        onClose={handleClose}
        onPrevious={goToPrevious}
        onNext={goToNext}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  pager: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
