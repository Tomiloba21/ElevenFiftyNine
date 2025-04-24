import { Star, ShoppingBag, Heart, Truck } from 'lucide-react';

interface ProductInfoProps {
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  sku: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ 
  name, 
  price, 
  rating, 
  reviewCount,
  sku
}) => {
  const fullStars = Math.floor(rating);
  
  return (
    <div>
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
          <img src="/api/placeholder/24/24" alt="Reebok logo" className="w-6 h-6" />
        </div>
        <span className="ml-2 font-medium text-gray-900" >Reebok</span>
        <span className="ml-auto text-gray-800 text-sm">{sku}</span>
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-black">{name}</h1>
      
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            fill={i < fullStars ? "gold" : "none"} 
            color={i < fullStars ? "gold" : "gray"} 
          />
        ))}
        <span className="ml-2 text-gray-500 text-sm">{reviewCount} reviews</span>
      </div>
      
      <div className="text-3xl font-bold mb-6">${price.toFixed(2)}</div>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-gray-900 mr-2">Color</span>
          <span className="font-medium">White</span>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <div className="w-12 h-12 border-2 border-black rounded-md bg-gray-100"></div>
          <div className="w-12 h-12 border border-gray-200 rounded-md bg-gray-200"></div>
          <div className="w-12 h-12 border border-gray-200 rounded-md bg-black"></div>
        </div>
        
        <div className="flex items-center mb-2">
          <span className="text-gray-500 mr-2">Size</span>
          <span className="font-medium">EU Men</span>
        </div>
        
        <div className="grid grid-cols-6 gap-2 mb-2">
          {[40.5, 41, 42, 43, 43.5, 44, 44.5, 45, 46].map((size, index) => (
            <button 
              key={index} 
              className={`py-3 rounded border ${size === 41 ? 'bg-black text-white' : 'border-gray-200 text-amber-400'}`}
            >
              {size}
            </button>
          ))}
        </div>
        
        <button className="text-gray-400 text-sm mb-6">Size guide</button>
        
        <div className="flex space-x-2 mb-4">
          <button className="flex-1 bg-black text-white py-3 rounded-md flex items-center justify-center">
            <ShoppingBag size={18} className="mr-2" />
            Add to cart
          </button>
          <button className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center">
            <Heart size={20} />
          </button>
        </div>
        
        <div className="flex items-center text-sm">
          <Truck size={18} className="mr-2" />
          <span>Free delivery on orders over $30.0</span>
        </div>
      </div>
    </div>
  );
};