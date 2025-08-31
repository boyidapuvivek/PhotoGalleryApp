import { fotoOwlApi } from './fotoOwlApi';
import { FotoOwlResponse, PaginationParams } from '@/types/api';
import { GalleryImage } from '@/types/gallery';

class ImageService {
  private readonly RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  async fetchImagesWithRetry(params: PaginationParams): Promise<GalleryImage[]> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fotoOwlApi.fetchImages(params);
        return this.transformToGalleryImages(response.images);
      } catch (error: any) {
        lastError = error;
        
        if (attempt < this.RETRY_ATTEMPTS && !error.message?.includes('cancelled')) {
          await this.delay(this.RETRY_DELAY * attempt); // Exponential backoff
          continue;
        }
        break;
      }
    }

    throw lastError!;
  }

  private transformToGalleryImages(images: any[]): GalleryImage[] {
    return images.map((image) => ({
      ...image,
      aspectRatio: image.width / image.height,
      isFavorite: false,
      isLoaded: false,
    }));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  cancelRequests(): void {
    fotoOwlApi.cancelRequests();
  }
}

export const imageService = new ImageService();