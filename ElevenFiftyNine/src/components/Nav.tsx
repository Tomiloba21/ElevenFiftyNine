import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';

export const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // This is where you would check if user is logged in
  // For example, you might check localStorage or a global state
  useEffect(() => {
    // Example: Check if user token exists in localStorage
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user && !!JSON.parse(user).accessToken);
  }, []);
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
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button className="text-gray-600 hover:text-gray-900 p-1">
              <Search size={20} />
            </button>
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 p-1 relative">
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </Link>
            {isLoggedIn ? (
              <Link to="/account" className="text-gray-600 hover:text-gray-900 p-1">
                <User size={20} />
              </Link>
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
            <Link to="/products" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              Products
            </Link>
            <Link to="/about" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              About
            </Link>
            <Link to="/contact" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              Contact
            </Link>
            <div className="border-t pt-2 mt-2 flex justify-around">
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Search size={20} />
              </button>
              <Link to="/cart" className="text-gray-600 hover:text-gray-900 p-1 relative">
                <ShoppingCart size={20} />
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  3
                </span>
              </Link>
              {isLoggedIn ? (
                <Link to="/account" className="text-gray-600 hover:text-gray-900 p-1">
                  <User size={20} />
                </Link>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-gray-900 p-1">
                  <User size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};