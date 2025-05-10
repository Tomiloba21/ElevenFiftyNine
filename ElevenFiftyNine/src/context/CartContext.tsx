import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartRequest, CartUpdateRequest } from '../types/types';
import { CartApi } from '../services/CartApi';
import { ProductApi } from '../services/ProductApi';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load cart data when component mounts, but only once
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    
    // Only fetch cart if user is logged in and cart hasn't been initialized
    if (userToken && !isInitialized) {
      refreshCart().then(() => {
        setIsInitialized(true);
      });
    }
  }, [isInitialized]);

  // Fetch cart from API
  const refreshCart = async (): Promise<void> => {
    // If already loading, don't trigger another request
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const cart = await CartApi.getCart();
      const itemsWithDetails = await addProductDetailsToCartItems(cart.items);
      setCartItems(itemsWithDetails);
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
      setError(err.message || 'Failed to fetch cart');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add product details to cart items for display purposes
  const addProductDetailsToCartItems = async (items: CartItem[]): Promise<CartItem[]> => {
    if (!items || items.length === 0) return [];
    
    const enhancedItems = await Promise.all(
      items.map(async (item) => {
        try {
          console.log("Items First ", item.productId)
          const product = await ProductApi.getProduct(item.productId);
          return {
            ...item,
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.imageUrl ? await ProductApi.fetchImage(product.imageUrl) : undefined
          };
        } catch (error) {
          console.error(`Error fetching details for product ${item.productId}:`, error);
          return item;
        }
      })
    );
    return enhancedItems;
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const request: CartRequest = {
        productId,
        quantity
      };
      const updatedCart = await CartApi.addItemToCart(request);
      const itemsWithDetails = await addProductDetailsToCartItems(updatedCart.items);
      setCartItems(itemsWithDetails);
    } catch (err: any) {
      setError(err.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number): Promise<void> => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const request: CartUpdateRequest = {
        itemId,
        quantity
      };
      const updatedCart = await CartApi.updateCartItem(request);
      const itemsWithDetails = await addProductDetailsToCartItems(updatedCart.items);
      setCartItems(itemsWithDetails);
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await CartApi.removeCartItem(itemId);
      const itemsWithDetails = await addProductDetailsToCartItems(updatedCart.items);
      setCartItems(itemsWithDetails);
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await CartApi.clearCart();
      setCartItems([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart total
  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Get total number of items in cart
  const getCartCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};