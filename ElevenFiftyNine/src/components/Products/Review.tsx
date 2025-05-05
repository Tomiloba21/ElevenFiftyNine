
// import { ThumbsUp, ThumbsDown, Star, User } from 'lucide-react';

// interface Review {
//   id: number;
//   author: string;
//   rating: number;
//   content: string;
//   likes: number;
//   dislikes: number;
//   timeAgo: string;
// }

// interface ReviewsProps {
//   reviews: Review[];
//   reviewStats: {
//     average: number;
//     total: number;
//     distribution: number[];
//   };
// }

// export const Reviews: React.FC<ReviewsProps> = ({ reviews, reviewStats }) => {
//   return (
//     <div className="mt-4 sm:mt-8">
//       <div className="border-b">
//         <div className="flex space-x-4 sm:space-x-6 text-base sm:text-lg mb-2 overflow-x-auto pb-1">
//           <button className="text-gray-800 whitespace-nowrap">Details</button>
//           <button className="font-bold border-b-2 border-black pb-2 whitespace-nowrap">Reviews</button>
//           <button className="text-gray-800 whitespace-nowrap">Discussion</button>
//         </div>
//       </div>
      
//       {/* Main content area - stack on mobile, side-by-side on tablet+ */}
//       <div className="flex flex-col md:flex-row mt-4">
//         {/* Reviews listing - full width on mobile */}
//         <div className="flex-1 order-2 md:order-1">
//           <div className="mb-4 flex items-center justify-between">
//             <select className="p-2 rounded border border-gray-200 text-sm sm:text-base">
//               <option>Newest</option>
//               <option>Highest Rating</option>
//               <option>Lowest Rating</option>
//             </select>
//           </div>
          
//           <div className="space-y-4 sm:space-y-6">
//             {reviews.map(review => (
//               <div key={review.id} className="border-b pb-4">
//                 <div className="flex items-center mb-2">
//                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 overflow-hidden mr-2">
//                     <User size={24} className="relative top-1 sm:hidden" />
//                     <User size={32} className="relative top-1 hidden sm:block" />
//                   </div>
//                   <div>
//                     <div className="font-medium text-stone-800 text-sm sm:text-base">{review.author}</div>
//                     <div className="text-xs sm:text-sm text-gray-900">{review.timeAgo}</div>
//                   </div>
//                 </div>
                
//                 <div className="flex mb-2">
//                   {[...Array(5)].map((_, i) => (
//                     <Star 
//                       key={i} 
//                       size={14} 
//                       className="sm:hidden"
//                       fill={i < review.rating ? "gold" : "none"} 
//                       color={i < review.rating ? "gold" : "gray"} 
//                     />
//                   ))}
//                   {[...Array(5)].map((_, i) => (
//                     <Star 
//                       key={i} 
//                       size={16}
//                       className="hidden sm:block" 
//                       fill={i < review.rating ? "gold" : "none"} 
//                       color={i < review.rating ? "gold" : "gray"} 
//                     />
//                   ))}
//                 </div>
                
//                 <p className="mb-2 text-sm sm:text-base">{review.content}</p>
                
//                 <div className="flex items-center text-xs sm:text-sm text-gray-900">
//                   <button className="mr-4">Reply</button>
//                   <button className="flex items-center mr-1">
//                     <ThumbsUp size={12} className="mr-1 sm:hidden" />
//                     <ThumbsUp size={14} className="mr-1 hidden sm:block" />
//                     {review.likes}
//                   </button>
//                   <button className="flex items-center">
//                     <ThumbsDown size={12} className="mr-1 sm:hidden" />
//                     <ThumbsDown size={14} className="mr-1 hidden sm:block" />
//                     {review.dislikes}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Review statistics - full width on mobile, sidebar on tablet+ */}
//         <div className="w-full md:w-64 md:ml-8 mb-6 md:mb-0 order-1 md:order-2">
//           <div className="flex items-center pb-4 sm:pb-10">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} size={16} className="sm:hidden" fill="gold" color="gold" />
//               ))}
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} size={18} className="hidden sm:block" fill="gold" color="gold" />
//               ))}
//             </div>
//             <span className="text-xl sm:text-2xl font-bold text-stone-700 ml-2 sm:ml-4">{reviewStats.average.toFixed(1)}</span>
//           </div>
          
