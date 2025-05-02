// import { useState, useEffect } from 'react';
// import { User, Settings, Clock, ShoppingBag, Heart, LogOut } from 'lucide-react';

// export const UserManagement = () => {
//   const [userData, setUserData] = useState({}
// //     {
// //     name: 'John Doe',
// //     email: 'john.doe@example.com',
// //     joinDate: 'January 15, 2023',
// //   }
// );
  
//   const [activeTab, setActiveTab] = useState('profile');
  
//   // Fetch user data on component mount
//   useEffect(() => {
//     // Here you would typically fetch user data from an API
//     // This is just a placeholder
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/v1/users/me');
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error('Failed to fetch user data', error);
//       }
//     };
    
//     fetchUserData();
//   }, []);
  
//   const handleLogout = () => {
//     // Clear user authentication data
//     localStorage.removeItem('userToken');
//     // Redirect to home or login page
//     window.location.href = '/';
//   };
  
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//       <h1 className="text-3xl font-bold mb-8">Account Management</h1>
      
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar navigation */}
//         <div className="w-full md:w-64 bg-white shadow rounded-lg p-4">
//           <div className="flex items-center space-x-4 mb-6">
//             <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
//               <User size={24} />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold">{userData.name}</h2>
//               <p className="text-sm text-gray-500">{userData.email}</p>
//             </div>
//           </div>
          
//           <nav className="space-y-1">
//             <button 
//               className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
//               onClick={() => setActiveTab('profile')}
//             >
//               <User size={20} />
//               <span>Profile</span>
//             </button>
            
//             <button 
//               className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
//               onClick={() => setActiveTab('orders')}
//             >
//               <ShoppingBag size={20} />
//               <span>Orders</span>
//             </button>
            
//             <button 
//               className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md ${activeTab === 'wishlist' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
//               onClick={() => setActiveTab('wishlist')}
//             >
//               <Heart size={20} />
//               <span>Wishlist</span>
//             </button>
            
//             <button 
//               className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
//               onClick={() => setActiveTab('settings')}
//             >
//               <Settings size={20} />
//               <span>Settings</span>
//             </button>
            
//             <button 
//               className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 mt-6"
//               onClick={handleLogout}
//             >
//               <LogOut size={20} />
//               <span>Logout</span>
//             </button>
//           </nav>
//         </div>
        
//         {/* Main content area */}
//         <div className="flex-1 bg-white shadow rounded-lg p-6">
//           {activeTab === 'profile' && (
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input 
//                     type="text" 
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                     value={userData.name}
//                     onChange={(e) => setUserData({...userData, name: e.target.value})}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input 
//                     type="email" 
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                     value={userData.email}
//                     onChange={(e) => setUserData({...userData, email: e.target.value})}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Member Since</label>
//                   <div className="flex items-center mt-1 text-gray-500">
//                     <Clock size={16} className="mr-2" />
//                     <span>{userData.joinDate}</span>
//                   </div>
//                 </div>
                
