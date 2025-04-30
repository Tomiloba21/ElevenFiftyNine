import { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Footer } from '../components/Footer';
// Import the JSON data directly or use API fetch
import productsData from '../context/products.json';
import type { Product } from '../types/types';
import { Nav } from '../components/Nav';




export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, you would fetch from API
    // For now, we'll simulate loading the data from our JSON file
    const fetchProducts = async () => {
      try {
        // Option 1: If using direct import
        setProducts(productsData.content);
        
        // Option 2: If fetching from an API endpoint
        // const response = await fetch('/api/products');
        // const data = await response.json();
        // setProducts(data.content);
        
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use fallback data for demo purposes
        setProducts([]);
      }finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on activeTab
  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(product => product.tags && product.tags.includes(activeTab.toLowerCase()));
  
  // Calculate pagination
  const productsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'running', name: 'Running' },
    { id: 'training', name: 'Training' },
    { id: 'casual', name: 'Casual' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm">
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
      </header> */}

      <Nav />

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
        {currentProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <div className="relative">
                  <img 
                    src={product.imageUrl || "/api/placeholder/300/300"} 
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
                      <span className="text-sm text-gray-700 ml-1">
                        {product.averageRating ? product.averageRating.toFixed(1) : '0.0'} 
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
                  <div className="flex items-center">
                    <span className="text-red-600 font-medium">${product.price.toFixed(2)}</span>
                    {product.discountPrice && (
                      <span className="text-gray-400 text-sm line-through ml-2">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center space-x-1">
                    {product.colors && product.colors.map((color, idx) => (
                      <div 
                        key={idx}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}