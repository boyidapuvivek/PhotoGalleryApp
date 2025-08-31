import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSettingsStore } from "@/store/settingsStore"
import { THEME } from "@/utils/constants"

interface EmptyStateProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  iconName?: keyof typeof Ionicons.glyphMap
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  iconName = "images-outline",
}) => {
  const { effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Ionicons
        name={iconName}
        size={80}
        color={colors.TEXT_SECONDARY}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: colors.TEXT_SECONDARY }]}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.button, { borderColor: colors.BORDER }]}
          onPress={onAction}>
          <Text style={[styles.buttonText, { color: THEME.COLORS.PRIMARY }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.SPACING.XL,
  },
  icon: {
    marginBottom: THEME.SPACING.LG,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: THEME.SPACING.SM,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: THEME.SPACING.XL,
  },
  button: {
    paddingHorizontal: THEME.SPACING.LG,
    paddingVertical: THEME.SPACING.MD,
    borderWidth: 1,
    borderRadius: THEME.BORDER_RADIUS.SM,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})
