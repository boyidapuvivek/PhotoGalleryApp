import React, { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import * as SplashScreen from "expo-splash-screen"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { ErrorBoundary } from "./src/components/common/ErrorBoundary"
import { HomeScreen } from "./src/screens/HomeScreen"
import { ImageViewerScreen } from "./src/screens/ImageViewerScreen"
import { FavoritesScreen } from "./src/screens/FavoritesScreen"
import { SettingsScreen } from "./src/screens/SettingsScreen"
import { useSettingsStore } from "./src/store/settingsStore"
import { useFavoritesStore } from "./src/store/favoritesStore"
import { RootStackParamList, TabParamList } from "./src/types/navigation"
import { THEME } from "./src/utils/constants"

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

const TabNavigator: React.FC = () => {
  const { effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Gallery") {
            iconName = focused ? "images" : "images-outline"
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          } else {
            iconName = "help-outline"
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          )
        },
        tabBarActiveTintColor: THEME.COLORS.PRIMARY,
        tabBarInactiveTintColor: colors.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: colors.SURFACE,
          borderTopColor: colors.BORDER,
        },
        headerStyle: {
          backgroundColor: colors.SURFACE,
        },
        headerTintColor: colors.TEXT_PRIMARY,
      })}>
      <Tab.Screen
        name='Gallery'
        component={HomeScreen}
        options={{ title: "Gallery" }}
      />
      <Tab.Screen
        name='Favorites'
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const { loadSettings, effectiveTheme } = useSettingsStore()
  const { loadFavorites } = useFavoritesStore()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load settings and favorites
        await Promise.all([loadSettings(), loadFavorites()])
      } catch (error) {
        console.error("Failed to initialize app:", error)
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync()
      }
    }

    initializeApp()
  }, [loadSettings, loadFavorites])

  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  // Create custom theme based on current theme
  const navigationTheme = {
    ...(effectiveTheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(effectiveTheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      primary: THEME.COLORS.PRIMARY,
      background: colors.BACKGROUND,
      card: colors.SURFACE,
      text: colors.TEXT_PRIMARY,
      border: colors.BORDER,
      notification: THEME.COLORS.ERROR,
    },
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name='Home'
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='ImageViewer'
              component={ImageViewerScreen}
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
                gestureEnabled: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style={effectiveTheme === "dark" ? "light" : "dark"} />
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
