"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  generateSessionId, 
  setSessionId, 
  setActiveUserId,
  removeSessionId,
  removeActiveUserId,
  clearAuthData
} from '@/lib/auth';

import { STORAGE_KEYS, API_ENDPOINTS } from './authConstants';
import { GoogleAuthStatus, GoogleAuthResponse } from './types/googleAuthTypes';
import { googleAuthReducer, initialGoogleAuthState } from './reducers/googleAuthReducer';

const useGoogleAuth = () => {
  const [state, dispatch] = useReducer(googleAuthReducer, initialGoogleAuthState);
  const router = useRouter();

  // Check Google OAuth configuration status
  const checkGoogleAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check Google auth status');
      }

      const status: GoogleAuthStatus = await response.json();
      dispatch({ type: 'SET_STATUS', payload: status });
      return status;
    } catch (err: unknown) {
      console.error('Error checking Google auth status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to check Google auth status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    }
  }, []);

  // Initiate Google OAuth login
  const initiateGoogleLogin = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Build the Google OAuth URL with proper redirect_uri
      const baseUrl = window.location.origin; // This will be your local dev URL (e.g., http://localhost:3000)
      const redirectUri = `${baseUrl}/auth/google/callback`;
      
      // Build the login URL with redirect_uri parameter
      const loginUrl = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      // Store the current URL to redirect back after login
      const currentUrl = window.location.href;
      localStorage.setItem(STORAGE_KEYS.GOOGLE_AUTH_REDIRECT, currentUrl);
      
      console.log('Redirecting to Google OAuth:', loginUrl);
      console.log('Redirect URI:', redirectUri);
      
      // Redirect to Google OAuth
      window.location.href = loginUrl;
      
    } catch (err: unknown) {
      console.error('Error initiating Google login:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate Google login';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Handle Google OAuth callback
  const handleGoogleCallback = useCallback(async (code: string, state?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const params = new URLSearchParams({
        code,
        ...(state && { state }),
      });

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.GOOGLE_CALLBACK}?${params}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to authenticate with Google');
      }

      const authData: GoogleAuthResponse = await response.json();
      
      if (authData.success && authData.token) {
        // Check if there's already an active session with a different user
        const existingToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const existingUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (existingToken && existingUser && authData.user) {
          try {
            const existingUserData = JSON.parse(existingUser);
            if (existingUserData.email !== authData.user.email) {
              console.warn('⚠️ Google login with different account detected');
              console.warn(`⚠️ Current user: ${existingUserData.email}, New user: ${authData.user.email}`);
              
              // Force logout of existing session
              console.log('🔒 Forcing logout of existing session before Google login');
              clearAuthData();
            }
          } catch (error) {
            console.error('❌ Error checking existing session:', error);
          }
        }
        
        // Generate new session ID
        const newSessionId = generateSessionId();
        console.log('🆔 Generated new session ID for Google login:', newSessionId);
        
        // Store the authentication token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token);
        
        // Store user info if available
        if (authData.user) {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));
          localStorage.setItem('user_info', JSON.stringify(authData.user));
          
          // Save session data
          setSessionId(newSessionId);
          setActiveUserId(authData.user.id);
        }
        
        console.log('✅ Google authentication successful with session tracking');

        // Get the redirect URL from localStorage
        const redirectUrl = localStorage.getItem(STORAGE_KEYS.GOOGLE_AUTH_REDIRECT);
        localStorage.removeItem(STORAGE_KEYS.GOOGLE_AUTH_REDIRECT);

        // Always redirect to connect page after successful Google auth
        // This ensures consistent behavior like simple auth
        const targetUrl = '/auth/connect';
        
        // Quietly fetch and cache Gemini API key (non-blocking, ignore errors)
        try {
          const res = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.GEMINI_KEYS}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authData.token}`
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data) {
              if (data.api_key_preview) {
                localStorage.setItem('gemini_api_key_preview', String(data.api_key_preview));
              }
              localStorage.setItem('has_gemini_key', String(!!(data.api_key_preview || data.is_active)));
              console.log('🔑 Cached Gemini key presence from server (Google auth)');
            } else {
              localStorage.setItem('has_gemini_key', 'false');
              localStorage.removeItem('gemini_api_key_preview');
              console.log('ℹ️ No Gemini key found (null) [Google auth]');
            }
          }
        } catch (e) {
          console.warn('⚠️ Gemini key fetch failed after Google login (ignored)');
        }

        router.push(targetUrl);
        
        return authData;
      } else {
        throw new Error(authData.message || 'Authentication failed');
      }
    } catch (err: unknown) {
      console.error('Error handling Google callback:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to handle Google callback';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [router]);

  // Check for Google OAuth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (error) {
      dispatch({ type: 'SET_ERROR', payload: `Google OAuth error: ${error}` });
      return;
    }

    if (code) {
      // Redirect to callback page to handle the authentication
      const callbackUrl = `/auth/google/callback?${window.location.search}`;
      window.location.href = callbackUrl;
    }
  }, []);

  // Note: No need to check Google auth status on mount since we're using the login endpoint directly

  return {
    isLoading: state.isLoading,
    error: state.error,
    authStatus: state.authStatus,
    initiateGoogleLogin,
    handleGoogleCallback,
  };
};

export default useGoogleAuth;
