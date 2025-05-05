import { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';
import { Footer } from '../components/Footer';
import type { Product } from '../types/types';
import { ProductApi } from "../context/ProductApi";
import { ProductImage } from '../components/Products/ProductImage';
import { useNavigate } from 'react-router';

export default function ProductsPage() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  
  const productsPerPage = 6;

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      // Redirect to login if no token found
      navigate('/auth');
      return;
    }
    
  }, [navigate]);
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, activeTab]);



  
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using ProductApi to fetch products with pagination
      const data = await ProductApi.fetchProducts(
        currentPage - 1, // Convert to 0-based index for API
        productsPerPage,
        activeTab !== 'all' ? activeTab : undefined
      );

      // Pre-cache images using the ProductApi helper method
      data.content.forEach(product => {
        if (product.imageUrl) {
          console.log("Image ID: ",product.imageUrl)
          console.log("Image URL raw:", product.imageUrl);
          console.log("Image URL string:", product.imageUrl?.toString?.());

          ProductApi.preloadImage(product.imageUrl);
        }
      });
      
      setProducts(data.content);
      setTotalPages(data.page.totalPages);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      
      // Handling different error types
      if (err.message && err.message.includes('401: Unauthorized')) {
        navigate("/auth")
        setError('You need to log in to view products. Please sign in.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      
      // Clear products data when there's an error
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // const imgae = await fetch ("")
  
  // Filter options
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'running', name: 'Running' },
    { id: 'training', name: 'Training' },
    { id: 'casual', name: 'Casual' }
  ];

  const handleAddToWishlist = (productId: string) => {
    // Implement wishlist functionality
    console.log(`Added product ${productId} to wishlist`);
  };
  
  // const handleProductClick = (productId: string) => {
  //   // Navigate to product detail page
  //   window.location.href = `/product/${productId}`;
  // };

  // Product card component to keep the main component cleaner
// Product card component to keep the main component cleaner
const ProductCard = ({ product, navigate }: { product: Product, navigate: any }) => (
  <div 
    className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer"
    onClick={() => navigate(`/products/${product.id}`)}
  >
    <div className="relative">
      <ProductImage 
        imageId={product.imageUrl} 
        alt={product.name} 
        className="w-full h-64 object-cover"
      />
      <button 
        className="absolute top-3 right-3 bg-white rounded-full p-2 text-gray-600 hover:text-red-500 z-10"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToWishlist(product.id);
        }}
      >
        <Heart size={20} />
      </button>
      {product.discountPrice && product.price > product.discountPrice && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-500">{product.brand || 'Brand'}</span>
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
        {product.discountPrice && product.price > product.discountPrice ? (
          <>
            <span className="text-red-600 font-medium">${product.discountPrice.toFixed(2)}</span>
            <span className="text-gray-400 text-sm line-through ml-2">
              ${product.price.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-gray-900 font-medium">${product.price?.toFixed(2) || '0.00'}</span>
        )}
      </div>
      {product.colors && product.colors.length > 0 && (
        <div className="mt-3 flex items-center space-x-1">
          {product.colors.map((color, idx) => (
            <div 
              key={idx}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gray-50">
    
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
              onClick={() => {
                setActiveTab(filter.id);
                setCurrentPage(1); // Reset to page 1 when changing filters
              }}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Products Grid */}
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-10">
              <Loader2 size={40} className="animate-spin mx-auto text-gray-500" />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product}  navigate={navigate} />
              ))}
            </div>
          )}
        </div>

      {/* Pagination - No changes needed for image loading */}
      {!loading && totalPages > 1 && (
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
            
            {/* Show limited page numbers with ellipsis for better UX */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(num => 
                num === 1 || 
                num === totalPages || 
                (num >= currentPage - 1 && num <= currentPage + 1)
              )
              .reduce((acc: (number | string)[], num, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== num - 1) {
                  acc.push('...');
                }
                acc.push(num);
                return acc;
              }, [])
              .map((item, index) => 
                item === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2">...</span>
                ) : (
                  <button
                    key={`page-${item}`}
                    onClick={() => setCurrentPage(item as number)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === item
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            
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

      <Footer />
    </div>
  );
}