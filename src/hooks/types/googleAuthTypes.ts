export interface GoogleAuthState {
  isLoading: boolean;
  error: string | null;
  authStatus: GoogleAuthStatus | null;
}

export interface GoogleAuthStatus {
  google_oauth_configured: boolean;
  login_url: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  message?: string;
}
