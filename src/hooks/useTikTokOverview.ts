"use client";

import { useCallback, useReducer } from 'react';
import { STORAGE_KEYS, API_ENDPOINTS } from './authConstants';
import { initialTikTokOverviewState, tiktokOverviewReducer } from './reducers/tiktokOverviewReducer';
import type { 
  TikTokUserProfileResponse, 
  TikTokUserVideosResponse
} from './types/tiktokOverviewTypes';

export default function useTikTokOverview() {
  const [state, dispatch] = useReducer(tiktokOverviewReducer, initialTikTokOverviewState);

  const fetchUserProfile = useCallback(async (refresh: boolean = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('You must be logged in to fetch TikTok profile');
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TIKTOK_USER_PROFILE}?refresh=${refresh}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch user profile`);
      }

      const data: TikTokUserProfileResponse = await response.json();
      
      console.log('🎵 TikTok user profile response:', data);

      if (data.success && data.data?.data) {
        dispatch({ type: 'SET_USER_PROFILE', payload: data.data.data });
        dispatch({ type: 'SET_LAST_UPDATED', payload: data.data.last_updated });
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch TikTok user profile';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('❌ TikTok user profile error:', err);
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchUserVideos = useCallback(async (maxCount: number = 20, refresh: boolean = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('You must be logged in to fetch TikTok videos');
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TIKTOK_USER_VIDEOS}?max_count=${maxCount}&refresh=${refresh}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch user videos`);
      }

      const data: TikTokUserVideosResponse = await response.json();
      
      console.log('🎵 TikTok user videos response:', data);

      if (data.success && data.data?.videos) {
        dispatch({ 
          type: 'SET_USER_VIDEOS', 
          payload: { 
            videos: data.data.videos,
            total: data.data.total_count,
            hasMore: data.data.has_more
          }
        });
      } else {
        throw new Error(data.message || 'Failed to fetch user videos');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch TikTok user videos';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('❌ TikTok user videos error:', err);
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchOverviewData = useCallback(async (refresh: boolean = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Fetch both profile and videos in parallel
      await Promise.all([
        fetchUserProfile(refresh),
        fetchUserVideos(20, refresh)
      ]);
    } catch (err) {
      console.error('❌ TikTok overview data error:', err);
      // Error is already handled by individual functions
    }
  }, [fetchUserProfile, fetchUserVideos]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    fetchUserProfile,
    fetchUserVideos,
    fetchOverviewData,
    clearError,
    reset,
  };
}
