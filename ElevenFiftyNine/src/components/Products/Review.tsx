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