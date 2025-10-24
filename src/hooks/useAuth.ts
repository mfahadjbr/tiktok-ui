"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  clearAuthData
} from '@/lib/auth';
import { STORAGE_KEYS } from './authConstants';
import { User } from './types/authTypes';
import { authReducer, initialAuthState } from './reducers/authReducer';

const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        const user: User = JSON.parse(userData);
        dispatch({ type: 'INIT', payload: { user, token } });
      } else {
        dispatch({ type: 'INIT', payload: { user: null, token: null } });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      dispatch({ type: 'INIT', payload: { user: null, token: null } });
    }
  }, []);

  // Login success handler
  const handleLoginSuccess = useCallback((user: User, token: string) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    clearAuthData();
    dispatch({ type: 'LOGOUT' });
    router.push('/auth/login');
  }, [router]);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    handleLoginSuccess,
    logout,
    setLoading,
    initializeAuth,
  };
};

export default useAuth;
