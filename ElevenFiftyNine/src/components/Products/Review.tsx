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
    <div className="mt-8">
      <div className="border-b">
        <div className="flex space-x-6 text-lg mb-2">
          <button className="text-gray-800">Details</button>
          <button className="font-bold border-b-2 border-black pb-2">Reviews</button>
          <button className="text-gray-800">Discussion</button>
        </div>
      </div>
      
      <div className="flex mt-4">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <select className="p-2 rounded border border-gray-200">
              <option>Newest</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
            
          </div>
          
          <div className="space-y-6">
            
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2">
                    <User size={32} className="relative top-1" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">{review.author}</div>
                    <div className="text-sm text-gray-900">{review.timeAgo}</div>
                  </div>
                </div>
                
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? "gold" : "none"} 
                      color={i < review.rating ? "gold" : "gray"} 
                    />
                  ))}
                </div>
                
                <p className="mb-2">{review.content}</p>
                
                <div className="flex items-center text-sm text-gray-900">
                  <button className="mr-4">Reply</button>
                  <button className="flex items-center mr-1">
                    <ThumbsUp size={14} className="mr-1" />
                    {review.likes}
                  </button>
                  <button className="flex items-center">
                    <ThumbsDown size={14} className="mr-1" />
                    {review.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-64 ml-8 ">
          <div className="flex items-center pb-10">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="gold" color="gold" />
                ))}
              </div>
              <span className="text-2xl font-bold ml-2 text-stone-700 ml-27">{reviewStats.average.toFixed(1)}</span>
            </div>
          <div className="space-y-2 mb-6 text-stone-700">
            {reviewStats.distribution.map((count, index) => (
              <div key={5 - index} className="flex items-center">
                <span className="w-4 text-stone-700">{5 - index}</span>
                <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full overflow-hidden text-stone-700">
                  <div 
                    className="bg-yellow-400 h-full" 
                    style={{ width: `${(count / reviewStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="w-6 text-right text-stone-70">{count}</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-800 rounded-md">
            <h3 className="font-bold mb-2">Popular brands with discounts over 25%</h3>
          </div>
        </div>
      </div>
    </div>
  );
};