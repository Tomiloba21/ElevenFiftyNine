// import { Search, ShoppingCart, Heart, User } from 'lucide-react';

// export const Header: React.FC = () => {
//   return (
//     <header className="flex items-center justify-between p-4 border-b">
//       <div className="font-bold text-xl ml-50">
//                         <span className="text-gray-800">11FiftyNine.</span>
//       </div>
      
//       <div className="relative w-full max-w-md mx-4">
//         <div className="absolute inset-y-0 right-3 flex items-center">
//           <Search size={18} className="text-gray-400" />
//         </div>
//         <input 
//           type="text" 
//           placeholder="Search" 
//           className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none"
//         />
//       </div>
      
//       <div className="flex items-center space-x-4">
//         <div className="relative">
//           <ShoppingCart size={24} className='text-zinc-800'/>
//           <span className="absolute -top-2 -right-2  text-amber-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
//             1
//           </span>
//         </div>
//         <Heart size={24} />
//         <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-100">
//           <User size={32} className="relative top-1" />
//         </div>
//       </div>
//     </header>
//   );
// };


import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="relative border-b">
      {/* Main header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-1" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="font-bold text-lg sm:text-xl">
          <span className="text-gray-800">11FiftyNine.</span>
        </div>

        {/* Desktop search */}
        <div className="hidden md:block relative w-full max-w-md mx-4">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none"
          />
        </div>

        {/* Mobile search toggle */}
        <button 
          className="md:hidden p-1" 
          onClick={toggleSearch}
          aria-label="Search"
        >
          <Search size={22} className={isSearchOpen ? "text-amber-600" : "text-zinc-800"} />
        </button>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative">
            <ShoppingCart size={22} className="text-zinc-800" />
            <span className="absolute -top-2 -right-2 text-amber-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </div>
          <div className="hidden sm:block">
            <Heart size={22} />
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 overflow-hidden">
            <User size={28} className="relative top-1 hidden sm:block" />
            <User size={24} className="relative top-1 sm:hidden" />
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="md:hidden p-3 bg-gray-50 border-t">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none text-sm"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute z-10 w-full bg-white border-t shadow-lg">
          <nav className="flex flex-col">
            <a href="/cart" className="px-4 py-3 border-b hover:bg-gray-50">Shop</a>
            <a href="auth" className="px-4 py-3 border-b hover:bg-gray-50">New Arrivals</a>
            <a href="products" className="px-4 py-3 border-b hover:bg-gray-50">Collections</a>
            <a href="#" className="px-4 py-3 border-b hover:bg-gray-50">Sale</a>
            <a href="#" className="px-4 py-3 border-b hover:bg-gray-50 flex items-center">
              <Heart size={16} className="mr-2" />
              Wishlist
            </a>
            <a href="#" className="px-4 py-3 hover:bg-gray-50 flex items-center">
              <User size={16} className="mr-2" />
              Account
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};