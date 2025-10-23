"use client";

import { useCallback, useReducer } from 'react';
import { STORAGE_KEYS, API_ENDPOINTS } from './authConstants';
import { initialTikTokState, tiktokReducer } from './reducers/tiktokReducer';
import type { TikTokCreateTokenResponse, TikTokTestUserResponse } from './types/tiktokTypes';

export default function useTikTokAuth() {
  const [state, dispatch] = useReducer(tiktokReducer, initialTikTokState);

  const initiateTikTokConnect = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_AUTH_URL', payload: null });
    dispatch({ type: 'SET_SUCCESS', payload: false });

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('You must be logged in to connect TikTok');
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/tiktok/create-token`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create TikTok token`);
      }

      const data: TikTokCreateTokenResponse = await response.json();
      
      console.log('🎵 TikTok create-token response:', data);

      const authUrl = data?.data?.auth_url;
      if (data.success && authUrl) {
        dispatch({ type: 'SET_AUTH_URL', payload: authUrl });
        dispatch({ type: 'SET_SUCCESS', payload: true });

        // Open TikTok OAuth in a centered popup window (not a new tab)
        const popupWidth = 640;
        const popupHeight = 780;
        const left = Math.max(0, (window.screenX || window.screenLeft || 0) + (window.outerWidth - popupWidth) / 2);
        const top = Math.max(0, (window.screenY || window.screenTop || 0) + (window.outerHeight - popupHeight) / 2);
        const features = `popup=yes,toolbar=no,menubar=no,location=yes,status=no,scrollbars=yes,resizable=yes,width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;

        const popup = window.open(authUrl, 'tiktok_oauth_popup', features);

        // Fallback: if popup is blocked, redirect current tab
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          console.warn('Popup blocked; redirecting current tab to TikTok');
          window.location.href = authUrl;
        } else {
          try { 
            popup.focus(); 
          } catch (e) {
            console.warn('Could not focus popup:', e);
          }
        }
      } else {
        throw new Error(data?.message || 'Failed to get TikTok auth URL');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initiate TikTok auth';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('❌ TikTok connect error:', err);
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const initiateTikTokTestUser = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_TEST_USER_URL', payload: null });
    dispatch({ type: 'SET_SUCCESS', payload: false });

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('You must be logged in to add TikTok test user');
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TIKTOK_TEST_USER}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to add TikTok test user`);
      }

      const data: TikTokTestUserResponse = await response.json();
      
      console.log('🎵 TikTok test user response:', data);

      const testUserUrl = data?.data?.test_user_url;
      if (data.success && testUserUrl) {
        dispatch({ type: 'SET_TEST_USER_URL', payload: testUserUrl });
        dispatch({ type: 'SET_SUCCESS', payload: true });

        // Open test user URL in a new tab
        window.open(testUserUrl, '_blank');
      } else {
        throw new Error(data?.message || 'Failed to get TikTok test user URL');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initiate TikTok test user';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('❌ TikTok test user error:', err);
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return {
    ...state,
    initiateTikTokConnect,
    initiateTikTokTestUser,
  };
}
