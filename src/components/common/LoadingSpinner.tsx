import React from "react"
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"
import { useSettingsStore } from "@/store/settingsStore"
import { THEME } from "@/utils/constants"

interface LoadingSpinnerProps {
  message?: string
  size?: "small" | "large"
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
}) => {
  const { effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <ActivityIndicator
        size={size}
        color={THEME.COLORS.PRIMARY}
      />
      {message && (
        <Text style={[styles.message, { color: colors.TEXT_SECONDARY }]}>
          {message}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.SPACING.LG,
  },
  message: {
    marginTop: THEME.SPACING.MD,
    fontSize: 16,
    textAlign: "center",
  },
})
