import React, { useState } from 'react';
import { NotificationPreferences, PasswordChangeData } from '../../types/userTypes';

interface SettingsTabProps {
  notificationPreferences: NotificationPreferences;
  onUpdatePassword: (passwordData: PasswordChangeData) => Promise<void>;
  onUpdateNotifications: (preferences: NotificationPreferences) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  notificationPreferences,
  onUpdatePassword,
  onUpdateNotifications
}) => {
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    ...notificationPreferences
  });
  
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [notificationsMessage, setNotificationsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setNotifications(prev => ({ ...prev, [id]: checked }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }
    
    setIsPasswordLoading(true);
    try {
      await onUpdatePassword(passwordData);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Failed to update password. Please check your current password and try again.' });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationsMessage(null);
    setIsNotificationsLoading(true);
    
    try {
      await onUpdateNotifications(notifications);
      setNotificationsMessage({ type: 'success', text: 'Notification preferences updated successfully!' });
    } catch (error) {
      setNotificationsMessage({ type: 'error', text: 'Failed to update notification preferences.' });
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
      
      <div className="space-y-8">
        {/* Password Section */}
        <section>
          <h4 className="text-lg font-medium mb-3">Password</h4>
          
          {passwordMessage && (
            <div className={`mb-4 p-3 rounded-md ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {passwordMessage.text}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                id="currentPassword"
                name="currentPassword"
                type="password" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                id="newPassword"
                name="newPassword"
                type="password" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                id="confirmPassword"
                name="confirmPassword"
                type="password" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>
        
        {/* Notifications Section */}
        <section className="border-t pt-6">
          <h4 className="text-lg font-medium mb-3">Notifications</h4>
          
          {notificationsMessage && (
            <div className={`mb-4 p-3 rounded-md ${notificationsMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {notificationsMessage.text}
            </div>
          )}
          
          <form onSubmit={handleNotificationsSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  id="orderUpdates" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={notifications.orderUpdates}
                  onChange={handleNotificationChange}
                />
                <label htmlFor="orderUpdates" className="ml-2 block text-sm text-gray-700">
                  Order status updates
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="promotions" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={notifications.promotions}
                  onChange={handleNotificationChange}
                />
                <label htmlFor="promotions" className="ml-2 block text-sm text-gray-700">
                  Promotions and deals
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="newsletter" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={notifications.newsletter}
                  onChange={handleNotificationChange}
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                  Weekly newsletter
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isNotificationsLoading}
            >
              {isNotificationsLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </section>
        
        {/* Account Danger Zone */}
        <section className="border-t pt-6">
          <h4 className="text-lg font-medium mb-3 text-red-600">Danger Zone</h4>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button 
            type="button" 
            className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
          >
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};