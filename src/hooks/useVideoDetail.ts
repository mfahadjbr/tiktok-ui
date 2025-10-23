"use client";

import { useCallback, useReducer } from 'react';
import { STORAGE_KEYS, API_ENDPOINTS } from './authConstants';
import { initialVideoDetailState, videoDetailReducer } from './reducers/videoDetailReducer';
import type { VideoQueryResponse, VideoDetailState } from './types/videoDetailTypes';

export default function useVideoDetail() {
  const [state, dispatch] = useReducer(videoDetailReducer, initialVideoDetailState);

  const fetchVideoDetail = useCallback(async (videoId: string, forceRefresh: boolean = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_VIDEO', payload: null });

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('You must be logged in to fetch video details');
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TIKTOK_VIDEO_QUERY}?video_ids=${videoId}&force_refresh=${forceRefresh}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch video details`);
      }

      const data: VideoQueryResponse = await response.json();
      
      console.log('🎵 TikTok video detail response:', data);

      if (data.success && data.data?.videos && data.data.videos.length > 0) {
        const video = data.data.videos[0];
        dispatch({ type: 'SET_VIDEO', payload: video });
        dispatch({ type: 'SET_LAST_UPDATED', payload: new Date().toISOString() });
      } else {
        throw new Error(data.message || 'Video not found');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch video details';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('❌ TikTok video detail error:', err);
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    fetchVideoDetail,
    clearError,
    reset,
  };
}
