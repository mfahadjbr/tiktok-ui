import { TikTokOverviewAction, TikTokOverviewState } from '../types/tiktokOverviewTypes';

export const initialTikTokOverviewState: TikTokOverviewState = {
  isLoading: false,
  error: null,
  userProfile: null,
  userVideos: [],
  totalVideos: 0,
  hasMoreVideos: false,
  lastUpdated: null,
};

export function tiktokOverviewReducer(state: TikTokOverviewState, action: TikTokOverviewAction): TikTokOverviewState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_USER_VIDEOS':
      return { 
        ...state, 
        userVideos: action.payload.videos,
        totalVideos: action.payload.total,
        hasMoreVideos: action.payload.hasMore
      };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'RESET':
      return initialTikTokOverviewState;
    default:
      return state;
  }
}
