// API Configuration utility
// Centralizes API configuration for use across services

// Main base URL from environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// API timeout in milliseconds
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Common endpoint paths
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  USERS: `${API_BASE_URL}/users`,
  CARTS: `${API_BASE_URL}/carts`,
  PRODUCTS: `${API_BASE_URL}/product`,
  ORDERS: `${API_BASE_URL}/orders`, 
  DISCOUNT : `${API_BASE_URL}/discounts`
};

// Helper to get common auth headers
export const getAuthHeaders = () => {
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

// Create request with timeout
export const fetchWithTimeout = async (url: string, options: RequestInit, timeout = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    return response;
  } catch (error : any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};