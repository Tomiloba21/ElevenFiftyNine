import { Cart, CartRequest, CartUpdateRequest } from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api/v1/carts';

// Helper function to get auth headers and user ID
const getAuthHeaders = () => {
  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  
  if (!userToken) {
    throw new Error('401: Unauthorized - No token found');
  }
  
  if (!userId) {
    throw new Error('User ID not found in storage');
  }
  
  return {
    'Authorization': `Bearer ${userToken}`,
    'X-User-Id': userId,
    'Content-Type': 'application/json'
  };
};

export const CartApi = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - might need to redirect to login
          throw new Error('Unauthorized - Please log in again');
        }
        throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching cart:', error.message || error);
      throw error;
    }
  },
  
  // Add item to cart
  addItemToCart: async (request: CartRequest): Promise<Cart> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add item: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error adding item to cart:', error.message || error);
      throw error;
    }
  },
  
  // Update cart item
  updateCartItem: async (request: CartUpdateRequest): Promise<Cart> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error updating cart item:', error.message || error);
      throw error;
    }
  },
  
  // Remove cart item
  removeCartItem: async (itemId: string): Promise<Cart> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: 'DELETE',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error removing cart item:', error.message || error);
      throw error;
    }
  },
  
  // Clear cart
  clearCart: async (): Promise<void> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'DELETE',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error clearing cart:', error.message || error);
      throw error;
    }
  }
};