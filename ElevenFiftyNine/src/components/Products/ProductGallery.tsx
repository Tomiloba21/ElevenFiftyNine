import { useState } from "react";

interface GalleryProps {
    mainImage: string;
    thumbnails: string[];
  }
  
export const ProductGallery: React.FC<GalleryProps> = ({ mainImage, thumbnails }) => {
    const [selectedImage, setSelectedImage] = useState(mainImage);
    
    return (
      <div className="mb-4">
        <div className="bg-gray-100 p-2 h-96 mb-2 rounded-lg flex items-center justify-center">
          <img 
            src={selectedImage} 
            alt="Reebok Zig Kinetica 3" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto">
          {thumbnails.map((thumb, index) => (
            <div 
              key={index}
              className={`border p-2 rounded cursor-pointer w-20 h-20 flex-shrink-0 ${selectedImage === thumb ? 'border-black' : 'border-gray-200'}`}
              onClick={() => setSelectedImage(thumb)}
            >
              <img 
                src={thumb} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          <div className="border border-gray-200 p-2 rounded cursor-pointer w-20 h-20 flex-shrink-0 flex items-center justify-center text-gray-500">
            +4 more
          </div>
        </div>
      </div>
    );
  };