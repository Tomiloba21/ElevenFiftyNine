import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ProductType } from '../types/types';

// Define cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
  brand?: string;
}

// Define cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductType, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartCount: () => 0,
  getCartTotal: () => 0,
});

// Create provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // If parsing fails, clear localStorage
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product: ProductType, quantity: number, selectedColor?: string, selectedSize?: string) => {
    setCartItems(prevItems => {
      // Check if product is already in cart
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.color === selectedColor && 
        item.size === selectedSize
      );

      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item => 
          (item.id === product.id && item.color === selectedColor && item.size === selectedSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          quantity: quantity,
          color: selectedColor,
          size: selectedSize,
          image: product.imageUrl,
          brand: product.brand
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);