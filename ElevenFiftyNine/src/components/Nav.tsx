import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold text-stone-700">Eleven Fifty Nine</div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6 text-gray-600">
            {['Women', 'Men', 'Sports', 'Brands'].map((item) => (
              <a key={item} href="#" className="hover:text-black">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black">
              <Heart size={20} />
            </button>
            <button className="text-gray-600 hover:text-black">
              <ShoppingCart size={20} />
            </button>
            <button className="text-gray-600 hover:text-black">
              <User size={20} />
            </button>
            <button 
              className="md:hidden text-gray-600 hover:text-black"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3 py-3">
              {['Women', 'Men', 'Sports', 'Brands'].map((item) => (
                <a key={item} href="#" className="text-gray-600 hover:text-black py-1">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}