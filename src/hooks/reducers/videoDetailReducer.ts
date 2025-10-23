import { VideoDetailAction, VideoDetailState } from '../types/videoDetailTypes';

export const initialVideoDetailState: VideoDetailState = {
  isLoading: false,
  error: null,
  video: null,
  lastUpdated: null,
};

export function videoDetailReducer(state: VideoDetailState, action: VideoDetailAction): VideoDetailState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VIDEO':
      return { ...state, video: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'RESET':
      return initialVideoDetailState;
    default:
      return state;
  }
}
