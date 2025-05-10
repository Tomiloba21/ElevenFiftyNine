

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/Authservice';
import AuthSyncService from "../utility/AuthSyncService";

interface Props {
  children: React.ReactNode;
}

export default function AuthRedirectHandler({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Force a refresh of auth state when component mounts
    AuthSyncService.refreshAuthState();
    
    // Only handle redirects on initial load or when location changes
    if (isInitialized) return;

    const user = AuthService.getCurrentUser();
    
    if (user) {
      // Store the role in localStorage for easy access if not already set
      const isAdmin = user.roles.includes('ROLE_ADMIN');
      const isCustomer = user.roles.includes('ROLE_CUSTOMER');
      
      localStorage.setItem('userRole', isAdmin ? 'admin' : isCustomer ? 'customer' : 'user');
      
      // Only redirect if we're on the auth page
      if (location.pathname === '/auth') {
        if (isAdmin) {
          navigate('/admin/product', { replace: true });
        } else if (isCustomer) {
          // Changed from navigate('/products') to home page
          navigate('/', { replace: true });
        }
      }
    } else {
      // User is not logged in
      const requiresAuth = [
        '/admin',
        '/orders',
        '/checkout',
        '/discounts',
        '/account'
      ].some(route => location.pathname.startsWith(route));
      
      if (requiresAuth) {
        // Redirect to auth page if trying to access protected route
        navigate('/auth', { replace: true, state: { from: location.pathname } });
      }
    }
    
    setIsInitialized(true);
    
    // Set up listener for location changes
    const handleLocationChange = () => {
      AuthSyncService.refreshAuthState();
    };
    
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [navigate, location.pathname, isInitialized]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      // Re-evaluate auth state when it changes
      const user = AuthService.getCurrentUser();
      if (user) {
        const isAdmin = user.roles.includes('ROLE_ADMIN');
        const isCustomer = user.roles.includes('ROLE_CUSTOMER');
        localStorage.setItem('userRole', isAdmin ? 'admin' : isCustomer ? 'customer' : 'user');
      } else {
        localStorage.removeItem('userRole');
      }
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Wait until we've checked auth status before rendering children
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}