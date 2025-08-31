import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { FotoOwlResponse, PaginationParams, ApiError } from '@/types/api';

const BASE_URL = 'https://openapi.fotoowl.ai/open/event/image-list';
const EVENT_ID = '154770';
const API_KEY = '4030';

class FotoOwlApi {
  private cancelTokenSource: CancelTokenSource | null = null;

  private createCancelToken(): CancelTokenSource {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('New request initiated');
    }
    this.cancelTokenSource = axios.CancelToken.source();
    return this.cancelTokenSource;
  }

  async fetchImages(params: PaginationParams): Promise<FotoOwlResponse> {
    const cancelToken = this.createCancelToken();

    try {
      const response: AxiosResponse<any> = await axios.get(BASE_URL, {
        params: {
          event_id: EVENT_ID,
          page: params.page,
          page_size: params.pageSize,
          key: API_KEY,
          order_by: params.orderBy,
          order_asc: params.orderAsc,
        },
        timeout: 30000, // 30 second timeout
        cancelToken: cancelToken.token,
      });
      

      // Transform the API response to match our expected format
      const images = (response.data.data.image_list).map((item: any) => ({
        id: item.id ,
        url: item.img_url,
        thumbnail_url: item.thumbnail_url,
        width: item.width || 1080,
        height: item.height || 1080,
        created_at: item.created_at || new Date().toISOString(),
        file_size: item.size,
      }));

      const totalCount = response.data.total_count || images.length;
      const hasMore = (params.page + 1) * params.pageSize < totalCount;

      return {
        images,
        total_count: totalCount,
        page: params.page,
        page_size: params.pageSize,
        has_more: hasMore,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) {
        throw new Error('Request cancelled');
      }

      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'Unknown error occurred',
        status: error.response?.status,
        code: error.code,
      };

      throw apiError;
    }
  }

  cancelRequests(): void {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Request cancelled by user');
      this.cancelTokenSource = null;
    }
  }
}

export const fotoOwlApi = new FotoOwlApi();