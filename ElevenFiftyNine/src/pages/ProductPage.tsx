import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductGallery } from '../components/Products/ProductGallery';
import { ProductInfo } from '../components/Products/ProductInfo';
import { Reviews } from '../components/Products/Review';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';
import { ProductApi } from '../services/ProductApi';
import { Loader2 } from 'lucide-react';
import { ProductType } from '../types/types';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>("");
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  
  // Sample review data - replace with API calls when available
  const reviews = [
    {
      id: 1,
      author: "Helen M.",
      rating: 5,
      content: "Love this product! The design is eye-catching and quality is excellent.",
      likes: 42,
      dislikes: 0,
      timeAgo: "Yesterday"
    },
    {
      id: 2,
      author: "Ann D.",
      rating: 4,
      content: "Great product, runs slightly large.",
      likes: 36,
      dislikes: 2,
      timeAgo: "2 days ago"
    },
    {
      id: 3,
      author: "Andrew G.",
      rating: 5,
      content: "Awesome design and comfortable fit!",
      likes: 0,
      dislikes: 0,
      timeAgo: "2 days ago"
    }
  ];
  
  const reviewStats = {
    average: 4.8,
    total: 42,
    distribution: [38, 2, 1, 1, 0]
  };

  // Check authentication
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      navigate('/auth');
      return;
    }
  }, [navigate]);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productData = await ProductApi.getProduct(id);
        setProduct(productData);
        
        // Handle image loading
        if (productData.imageUrl) {
          try {
            const imageUrl = await ProductApi.fetchImage(productData.imageUrl);
            setMainImage(imageUrl);
            
            // For simplicity, use the same image for thumbnails
            // In a real app, you'd fetch multiple images or thumbnails
            setThumbnails(Array(4).fill(imageUrl));
          } catch (imageError) {
            console.error('Failed to load product image:', imageError);
            // Set a placeholder if image loading fails
            setMainImage('/placeholder-image.jpg');
          }
        }
      } catch (err : any) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
        
        // Handle unauthorized errors
        if (err.message && err.message.includes('401: Unauthorized')) {
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-500" />
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full bg-white min-h-screen">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => navigate('/products')}
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show product not found
  if (!product) {
    return (
      <div className="w-full bg-white min-h-screen">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Main content - full width with white background */}
      <div className="w-full bg-white">
        {/* Content container with responsive padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product section with improved responsive grid */}
          <div className="py-6 lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery container with better mobile spacing */}
            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <ProductGallery
                mainImage={mainImage}
                thumbnails={thumbnails}
              />
            </div>
            {/* Product info with proper spacing on mobile */}
            <div className="mt-6 md:mt-0">
            <ProductInfo 
                name={product.name}
                price={product.price}
                discountPrice={product.discountPrice ?? 0}
                rating={product.averageRating || 0}
                reviewCount={product.reviewCount || 0}
                sku={product.sku || `SKU-${product.id.substring(0, 8)}`}
                colors={product.colors || []}  // Fallback to an empty array if undefined
                sizes={product.sizes || []}    // Fallback to an empty array if undefined
                brand={product.brand || 'Unknown Brand'}  // Fallback to 'Unknown Brand' if undefined
                category={product.category || 'Unknown Category'} // Fallback to 'Unknown Category' if undefined
                description={product.description || 'No description available'}  // Fallback if undefined
                productId={product.id}
              />

            </div>
          </div>
          {/* Tabs and reviews with better mobile layout */}
          <div className="pb-8 lg:pb-12">
            <div className="border-b border-gray-200 mb-6 lg:mb-8">
              <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
                <button className="border-b-2 border-black pb-3 sm:pb-4 font-medium text-sm sm:text-base whitespace-nowrap">Details</button>
                <button className="text-gray-500 pb-3 sm:pb-4 font-medium text-sm sm:text-base whitespace-nowrap">Discussion</button>
              </div>
            </div>
            <Reviews reviews={reviews} reviewStats={reviewStats} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;

