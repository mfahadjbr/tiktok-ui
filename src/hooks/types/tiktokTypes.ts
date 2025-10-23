export interface TikTokAuthState {
  isLoading: boolean;
  error: string | null;
  authUrl: string | null;
  testUserUrl: string | null;
  success: boolean;
}

export interface TikTokCreateTokenResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    user_id: string;
    auth_url: string;
    instructions?: string;
  };
}

export interface TikTokTestUserResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    test_user_url: string;
    instructions: string;
    user_id: string;
  };
}

export type TikTokAuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTH_URL'; payload: string | null }
  | { type: 'SET_TEST_USER_URL'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: boolean };