//                 <div className="pt-4">
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'orders' && (
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Order History</h3>
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1234</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 23, 2025</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$120.00</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Delivered
//                         </span>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1233</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 12, 2025</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$85.50</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           Shipped
//                         </span>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'wishlist' && (
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Wishlist</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="border rounded-md p-4 flex items-start space-x-4">
//                   <div className="bg-gray-200 w-20 h-20 flex-shrink-0"></div>
//                   <div>
//                     <h4 className="font-medium">Product Name</h4>
//                     <p className="text-gray-600 text-sm mt-1">$49.99</p>
//                     <div className="mt-2 space-x-2">
//                       <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
//                         Add to Cart
//                       </button>
//                       <button className="text-xs text-red-600 hover:text-red-700">
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="border rounded-md p-4 flex items-start space-x-4">
//                   <div className="bg-gray-200 w-20 h-20 flex-shrink-0"></div>
//                   <div>
//                     <h4 className="font-medium">Another Product</h4>
//                     <p className="text-gray-600 text-sm mt-1">$79.99</p>
//                     <div className="mt-2 space-x-2">
//                       <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
//                         Add to Cart
//                       </button>
//                       <button className="text-xs text-red-600 hover:text-red-700">
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'settings' && (
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="text-lg font-medium mb-2">Password</h4>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Current Password</label>
//                       <input 
//                         type="password" 
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">New Password</label>
//                       <input 
//                         type="password" 
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//                       <input 
//                         type="password" 
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                       />
//                     </div>
//                     <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                       Update Password
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="border-t pt-4">
//                   <h4 className="text-lg font-medium mb-2">Notifications</h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center">
//                       <input 
//                         id="order-updates" 
//                         type="checkbox" 
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         defaultChecked
//                       />
//                       <label htmlFor="order-updates" className="ml-2 block text-sm text-gray-700">
//                         Order status updates
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input 
//                         id="promotions" 
//                         type="checkbox" 
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         defaultChecked
//                       />
//                       <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
//                         Promotions and deals
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input 
//                         id="newsletter" 
//                         type="checkbox" 
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                       />
//                       <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
//                         Weekly newsletter
//                       </label>
//                     </div>
//                   </div>
//                   <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                     Save Preferences
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from 'react';

// import {  TabType,Order, WishlistItem, NotificationPreferences } from '../types/userTypes';
// import { userApi, UserData } from '../context/UserApi';
// import { OrdersTab } from "../components/user/OrderTab";
// import { WishlistTab } from "../components/user/WishListTab";
// import { SettingsTab } from "../components/user/SettingTab";
// import { ProfileTab } from "../components/user/ProfileTabs";
// import { Sidebar } from "../components/user/Sidebar";



// export const UserManagementPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('profile');
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
//   const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
//     orderUpdates: true,
//     promotions: true,
//     newsletter: true
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user data and related information
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         // Fetch user data
//         const user = await userApi.getCurrentUser();
//         setUserData(user);
        
//         // In a real app, you would fetch these from APIs
//         // Mock data for demonstration
//         setOrders([
//           {
//             id: '1',
//             orderNumber: 'ORD-12345',
//             date: '2023-05-15',
//             amount: 125.99,
//             status: 'Delivered'
//           },
//           {
//             id: '2',
//             orderNumber: 'ORD-12346',
//             date: '2023-06-20',
//             amount: 89.50,
//             status: 'Shipped'
//           }
//         ]);
        
//         setWishlist([
//           {
//             id: '1',
//             name: 'Premium Headphones',
//             price: 199.99,
//             imageUrl: 'https://example.com/headphones.jpg'
//           },
//           {
//             id: '2',
//             name: 'Wireless Keyboard',
//             price: 59.99,
//             imageUrl: 'https://example.com/keyboard.jpg'
//           }
//         ]);
        
//       } catch (err) {
//         console.error('Failed to fetch user data:', err);
//         setError('Failed to load user data. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const handleSaveProfile = async (updatedData: Partial<UserData>) => {
//     try {
//       if (!userData) return;
      
//       const updatedUser = await userApi.updateUserProfile(updatedData);
//       setUserData(updatedUser);
//       return updatedUser;
//     } catch (error) {
//       console.error('Failed to update profile:', error);
//       throw error;
//     }
//   };

//   const handleUpdatePassword = async (passwordData: {
//     currentPassword: string;
//     newPassword: string;
//     confirmPassword: string;
//   }) => {
//     try {
//       await userApi.updatePassword(passwordData.currentPassword, passwordData.newPassword);
//     } catch (error) {
//       console.error('Failed to update password:', error);
//       throw error;
//     }
//   };

//   const handleUpdateNotifications = async (preferences: NotificationPreferences) => {
//     try {
//       await userApi.updateNotificationPreferences(preferences);
//       setNotificationPreferences(preferences);
//     } catch (error) {
//       console.error('Failed to update notifications:', error);
//       throw error;
//     }
//   };

//   const handleAddToCart = (itemId: string) => {
//     // In a real app, this would call an API to add to cart
//     console.log('Adding item to cart:', itemId);
//     alert(`Item ${itemId} added to cart!`);
//   };

//   const handleRemoveFromWishlist = (itemId: string) => {
//     // In a real app, this would call an API to remove from wishlist
//     setWishlist(wishlist.filter(item => item.id !== itemId));
//     console.log('Removing item from wishlist:', itemId);
//   };

//   const handleLogout = () => {
//     userApi.logout();
//     // Redirect to home or login page
//     window.location.href = '/login';
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
//           <p>{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return null;
//   }

//   return (

//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>
        
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Sidebar */}
//           <div className="w-full md:w-64 flex-shrink-0">
//             <Sidebar 
//               userData={userData}
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//               onLogout={handleLogout}
//             />
//           </div>
          
//           {/* Main Content */}
//           <div className="flex-1 bg-white shadow rounded-lg p-6">
//             {activeTab === 'profile' && (
//               <ProfileTab 
//                 userData={userData}
//                 onSaveChanges={handleSaveProfile}
//               />
//             )}
            
//             {activeTab === 'orders' && (
//               <OrdersTab orders={orders} />
//             )}
            
//             {activeTab === 'wishlist' && (
//               <WishlistTab 
//                 items={wishlist}
//                 onAddToCart={handleAddToCart}
//                 onRemoveFromWishlist={handleRemoveFromWishlist}
//               />
//             )}
            
//             {activeTab === 'settings' && (
//               <SettingsTab 
//                 notificationPreferences={notificationPreferences}
//                 onUpdatePassword={handleUpdatePassword}
//                 onUpdateNotifications={handleUpdateNotifications}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TabType, Order, WishlistItem, NotificationPreferences } from '../types/userTypes';
import { userApi, UserData } from '../context/UserApi';
import { OrdersTab } from "../components/user/OrderTab";
import { WishlistTab } from "../components/user/WishListTab";
import { SettingsTab } from "../components/user/SettingTab";
import { ProfileTab } from "../components/user/ProfileTabs";
import { Sidebar } from "../components/user/Sidebar";

export const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: true,
    newsletter: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status before fetching data
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      // Redirect to login if no token found
      navigate('/auth');
      return;
    }
    
    fetchUserData();
  }, [navigate]);

  // Fetch user data and related information
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user data with authorization header
      const user = await userApi.getCurrentUser();
      setUserData(user);
      
      // In a real app, you would fetch these from APIs
      // Mock data for demonstration
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-12345',
          date: '2023-05-15',
          amount: 125.99,
          status: 'Delivered'
        },
        {
          id: '2',
          orderNumber: 'ORD-12346',
          date: '2023-06-20',
          amount: 89.50,
          status: 'Shipped'
        }
      ]);
      
      setWishlist([
        {
          id: '1',
          name: 'Premium Headphones',
          price: 199.99,
          imageUrl: 'https://example.com/headphones.jpg'
        },
        {
          id: '2',
          name: 'Wireless Keyboard',
          price: 59.99,
          imageUrl: 'https://example.com/keyboard.jpg'
        }
      ]);
      
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load user data. Please try again later.');
      
      // If error is 401, redirect to login
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('userToken'); // Clear invalid token
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData: Partial<UserData>) => {
    try {
      if (!userData) return;
      
      const updatedUser = await userApi.updateUserProfile(updatedData);
      setUserData(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const handleUpdatePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await userApi.updatePassword(passwordData.currentPassword, passwordData.newPassword);
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  };

  const handleUpdateNotifications = async (preferences: NotificationPreferences) => {
    try {
      await userApi.updateNotificationPreferences(preferences);
      setNotificationPreferences(preferences);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      throw error;
    }
  };

  const handleAddToCart = (itemId: string) => {
    // In a real app, this would call an API to add to cart
    console.log('Adding item to cart:', itemId);
    alert(`Item ${itemId} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    // In a real app, this would call an API to remove from wishlist
    setWishlist(wishlist.filter(item => item.id !== itemId));
    console.log('Removing item from wishlist:', itemId);
  };

  const handleLogout = () => {
    userApi.logout();
    // Redirect to login page after logout
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !error.includes('401')) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={fetchUserData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Sidebar 
              userData={userData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 bg-white shadow rounded-lg p-6">
            {activeTab === 'profile' && (
              <ProfileTab 
                userData={userData}
                onSaveChanges={handleSaveProfile}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} />
            )}
            
            {activeTab === 'wishlist' && (
              <WishlistTab 
                items={wishlist}
                onAddToCart={handleAddToCart}
                onRemoveFromWishlist={handleRemoveFromWishlist}
              />
            )}
            
            {activeTab === 'settings' && (
              <SettingsTab 
                notificationPreferences={notificationPreferences}
                onUpdatePassword={handleUpdatePassword}
                onUpdateNotifications={handleUpdateNotifications}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};