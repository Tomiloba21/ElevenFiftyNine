import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import DiscountService from '../../services/DiscountService';

const AdminDiscountPage: React.FC = () => {
  const [discountPercentage, setDiscountPercentage] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleActivateDiscount = async () => {
    try {
      setLoading(true);
      const response = await DiscountService.activateLastHourDeals(discountPercentage);

      setNotification({
        message: response.data,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to activate discount. Please try again.',
        type: 'error'
      });
      console.error('Error activating discount:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
    }
  };

  const handleResetDiscounts = async () => {
    try {
      setLoading(true);
      const response = await DiscountService.resetAllDiscounts();
      setNotification({
        message: response.data,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to reset discounts. Please try again.',
        type: 'error'
      });
      console.error('Error resetting discounts:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Discount Management</h1>
      
      {notification && (
        <div 
          className={`mb-6 p-4 rounded-md flex items-center ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="mr-2" size={20} />
          ) : (
            <AlertCircle className="mr-2" size={20} />
          )}
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Last Hour Deals</h2>
        <div className="mb-4">
          <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Percentage
          </label>
          <div className="flex items-center">
            <input
              type="number"
              id="discountPercentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-1/4 sm:text-sm border-gray-300 rounded-md mr-2"
              min="0"
              max="100"
            />
            <span className="text-gray-500">%</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Set the percentage discount to apply to all products.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleActivateDiscount}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Activating...' : 'Activate Last Hour Deals'}
          </button>
          
          <button
            onClick={handleResetDiscounts}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset All Discounts'}
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Please note that activating discounts will apply the specified percentage to <strong>all products</strong>. 
              Use with caution during regular business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscountPage;