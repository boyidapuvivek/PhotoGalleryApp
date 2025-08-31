import { storage } from './mmkvStorage';
import { CONSTANTS } from '@/utils/constants';
import { CacheMetadata } from '@/types/api';

class ImageCacheService {
  private readonly CACHE_PREFIX = CONSTANTS.STORAGE.CACHE_KEY_PREFIX;

  async cacheImageMetadata(imageId: string, metadata: CacheMetadata): Promise<void> {
    const key = `${this.CACHE_PREFIX}${imageId}`;
    await storage.set(key, metadata);
  }

  async getCachedImageMetadata(imageId: string): Promise<CacheMetadata | null> {
    const key = `${this.CACHE_PREFIX}${imageId}`;
    const metadata = await storage.get<CacheMetadata>(key);
    
    if (metadata && metadata.expiresAt > Date.now()) {
      return metadata;
    }
    
    if (metadata) {
      // Remove expired cache
      await storage.remove(key);
    }
    
    return null;
  }

  async clearExpiredCache(): Promise<void> {
    const allKeys = await storage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
    
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const key of cacheKeys) {
      const metadata = await storage.get<CacheMetadata>(key);
      if (metadata && metadata.expiresAt <= now) {
        expiredKeys.push(key);
      }
    }
    
    await Promise.all(expiredKeys.map(key => storage.remove(key)));
  }

  async getCacheSize(): Promise<number> {
    const allKeys = await storage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
    
    let totalSize = 0;
    for (const key of cacheKeys) {
      const metadata = await storage.get<CacheMetadata>(key);
      if (metadata) {
        totalSize += metadata.size;
      }
    }
    
    return totalSize;
  }

  async clearAllCache(): Promise<void> {
    const allKeys = await storage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
    await Promise.all(cacheKeys.map(key => storage.remove(key)));
  }
}

export const imageCacheService = new ImageCacheService();