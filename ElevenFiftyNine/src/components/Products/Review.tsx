
import { ThumbsUp, ThumbsDown, Star, User } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
  timeAgo: string;
}

interface ReviewsProps {
  reviews: Review[];
  reviewStats: {
    average: number;
    total: number;
    distribution: number[];
  };
}

export const Reviews: React.FC<ReviewsProps> = ({ reviews, reviewStats }) => {
  return (
    <div className="mt-4 sm:mt-8">
      <div className="border-b">
        <div className="flex space-x-4 sm:space-x-6 text-base sm:text-lg mb-2 overflow-x-auto pb-1">
          <button className="text-gray-800 whitespace-nowrap">Details</button>
          <button className="font-bold border-b-2 border-black pb-2 whitespace-nowrap">Reviews</button>
          <button className="text-gray-800 whitespace-nowrap">Discussion</button>
        </div>
      </div>
      
      {/* Main content area - stack on mobile, side-by-side on tablet+ */}
      <div className="flex flex-col md:flex-row mt-4">
        {/* Reviews listing - full width on mobile */}
        <div className="flex-1 order-2 md:order-1">
          <div className="mb-4 flex items-center justify-between">
            <select className="p-2 rounded border border-gray-200 text-sm sm:text-base">
              <option>Newest</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 overflow-hidden mr-2">
                    <User size={24} className="relative top-1 sm:hidden" />
                    <User size={32} className="relative top-1 hidden sm:block" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-800 text-sm sm:text-base">{review.author}</div>
                    <div className="text-xs sm:text-sm text-gray-900">{review.timeAgo}</div>
                  </div>
                </div>
                
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className="sm:hidden"
                      fill={i < review.rating ? "gold" : "none"} 
                      color={i < review.rating ? "gold" : "gray"} 
                    />
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16}
                      className="hidden sm:block" 
                      fill={i < review.rating ? "gold" : "none"} 
                      color={i < review.rating ? "gold" : "gray"} 
                    />
                  ))}
                </div>
                
                <p className="mb-2 text-sm sm:text-base">{review.content}</p>
                
                <div className="flex items-center text-xs sm:text-sm text-gray-900">
                  <button className="mr-4">Reply</button>
                  <button className="flex items-center mr-1">
                    <ThumbsUp size={12} className="mr-1 sm:hidden" />
                    <ThumbsUp size={14} className="mr-1 hidden sm:block" />
                    {review.likes}
                  </button>
                  <button className="flex items-center">
                    <ThumbsDown size={12} className="mr-1 sm:hidden" />
                    <ThumbsDown size={14} className="mr-1 hidden sm:block" />
                    {review.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Review statistics - full width on mobile, sidebar on tablet+ */}
        <div className="w-full md:w-64 md:ml-8 mb-6 md:mb-0 order-1 md:order-2">
          <div className="flex items-center pb-4 sm:pb-10">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="sm:hidden" fill="gold" color="gold" />
              ))}
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="hidden sm:block" fill="gold" color="gold" />
              ))}
            </div>
            <span className="text-xl sm:text-2xl font-bold text-stone-700 ml-2 sm:ml-4">{reviewStats.average.toFixed(1)}</span>
          </div>
          
          <div className="space-y-1 sm:space-y-2 mb-6 text-stone-700">
            {reviewStats.distribution.map((count, index) => (
              <div key={5 - index} className="flex items-center">
                <span className="w-3 sm:w-4 text-xs sm:text-sm text-stone-700">{5 - index}</span>
                <div className="flex-1 mx-1 sm:mx-2 bg-gray-200 h-1.5 sm:h-2 rounded-full overflow-hidden text-stone-700">
                  <div 
                    className="bg-yellow-400 h-full" 
                    style={{ width: `${(count / reviewStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="w-4 sm:w-6 text-right text-xs sm:text-sm text-stone-700">{count}</span>
              </div>
            ))}
          </div>
          
          <div className="p-3 sm:p-4 bg-gray-800 rounded-md text-white text-sm sm:text-base">
            <h3 className="font-bold mb-1 sm:mb-2">Popular brands with discounts over 25%</h3>
          </div>
        </div>
      </div>
    </div>
  );
};