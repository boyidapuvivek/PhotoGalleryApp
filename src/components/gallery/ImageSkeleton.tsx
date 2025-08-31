import React from "react"
import { View, Animated, StyleSheet } from "react-native"
import { useSettingsStore } from "@/store/settingsStore"
import { THEME } from "@/utils/constants"

interface ImageSkeletonProps {
  width: number
  height: number
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  width,
  height,
}) => {
  const { effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  const animatedValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    )

    animation.start()

    return () => animation.stop()
  }, [animatedValue])

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.SURFACE, colors.BORDER],
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor,
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.BORDER_RADIUS.SM,
  },
})
