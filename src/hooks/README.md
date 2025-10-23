# Authentication Hooks

This folder contains custom React hooks for handling authentication in the TikTok UI application.

## Structure

```
src/hooks/
├── types/
│   ├── authTypes.ts          # TypeScript types for authentication
│   └── googleAuthTypes.ts    # TypeScript types for Google OAuth
├── reducers/
│   ├── authReducer.ts        # Reducer for auth state management
│   └── googleAuthReducer.ts  # Reducer for Google auth state
├── authConstants.ts          # Constants for storage keys and API endpoints
├── useAuth.ts               # Main authentication hook
├── useLogin.ts              # Login functionality hook
├── useSignup.ts             # Signup functionality hook
├── useGoogleAuth.ts         # Google OAuth hook
└── index.ts                 # Export all hooks and types
```

## Available Hooks

### useAuth
Main authentication hook that manages the overall auth state.

```typescript
import { useAuth } from '@/hooks';

const { user, token, isAuthenticated, isLoading, logout } = useAuth();
```

### useLogin
Handles user login functionality.

```typescript
import { useLogin } from '@/hooks';

const { login, isLoading, error, isSuccess, clearError } = useLogin();

// Usage
const handleLogin = async () => {
  const result = await login({
    email: 'user@example.com',
    password: 'password123'
  });
};
```

### useSignup
Handles user registration functionality.

```typescript
import { useSignup } from '@/hooks';

const { signup, isLoading, error, isSuccess, clearError } = useSignup();

// Usage
const handleSignup = async () => {
  const result = await signup({
    email: 'user@example.com',
    username: 'username',
    full_name: 'Full Name',
    password: 'password123'
  });
};
```

### useGoogleAuth
Handles Google OAuth authentication.

```typescript
import { useGoogleAuth } from '@/hooks';

const { 
  initiateGoogleLogin, 
  isLoading, 
  error, 
  authStatus 
} = useGoogleAuth();

// Usage
const handleGoogleLogin = () => {
  initiateGoogleLogin();
};
```

## API Endpoints

The hooks are configured to work with the following API endpoints:

- **Signup**: `POST https://backend.postsiva.com/auth/signup`
- **Login**: `POST https://backend.postsiva.com/auth/login`
- **Google Status**: `GET https://backend.postsiva.com/auth/google/status`
- **Google Callback**: `GET https://backend.postsiva.com/auth/google/callback`

## Features

- ✅ Session management with unique session IDs
- ✅ Automatic token storage and retrieval
- ✅ User data persistence
- ✅ Google OAuth integration
- ✅ Gemini API key caching
- ✅ Error handling and loading states
- ✅ Automatic redirects after authentication
- ✅ Session conflict detection and resolution

## Storage Keys

The hooks use the following localStorage keys:

- `auth_token`: JWT access token
- `user_data`: User information
- `user_id`: User ID
- `session_id`: Unique session identifier
- `active_user_id`: Currently active user ID
- `google_auth_redirect`: URL to redirect after Google auth
- `gemini_api_key_preview`: Cached Gemini API key
- `has_gemini_key`: Boolean flag for Gemini key presence

## Error Handling

All hooks include comprehensive error handling:

- Network errors
- API response errors
- Session conflicts
- Invalid credentials
- OAuth errors

## Usage Examples

### Login Page
```typescript
import { useLogin } from '@/hooks';

export default function LoginPage() {
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Signup Page
```typescript
import { useSignup } from '@/hooks';

export default function SignupPage() {
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    await signup({
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      full_name: formData.get('full_name') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```
