
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TabType, NotificationPreferences } from '../types/userTypes';
import { UserApi,UserData } from '../services/UserApi';
// import { OrdersTab } from "../components/user/OrderTab";
// import { WishlistTab } from "../components/user/WishListTab";
import { SettingsTab } from "../components/user/SettingTab";
import { ProfileTab } from "../components/user/ProfileTabs";
import { Sidebar } from "../components/user/Sidebar";
import AuthService from '../services/Authservice';
import CustomerOrderTracking from './CustomOrderTracking';

export const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  // const [orders, setOrders] = useState<Order[]>([]);
  // const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
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
      navigate('/auth', { replace: true });
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
      const user = await UserApi.getCurrentUser();
      setUserData(user);
      
      // //  fetch these from APIs
      // // Mock data for demonstration
      // setOrders([
      //   {
      //     id: '1',
      //     orderNumber: 'ORD-12345',
      //     date: '2023-05-15',
      //     amount: 125.99,
      //     status: 'Delivered'
      //   },
      //   {
      //     id: '2',
      //     orderNumber: 'ORD-12346',
      //     date: '2023-06-20',
      //     amount: 89.50,
      //     status: 'Shipped'
      //   }
      // ]);
      
      // setWishlist([
      //   {
      //     id: '1',
      //     name: 'Premium Headphones',
      //     price: 199.99,
      //     imageUrl: 'https://example.com/headphones.jpg'
      //   },
      //   {
      //     id: '2',
      //     name: 'Wireless Keyboard',
      //     price: 59.99,
      //     imageUrl: 'https://example.com/keyboard.jpg'
      //   }
      // ]);
      
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load user data. Please try again later.');
      
      // If error is 401, redirect to login
      if (err instanceof Error && err.message.includes('401')) {
        // Clear all auth data
        AuthService.logout();
        navigate('/auth', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData: Partial<UserData>) => {
    try {
      if (!userData) return;
      
      const updatedUser = await UserApi.updateUserProfile(updatedData);
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
      await UserApi.updatePassword(passwordData.currentPassword, passwordData.newPassword);
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  };

  const handleUpdateNotifications = async (preferences: NotificationPreferences) => {
    try {
      await UserApi.updateNotificationPreferences(preferences);
      setNotificationPreferences(preferences);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      throw error;
    }
  };

  // const handleAddToCart = (itemId: string) => {
  //   // In a real app, this would call an API to add to cart
  //   console.log('Adding item to cart:', itemId);
  //   alert(`Item ${itemId} added to cart!`);
  // };

  // const handleRemoveFromWishlist = (itemId: string) => {
  //   // In a real app, this would call an API to remove from wishlist
  //   setWishlist(wishlist.filter(item => item.id !== itemId));
  //   console.log('Removing item from wishlist:', itemId);
  // };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Redirect to login page after logout
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
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
              // <OrdersTab orders={orders} />
              <CustomerOrderTracking />
            )}
            
            {/* {activeTab === 'wishlist' && (
              <WishlistTab 
                items={wishlist}
                onAddToCart={handleAddToCart}
                onRemoveFromWishlist={handleRemoveFromWishlist}
              />
            )} */}
            
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