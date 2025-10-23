"use client";

import { useState, useCallback } from 'react';
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
import { LoginRequest, LoginResponse, AuthError } from './types/authTypes';

interface UseLoginState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface UseLoginReturn extends UseLoginState {
  login: (data: LoginRequest) => Promise<LoginResponse | null>;
  clearError: () => void;
  reset: () => void;
}

const useLogin = (): UseLoginReturn => {
  const [state, setState] = useState<UseLoginState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const router = useRouter();

  const login = useCallback(async (data: LoginRequest): Promise<LoginResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null, isSuccess: false }));

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: Login failed`);
      }

      const loginData: LoginResponse = await response.json();
      
      // Check if there's already an active session with a different user
      const existingToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const existingUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (existingToken && existingUser && loginData.user) {
        try {
          const existingUserData = JSON.parse(existingUser);
          if (existingUserData.email !== loginData.user.email) {
            console.warn('⚠️ Login with different account detected');
            console.warn(`⚠️ Current user: ${existingUserData.email}, New user: ${loginData.user.email}`);
            
            // Force logout of existing session
            console.log('🔒 Forcing logout of existing session before login');
            clearAuthData();
          }
        } catch (error) {
          console.error('❌ Error checking existing session:', error);
        }
      }
      
      // Generate new session ID
      const newSessionId = generateSessionId();
      console.log('🆔 Generated new session ID for login:', newSessionId);
      
      // Store the authentication token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, loginData.access_token);
      
      // Store user info
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(loginData.user));
      localStorage.setItem('user_info', JSON.stringify(loginData.user));
      
      // Save session data
      setSessionId(newSessionId);
      setActiveUserId(loginData.user.id);
      
      console.log('✅ Login successful with session tracking');

      // Quietly fetch and cache Gemini API key (non-blocking, ignore errors)
      try {
        const res = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.GEMINI_KEYS}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.access_token}`
          },
        });
        
        if (res.ok) {
          const geminiData = await res.json();
          if (geminiData) {
            if (geminiData.api_key_preview) {
              localStorage.setItem('gemini_api_key_preview', String(geminiData.api_key_preview));
            }
            localStorage.setItem('has_gemini_key', String(!!(geminiData.api_key_preview || geminiData.is_active)));
            console.log('🔑 Cached Gemini key presence from server (login)');
          } else {
            localStorage.setItem('has_gemini_key', 'false');
            localStorage.removeItem('gemini_api_key_preview');
            console.log('ℹ️ No Gemini key found (null) [login]');
          }
        }
      } catch (e) {
        console.warn('⚠️ Gemini key fetch failed after login (ignored)');
      }

      setState(prev => ({ ...prev, isLoading: false, isSuccess: true }));
      
      // Redirect to connect page
      router.push('/auth/connect');
      
      return loginData;
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const errorMessage = err.message || 'Login failed. Please check your credentials and try again.';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return null;
    }
  }, [router]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return {
    ...state,
    login,
    clearError,
    reset,
  };
};

export default useLogin;
