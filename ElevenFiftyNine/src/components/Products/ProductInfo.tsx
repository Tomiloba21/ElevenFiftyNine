// import { Star, ShoppingBag, Heart, Truck } from 'lucide-react';



// export const ProductInfo: React.FC<ProductInfoProps> = ({ 
//   name, 
//   price, 
//   rating, 
//   reviewCount,
//   sku
// }) => {
//   const fullStars = Math.floor(rating);
  
//   return (
//     <div>
//       <div className="flex items-center mb-2">
//         <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
//           <img src="/api/placeholder/24/24" alt="Reebok logo" className="w-6 h-6" />
//         </div>
//         <span className="ml-2 font-medium text-gray-900" >Reebok</span>
//         <span className="ml-auto text-gray-800 text-sm">{sku}</span>
//       </div>
      
//       <h1 className="text-2xl font-bold mb-2 text-black">{name}</h1>
      
//       <div className="flex items-center mb-4">
//         {[...Array(5)].map((_, i) => (
//           <Star 
//             key={i} 
//             size={18} 
//             fill={i < fullStars ? "gold" : "none"} 
//             color={i < fullStars ? "gold" : "gray"} 
//           />
//         ))}
//         <span className="ml-2 text-gray-500 text-sm">{reviewCount} reviews</span>
//       </div>
      
//       <div className="text-3xl font-bold mb-6">${price.toFixed(2)}</div>
      
//       <div className="mb-4">
//         <div className="flex items-center mb-2">
//           <span className="text-gray-900 mr-2">Color</span>
//           <span className="font-medium">White</span>
//         </div>
        
//         <div className="flex space-x-2 mb-6">
//           <div className="w-12 h-12 border-2 border-black rounded-md bg-gray-100"></div>
//           <div className="w-12 h-12 border border-gray-200 rounded-md bg-gray-200"></div>
//           <div className="w-12 h-12 border border-gray-200 rounded-md bg-black"></div>
//         </div>
        
//         <div className="flex items-center mb-2">
//           <span className="text-gray-500 mr-2">Size</span>
//           <span className="font-medium">EU Men</span>
//         </div>
        
//         <div className="grid grid-cols-6 gap-2 mb-2">
//           {[40.5, 41, 42, 43, 43.5, 44, 44.5, 45, 46].map((size, index) => (
//             <button 
//               key={index} 
//               className={`py-3 rounded border ${size === 41 ? 'bg-black text-white' : 'border-gray-200 text-amber-400'}`}
//             >
//               {size}
//             </button>
//           ))}
//         </div>
        
//         <button className="text-gray-400 text-sm mb-6">Size guide</button>
        
//         <div className="flex space-x-2 mb-4">
//           <button className="flex-1 bg-black text-white py-3 rounded-md flex items-center justify-center">
//             <ShoppingBag size={18} className="mr-2" />
//             Add to cart
//           </button>
//           <button className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center">
//             <Heart size={20} />
//           </button>
//         </div>
        
//         <div className="flex items-center text-sm">
//           <Truck size={18} className="mr-2" />
//           <span>Free delivery on orders over $30.0</span>
//         </div>
//       </div>
//     </div>
//   );
// };



import { useState } from 'react';
import { Star, Truck, ArrowRight, Heart } from 'lucide-react';
import { ProductInfoProps } from '../../types/types';

// Define the props for the ProductInfo component
export const ProductInfo = ({
  name,
  price,
  discountPrice,
  rating = 0,
  reviewCount = 0,
  sku,
  colors = [],
  sizes = [],
  brand,
  category,
  description
} : ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState(sizes && sizes.length > 0 ? sizes[0] : '');
  const [selectedColor, setSelectedColor] = useState(colors && colors.length > 0 ? colors[0] : '');
  const [quantity, setQuantity] = useState(1);

  // Handle adding to cart
  const handleAddToCart = () => {
    console.log('Added to cart:', {
      name,
      price: discountPrice || price,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    // Here you would implement your cart logic
  };

  // Handle adding to wishlist
  const handleAddToWishlist = () => {
    console.log('Added to wishlist:', { name, price: discountPrice || price });
    // Here you would implement your wishlist logic
  };

  // Format the price for display
  const formatPrice = (value : any) => {
    return value ? `$${value.toFixed(2)}` : '$0.00';
  };

  // Calculate the discount percentage if applicable
  const discountPercentage = discountPrice && price > discountPrice
    ? Math.round((1 - discountPrice / price) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      {brand && (
        <p className="text-gray-500 text-sm mb-1">{brand}</p>
      )}

      {/* Product name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{name}</h1>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center mb-6">
        {discountPrice && price > discountPrice ? (
          <>
            <span className="text-2xl font-bold text-red-600">{formatPrice(discountPrice)}</span>
            <span className="ml-2 text-lg text-gray-400 line-through">{formatPrice(price)}</span>
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">
              {discountPercentage}% OFF
            </span>
          </>
        ) : (
          <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="mb-6">
          <p className="text-gray-600">{description}</p>
        </div>
      )}

      {/* Color selection */}
      {colors && colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
          <div className="flex space-x-2">
            {colors.map((color :any, index :any) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Color: ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selection */}
      {sizes && sizes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <a href="#size-guide" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Size guide
            </a>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size :any) => (
              <button
                key={size}
                className={`py-2 text-center border rounded-md ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
        <div className="flex border border-gray-300 rounded-md w-32">
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full text-center focus:outline-none"
          />
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 mb-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-black text-white py-3 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToWishlist}
          className="flex-1 flex justify-center items-center border border-gray-300 py-3 px-4 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <Heart size={20} className="mr-2" /> Wishlist
        </button>
      </div>

      {/* Additional info */}
      <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
        {/* Shipping info */}
        <div className="flex items-start">
          <Truck size={20} className="text-gray-400 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Free shipping</p>
            <p className="text-sm text-gray-500">2-3 business days</p>
          </div>
        </div>

        {/* Product SKU */}
        {sku && (
          <p className="text-sm text-gray-500">SKU: {sku}</p>
        )}

        {/* Category */}
        {category && (
          <p className="text-sm text-gray-500">Category: {category}</p>
        )}

        {/* Returns */}
        <a href="#returns" className="flex items-center text-sm text-indigo-600 hover:text-indigo-500">
          Return policy <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};