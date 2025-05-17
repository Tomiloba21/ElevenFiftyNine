import { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { OrderApi } from '../services/OrderApi';
import { 
  Address, 
  OrderItem, 
  OrderRequest, 
  OrderResponse, 
  PaymentMethod 
} from '../types/types';




export default function CheckoutPage() {
  // Theme toggle state
  const [isDarkMode] = useState(false);
  const navigate = useNavigate();
  
  // Get cart context
  const { 
    cartItems, 
    loading: cartLoading, 
    getCartTotal, 
    clearCart 
  } = useCart();
  
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United Kingdom',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate, step]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;
  
  // Convert cart items to order items
  const prepareOrderItems = (): OrderItem[] => {
    
    
    const cartItemss = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      color: item.color,
      size: item.size
    }));

    console.log("Cart Items ", cartItemss);
    return cartItemss;
  };
  
  // Prepare shipping address
  const prepareShippingAddress = (): Address => {
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      addressLine: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      email: formData.email
    };
  };
  
  // Submit order
  const submitOrder = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const orderRequest: OrderRequest = {
        orderItems: prepareOrderItems(),
        shippingAddress: prepareShippingAddress(),
        customerId: userId,
        paymentMethod: PaymentMethod.CREDIT_CARD, // Hardcoded for now
      };
      
      const order = await OrderApi.createOrder(orderRequest);
      setCreatedOrder(order);
      
      // Clear the cart after successful order
      await clearCart();
      
      // Move to success step
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      console.error('Order creation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      submitOrder();
    }
  };
  
  // Define dynamic theme classes
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const secondaryTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const inputBgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const buttonBgColor = isDarkMode ? "bg-blue-600" : "bg-black";
  
  // Order summary component
  const orderSummary = (
    <div className={`${secondaryBgColor} p-4 rounded border ${borderColor}`}>
      <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>Order Summary</h2>
      
      {/* Cart items */}
      {cartItems.map((item) => (
        <div key={item.id} className="flex mb-4">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="ml-4">
            <p className={`text-sm ${secondaryTextColor}`}>{item.brand || 'Brand'}</p>
            <p className={`font-medium ${textColor}`}>{item.name}</p>
            {item.color && <p className={`text-sm ${secondaryTextColor}`}>{item.color} • {item.size || 'One Size'}</p>}
            <div className="flex justify-between mt-1">
              <p className={`text-sm ${secondaryTextColor}`}>Qty: {item.quantity}</p>
              <p className={`font-medium ${textColor}`}>£{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Order totals */}
      <div className={`border-t ${borderColor} pt-4`}>
        <div className="flex justify-between mb-1">
          <p className={textColor}>Subtotal</p>
          <p className={textColor}>£{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between mb-1">
          <p className={textColor}>Shipping</p>
          <p className={textColor}>£{shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between mb-1">
          <p className={textColor}>Tax</p>
          <p className={textColor}>£{tax.toFixed(2)}</p>
        </div>
        <div className={`flex justify-between font-semibold mt-2 pt-2 border-t ${borderColor}`}>
          <p className={textColor}>Total</p>
          <p className={textColor}>£{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
  
  // Shipping form
  const renderShippingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1 ${textColor}`}>Email</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
          required
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${textColor}`}>First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            required
          />
        </div>
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${textColor}`}>Last Name</label>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            required
          />
        </div>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${textColor}`}>Address</label>
        <input 
          type="text" 
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
          required
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${textColor}`}>City</label>
          <input 
            type="text" 
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            required
          />
        </div>
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${textColor}`}>Postal Code</label>
          <input 
            type="text" 
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            required
          />
        </div>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${textColor}`}>Country</label>
        <select 
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`}
        >
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className={`w-full ${buttonBgColor} text-white py-3 rounded mt-6`}
        disabled={isLoading}
      >
        Continue to Payment
      </button>
    </form>
  );
  
  // Payment form
  const renderPaymentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1 ${textColor}`}>Name on Card</label>
        <input 
          type="text" 
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
          required
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${textColor}`}>Card Number</label>
        <div className="relative">
          <input 
            type="text" 
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            placeholder="1234 5678 9012 3456"
            required
          />
          <CreditCard className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${textColor}`}>Expiration Date</label>
          <input 
            type="text" 
            name="expDate"
            value={formData.expDate}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${textColor}`}>CVV</label>
          <input 
            type="text" 
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${borderColor} ${inputBgColor} ${textColor}`} 
            placeholder="123"
            required
          />
        </div>
      </div>
      
      <div className="flex items-start mt-4">
        <input type="checkbox" className="mt-1" required />
        <p className={`ml-2 text-sm ${secondaryTextColor}`}>
          I agree to the Terms of Service and Privacy Policy
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={isLoading}
        className={`w-full ${buttonBgColor} text-white py-3 rounded mt-6 flex items-center justify-center`}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Purchase'
        )}
      </button>
    </form>
  );
  
  // Order success
  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h2 className={`text-2xl font-semibold mb-2 ${textColor}`}>Order Confirmed!</h2>
      <p className={`${secondaryTextColor} mb-6`}>
        Your order #{createdOrder?.orderNumber || 'N/A'} has been placed successfully.
      </p>
      <p className={`${secondaryTextColor} mb-6`}>We've sent a confirmation email to {formData.email}</p>
      <div className={`${secondaryBgColor} p-4 rounded-lg mb-6 inline-block`}>
        <p className={`font-medium ${textColor}`}>Estimated Delivery</p>
        <p className={`text-lg ${textColor}`}>May 10 - May 14, 2025</p>
      </div>
      <div>
        <Link to={`/orders/`}>
          <button className={`${buttonBgColor} text-white px-6 py-2 rounded`}>
            Track Order
          </button>
        </Link>
        <Link to="/products">
          <button className={`ml-4 px-6 py-2 border ${borderColor} ${textColor}`}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
  
  return (
    <div className={`${bgColor} ${textColor} min-h-screen`}>
      <div className="max-w-5xl mx-auto p-4">
        {step !== 3 && (
          <div className="flex items-center mb-6">
            {step === 2 && (
              <button onClick={() => setStep(1)} className={`flex items-center ${textColor}`}>
                <ChevronLeft className="mr-1" />
                Back
              </button>
            )}
            <h1 className={`text-2xl font-bold ml-auto mr-auto ${textColor}`}>
              {step === 1 ? 'Shipping Information' : 'Payment Method'}
            </h1>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            {step === 1 && renderShippingForm()}
            {step === 2 && renderPaymentForm()}
            {step === 3 && renderSuccess()}
          </div>
          
          {step !== 3 && (
            <div className="lg:w-2/5">
              {orderSummary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}