
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrderResponse, OrderStatusUpdateRequest } from '../types/types';
import { OrderApi } from './OrderApi';

interface OrderContextType {
  orders: OrderResponse[];
  currentOrder: OrderResponse | null;
  loading: boolean;
  error: string | null;
  fetchUserOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, statusUpdate: OrderStatusUpdateRequest) => Promise<void>;
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const userOrders = await OrderApi.getUserOrders();
      setOrders(userOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const orderDetails = await OrderApi.getOrder(orderId);
      setCurrentOrder(orderDetails);
    } catch (err: any) {
      setError(err.message || `Failed to fetch order ${orderId}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, statusUpdate: OrderStatusUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await OrderApi.updateOrderStatus(orderId, statusUpdate);
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      // Update current order if it's the one being updated
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(updatedOrder);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    fetchUserOrders,
    fetchOrderById,
    updateOrderStatus,
    clearCurrentOrder
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};