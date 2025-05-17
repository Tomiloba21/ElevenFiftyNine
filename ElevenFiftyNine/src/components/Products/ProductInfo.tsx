

import { useState } from 'react';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductInfoProps {
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  sku: string;
  brand: string;
  category: string;
  description: string;
  colors: string[];
  sizes: string[];
  productId?: string; // Add productId for cart functionality
}

export const ProductInfo = ({
  name,
  price,
  discountPrice,
  rating,
  reviewCount,
  sku,
  brand,
  category,
  description,
  colors,
  sizes,
  productId
}: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [addToCartError, setAddToCartError] = useState('');
  
  const { addToCart } = useCart();
  
  // Format the stars display
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };
  
  const handleAddToCart = async () => {
    if (!productId) {
      setAddToCartError('Product ID is missing');
      return;
    }
    
    setAddingToCart(true);
    setAddToCartError('');
    
    try {
      await addToCart(productId, quantity);
      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 3000);
    } catch (error: any) {
      setAddToCartError(error.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    setQuantity(newQuantity);
  };
  
  return (
    <div>
      {/* Product title and price */}
      <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
      <div className="mt-2 flex items-center">
        {discountPrice && discountPrice < price ? (
          <>
            <p className="text-xl font-semibold text-gray-900">£{discountPrice.toFixed(2)}</p>
            <p className="ml-2 text-lg text-gray-500 line-through">£{price.toFixed(2)}</p>
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
              {Math.round(((price - discountPrice) / price) * 100)}% OFF
            </span>
          </>
        ) : (
          <p className="text-xl font-semibold text-gray-900">£{price.toFixed(2)}</p>
        )}
      </div>
      
      {/* Ratings */}
      <div className="mt-4 flex items-center">
        <div className="flex items-center">{renderStars(rating)}</div>
        <p className="ml-2 text-sm text-gray-500">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </p>
      </div>
      
      {/* Description */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">Description</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      
      {/* Color selection */}
      {colors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Color</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`rounded-full h-8 w-8 border ${
                  selectedColor === color
                    ? 'ring-2 ring-offset-2 ring-gray-500'
                    : 'ring-1 ring-gray-200'
                }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Color: ${color}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Size selection */}
      {sizes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className={`px-3 py-1 border ${
                  selectedSize === size
                    ? 'border-gray-800 bg-gray-800 text-white'
                    : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                } rounded-md text-sm`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Quantity */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
        <div className="mt-2 flex items-center">
          <button
            className="rounded-l border border-gray-300 bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 border-t border-b border-gray-300 py-1 text-center"
          />
          <button
            className="rounded-r border border-gray-300 bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 99}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Add to cart button */}
      <div className="mt-8">
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || !productId}
          className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {addingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </>
          )}
        </button>
        
        {/* Success message */}
        {addToCartSuccess && (
          <div className="mt-2 text-sm text-green-600">
            Item added to cart successfully!
          </div>
        )}
        
        {/* Error message */}
        {addToCartError && (
          <div className="mt-2 text-sm text-red-600">
            {addToCartError}
          </div>
        )}
      </div>
      
      {/* Product details */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">SKU:</span> {sku}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Brand:</span> {brand}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Category:</span> {category}
          </p>
        </div>
      </div>
    </div>
  );
};