//           <div className="space-y-1 sm:space-y-2 mb-6 text-stone-700">
//             {reviewStats.distribution.map((count, index) => (
//               <div key={5 - index} className="flex items-center">
//                 <span className="w-3 sm:w-4 text-xs sm:text-sm text-stone-700">{5 - index}</span>
//                 <div className="flex-1 mx-1 sm:mx-2 bg-gray-200 h-1.5 sm:h-2 rounded-full overflow-hidden text-stone-700">
//                   <div 
//                     className="bg-yellow-400 h-full" 
//                     style={{ width: `${(count / reviewStats.total) * 100}%` }}
//                   ></div>
//                 </div>
//                 <span className="w-4 sm:w-6 text-right text-xs sm:text-sm text-stone-700">{count}</span>
//               </div>
//             ))}
//           </div>
          
//           <div className="p-3 sm:p-4 bg-gray-800 rounded-md text-white text-sm sm:text-base">
//             <h3 className="font-bold mb-1 sm:mb-2">Popular brands with discounts over 25%</h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export const Reviews = ({ reviews = [], reviewStats = { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] } } :any) => {
  const [sortBy, setSortBy] = useState('recent');
  
  // Calculate the percentage for each star rating
  const calculatePercentage = (count : any) => {
    if (reviewStats.total === 0) return 0;
    return (count / reviewStats.total) * 100;
  };
  
  // Handle sort change
  const handleSortChange = (e : any) => {
    setSortBy(e.target.value);
  };
  
  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a : any, b : any) => {
    if (sortBy === 'recent') {
      // Simple time comparison (in a real app, use proper date comparison)
      return a.timeAgo < b.timeAgo ? -1 : 1;
    } else if (sortBy === 'helpful') {
      return b.likes - a.likes;
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Review summary - takes 4/12 columns on large screens */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            {/* Overall rating */}
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold text-gray-900 mr-2">{reviewStats.average.toFixed(1)}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(reviewStats.average) ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">{reviewStats.total} reviews</p>
            
            {/* Distribution bars */}
            <div className="space-y-2">
              {reviewStats.distribution.map((count :any, i :any) => (
                <div key={i} className="flex items-center text-sm">
                  <span className="w-12 text-gray-600">{5 - i} stars</span>
                  <div className="flex-1 mx-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400" 
                      style={{ width: `${calculatePercentage(count)}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-gray-500">{count}</span>
                </div>
              ))}
            </div>
            
            {/* Write review button */}
            <button className="w-full mt-6 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Write a Review
            </button>
          </div>
        </div>
        
        {/* Reviews list - takes 8/12 columns on large screens */}
        <div className="lg:col-span-8">
          {/* Sort options */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </h3>
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort by:</label>
              <select
                id="sort"
                className="text-sm border-gray-300 rounded-md"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
          
          {/* Reviews list */}
          {sortedReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedReviews.map((review : any) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  {/* Review header */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.author}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-gray-500 text-sm ml-2">
                          Verified Purchase
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{review.timeAgo}</p>
                  </div>
                  
                  {/* Review content */}
                  <p className="text-gray-700 mt-3 mb-4">{review.content}</p>
                  
                  {/* Review actions */}
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      <ThumbsUp size={16} className="mr-1" />
                      Helpful ({review.likes})
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      <ThumbsDown size={16} className="mr-1" />
                      Not helpful ({review.dislikes})
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      <MessageSquare size={16} className="mr-1" />
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination would go here if needed */}
          {reviews.length > 5 && (
            <div className="mt-8 flex justify-center">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2">
                Previous
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};