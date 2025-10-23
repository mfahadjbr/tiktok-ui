import { TikTokAuthAction, TikTokAuthState } from '../types/tiktokTypes';

export const initialTikTokState: TikTokAuthState = {
  isLoading: false,
  error: null,
  authUrl: null,
  testUserUrl: null,
  success: false,
};

export function tiktokReducer(state: TikTokAuthState, action: TikTokAuthAction): TikTokAuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_AUTH_URL':
      return { ...state, authUrl: action.payload };
    case 'SET_TEST_USER_URL':
      return { ...state, testUserUrl: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    default:
      return state;
  }
}
