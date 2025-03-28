import { ShoppingCart, Heart, User, Menu } from 'lucide-react';
export const Nav = () => {


  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-stone-700">Eleven Fifty Nine</div>
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
              <button className="md:hidden text-gray-600 hover:text-black">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
  )
}
