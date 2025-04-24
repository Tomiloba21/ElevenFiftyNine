import { Search, ShoppingCart, Heart, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="font-bold text-xl ml-50">
                        <span className="text-gray-800">11FiftyNine.</span>
      </div>
      
      <div className="relative w-full max-w-md mx-4">
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <ShoppingCart size={24} className='text-zinc-800'/>
          <span className="absolute -top-2 -right-2  text-amber-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            1
          </span>
        </div>
        <Heart size={24} />
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-100">
          <User size={32} className="relative top-1" />
        </div>
      </div>
    </header>
  );
};
