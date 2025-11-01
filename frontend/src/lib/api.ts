const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    username: string;
    avatar_url: string;
    bio?: string;
    rating: number;
    isAdmin: boolean;
    adminRole?: string | null;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
  message?: string;
  requiresVerification?: boolean;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio?: string;
  rating: number;
  isAdmin: boolean;
  adminRole?: string | null;
}

// Get stored token from localStorage
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

// Store token in localStorage
export const storeToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

// Store refresh token
export const storeRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  }
};

// Get stored refresh token
export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
};

// Remove tokens from localStorage
export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

// Auth API functions
export const authAPI = {
  // Register
  register: async (email: string, password: string, full_name: string, username?: string): Promise<AuthResponse> => {
    try {
      console.log('Registering user:', { email, full_name, apiUrl: API_URL });
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name, username }),
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Registration error:', errorData);
        throw new Error(errorData.error || `Registration failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      
      // Only store tokens if session exists (user is verified)
      if (data.session) {
        storeToken(data.session.access_token);
        storeRefreshToken(data.session.refresh_token);
      }
      
      return data;
    } catch (error: unknown) {
      console.error('Registration exception:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Cannot connect to backend at ${API_URL}. Is the server running?`);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during registration');
    }
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('=== FRONTEND LOGIN START ===');
      console.log('Email:', email);
      console.log('API URL:', API_URL);
      
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Login error response:', errorData);
        throw new Error(errorData.error || `Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Login successful. Data received:', {
        hasUser: !!data.user,
        hasSession: !!data.session,
        userEmail: data.user?.email,
      });

      if (!data.session) {
        console.error('No session in login response!');
        throw new Error('Login failed: No session returned');
      }

      storeToken(data.session.access_token);
      storeRefreshToken(data.session.refresh_token);
      console.log('Tokens stored successfully');
      console.log('=== FRONTEND LOGIN SUCCESS ===');
      return data;
    } catch (error: unknown) {
      console.error('=== FRONTEND LOGIN EXCEPTION ===');
      console.error('Error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        throw error;
      }
      throw new Error('Unknown error during login');
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiRequest('/auth/me', {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearTokens();
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<{ session: { access_token: string; refresh_token: string; expires_at: number } } | null> => {
    const refresh_token = getStoredRefreshToken();
    if (!refresh_token) {
      return null;
    }

    try {
      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) {
        clearTokens();
        return null;
      }

      const data = await response.json();
      storeToken(data.session.access_token);
      storeRefreshToken(data.session.refresh_token);
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      clearTokens();
      return null;
    }
  },
};

