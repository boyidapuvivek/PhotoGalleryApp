import React, { useMemo, useCallback } from "react"
import { Dimensions, View, RefreshControl } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { ImageGridItem } from "./ImageGridItem"
import { LoadingSpinner } from "../common/LoadingSpinner"
import { EmptyState } from "../common/EmptyState"
import { GalleryImage } from "@/types/gallery"
import { useSettingsStore } from "@/store/settingsStore"
import { THEME, CONSTANTS } from "@/utils/constants"

interface ImageGridProps {
  images: GalleryImage[]
  isLoading: boolean
  isRefreshing: boolean
  hasError: boolean
  errorMessage?: string
  onImagePress: (image: GalleryImage, index: number) => void
  onRefresh: () => void
  onLoadMore: () => void
  onRetry: () => void
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  isLoading,
  isRefreshing,
  hasError,
  errorMessage,
  onImagePress,
  onRefresh,
  onLoadMore,
  onRetry,
}) => {
  const { gridColumns, effectiveTheme } = useSettingsStore()
  const colors = THEME.COLORS[effectiveTheme.toUpperCase() as "LIGHT" | "DARK"]

  const { width: screenWidth } = Dimensions.get("window")

  const itemSize = useMemo(() => {
    const spacing = CONSTANTS.GRID.ITEM_SPACING
    const totalSpacing = spacing * (gridColumns + 1)
    return (screenWidth - totalSpacing) / gridColumns
  }, [screenWidth, gridColumns])

  // Memoized render item for better performance
  const renderItem = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => (
      <ImageGridItem
        image={item}
        itemSize={itemSize}
        onPress={() => onImagePress(item, index)}
      />
    ),
    [itemSize, onImagePress]
  )

  // Memoized key extractor
  const keyExtractor = useCallback((item: GalleryImage) => item.id, [])

  // Get item type for better performance (optional)
  const getItemType = useCallback((item: GalleryImage, index: number) => {
    // You can return different types for different items if needed
    return "image"
  }, [])

  const renderFooter = useCallback(() => {
    if (isLoading && images.length > 0) {
      return (
        <View style={{ padding: THEME.SPACING.LG }}>
          <LoadingSpinner
            message='Loading more images...'
            size='small'
          />
        </View>
      )
    }
    return null
  }, [isLoading, images.length])

  if (isLoading && images.length === 0) {
    return <LoadingSpinner message='Loading images...' />
  }

  if (hasError && images.length === 0) {
    return (
      <EmptyState
        title='Failed to load images'
        message={errorMessage || "Something went wrong while loading images."}
        actionLabel='Try Again'
        onAction={onRetry}
        iconName='alert-circle-outline'
      />
    )
  }

  if (images.length === 0) {
    return (
      <EmptyState
        title='No images found'
        message='There are no images to display at the moment.'
        actionLabel='Refresh'
        onAction={onRefresh}
        iconName='images-outline'
      />
    )
  }

  return (
    <FlashList
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      numColumns={gridColumns}
      estimatedItemSize={itemSize}
      contentContainerStyle={{
        padding: CONSTANTS.GRID.ITEM_SPACING / 2,
        backgroundColor: colors.BACKGROUND,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={THEME.COLORS.PRIMARY}
          colors={[THEME.COLORS.PRIMARY]}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      // Performance optimizations
      drawDistance={200} // How far ahead to render items
      optimizeItemArrangement={true}
      disableAutoLayout={false}
    />
  )
}
