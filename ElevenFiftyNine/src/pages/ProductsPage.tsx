import { useState } from 'react';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star, Search, User } from 'lucide-react';
import { Footer } from '../components/Footer';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const products = [
    {
      id: 1,
      name: "Oversized Fit Printed Mesh T-Shirt",
      brand: "H&M",
      rating: 4.9,
      reviews: 136,
      price: 295.00,
      originalPrice: 550.00,
      image: "/api/placeholder/300/300",
      colors: ["navy", "blue", "lightblue"]
    },
    {
      id: 2,
      name: "Printed Sweatshirt",
      brand: "H&M",
      rating: 4.8,
      reviews: 178,
      price: 314.00,
      image: "/api/placeholder/300/300",
      colors: ["gray", "black"]
    },
    {
      id: 3,
      name: "Regular Fit Linen-blend T-shirt",
      brand: "H&M",
      rating: 4.8,
      reviews: 236,
      price: 169.00,
      image: "/api/placeholder/300/300",
      colors: ["black", "white"]
    },
    {
      id: 4,
      name: "Loose Fit Sweatshirt",
      brand: "H&M",
      rating: 4.7,
      reviews: 59,
      price: 187.00,
      image: "/api/placeholder/300/300",
      colors: ["lightblue", "gray"]
    },
    {
      id: 5,
      name: "Loose Fit Hoodie",
      brand: "H&M",
      rating: 5.0,
      reviews: 29,
      price: 249.00,
      image: "/api/placeholder/300/300",
      colors: ["beige", "black"]
    },
    {
      id: 6,
      name: "DryMove™ Track Jacket",
      brand: "H&M",
      rating: 4.8,
      reviews: 163,
      price: 329.00,
      image: "/api/placeholder/300/300",
      colors: ["navy", "gray"]
    },
    {
      id: 7,
      name: "11FiftyNine Graphic T-Shirt",
      brand: "Reebok",
      rating: 4.8,
      reviews: 42,
      price: 275.00,
      image: "/api/placeholder/300/300",
      colors: ["red", "white", "black"]
    },
    {
      id: 8,
      name: "Miami Print T-shirt",
      brand: "H&M",
      rating: 4.7,
      reviews: 53,
      price: 199.00,
      image: "/api/placeholder/300/300",
      colors: ["blue", "white"]
    }
  ];
  
  // Calculate pagination
  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'women', name: 'Women' },
    { id: 'men', name: 'Men' },
    { id: 'teens', name: 'Teens' },
    { id: 'kids', name: 'Kids' },
    { id: 'sports', name: 'Sports' }
  ];
  
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'running', name: 'Running' },
    { id: 'training', name: 'Training' },
    { id: 'casual', name: 'Casual' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="#" className="text-xl font-bold text-gray-800">ElevenFiftyNine</a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Women</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Men</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Sports</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Brands</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Search size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 relative">
              <Heart size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gray-100 py-6 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Discover Your Perfect Stride</h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore the latest in performance footwear. Comfort, style, and innovation come together.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
              Shop Now
            </button>
            <button className="bg-white text-gray-800 px-6 py-2 rounded border border-gray-300 hover:bg-gray-50 transition">
              Explore Brands
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto pb-2 hide-scrollbar space-x-2 md:justify-center">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                activeTab === filter.id 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
              onClick={() => setActiveTab(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover"
                />
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 text-gray-600 hover:text-red-500">
                  <Heart size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-700 ml-1">{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
                <div className="flex items-center">
                  <span className="text-red-600 font-medium">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-sm line-through ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center space-x-1">
                  {product.colors.map((color, idx) => (
                    <div 
                      key={idx}
                      className={`w-4 h-4 rounded-full border border-gray-300`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-8 h-8 rounded-full ${
                currentPage === number
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}