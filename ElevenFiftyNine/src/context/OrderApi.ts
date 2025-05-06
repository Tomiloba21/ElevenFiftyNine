// src/services/OrderApi.ts
import { OrderRequest, OrderResponse, OrderStatusUpdateRequest } from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api/v1/orders';

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

export const OrderApi = {
  // Create a new order
  createOrder: async (orderRequest: OrderRequest): Promise<OrderResponse> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: headers,
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
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/${orderId}`, {
        method: 'GET',
        headers: headers
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
      const headers = getAuthHeaders();
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/customer/${userId}`, {
        method: 'GET',
        headers: headers
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
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: headers
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
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
        method: 'PATCH',
        headers: headers,
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