import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AuthService from '../context/Authservice';

export const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  // Use our cart context to get cart count
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  
  // Check auth status and get user role - now dependent on location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const user = AuthService.getCurrentUser();
      const isAuthenticated = !!user?.accessToken;
      setIsLoggedIn(isAuthenticated);
      
      if (isAuthenticated) {
        // Determine user role
        const isAdmin = user.roles.includes('ROLE_ADMIN');
        const isCustomer = user.roles.includes('ROLE_CUSTOMER');
        setUserRole(isAdmin ? 'admin' : isCustomer ? 'customer' : 'user');
        
        // Debug
        console.log("Auth check: User is authenticated as", isAdmin ? "admin" : isCustomer ? "customer" : "user");
      } else {
        setUserRole(null);
        console.log("Auth check: User is not authenticated");
      }
    };
    
    // Check immediately when component mounts or location changes
    checkAuthStatus();
    
    // Set up an event listener for storage changes (for logout in other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for auth changes within the same tab
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [location.pathname]); // Re-run when the path changes
  
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Create and dispatch a custom event for auth state change
      const event = new CustomEvent('authStateChanged');
      window.dispatchEvent(event);
      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const isAdmin = userRole === 'admin';
  
  // Handler for cart icon click - prevent admins from accessing cart
  const handleCartClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      e.preventDefault();
      // Optionally show a message that admins can't access cart
      console.log("Admins cannot access the cart");
      return;
    }
    // For customers, normal navigation will proceed
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              ElevenFiftyNine
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            
            {isAdmin ? (
              // Admin navigation links
              <>
                <Link to="/admin/product" className="text-gray-600 hover:text-gray-900">
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">
                  Manage Orders
                </Link>
              </>
            ) : (
              // Regular user navigation links
              <Link to="/products" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
            )}
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isAdmin && (
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Search size={20} />
              </button>
            )}
            
            {!isAdmin && (
              <Link 
                to="/cart" 
                className={`text-gray-600 hover:text-gray-900 p-1 relative ${isAdmin ? 'pointer-events-none opacity-50' : ''}`}
                onClick={handleCartClick}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {isLoggedIn ? (
              <>
                <Link to={isAdmin ? "/admin/product" : "/account"} className="text-gray-600 hover:text-gray-900 p-1">
                  <Settings size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 p-1 flex items-center"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-gray-600 hover:text-gray-900 p-1">
                <User size={20} />
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              className="text-gray-600 hover:text-gray-900 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 border-t">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              Home
            </Link>
            
            {isAdmin ? (
              // Admin mobile navigation links
              <>
                <Link to="/admin/product" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                  Manage Orders
                </Link>
              </>
            ) : (
              // Regular user mobile navigation links
              <>
                <Link to="/products" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                  Products
                </Link>
                <Link 
                  to="/cart" 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={handleCartClick}
                >
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </>
            )}
            
            <div className="border-t pt-2 mt-2 flex justify-around">
              {isLoggedIn ? (
                <>
                  <Link to={isAdmin ? "/admin/product" : "/account"} className="text-gray-600 hover:text-gray-900 p-2 flex items-center">
                    <Settings size={20} />
                    <span className="ml-2">Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 p-2 flex items-center"
                  >
                    <LogOut size={20} />
                    <span className="ml-2">Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-gray-600 hover:text-gray-900 p-2 flex items-center">
                  <User size={20} />
                  <span className="ml-2">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};