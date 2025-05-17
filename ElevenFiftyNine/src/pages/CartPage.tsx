import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Footer } from '../components/Footer';

export default function CartPage() {
  // Theme toggle state (keeping this from original code)
  const [isDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use our cart context
  const { 
    cartItems, 
    loading: cartLoading, 
    error: cartError, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    refreshCart 
  } = useCart();
  
  // Load cart data when component mounts - WITH ERROR HANDLING
  useEffect(() => {
    const loadCart = async () => {
      // Check if user is logged in
      const userToken = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      
      if (!userToken || !userId) {
        console.log('User not logged in, redirecting to login');
        setIsPageLoading(false);
        return; // Don't try to load cart if user isn't logged in
      }
      
      setIsPageLoading(true);
      try {
        await refreshCart();
      } catch (error : any) {
        console.error('Error loading cart:', error);
        // If the error is related to authentication, redirect to login
        if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
          // Clear invalid tokens
          localStorage.removeItem('userToken');
          localStorage.removeItem('userId');
          navigate('/auth');
        }
      } finally {
        setIsPageLoading(false);
      }
    };
    
    loadCart();
    // Only run this once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Define dynamic theme classes (keeping this from original code)
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonBgColor = isDarkMode ? "bg-blue-600" : "bg-black";
  const itemBorderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const quantityBgColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  
  // Calculate subtotal - Make sure cartItems exists
  const subtotal = getCartTotal();
  
  // Fixed values for shipping and tax (could be made dynamic later)
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  // Handle checkout
  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };
  
  // Check if user is logged in before rendering
  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  
  if (!userToken || !userId) {
    return (
      <div className={`${bgColor} ${textColor} min-h-screen`}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-16">
            <ShoppingCart size={48} className={`mx-auto ${secondaryTextColor} mb-4`} />
            <h2 className={`text-xl font-medium mb-2 ${textColor}`}>Please log in to view your cart</h2>
            <p className={`${secondaryTextColor} mb-6`}>You need to be logged in to access your shopping cart.</p>
            <Link to="/auth">
              <button className={`${buttonBgColor} text-white px-6 py-2 rounded hover:bg-gray-800`}>
                Log In / Sign Up
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Show loading state
  if (isPageLoading) {
    return (
      <div className={`${bgColor} ${textColor} min-h-screen`}>
      
        <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-500" />
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Show error state
  if (cartError) {
    return (
      <div className={`${bgColor} ${textColor} min-h-screen`}>
      
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{cartError}</span>
            <div className="mt-4">
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                onClick={() => refreshCart()}
              >
                Try Again
              </button>
              <Link to="/products">
                <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Browse Products
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className={`${bgColor} ${textColor} min-h-screen`}>
    
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link to="/products" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="mr-2" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className={`text-2xl font-bold ${textColor} ml-auto`}>Shopping Cart ({cartItems.length})</h1>
        </div>
        
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              {cartItems.map((item) => (
                <div key={item.id} className={`flex border-b ${itemBorderColor} py-4`}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <ShoppingCart size={24} className="text-gray-400" />
                    </div>
                  )}
                  
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>{item.brand || 'Brand'}</p>
                        <h3 className={`font-medium ${textColor}`}>{item.name}</h3>
                        {item.color && <p className={`text-sm mt-1 ${secondaryTextColor}`}>Color: {item.color}</p>}
                        {item.size && <p className={`text-sm ${secondaryTextColor}`}>Size: {item.size}</p>}
                      </div>
                      <p className={`font-semibold ${textColor}`}>£{item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className={`flex items-center border rounded ${borderColor}`}>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={cartLoading}
                          className={`px-2 py-1 ${secondaryTextColor} ${quantityBgColor} ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={`px-4 ${textColor}`}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={cartLoading}
                          className={`px-2 py-1 ${secondaryTextColor} ${quantityBgColor} ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        disabled={cartLoading}
                        className={`text-red-500 flex items-center ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`lg:w-1/3 ${secondaryBgColor} p-4 rounded h-fit border ${borderColor}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Subtotal</p>
                <p className={textColor}>£{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Shipping</p>
                <p className={textColor}>£{shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Tax</p>
                <p className={textColor}>£{tax.toFixed(2)}</p>
              </div>
              <div className={`border-t ${borderColor} mt-4 pt-4 flex justify-between font-semibold`}>
                <p className={textColor}>Total</p>
                <p className={textColor}>£{total.toFixed(2)}</p>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading || cartLoading || cartItems.length === 0}
                className={`w-full ${buttonBgColor} text-white py-3 rounded mt-4 flex items-center justify-center hover:bg-gray-800 transition-colors ${
                  (isLoading || cartLoading || cartItems.length === 0) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <ShoppingCart size={18} className="mr-2" />
                    Proceed to Checkout
                  </>
                )}
              </button>
              
              {shipping === 0 ? (
                <p className={`text-center mt-4 text-sm ${secondaryTextColor}`}>
                  Free shipping included
                </p>
              ) : (
                <p className={`text-center mt-4 text-sm ${secondaryTextColor}`}>
                  Free shipping on orders over £50
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart size={48} className={`mx-auto ${secondaryTextColor} mb-4`} />
            <h2 className={`text-xl font-medium mb-2 ${textColor}`}>Your cart is empty</h2>
            <p className={`${secondaryTextColor} mb-6`}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products">
              <button className={`${buttonBgColor} text-white px-6 py-2 rounded hover:bg-gray-800`}>
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
