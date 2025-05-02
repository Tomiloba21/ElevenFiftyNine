// types/userTypes.ts

export type TabType = 'profile' | 'orders' | 'wishlist' | 'settings';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}