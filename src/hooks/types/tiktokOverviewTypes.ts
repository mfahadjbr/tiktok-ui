export interface TikTokUserProfile {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_large_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  username: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    data: TikTokUserProfile;
    source: string;
    last_updated: string;
  };
}

export interface TikTokVideo {
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

export interface TikTokUserVideosResponse {
  success: boolean;
  message: string;
  data: {
    videos: TikTokVideo[];
    total_count: number;
    cursor: number;
    has_more: boolean;
  };
}

export interface TikTokOverviewState {
  isLoading: boolean;
  error: string | null;
  userProfile: TikTokUserProfile | null;
  userVideos: TikTokVideo[];
  totalVideos: number;
  hasMoreVideos: boolean;
  lastUpdated: string | null;
}

export type TikTokOverviewAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_PROFILE'; payload: TikTokUserProfile | null }
  | { type: 'SET_USER_VIDEOS'; payload: { videos: TikTokVideo[]; total: number; hasMore: boolean } }
  | { type: 'SET_LAST_UPDATED'; payload: string | null }
  | { type: 'RESET' };
