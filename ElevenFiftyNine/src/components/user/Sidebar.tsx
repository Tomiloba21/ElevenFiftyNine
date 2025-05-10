
import React from 'react';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { UserData } from '../../services/UserApi';
import { TabType } from '../../types/userTypes';

interface SidebarProps {
  userData: UserData;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ 
  icon, 
  label, 
  isActive, 
  onClick 
}) => {
  return (
    <button
      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  userData, 
  activeTab, 
  onTabChange,
  onLogout
}) => {
  return (
    <div className="w-full md:w-64 bg-white shadow rounded-lg p-4">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
          {userData.avatar ? (
            <img 
              src={userData.avatar} 
              alt={`${userData.firstName} ${userData.lastName}`}
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            <User size={24} className="text-gray-500" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>
      
      <nav className="space-y-1">
        <SidebarButton 
          icon={<User size={20} />}
          label="Profile"
          isActive={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
        
        <SidebarButton 
          icon={<ShoppingBag size={20} />}
          label="Orders"
          isActive={activeTab === 'orders'}
          onClick={() => onTabChange('orders')}
        />
        
        <SidebarButton 
          icon={<Heart size={20} />}
          label="Wishlist"
          isActive={activeTab === 'wishlist'}
          onClick={() => onTabChange('wishlist')}
        />
        
        <SidebarButton 
          icon={<Settings size={20} />}
          label="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
        
        <button 
          className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 mt-6 transition-colors"
          onClick={onLogout}
        >
          <LogOut size={20} className="text-red-500" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};