import { API_ENDPOINTS, fetchWithTimeout, getAuthHeaders } from "../utility/apiConfig";
import { OrderRequest, OrderResponse, OrderStatusUpdateRequest } from '../types/types';

export const OrderApi = {
  // Create a new order
  createOrder: async (orderRequest: OrderRequest): Promise<OrderResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_ENDPOINTS.ORDERS}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderRequest)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error creating order:', error.message || error);
      throw error;
    }
  },
  
  // Get a specific order by ID
  getOrder: async (orderId: string): Promise<OrderResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`Error fetching order ${orderId}:`, error.message || error);
      throw error;
    }
  },
  
  // Get all orders for current user
  getUserOrders: async (): Promise<OrderResponse[]> => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const response = await fetchWithTimeout(`${API_ENDPOINTS.ORDERS}/customer/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user orders: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching user orders:', error.message || error);
      throw error;
    }
  },
  
  // Admin: Get all orders
  getAllOrders: async (): Promise<OrderResponse[]> => {
    try {
      const response = await fetchWithTimeout(`${API_ENDPOINTS.ORDERS}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch all orders: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching all orders:', error.message || error);
      throw error;
    }
  },
  
  // Admin: Update order status
  updateOrderStatus: async (orderId: string, statusUpdate: OrderStatusUpdateRequest): Promise<OrderResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusUpdate)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error updating order status:', error.message || error);
      throw error;
    }
  }
};
