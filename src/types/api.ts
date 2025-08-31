export interface FotoOwlImage {
  id: string;
  url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
  created_at: string;
  file_size?: number;
  format?: string;
}

export interface FotoOwlResponse {
  images: FotoOwlImage[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  orderBy: number;
  orderAsc: boolean;
}

export interface CacheMetadata {
  timestamp: number;
  expiresAt: number;
  size: number;
}