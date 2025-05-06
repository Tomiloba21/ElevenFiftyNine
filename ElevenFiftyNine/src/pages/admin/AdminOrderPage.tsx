// // src/pages/AdminOrderPage.tsx
// import React, { useEffect, useState } from 'react';
// import { OrderApi } from '../../context/OrderApi';
// import { OrderStatus,OrderResponse, OrderStatusUpdateRequest } from '../../types/types';

// const AdminOrderPage: React.FC = () => {
//   const [orders, setOrders] = useState<OrderResponse[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
//   const [trackingNumber, setTrackingNumber] = useState<string>('');
//   const [isUpdating, setIsUpdating] = useState<boolean>(false);

//   // Fetch all orders on component mount
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Apply filters when orders, statusFilter or searchTerm changes
//   useEffect(() => {
//     applyFilters();
//   }, [orders, statusFilter, searchTerm]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const allOrders = await OrderApi.getAllOrders();
//       setOrders(allOrders);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let result = [...orders];
    
//     // Apply status filter
//     if (statusFilter !== 'ALL') {
//       result = result.filter(order => order.status === statusFilter);
//     }
    
//     // Apply search filter (searching by order number or customer ID)
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       result = result.filter(order => 
//         order.orderNumber.toLowerCase().includes(term) || 
//         order.customerId.toLowerCase().includes(term)
//       );
//     }
    
//     setFilteredOrders(result);
//   };

//   const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
//     setIsUpdating(true);
//     try {
//       const statusUpdate: OrderStatusUpdateRequest = {
//         status: newStatus,
//         trackingNumber: newStatus === OrderStatus.SHIPPED ? trackingNumber : undefined
//       };
      
//       await OrderApi.updateOrderStatus(orderId, statusUpdate);
      
//       // Refresh orders after update
//       await fetchOrders();
//       setSelectedOrder(null);
//       setTrackingNumber('');
//     } catch (err: any) {
//       setError(err.message || 'Failed to update order status');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const getStatusBadgeClass = (status: OrderStatus) => {
//     switch (status) {
//       case OrderStatus.PENDING:
//         return 'bg-yellow-100 text-yellow-800';
//       case OrderStatus.PROCESSING:
//         return 'bg-blue-100 text-blue-800';
//       case OrderStatus.SHIPPED:
//         return 'bg-purple-100 text-purple-800';
//       case OrderStatus.DELIVERED:
//         return 'bg-green-100 text-green-800';
//       case OrderStatus.CANCELLED:
//         return 'bg-red-100 text-red-800';
//       case OrderStatus.REFUNDED:
//         return 'bg-gray-100 text-gray-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString();
//   };

//   if (loading && orders.length === 0) {
//     return <div className="p-6 text-center">Loading orders...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-600">Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Order Management Dashboard</h1>
      
//       {/* Filters and Controls */}
//       <div className="mb-6 flex flex-wrap items-center gap-4">
//         <div className="flex-1 min-w-[250px]">
//           <input
//             type="text"
//             placeholder="Search by Order # or Customer ID"
//             className="w-full px-4 py-2 border rounded"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <div>
//           <select 
//             className="px-4 py-2 border rounded"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="ALL">All Statuses</option>
//             {Object.values(OrderStatus).map(status => (
//               <option key={status} value={status}>{status}</option>
//             ))}
//           </select>
//         </div>
        
//         <button 
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           onClick={fetchOrders}
//         >
//           Refresh Orders
//         </button>
//       </div>
      
//       {/* Orders Table */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
//                   No orders found
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
//                     {order.trackingNumber && (
//                       <div className="text-xs text-gray-500">
//                         Tracking: {order.trackingNumber}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{order.customerId}</div>
//                     <div className="text-xs text-gray-500">
//                       Items: {order.orderItems.length}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {formatCurrency(order.totalAmount)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button 
//                       onClick={() => setSelectedOrder(order)}
//                       className="text-indigo-600 hover:text-indigo-900 mr-3"
//                     >
//                       Manage
//                     </button>
//                     <button 
//                       onClick={() => window.open(`/orders/${order.id}`, '_blank')}
//                       className="text-gray-600 hover:text-gray-900"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Order Management Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold">Manage Order: {selectedOrder.orderNumber}</h2>
//                 <button 
//                   onClick={() => setSelectedOrder(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div className="mb-6 grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Customer ID</p>
//                   <p className="font-medium">{selectedOrder.customerId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Order Date</p>
//                   <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Current Status</p>
//                   <p className="font-medium">{selectedOrder.status}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</p>
//                 </div>
//               </div>
              
//               <div className="mb-6">
//                 <h3 className="font-medium mb-2">Order Items</h3>
//                 <div className="bg-gray-50 p-3 rounded">
//                   {selectedOrder.orderItems.map((item, idx) => (
//                     <div key={idx} className="flex justify-between py-1 border-b last:border-b-0">
//                       <span>{item.quantity}x {item.productName}</span>
//                       <span>{formatCurrency(item.totalPrice)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="mb-6">
//                 <h3 className="font-medium mb-2">Shipping Address</h3>
//                 <p className="bg-gray-50 p-3 rounded">
//                   {selectedOrder.shippingAddress.addressLine}
//                 </p>
//               </div>
              
//               {selectedOrder.status === OrderStatus.PENDING && (
//                 <div className="mb-6">
//                   <h3 className="font-medium mb-2">Update Status</h3>
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.PROCESSING)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                       disabled={isUpdating}
//                     >
//                       Confirm Payment & Process
//                     </button>
//                     <button 
//                       onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.CANCELLED)}
//                       className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                       disabled={isUpdating}
//                     >
//                       Cancel Order
//                     </button>
//                   </div>
//                 </div>
//               )}
              
