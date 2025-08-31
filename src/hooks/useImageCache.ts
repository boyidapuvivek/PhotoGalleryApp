import { useCallback, useEffect, useState } from 'react';
import { imageCacheService } from '@/services/storage/imageCache';
import { useSettingsStore } from '@/store/settingsStore';

export const useImageCache = () => {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [isClearing, setIsClearing] = useState(false);
  const { autoCache } = useSettingsStore();

  const loadCacheSize = useCallback(async () => {
    try {
      const size = await imageCacheService.getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error('Failed to load cache size:', error);
    }
  }, []);

  const clearCache = useCallback(async () => {
    setIsClearing(true);
    try {
      await imageCacheService.clearAllCache();
      setCacheSize(0);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setIsClearing(false);
    }
  }, []);

  const clearExpiredCache = useCallback(async () => {
    try {
      await imageCacheService.clearExpiredCache();
      await loadCacheSize();
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }, [loadCacheSize]);

  useEffect(() => {
    loadCacheSize();
  }, [loadCacheSize]);

  // Auto-clear expired cache every hour when auto cache is enabled
  useEffect(() => {
    if (!autoCache) return;

    const interval = setInterval(clearExpiredCache, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, [autoCache, clearExpiredCache]);

  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return {
    cacheSize,
    formattedCacheSize: formatCacheSize(cacheSize),
    isClearing,
    clearCache,
    clearExpiredCache,
    refreshCacheSize: loadCacheSize,
  };
};