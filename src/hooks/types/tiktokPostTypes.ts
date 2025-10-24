// TikTok Post Upload Types
export interface TikTokPostUploadRequest {
  file?: File;
  title: string;
  video_url?: string;
}

export interface TikTokPostUploadResponse {
  success: boolean;
  message: string;
  data: {
    publish_id?: string;
    upload_url?: string;
    error?: {
      code: string;
      message: string;
      log_id: string;
    };
    upload_status?: string;
    file_info?: {
      filename: string;
      file_size: number;
      content_type: string;
      chunk_size: number;
      total_chunks: number;
      upload_completed: boolean;
    };
    instructions?: string;
  };
}

// TikTok Photo Post Types
export interface TikTokPhotoPostRequest {
  photo_urls: string[];
  cover_index: number;
  title: string;
  description: string;
  privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIEND' | 'SELF_ONLY';
  disable_comment?: boolean;
  auto_add_music?: boolean;
  brand_content_toggle?: boolean;
  brand_organic_toggle?: boolean;
}

export interface TikTokPhotoPostResponse {
  success: boolean;
  message: string;
  data: {
    publish_id?: string;
    photo_count?: number;
    cover_index?: number;
    title?: string;
    description?: string;
    instructions?: string;
    image_processing?: {
      total_processed: number;
      successful_count: number;
      failed_count: number;
      failed_uploads: Array<{
        filename: string;
        error: string;
        reason: string;
      }>;
    };
    uploaded_images?: Array<{
      filename: string;
      size: number;
      type: string;
      public_url: string;
    }>;
    error?: {
      code: string;
      message: string;
      log_id: string;
    };
  };
}

// Post Status Types
export interface TikTokPostStatusRequest {
  publish_id: string;
}

export interface TikTokPostStatusResponse {
  success: boolean;
  message: string;
  data: {
    status?: string;
    publish_id?: string;
    error?: string;
  };
}

// Hook State Types
export interface TikTokPostState {
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  publishId: string | null;
  uploadStatus: string | null;
  lastResponse: TikTokPostUploadResponse | TikTokPhotoPostResponse | null;
}

export interface TikTokPostActions {
  uploadVideoDirect: (file: File, title: string) => Promise<TikTokPostUploadResponse>;
  uploadVideoDraft: (file: File, title: string) => Promise<TikTokPostUploadResponse>;
  uploadVideoFromUrl: (videoUrl: string, title: string) => Promise<TikTokPostUploadResponse>;
  uploadVideoDraftFromUrl: (videoUrl: string, title: string) => Promise<TikTokPostUploadResponse>;
  uploadImagesToServer: (files: File[]) => Promise<string[]>;
  uploadPhotoDirect: (request: TikTokPhotoPostRequest) => Promise<TikTokPhotoPostResponse>;
  uploadPhotoDraft: (request: Omit<TikTokPhotoPostRequest, 'privacy_level' | 'disable_comment' | 'auto_add_music' | 'brand_content_toggle' | 'brand_organic_toggle'>) => Promise<TikTokPhotoPostResponse>;
  checkPostStatus: (publishId: string) => Promise<TikTokPostStatusResponse>;
  clearError: () => void;
  resetState: () => void;
}

export type TikTokPostHook = TikTokPostState & TikTokPostActions;
