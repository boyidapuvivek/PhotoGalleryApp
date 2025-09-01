# Gallery App

A beautiful React Native gallery application with image viewing, favorites management, and smooth navigation.

## Features

- 📱 **Image Gallery**: Browse through a collection of images in an elegant grid layout
- ❤️ **Favorites**: Add images to favorites and manage your collection
- 🔍 **Image Viewer**: Full-screen image viewing with zoom, pan, and gesture controls
- 🌓 **Theme Support**: Light and dark theme modes
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎯 **Performance Optimized**: Memory-efficient image loading and caching

## Screenshots

<!-- Add your screenshots here -->
### Light Theme
![Home Screen](./screenshots/home-light.png)
![Favorites Screen](./screenshots/favorites.png)
![Image Viewer](./screenshots/image-viewer.png)

### Dark Theme
![Home Screen](./screenshots/home-dark.png)
![Favorites Screen](./screenshots/favorites.png)
![Image Viewer](./screenshots/image-viewer.png)

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **React Native CLI** or **Expo CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### For React Native CLI:
```bash
npm install -g react-native-cli
```

### For Expo CLI:
```bash
npm install -g @expo/cli
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/boyidapuvivek/PhotoGalleryApp.git
   cd PhotoGalleryApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

**For Android:**
```bash
npx expo run:android

```

#### Using Expo (if applicable):

```bash
# Start Expo development server
npx expo start

# Scan QR code with Expo Go app or press 'a' for Android, 'i' for iOS
```

## Project Structure

```
src/
├── components/
│   ├── gallery/
│   │   ├── ImageGrid.tsx
│   │   └── ImageSkeleton.tsx
│   ├── viewer/
│   │   ├── ImageViewer.tsx
│   │   └── ImageViewerControls.tsx
│   └── common/
│       ├── ErrorBoundary.tsx
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── ImageViewerScreen.tsx
├── hooks/
│   ├── useImageGrid.ts
│   └── useFavorites.ts
├── store/
│   ├── galleryStore.ts
│   ├── favoritesStore.ts
│   └── settingsStore.ts
├── types/
│   ├── gallery.ts
│   └── navigation.ts
├── utils/
│   └── constants.ts
└── services/
    └── storage/
        └── mmkvStorage.ts
```

## Key Dependencies

- **React Native**: Core framework
- **React Navigation**: Navigation management
- **Expo Image**: Optimized image component
- **React Native Gesture Handler**: Gesture controls
- **React Native Reanimated**: Smooth animations
- **React Native MMKV**: Fast key-value storage
- **Zustand**: State management
- **React Native Safe Area Context**: Safe area handling

## Configuration

### Theme Configuration
The app supports light and dark themes. Theme settings are managed in:
- `src/store/settingsStore.ts`
- `src/utils/constants.ts`

### Storage Configuration
Favorites and settings are stored locally using MMKV:
- `src/services/storage/mmkvStorage.ts`

## Troubleshooting

#### Node modules issues:
```bash
# Clean install
rm -rf node_modules
rm package-lock.json # or yarn.lock
npm install # or yarn install
```
