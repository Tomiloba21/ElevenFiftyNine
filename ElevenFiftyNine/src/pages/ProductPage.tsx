import { ProductGallery } from '../components/Products/ProductGallery';
import { ProductInfo } from '../components/Products/ProductInfo';
import { Reviews } from '../components/Products/Review';
import tshirtImage from "../assets/images/redShirt.png";
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

const ProductPage: React.FC = () => {
  // Sample data
  const thumbnails = [
    tshirtImage,
    tshirtImage,
    tshirtImage,
    tshirtImage
  ];
  
  const reviews = [
    {
      id: 1,
      author: "Helen M.",
      rating: 5,
      content: "Love this shirt! The design is eye-catching and quality is excellent.",
      likes: 42,
      dislikes: 0,
      timeAgo: "Yesterday"
    },
    {
      id: 2,
      author: "Ann D.",
      rating: 4,
      content: "Great t-shirt, runs slightly large.",
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

  return (
    <div className="w-full bg-white">
     <Nav />
      {/* Main content - full width with whiteee background */}
      <div className="w-full bg-white">
        {/* Content container with responsive padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product section with improved responsive grid */}
          <div className="py-6 lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery container with better mobile spacing */}
            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <ProductGallery 
                mainImage={tshirtImage}
                thumbnails={thumbnails}
              />
            </div>
            {/* Product info with proper spacing on mobile */}
            <div className="mt-6 md:mt-0">
              <ProductInfo
                name="11FiftyNine Graphic T-Shirt"
                price={59.99}
                rating={4}
                reviewCount={42}
                sku="HR1325ROO-8"
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