import { API_ENDPOINTS, fetchWithTimeout } from "../utility/apiConfig";

// Use the centralized API endpoints
const AUTH_URL = `${API_ENDPOINTS.AUTH}/`;

interface User {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: Address[] | Address; // Modified to accept both array and single object
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  username: string;
  roles: string[];
  tokenType: string;
  message?: string;
}

interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

interface RegisterData extends User {
  password: string;
}

class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetchWithTimeout(`${AUTH_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: username,
          password
        } as LoginCredentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Login failed';
        throw new Error(errorMessage);
      }
      
      if (data.accessToken) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userToken', data.accessToken);
        
        // Set user role for easy access
        if (data.roles && data.roles.length > 0) {
          const isAdmin = data.roles.includes('ROLE_ADMIN');
          const isCustomer = data.roles.includes('ROLE_CUSTOMER');
          localStorage.setItem('userRole', isAdmin ? 'admin' : isCustomer ? 'customer' : 'user');
        }
        
        // Immediately fetch the user data to get the ID
        this.fetchUserDataAfterLogin();
      }
      
      return data as AuthResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  // New method to fetch user data after login
  private async fetchUserDataAfterLogin(): Promise<void> {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      
      const response = await fetchWithTimeout(`${API_ENDPOINTS.USERS}/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(`Error fetching user data: ${response.status}`);
        return;
      }
      
      const userData = await response.json();
      
      // Save the user ID to localStorage
      if (userData && userData.id) {
        localStorage.setItem('userId', userData.id);
      }
    } catch (error) {
      console.error('Failed to fetch user data after login', error);
    }
  }

  logout(): Promise<void> {
    // Clear all authentication-related items from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    
    // Add a small delay to ensure localStorage is cleared before any redirects
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Create a copy of the userData to modify
      const modifiedUserData = { ...userData };
      
      // Convert single address object to an array if it's not already an array
      if (modifiedUserData.address && !Array.isArray(modifiedUserData.address)) {
        modifiedUserData.address = [modifiedUserData.address];
      }
      
      const response = await fetchWithTimeout(`${AUTH_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedUserData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Registration failed';
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
      
      return data as AuthResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as AuthResponse : null;
  }

  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.accessToken);
  }

  getAuthHeader(): { 'Authorization': string } | {} {
    const user = this.getCurrentUser();
    return user?.accessToken ? { 'Authorization': `Bearer ${user.accessToken}` } : {};
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await fetchWithTimeout(`${AUTH_URL}forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Password reset request failed';
        throw new Error(errorMessage);
      }
      
      return data as { message: string };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }
}

export default new AuthService();

