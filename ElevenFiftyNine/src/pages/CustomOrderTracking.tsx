import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { OrderResponse } from '../types/types';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search, ChevronRight, ArrowLeft } from 'lucide-react';

const OrderStatusIcon = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'processing':
      return <Package className="h-5 w-5 text-blue-500" />;
    case 'shipped':
      return <Truck className="h-5 w-5 text-indigo-500" />;
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case 'cancelled':
      return <AlertCircle className="h-5 w-5 text-rose-500" />;
    default:
      return <Clock className="h-5 w-5 text-slate-400" />;
  }
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  }[status.toLowerCase()] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
      {status}
    </span>
  );
};

const CustomerOrderTracking: React.FC = () => {
  const { orders, loading, error, fetchUserOrders, currentOrder, fetchOrderById, clearCurrentOrder } = useOrder();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.status && order.status.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
    }
  }, [orders, searchQuery]);

  const handleViewOrderDetails = (orderId: string) => {
    fetchOrderById(orderId);
  };

  const handleBackToList = () => {
    clearCurrentOrder();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-rose-700">
              Error: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={handleBackToList}
          className="mb-6 inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </button>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Order #{currentOrder.id}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Placed on: {currentOrder.createdAt ? formatDate(currentOrder.createdAt) : 'N/A'}
              </p>
            </div>
            <OrderStatusBadge status={currentOrder.status || 'Unknown'} />
          </div>
          
          <div>
            <dl>
              <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-slate-500">Order Status</dt>
                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <OrderStatusIcon status={currentOrder.status || 'Unknown'} />
                  <span className="ml-2">{currentOrder.status}</span>
                </dd>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-slate-500">Total Amount</dt>
                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                  ${currentOrder.totalAmount?.toFixed(2) || '0.00'}
                </dd>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-slate-500">Shipping Address</dt>
                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                  {currentOrder.shippingAddress.addressLine || 'No shipping address provided'}
                </dd>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-slate-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                  {currentOrder.updatedAt ? formatDate(currentOrder.updatedAt) : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="px-6 py-5 border-t border-slate-100">
            <h4 className="text-base font-semibold text-slate-900 mb-4">Order Items</h4>
            {currentOrder.orderItems && currentOrder.orderItems.length > 0 ? (
              <div className="overflow-x-auto -mx-6">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.orderItems.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {item.productName || item.productId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          £{item.totalPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          £{(item.quantity * (item.totalPrice || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No items in this order</p>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-slate-100">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-lg font-medium text-slate-900">£{currentOrder.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
          
          {currentOrder.status === 'DELIVERED' && (
            <div className="px-6 py-4 border-t border-slate-100 bg-emerald-50">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                <p className="text-sm font-medium text-emerald-700">
                  Your order has been delivered. Thank you for shopping with us!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
          <div className="flex flex-col items-center">
            <Package className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-600">You don't have any orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <li key={order.id} className="hover:bg-slate-50 transition-colors">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start sm:items-center">
                    <OrderStatusIcon status={order.status || 'Unknown'} />
                    <div className="ml-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-sm font-medium text-slate-900">Order #{order.id}</h3>
                        <OrderStatusBadge status={order.status || 'Unknown'} />
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        <p>Placed on: {order.createdAt ? formatDate(order.createdAt) : 'N/A'}</p>
                        <p className="mt-1">£{order.totalAmount?.toFixed(2) || '0.00'} • {order.orderItems?.length || 0} items</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewOrderDetails(order.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span>View Details</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderTracking;