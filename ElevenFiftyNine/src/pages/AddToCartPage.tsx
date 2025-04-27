import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Nav } from '../components/Nav';

export default function AddToCartPage() {
  // Theme toggle state
  const [isDarkMode] = useState(false);
  
  // Cart items state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "11FiftyNine Graphic T-Shirt",
      brand: "Reebok",
      color: "White",
      size: "42",
      price: 29.99,
      quantity: 1,
      image: "/api/placeholder/100/100"
    }
  ]);
  
  // Theme toggle function
//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//   };
  
  // Define dynamic theme classes
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonBgColor = isDarkMode ? "bg-blue-600" : "bg-black";
  const itemBorderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const quantityBgColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  
  const updateQuantity = (id : number, change : any) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {...item, quantity: newQuantity};
      }
      return item;
    }));
  };
  
  const removeItem = (id :number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };
  
  // Simple footer component
  const Footer = () => (
    <div className={`mt-12 py-6 border-t ${borderColor}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className={`font-semibold mb-2 ${textColor}`}>Shopping with us</h3>
            <ul className={secondaryTextColor}>
              <li>Shipping & Delivery</li>
              <li>Returns & Exchanges</li>
              <li>Payment Methods</li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0">
            <h3 className={`font-semibold mb-2 ${textColor}`}>Customer Service</h3>
            <ul className={secondaryTextColor}>
              <li>Contact Us</li>
              <li>FAQ</li>
              <li>Size Guide</li>
            </ul>
          </div>
          <div>
            <h3 className={`font-semibold mb-2 ${textColor}`}>Stay Connected</h3>
            <div className="flex space-x-4">
              <div className={`w-8 h-8 rounded-full ${secondaryBgColor} flex items-center justify-center`}>
                <span>𝕏</span>
              </div>
              <div className={`w-8 h-8 rounded-full ${secondaryBgColor} flex items-center justify-center`}>
                <span>f</span>
              </div>
              <div className={`w-8 h-8 rounded-full ${secondaryBgColor} flex items-center justify-center`}>
                <span>in</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`text-center mt-6 ${secondaryTextColor} text-sm`}>
          © 2025 11FiftyNine. All rights reserved.
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={`${bgColor} ${textColor} min-h-screen`}>
        <Nav />
      <div className="max-w-4xl mx-auto p-4">


{/*         
        <button 
          onClick={toggleTheme} 
          className={`absolute top-4 right-4 px-3 py-1 rounded ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button> */}
        
        <div className="flex items-center mb-6">
          {/* <ChevronLeft className={`mr-2 ${textColor}`} /> */}
          <h1 className={`text-2xl font-bold ${textColor}`} > Shopping Cart ({cartItems.length})</h1>
        </div>
        
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              {cartItems.map(item => (
                <div key={item.id} className={`flex border-b ${itemBorderColor} py-4`}>
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                  
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <p className={`text-sm ${secondaryTextColor}`}>{item.brand}</p>
                        <h3 className={`font-medium ${textColor}`}>{item.name}</h3>
                        <p className={`text-sm mt-1 ${secondaryTextColor}`}>Color: {item.color}</p>
                        <p className={`text-sm ${secondaryTextColor}`}>Size: {item.size}</p>
                      </div>
                      <p className={`font-semibold ${textColor}`}>${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className={`flex items-center border rounded ${borderColor}`}>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className={`px-2 py-1 ${secondaryTextColor} ${quantityBgColor}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={`px-4 ${textColor}`}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className={`px-2 py-1 ${secondaryTextColor} ${quantityBgColor}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
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
                <p className={textColor}>${calculateSubtotal()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Shipping</p>
                <p className={textColor}>$5.99</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className={textColor}>Tax</p>
                <p className={textColor}>$3.60</p>
              </div>
              <div className={`border-t ${borderColor} mt-4 pt-4 flex justify-between font-semibold`}>
                <p className={textColor}>Total</p>
                <p className={textColor}>${(parseFloat(calculateSubtotal()) + 5.99 + 3.60).toFixed(2)}</p>
              </div>
              
              <button className={`w-full ${buttonBgColor} text-white py-3 rounded mt-4 flex items-center justify-center`}>
                <ShoppingCart size={18} className="mr-2" />
                Proceed to Checkout
              </button>
              
              <p className={`text-center mt-4 text-sm ${secondaryTextColor}`}>
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart size={48} className={`mx-auto ${secondaryTextColor} mb-4`} />
            <h2 className={`text-xl font-medium mb-2 ${textColor}`}>Your cart is empty</h2>
            <p className={`${secondaryTextColor} mb-6`}>Looks like you haven't added anything to your cart yet.</p>
            <button className={`${buttonBgColor} text-white px-6 py-2 rounded`}>
              Continue Shopping
            </button>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}