//               {selectedOrder.status === OrderStatus.PROCESSING && (
//                 <div className="mb-6">
//                   <h3 className="font-medium mb-2">Mark as Shipped</h3>
//                   <div className="flex gap-2 items-end">
//                     <div className="flex-1">
//                       <label className="block text-sm text-gray-600 mb-1">Tracking Number</label>
//                       <input 
//                         type="text" 
//                         className="w-full px-3 py-2 border rounded" 
//                         value={trackingNumber}
//                         onChange={(e) => setTrackingNumber(e.target.value)}
//                         placeholder="Enter tracking number"
//                       />
//                     </div>
//                     <button 
//                       onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.SHIPPED)}
//                       className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//                       disabled={isUpdating || !trackingNumber.trim()}
//                     >
//                       Ship Order
//                     </button>
//                   </div>
//                 </div>
//               )}
              
//               {selectedOrder.status === OrderStatus.SHIPPED && (
//                 <div className="mb-6">
//                   <h3 className="font-medium mb-2">Delivery Status</h3>
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.DELIVERED)}
//                       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                       disabled={isUpdating}
//                     >
//                       Mark as Delivered
//                     </button>
//                   </div>
//                   {selectedOrder.trackingNumber && (
//                     <p className="mt-2 text-sm">
//                       Tracking Number: {selectedOrder.trackingNumber}
//                     </p>
//                   )}
//                 </div>
//               )}
              
//               {(selectedOrder.status === OrderStatus.PENDING || selectedOrder.status === OrderStatus.PROCESSING) && (
//                 <div className="text-sm text-gray-500 italic mt-4">
//                   Note: Orders that have been shipped cannot be cancelled or refunded through this interface.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrderPage;



import React, { useEffect, useState } from 'react';
import { OrderApi } from '../../context/OrderApi';
import { OrderStatus,OrderResponse, OrderStatusUpdateRequest } from '../../types/types';



const AdminOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch all orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters when orders, statusFilter or searchTerm changes
  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await OrderApi.getAllOrders();
      setOrders(allOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter (searching by order number or customer ID)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(term) || 
        order.customerId.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const statusUpdate: OrderStatusUpdateRequest = {
        status: newStatus,
        trackingNumber: newStatus === OrderStatus.SHIPPED ? trackingNumber : undefined
      };
      
      await OrderApi.updateOrderStatus(orderId, statusUpdate);
      
      // Refresh orders after update
      await fetchOrders();
      setSelectedOrder(null);
      setTrackingNumber('');
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case OrderStatus.REFUNDED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && orders.length === 0) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Order Management Dashboard</h1>
      
      {/* Filters and Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by Order # or Customer ID"
            className="w-full px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select 
            className="px-4 py-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={fetchOrders}
        >
          Refresh Orders
        </button>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500">
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerId}</div>
                    <div className="text-xs text-gray-500">
                      Items: {order.orderItems.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Manage
                    </button>
                    <button 
                      onClick={() => window.open(`/orders/${order.id}`, '_blank')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Order Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Order: {selectedOrder.orderNumber}</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-medium">{selectedOrder.customerId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="font-medium">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="bg-gray-50 p-3 rounded">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                      <span>{item.quantity}x {item.productName}</span>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="bg-gray-50 p-3 rounded">
                  {selectedOrder.shippingAddress.addressLine}
                </p>
              </div>
              
              {selectedOrder.status === OrderStatus.PENDING && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.PROCESSING)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      disabled={isUpdating}
                    >
                      Confirm Payment & Process
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.CANCELLED)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={isUpdating}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
              
              {selectedOrder.status === OrderStatus.PROCESSING && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Mark as Shipped</h3>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Tracking Number</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded" 
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </div>
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.SHIPPED)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      disabled={isUpdating || !trackingNumber.trim()}
                    >
                      Ship Order
                    </button>
                  </div>
                </div>
              )}
              
              {selectedOrder.status === OrderStatus.SHIPPED && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Delivery Status</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.DELIVERED)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={isUpdating}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <p className="mt-2 text-sm">
                      Tracking Number: {selectedOrder.trackingNumber}
                    </p>
                  )}
                </div>
              )}
              
              {(selectedOrder.status === OrderStatus.PENDING || selectedOrder.status === OrderStatus.PROCESSING) && (
                <div className="text-sm text-gray-500 italic mt-4">
                  Note: Orders that have been shipped cannot be cancelled or refunded through this interface.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;