// Generate a unique session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Set session ID in localStorage
export const setSessionId = (sessionId: string): void => {
  localStorage.setItem('session_id', sessionId);
};

// Get session ID from localStorage
export const getSessionId = (): string | null => {
  return localStorage.getItem('session_id');
};

// Remove session ID from localStorage
export const removeSessionId = (): void => {
  localStorage.removeItem('session_id');
};

// Set active user ID in localStorage
export const setActiveUserId = (userId: string): void => {
  localStorage.setItem('active_user_id', userId);
};

// Get active user ID from localStorage
export const getActiveUserId = (): string | null => {
  return localStorage.getItem('active_user_id');
};

// Remove active user ID from localStorage
export const removeActiveUserId = (): void => {
  localStorage.removeItem('active_user_id');
};

// Clear all auth-related data
export const clearAuthData = (): void => {
  removeSessionId();
  removeActiveUserId();
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_info');
  localStorage.removeItem('gemini_api_key_preview');
  localStorage.removeItem('has_gemini_key');
};
