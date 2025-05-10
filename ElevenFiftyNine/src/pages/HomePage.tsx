import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductApi } from '../services/ProductApi';
import { Footer } from '../components/Footer';
import { Product } from '../types/types';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and extract available categories
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        // Fetch a larger number of products to ensure we get enough featured ones
        const response = await ProductApi.fetchProducts(0, 20);
        
        if (response && response.content) {
          // Filter featured products
          const featured = response.content.filter(product => product.featured);
          setFeaturedProducts(featured.length > 0 ? featured : response.content.slice(0, 3));
          
          // Extract unique categories
          const categories = new Set<string>();
          categories.add('All');
          
          response.content.forEach(product => {
            if (product.category) {
              categories.add(product.category);
            }
          });
          
          setAllCategories(Array.from(categories));
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        // Use placeholder data if API fails
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === activeCategory);

  // Preload all product images
  useEffect(() => {
    featuredProducts.forEach(product => {
      if (product.imageUrl) {
        ProductApi.preloadImage(product.imageUrl);
      }
    });
  }, [featuredProducts]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-stone-600">
            Discover Your Perfect Style
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore the latest in fashion apparel. Comfort, style, and quality come together at ElevenFiftyNine.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
              Shop Now
            </Link>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-100 transition">
              Explore Brands
            </button>
          </div>
        </div>
      </header>

      {/* Product Categories */}
      <section className="mb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center space-x-2 md:space-x-4 mb-8">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 mb-2 rounded-md transition ${
                  activeCategory === category 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-600 p-4">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4"
                >
                  <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={ProductApi.getImageUrl(product.imageUrl)} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = "/api/placeholder/200/200";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">{product.brand}</p>
                      <h3 className="font-semibold">{product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold">${product.price.toFixed(2)}</p>
                        {product.discountPrice && product.discountPrice > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.discountPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      {product.averageRating > 0 && (
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.round(product.averageRating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {product.colors && product.colors.map((color) => (
                        <div 
                          key={color} 
                          className="w-4 h-4 rounded-full border border-gray-200" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link 
                      to={`/products/${product.id}`}
                      className="w-full block text-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories.filter(cat => cat !== 'All').slice(0, 4).map((category) => (
              <div key={category} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Link 
                    to={`/products?category=${encodeURIComponent(category)}`} 
                    className="text-black font-medium hover:underline mt-2 inline-block"
                  >
                    Browse Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
