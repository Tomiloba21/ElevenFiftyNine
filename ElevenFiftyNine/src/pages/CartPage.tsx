import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Loader2, ChevronLeft } from 'lucide-react';
import { Nav } from '../components/Nav';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Footer } from '../components/Footer';

export default function CartPage() {
  // Theme toggle state (keeping this from original code)
  const [isDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Use our cart context
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  
  // Define dynamic theme classes (keeping this from original code)
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonBgColor = isDarkMode ? "bg-blue-600" : "bg-black";
  const itemBorderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const quantityBgColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  
  // Calculate subtotal
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
  
  return (
    <div className={`${bgColor} ${textColor} min-h-screen`}>
      <Nav />
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
                      <p className={`font-semibold ${textColor}`}>${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className={`flex items-center border rounded ${borderColor}`}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`px-2 py-1 ${secondaryTextColor} ${quantityBgColor}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={`px-4 ${textColor}`}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`px-2 py-1 ${secondaryTextColor} ${quantityBgColor}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 flex items-center"
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
                <p className={textColor}>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Shipping</p>
                <p className={textColor}>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Tax</p>
                <p className={textColor}>${tax.toFixed(2)}</p>
              </div>
              <div className={`border-t ${borderColor} mt-4 pt-4 flex justify-between font-semibold`}>
                <p className={textColor}>Total</p>
                <p className={textColor}>${total.toFixed(2)}</p>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full ${buttonBgColor} text-white py-3 rounded mt-4 flex items-center justify-center hover:bg-gray-800 transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
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
                  Free shipping on orders over $50
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