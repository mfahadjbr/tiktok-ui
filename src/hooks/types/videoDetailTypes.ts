export interface VideoDetail {
  id: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  title: string;
  embed_html: string;
  embed_link: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
}

export interface VideoQueryResponse {
  success: boolean;
  message: string;
  data: {
    videos: VideoDetail[];
    total_count: number;
    requested_count: number;
    found_in_db: number;
    missing_from_db: number;
  };
}

export interface VideoDetailState {
  isLoading: boolean;
  error: string | null;
  video: VideoDetail | null;
  lastUpdated: string | null;
}

export type VideoDetailAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VIDEO'; payload: VideoDetail | null }
  | { type: 'SET_LAST_UPDATED'; payload: string | null }
  | { type: 'RESET' };
