export interface UserData {
    avatar: any;
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    addresses: Address[];
    roles: string[];
    enabled: boolean;
    loyaltyPoints: number;
    membershipTier: string;
    joinDate?: string; // Optional field that might be added later
  }
  
  export interface Address {
    id?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }
  
  const API_BASE_URL = 'http://localhost:8080/api/v1';
  
  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('401 - No authentication token found');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };
  
  export const userApi = {
    /**
     * Fetch the current user's data
     */
    getCurrentUser: async (): Promise<UserData> => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.status}`);
        }
        
        const data = await response.json();
        // Add formatted join date (this could come from the API or be mocked for now)
        // In a real app, we might get this from the API or calculate it from a timestamp
        

        if(getAuthHeaders()) localStorage.setItem("userId", data.id )
        return {
          ...data,
          joinDate: data.joinDate || 'January 15, 2023', // Default value for now
        };
      } catch (error) {
        console.error('Failed to fetch user data', error);
        throw error;
      }
    },
  
    /**
     * Update user profile information
     */
    updateUserProfile: async (userData: Partial<UserData>): Promise<UserData> => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          throw new Error(`Error updating user data: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to update user data', error);
        throw error;
      }
    },
  
    /**
     * Update user password
     */
    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/password`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error updating password: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to update password', error);
        throw error;
      }
    },
  
    /**
     * Update notification preferences
     */
    updateNotificationPreferences: async (preferences: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
    }): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/preferences`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(preferences),
        });
        
        if (!response.ok) {
          throw new Error(`Error updating preferences: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to update preferences', error);
        throw error;
      }
    },
  
    /**
     * Log out the user
     */
    logout: (): void => {
      localStorage.removeItem('userToken');
      // Additional cleanup can be added here
    }
  };