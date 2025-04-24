import { Header } from '../components/Products/Header';
import { ProductGallery } from '../components/Products/ProductGallery';
import { ProductInfo } from '../components/Products/ProductInfo';
import { Reviews } from '../components/Products/Review';
import tshirtImage from "../assets/images/redShirt.png";

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
      <Header />
      {/* Main content - full width with white background */}
      <div className="w-full bg-white">

        {/* Content container similar to your homepage */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product section */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-100 p-6 rounded-lg">
              <ProductGallery
                mainImage={tshirtImage}
                thumbnails={thumbnails}
              />
            </div>
            <div>
              <ProductInfo
                name="11FiftyNine Graphic T-Shirt"
                price={59.99}
                rating={4}
                reviewCount={42}
                sku="HR1325ROO-8"
              />
            </div>
          </div>
          
          {/* Tabs and reviews */}
          <div className="pb-12">
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                <button className="border-b-2 border-black pb-4 font-medium">Details</button>
                <button className="text-gray-500 pb-4 font-medium">Discussion</button>
              </div>
            </div>
            <Reviews reviews={reviews} reviewStats={reviewStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;