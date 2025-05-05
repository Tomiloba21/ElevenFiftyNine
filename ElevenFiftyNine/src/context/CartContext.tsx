// import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { ProductType } from '../types/types';

// // Define cart item type
// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   color?: string;
//   size?: string;
//   image?: string;
//   brand?: string;
// }

// // Define cart context type
// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (product: ProductType, quantity: number, selectedColor?: string, selectedSize?: string) => void;
//   removeFromCart: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
//   getCartCount: () => number;
//   getCartTotal: () => number;
// }

// // Create context with default values
// const CartContext = createContext<CartContextType>({
//   cartItems: [],
//   addToCart: () => {},
//   removeFromCart: () => {},
//   updateQuantity: () => {},
//   clearCart: () => {},
//   getCartCount: () => 0,
//   getCartTotal: () => 0,
// });

// // Create provider component
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       try {
//         setCartItems(JSON.parse(savedCart));
//       } catch (error) {
//         console.error('Failed to parse cart from localStorage:', error);
//         // If parsing fails, clear localStorage
//         localStorage.removeItem('cart');
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Add item to cart
//   const addToCart = (product: ProductType, quantity: number, selectedColor?: string, selectedSize?: string) => {
//     setCartItems(prevItems => {
//       // Check if product is already in cart
//       const existingItem = prevItems.find(item => 
//         item.id === product.id && 
//         item.color === selectedColor && 
//         item.size === selectedSize
//       );

//       if (existingItem) {
//         // Update quantity if item exists
//         return prevItems.map(item => 
//           (item.id === product.id && item.color === selectedColor && item.size === selectedSize)
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // Add new item
//         const newItem: CartItem = {
//           id: product.id,
//           name: product.name,
//           price: product.discountPrice || product.price,
//           quantity: quantity,
//           color: selectedColor,
//           size: selectedSize,
//           image: product.imageUrl,
//           brand: product.brand
//         };
//         return [...prevItems, newItem];
//       }
//     });
//   };

//   // Remove item from cart
//   const removeFromCart = (id: string) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== id));
//   };

//   // Update item quantity
//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(id);
//       return;
//     }

//     setCartItems(prevItems => 
//       prevItems.map(item => 
//         item.id === id ? { ...item, quantity } : item
//       )
//     );
//   };

//   // Clear cart
//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem('cart');
//   };

//   // Get total number of items in cart
//   const getCartCount = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   // Get total price of cart
//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getCartCount,
//       getCartTotal
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use the cart context
// export const useCart = () => useContext(CartContext);


// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import {  CartItem, CartRequest, CartUpdateRequest } from '../types/types';
// import { CartApi } from './CartApi';
// import { ProductApi } from './ProductApi';

// interface CartContextType {
//   cartItems: CartItem[];
//   loading: boolean;
//   error: string | null;
//   addToCart: (productId: string, quantity: number) => Promise<void>;
//   updateQuantity: (itemId: string, quantity: number) => Promise<void>;
//   removeFromCart: (itemId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
//   refreshCart: () => Promise<void>;
//   getCartTotal: () => number;
//   getCartCount: () => number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Load cart data when component mounts
//   useEffect(() => {
//     const userToken = localStorage.getItem('userToken');
//     if (userToken) {
//       refreshCart();
//     }
//   }, []);

//   // Fetch cart from API
//   const refreshCart = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const cart = await CartApi.getCart();
//       const itemsWithDetails = await addProductDetailsToCartItems(cart.items);
//       setCartItems(itemsWithDetails);
//     } catch (err: any) {
//       console.error('Failed to fetch cart:', err);
//       setError(err.message || 'Failed to fetch cart');
//       setCartItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add product details to cart items for display purposes
//   const addProductDetailsToCartItems = async (items: CartItem[]): Promise<CartItem[]> => {
//     const enhancedItems = await Promise.all(
//       items.map(async (item) => {
//         try {
//           const product = await ProductApi.getProduct(item.productId);
//           return {
//             ...item,
//             name: product.name,
//             brand: product.brand,
//             image: product.imageUrl ? await ProductApi.fetchImage(product.imageUrl) : undefined
//           };
//         } catch (error) {
//           console.error(`Error fetching details for product ${item.productId}:`, error);
//           return item;
//         }
//       })
//     );
//     return enhancedItems;
//   };

//   // Add item to cart
//   const addToCart = async (productId: string, quantity: number): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const request: CartRequest = {
//         productId,
//         quantity
//       };
//       const updatedCart = await CartApi.addItemToCart(request);
//       const itemsWithDetails = await addProductDetailsToCartItems(updatedCart.items);
//       setCartItems(itemsWithDetails);
//     } catch (err: any) {
//       setError(err.message || 'Failed to add item to cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update item quantity
//   const updateQuantity = async (itemId: string, quantity: number): Promise<void> => {
//     if (quantity < 1) {
//       await removeFromCart(itemId);
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     try {
//       const request: CartUpdateRequest = {
//         itemId,
//         quantity
//       };
//       const updatedCart = await CartApi.updateCartItem(request);
//       const itemsWithDetails = await addProductDetailsToCartItems(updatedCart.items);
//       setCartItems(itemsWithDetails);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update cart item');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (itemId: string): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const updatedCart = await CartApi.removeCartItem(itemId);
//       const itemsWithDetails = await addProductDetailsToCartItems(updatedCart.items);
//       setCartItems(itemsWithDetails);
//     } catch (err: any) {
//       setError(err.message || 'Failed to remove item from cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear cart
//   const clearCart = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       await CartApi.clearCart();
//       setCartItems([]);
//     } catch (err: any) {
//       setError(err.message || 'Failed to clear cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate cart total
//   const getCartTotal = (): number => {
//     return cartItems.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//   // Get total number of items in cart
//   const getCartCount = (): number => {
//     return cartItems.reduce((count, item) => count + item.quantity, 0);
//   };

//   const value = {
//     cartItems,
//     loading,
//     error,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//     refreshCart,
//     getCartTotal,
//     getCartCount
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartRequest, CartUpdateRequest } from '../types/types';
import { CartApi } from './CartApi';
import { ProductApi } from './ProductApi';

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
          const product = await ProductApi.getProduct(item.productId);
          return {
            ...item,
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