import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ProductApi } from '../../context/ProductApi';

interface ProductImageProps {
  imageId: string | null | undefined;
  alt: string;
  className?: string;
  placeholderImage?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ProductImage = ({
  imageId,
  alt,
  className = "w-full h-64 object-cover",
  placeholderImage = "/images/placeholder-product.jpg",
  onLoad,
  onError
}: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when imageId changes
    setImageError(false);
    setLoading(true);
    setImageSrc(null);

    // If no imageId is provided, don't try to load
    if (!imageId) {
      setLoading(false);
      return;
    }

    // Validate that imageId is a string
    if (typeof imageId !== 'string') {
      console.error('Invalid imageId type:', typeof imageId, imageId);
      setImageError(true);
      setLoading(false);
      if (onError) onError();
      return;
    }

    // Track if component is still mounted
    let isMounted = true;

    const loadImage = async () => {
      try {
        console.log(`Loading image with ID: ${imageId}`);
        
        // Get direct image URL first - this will be used if fetchImage fails
        const directUrl = ProductApi.getImageUrl(imageId);
        
        // Start loading process
        try {
          // Try to get the image URL using the API with proper authentication
          const imageUrl = await ProductApi.fetchImage(imageId);
          
          if (!isMounted) return;
          
          console.log(`Image loaded successfully: ${imageId}`);
          setImageSrc(imageUrl);
          setLoading(false);
          if (onLoad) onLoad();
        } catch (err) {
          if (!isMounted) return;
          console.warn('Error in fetchImage, falling back to direct URL:', err);
          
          // Fall back to direct URL if fetchImage fails
          setImageSrc(directUrl);
          setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading image:', err);
        setImageError(true);
        setLoading(false);
        if (onError) onError();
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      isMounted = false;
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageId, onLoad, onError]);

  // Show placeholder if no imageId or error
  if (!imageId || imageError) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={placeholderImage}
          alt={`${alt} placeholder`}
          className={className}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
            <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Image failed to load</span>
          </div>
        )}
      </div>
    );
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show image when loaded
  return (
    <img
      src={imageSrc || placeholderImage}
      alt={alt}
      className={className}
      onError={() => {
        console.error(`Image rendering failed: ${imageId}`);
        setImageError(true);
        if (onError) onError();
      }}
      loading="lazy"
    />
  );
};