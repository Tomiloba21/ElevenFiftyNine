// import { useState } from "react";

// interface GalleryProps {
//     mainImage: string;
//     thumbnails: string[];
//   }
  
// export const ProductGallery: React.FC<GalleryProps> = ({ mainImage, thumbnails }) => {
//     const [selectedImage, setSelectedImage] = useState(mainImage);
    
//     return (
//       <div className="mb-4">
//         <div className="bg-gray-100 p-2 h-96 mb-2 rounded-lg flex items-center justify-center">
//           <img 
//             src={selectedImage} 
//             alt="Reebok Zig Kinetica 3" 
//             className="max-h-full max-w-full object-contain"
//           />
//         </div>
        
//         <div className="flex space-x-2 overflow-x-auto">
//           {thumbnails.map((thumb, index) => (
//             <div 
//               key={index}
//               className={`border p-2 rounded cursor-pointer w-20 h-20 flex-shrink-0 ${selectedImage === thumb ? 'border-black' : 'border-gray-200'}`}
//               onClick={() => setSelectedImage(thumb)}
//             >
//               <img 
//                 src={thumb} 
//                 alt={`Thumbnail ${index + 1}`} 
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           ))}
//           <div className="border border-gray-200 p-2 rounded cursor-pointer w-20 h-20 flex-shrink-0 flex items-center justify-center text-gray-500">
//             +4 more
//           </div>
//         </div>
//       </div>
//     );
//   };

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const ProductGallery = ({ mainImage, thumbnails = [] } : any) => {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Handle thumbnail click
  const handleThumbnailClick = (image : any, index :any) => {
    setCurrentImage(image);
    setCurrentIndex(index);
  };
  
  // Handle navigation between images
  const handleNavigate = (direction : any) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % thumbnails.length
      : (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    
    setCurrentIndex(newIndex);
    setCurrentImage(thumbnails[newIndex]);
  };
  
  // Toggle zoom effect
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Display a placeholder if no image is available
  const showPlaceholder = !mainImage && (!thumbnails || thumbnails.length === 0);
  
  return (
    <div className="flex flex-col">
      {/* Main image container */}
      <div className="relative flex-grow overflow-hidden rounded-lg bg-white">
        {showPlaceholder ? (
          <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
            <p className="text-gray-500">No image available</p>
          </div>
        ) : (
          <div className="relative h-96 md:h-[500px] w-full">
            <img
              src={currentImage || mainImage}
              alt="Product"
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              onClick={toggleZoom}
            />
            
            {/* Zoom indicator */}
            <button 
              className="absolute top-4 right-4 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
              onClick={toggleZoom}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn size={20} className="text-gray-700" />
            </button>
            
            {/* Navigation arrows - only show if we have multiple images */}
            {thumbnails && thumbnails.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
                  onClick={() => handleNavigate('prev')}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
                  onClick={() => handleNavigate('next')}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Thumbnails row */}
      {thumbnails && thumbnails.length > 0 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {thumbnails.map((thumbnail :any, index : any) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                currentIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => handleThumbnailClick(thumbnail, index)}
            >
              <img 
                src={thumbnail} 
                alt={`Product thumbnail ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};