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
import { SignupRequest, SignupResponse, AuthError } from './types/authTypes';

interface UseSignupState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface UseSignupReturn extends UseSignupState {
  signup: (data: SignupRequest) => Promise<SignupResponse | null>;
  clearError: () => void;
  reset: () => void;
}

const useSignup = (): UseSignupReturn => {
  const [state, setState] = useState<UseSignupState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const router = useRouter();

  const signup = useCallback(async (data: SignupRequest): Promise<SignupResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null, isSuccess: false }));

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: Signup failed`);
      }

      const signupData: SignupResponse = await response.json();
      
      // Clear any existing auth data before setting new session
      clearAuthData();
      
      // Generate new session ID for the new user
      const newSessionId = generateSessionId();
      console.log('🆔 Generated new session ID for signup:', newSessionId);
      
      // Store session data
      setSessionId(newSessionId);
      setActiveUserId(signupData.id);
      
      // Store user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(signupData));
      localStorage.setItem('user_info', JSON.stringify(signupData));
      
      console.log('✅ Signup successful with session tracking');
      
      setState(prev => ({ ...prev, isLoading: false, isSuccess: true }));
      
      // Redirect to login page or dashboard
      router.push('/auth/login');
      
      return signupData;
    } catch (err: any) {
      console.error('❌ Signup error:', err);
      const errorMessage = err.message || 'Signup failed. Please try again.';
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
    signup,
    clearError,
    reset,
  };
};

export default useSignup;
