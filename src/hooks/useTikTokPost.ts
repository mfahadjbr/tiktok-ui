import { useReducer, useCallback } from 'react';
import { API_ENDPOINTS } from './authConstants';
import { 
  TikTokPostState, 
  TikTokPostActions, 
  TikTokPostHook,
  TikTokPostUploadRequest,
  TikTokPostUploadResponse,
  TikTokPhotoPostRequest,
  TikTokPhotoPostResponse,
  TikTokPostStatusRequest,
  TikTokPostStatusResponse
} from './types/tiktokPostTypes';

// Action Types
type TikTokPostAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'SET_PUBLISH_ID'; payload: string | null }
  | { type: 'SET_UPLOAD_STATUS'; payload: string | null }
  | { type: 'SET_LAST_RESPONSE'; payload: TikTokPostUploadResponse | TikTokPhotoPostResponse | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: TikTokPostState = {
  isLoading: false,
  error: null,
  uploadProgress: 0,
  publishId: null,
  uploadStatus: null,
  lastResponse: null,
};

// Reducer
const tiktokPostReducer = (state: TikTokPostState, action: TikTokPostAction): TikTokPostState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    case 'SET_PUBLISH_ID':
      return { ...state, publishId: action.payload };
    case 'SET_UPLOAD_STATUS':
      return { ...state, uploadStatus: action.payload };
    case 'SET_LAST_RESPONSE':
      return { ...state, lastResponse: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

const useTikTokPost = (): TikTokPostHook => {
  const [state, dispatch] = useReducer(tiktokPostReducer, initialState);

  // Helper function to get auth token
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }
    return token;
  }, []);

  // Helper function to make API calls
  const makeApiCall = useCallback(async <T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [getAuthToken]);

  // Upload video directly (POST)
  const uploadVideoDirect = useCallback(async (file: File, title: string): Promise<TikTokPostUploadResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const response = await makeApiCall<TikTokPostUploadResponse>('/tiktok/post/upload', {
        method: 'POST',
        body: formData,
      });

      dispatch({ type: 'SET_LAST_RESPONSE', payload: response });
      
      if (response.success && response.data.publish_id) {
        dispatch({ type: 'SET_PUBLISH_ID', payload: response.data.publish_id });
        dispatch({ type: 'SET_UPLOAD_STATUS', payload: response.data.upload_status || "completed" });
      }

      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 100 });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Upload video as draft (POST)
  const uploadVideoDraft = useCallback(async (file: File, title: string): Promise<TikTokPostUploadResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const response = await makeApiCall<TikTokPostUploadResponse>('/tiktok/draft-post/upload', {
        method: 'POST',
        body: formData,
      });

      dispatch({ type: 'SET_LAST_RESPONSE', payload: response });
      
      if (response.success && response.data.publish_id) {
        dispatch({ type: 'SET_PUBLISH_ID', payload: response.data.publish_id });
        dispatch({ type: 'SET_UPLOAD_STATUS', payload: response.data.upload_status || "completed" });
      }

      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 100 });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video draft';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Upload video from URL (POST)
  const uploadVideoFromUrl = useCallback(async (videoUrl: string, title: string): Promise<TikTokPostUploadResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const params = new URLSearchParams({
        title: title,
        video_url: videoUrl,
      });

      const response = await makeApiCall<TikTokPostUploadResponse>('/tiktok/post/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      dispatch({ type: 'SET_LAST_RESPONSE', payload: response });
      
      if (response.success && response.data.publish_id) {
        dispatch({ type: 'SET_PUBLISH_ID', payload: response.data.publish_id });
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video from URL';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Upload video draft from URL (POST)
  const uploadVideoDraftFromUrl = useCallback(async (videoUrl: string, title: string): Promise<TikTokPostUploadResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const params = new URLSearchParams({
        title: title,
        video_url: videoUrl,
      });

      const response = await makeApiCall<TikTokPostUploadResponse>('/tiktok/draft-post/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      dispatch({ type: 'SET_LAST_RESPONSE', payload: response });
      
      if (response.success && response.data.publish_id) {
        dispatch({ type: 'SET_PUBLISH_ID', payload: response.data.publish_id });
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video draft from URL';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Upload images to server first (for photo posts)
  const uploadImagesToServer = useCallback(async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await makeApiCall<{ success: boolean; url: string }>('/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.success) {
        throw new Error('Failed to upload image');
      }
      
      return response.url;
    });
    
    return Promise.all(uploadPromises);
  }, [makeApiCall]);

  // Upload photo directly (POST)
  const uploadPhotoDirect = useCallback(async (request: TikTokPhotoPostRequest): Promise<TikTokPhotoPostResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await makeApiCall<TikTokPhotoPostResponse>('/tiktok/photo/direct/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      dispatch({ type: 'SET_LAST_RESPONSE', payload: response });
      
      if (response.success && response.data.publish_id) {
        dispatch({ type: 'SET_PUBLISH_ID', payload: response.data.publish_id });
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Upload photo as draft (POST)
  const uploadPhotoDraft = useCallback(async (request: Omit<TikTokPhotoPostRequest, 'privacy_level' | 'disable_comment' | 'auto_add_music' | 'brand_content_toggle' | 'brand_organic_toggle'>): Promise<TikTokPhotoPostResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await makeApiCall<TikTokPhotoPostResponse>('/tiktok/photo/draft/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      dispatch({ type: 'SET_LAST_RESPONSE', payload: response });
      
      if (response.success && response.data.publish_id) {
        dispatch({ type: 'SET_PUBLISH_ID', payload: response.data.publish_id });
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo draft';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Check post status (POST)
  const checkPostStatus = useCallback(async (publishId: string): Promise<TikTokPostStatusResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await makeApiCall<TikTokPostStatusResponse>('/tiktok/post-status/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publish_id: publishId }),
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check post status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [makeApiCall]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  return {
    ...state,
    uploadVideoDirect,
    uploadVideoDraft,
    uploadVideoFromUrl,
    uploadVideoDraftFromUrl,
    uploadImagesToServer,
    uploadPhotoDirect,
    uploadPhotoDraft,
    checkPostStatus,
    clearError,
    resetState,
  };
};

export default useTikTokPost;
