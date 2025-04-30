const API_URL = "http://localhost:8080/api/v1/auth/";

interface User {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

interface LoginCredentials {
  usernameOrEmail: string;  // Changed from username to usernameOrEmail
  password: string;
}

interface RegisterData extends User {
  password: string;
}

class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          usernameOrEmail: username,  // Changed key to match API expectation
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
      }
      
      return data as AuthResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Registration failed';
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
      const response = await fetch(`${API_URL}forgotPassword`, {
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