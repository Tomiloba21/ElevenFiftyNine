import { API_ENDPOINTS, fetchWithTimeout, getAuthHeaders } from "../utility/apiConfig";
import { Cart, CartRequest, CartUpdateRequest } from '../types/types';

export const CartApi = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    try {
      const response = await fetchWithTimeout(`${API_ENDPOINTS.CARTS}`, {
        method: 'GET',
        headers: getAuthHeaders()
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
      const response = await fetchWithTimeout(`${API_ENDPOINTS.CARTS}/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const response = await fetchWithTimeout(`${API_ENDPOINTS.CARTS}/items`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update items: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error updating cart items:', error.message || error);
      throw error;
    }
  },
  
  // Remove cart item
  removeCartItem: async (itemId: string): Promise<Cart> => {
    try {
      const response = await fetchWithTimeout(`${API_ENDPOINTS.CARTS}/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
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
      const response = await fetchWithTimeout(`${API_ENDPOINTS.CARTS}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
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
