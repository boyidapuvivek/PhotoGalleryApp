import React from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Appearance,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

import { useSettingsStore } from "@/store/settingsStore"
import { useImageCache } from "@/hooks/useImageCache"
import { useFavorites } from "@/hooks/useFavorites"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { THEME, CONSTANTS } from "@/utils/constants"

export const SettingsScreen: React.FC = () => {
  const {
    theme,
    gridColumns,
    autoCache,
    sortOrder,
    effectiveTheme,
    updateTheme,
    updateGridColumns,
    updateAutoCache,
    updateSortOrder,
    resetSettings,
  } = useSettingsStore()

  const { formattedCacheSize, isClearing, clearCache, clearExpiredCache } =
    useImageCache()

  const { onClearAll: clearFavorites, favorites } = useFavorites()

  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  const handleThemeChange = () => {
    const themes: ("light" | "dark" | "system")[] = ["system", "light", "dark"]
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    updateTheme(nextTheme)
  }

  const handleGridColumnsChange = () => {
    const newColumns =
      gridColumns >= CONSTANTS.GRID.MAX_COLUMNS
        ? CONSTANTS.GRID.MIN_COLUMNS
        : gridColumns + 1
    updateGridColumns(newColumns)
  }

  const handleSortOrderChange = () => {
    const orders: (typeof sortOrder)[] = [
      "date_desc",
      "date_asc",
      "size_desc",
      "size_asc",
    ]
    const currentIndex = orders.indexOf(sortOrder)
    const nextOrder = orders[(currentIndex + 1) % orders.length]
    updateSortOrder(nextOrder)
  }

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetSettings,
        },
      ]
    )
  }

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will remove all cached image data. Images will need to be downloaded again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCache,
        },
      ]
    )
  }

  const handleClearFavorites = () => {
    if (favorites.length === 0) return

    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorite images?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearFavorites,
        },
      ]
    )
  }

  const getThemeDisplayName = (theme: string) => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      case "system":
        return "System"
      default:
        return "System"
    }
  }

  const getSortOrderDisplayName = (order: string) => {
    switch (order) {
      case "date_desc":
        return "Newest First"
      case "date_asc":
        return "Oldest First"
      case "size_desc":
        return "Largest First"
      case "size_asc":
        return "Smallest First"
      default:
        return "Newest First"
    }
  }

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Display Settings */}
          <View style={[styles.section, { backgroundColor: colors.SURFACE }]}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
              Display
            </Text>

            <TouchableOpacity
              style={[styles.settingRow, { borderBottomColor: colors.BORDER }]}
              onPress={handleThemeChange}>
              <View style={styles.settingContent}>
                <Ionicons
                  name='color-palette-outline'
                  size={24}
                  color={colors.TEXT_PRIMARY}
                  style={styles.settingIcon}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.TEXT_PRIMARY },
                    ]}>
                    Theme
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.TEXT_SECONDARY },
                    ]}>
                    {getThemeDisplayName(theme)}
                  </Text>
                </View>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={colors.TEXT_SECONDARY}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 0 }]}
              onPress={handleClearCache}
              disabled={isClearing}>
              <View style={styles.settingContent}>
                <Ionicons
                  name='server-outline'
                  size={24}
                  color={colors.TEXT_PRIMARY}
                  style={styles.settingIcon}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.TEXT_PRIMARY },
                    ]}>
                    Clear All Cache
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.TEXT_SECONDARY },
                    ]}>
                    {isClearing
                      ? "Clearing..."
                      : `${formattedCacheSize} cached`}
                  </Text>
                </View>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={colors.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>

          {/* Data Management */}
          <View style={[styles.section, { backgroundColor: colors.SURFACE }]}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
              Data Management
            </Text>

            <TouchableOpacity
              style={[styles.settingRow, { borderBottomColor: colors.BORDER }]}
              onPress={handleClearFavorites}>
              <View style={styles.settingContent}>
                <Ionicons
                  name='heart-outline'
                  size={24}
                  color={colors.TEXT_PRIMARY}
                  style={styles.settingIcon}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.TEXT_PRIMARY },
                    ]}>
                    Clear Favorites
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.TEXT_SECONDARY },
                    ]}>
                    {favorites.length} favorite images
                  </Text>
                </View>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={colors.TEXT_SECONDARY}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 0 }]}
              onPress={handleResetSettings}>
              <View style={styles.settingContent}>
                <Ionicons
                  name='refresh-outline'
                  size={24}
                  color={THEME.COLORS.ERROR}
                  style={styles.settingIcon}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: THEME.COLORS.ERROR },
                    ]}>
                    Reset All Settings
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.TEXT_SECONDARY },
                    ]}>
                    Restore default settings
                  </Text>
                </View>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={colors.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={[styles.section, { backgroundColor: colors.SURFACE }]}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
              About
            </Text>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.settingContent}>
                <Ionicons
                  name='information-circle-outline'
                  size={24}
                  color={colors.TEXT_PRIMARY}
                  style={styles.settingIcon}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.TEXT_PRIMARY },
                    ]}>
                    Version
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.TEXT_SECONDARY },
                    ]}>
                    1.0.0
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: THEME.SPACING.MD,
    marginVertical: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.MD,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.MD,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: THEME.SPACING.MD,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
})
