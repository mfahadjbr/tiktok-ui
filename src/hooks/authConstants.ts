export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ID: 'user_id',
  GOOGLE_AUTH_REDIRECT: 'google_auth_redirect',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: 'https://backend.postsiva.com',
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  GOOGLE_STATUS: '/auth/google/status',
  GOOGLE_CALLBACK: '/auth/google/callback',
  GEMINI_KEYS: '/gemini-keys/',
  TIKTOK_CREATE_TOKEN: '/tiktok/create-token',
  TIKTOK_TEST_USER: '/tiktok/add-test-user',
  TIKTOK_USER_PROFILE: '/tiktok/user-profile/',
  TIKTOK_USER_VIDEOS: '/tiktok/user-videos/',
} as const;
