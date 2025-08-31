import React, { useState, useEffect, useCallback } from "react"
import { View, Dimensions, StyleSheet, Text } from "react-native"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  clamp,
} from "react-native-reanimated"
import { Image } from "expo-image"
import { GalleryImage } from "@/types/gallery"
import { CONSTANTS } from "@/utils/constants"
import { ImageSkeleton } from "../gallery/ImageSkeleton"

interface ImageViewerProps {
  image: GalleryImage
  onSingleTap?: () => void
  onDoubleTap?: () => void
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  onSingleTap,
  onDoubleTap,
}) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)

  // Reset everything when image changes
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setImageDimensions({ width: 0, height: 0 })

    // Reset transforms
    scale.value = withSpring(1)
    savedScale.value = 1
    translateX.value = withSpring(0)
    translateY.value = withSpring(0)
    savedTranslateX.value = 0
    savedTranslateY.value = 0
  }, [image.id, image.url])

  const handleImageLoad = useCallback((event: any) => {
    try {
      const { width, height } = event.source
      setImageDimensions({
        width: width || SCREEN_WIDTH,
        height: height || SCREEN_HEIGHT,
      })
      setIsLoading(false)
      setHasError(false)
    } catch (error) {
      console.error("Error loading image dimensions:", error)
      setImageDimensions({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT })
      setIsLoading(false)
    }
  }, [])

  const handleImageError = useCallback(() => {
    console.error("Failed to load image:", image.url)
    setIsLoading(false)
    setHasError(true)
    setImageDimensions({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT })
  }, [image.url])

  const getScaledImageDimensions = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) {
      return { width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.8 }
    }

    const imageAspectRatio = imageDimensions.width / imageDimensions.height
    const screenAspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT

    if (imageAspectRatio > screenAspectRatio) {
      return {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH / imageAspectRatio,
      }
    } else {
      return {
        width: SCREEN_HEIGHT * imageAspectRatio,
        height: SCREEN_HEIGHT,
      }
    }
  }, [imageDimensions])

  const { width: scaledWidth, height: scaledHeight } =
    getScaledImageDimensions()

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale
      scale.value = clamp(
        newScale,
        CONSTANTS.VIEWER.MIN_ZOOM || 0.5,
        CONSTANTS.VIEWER.MAX_ZOOM || 3
      )
    })
    .onEnd(() => {
      savedScale.value = scale.value
      if (scale.value < 1) {
        scale.value = withSpring(1)
        savedScale.value = 1
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
        savedTranslateX.value = 0
        savedTranslateY.value = 0
      }
    })

  // Pan gesture - only handle when zoomed in
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        const maxTranslateX = Math.max(
          0,
          (scaledWidth * scale.value - SCREEN_WIDTH) / 2
        )
        const maxTranslateY = Math.max(
          0,
          (scaledHeight * scale.value - SCREEN_HEIGHT) / 2
        )

        translateX.value = clamp(
          savedTranslateX.value + event.translationX,
          -maxTranslateX,
          maxTranslateX
        )

        translateY.value = clamp(
          savedTranslateY.value + event.translationY,
          -maxTranslateY,
          maxTranslateY
        )
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
    })
    .shouldCancelWhenOutside(false)
    .enableTrackpadTwoFingerGesture(false)

  // Single tap gesture
  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (onSingleTap) {
        runOnJS(onSingleTap)()
      }
    })

  // Double tap gesture
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const duration = CONSTANTS.VIEWER.ZOOM_DURATION || 300

      if (scale.value > 1) {
        scale.value = withTiming(1, { duration })
        savedScale.value = 1
        translateX.value = withTiming(0, { duration })
        translateY.value = withTiming(0, { duration })
        savedTranslateX.value = 0
        savedTranslateY.value = 0
      } else {
        scale.value = withTiming(2, { duration })
        savedScale.value = 2
      }

      if (onDoubleTap) {
        runOnJS(onDoubleTap)()
      }
    })

  // Compose gestures
  const composedGestures = Gesture.Simultaneous(
    Gesture.Race(singleTapGesture, doubleTapGesture),
    Gesture.Simultaneous(pinchGesture, panGesture)
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  // Determine which image URL to use
  const imageSource = React.useMemo(
    () => ({
      uri: image.url || image.thumbnail_url,
    }),
    [image.url, image.thumbnail_url]
  )

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Show skeleton loader while loading */}
        {isLoading && (
          <View style={styles.skeletonContainer}>
            <ImageSkeleton
              width={scaledWidth}
              height={scaledHeight}
            />
          </View>
        )}

        {/* Always render the image but make it invisible while loading */}
        <GestureDetector gesture={composedGestures}>
          <Animated.View
            style={[
              styles.imageContainer,
              animatedStyle,
              { opacity: isLoading ? 0 : 1 },
            ]}>
            <Image
              source={imageSource}
              style={{
                width: scaledWidth,
                height: scaledHeight,
              }}
              contentFit='contain'
              onLoad={handleImageLoad}
              onError={handleImageError}
              cachePolicy='memory-disk'
              transition={200}
              priority='high'
              placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
})
