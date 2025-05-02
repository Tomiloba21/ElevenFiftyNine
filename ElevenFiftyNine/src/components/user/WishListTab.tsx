// components/WishlistTab.tsx
import React from 'react';
import { WishlistItem } from '../../types/userTypes';

interface WishlistTabProps {
  items: WishlistItem[];
  onAddToCart: (itemId: string) => void;
  onRemoveFromWishlist: (itemId: string) => void;
}

export const WishlistTab: React.FC<WishlistTabProps> = ({ 
  items, 
  onAddToCart, 
  onRemoveFromWishlist 
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Wishlist</h3>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Your wishlist is empty.</p>
          <button className="mt-4 text-blue-600 hover:text-blue-800">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-md p-4 flex items-start space-x-4">
              <div className="bg-gray-200 w-20 h-20 flex-shrink-0">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-600 text-sm mt-1">${item.price.toFixed(2)}</p>
                <div className="mt-2 space-x-2 flex flex-wrap">
                  <button 
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => onAddToCart(item.id)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="text-xs text-red-600 hover:text-red-700"
                    onClick={() => onRemoveFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};