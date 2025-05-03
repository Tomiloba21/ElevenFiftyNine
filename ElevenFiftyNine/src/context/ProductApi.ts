import type { Product, ProductData } from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api/v1/product';
const IMAGE_API_URL = 'http://localhost:8080/api/v1/images';

const getAuthHeaders = () => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    throw new Error('401: Unauthorized - No token found');
  }
  return {
    'Authorization': `Bearer ${userToken}`,
  };
};

const imageCache = new Map();


export const ProductApi = {
  // Save product (create or update)
  saveProduct: async (product: Product): Promise<Product> => {
    const isNew = product.id.startsWith('temp-');
    const url = isNew ? `${API_BASE_URL}/` : `${API_BASE_URL}/${product.id}`;
    
    // Create FormData for multipart request
    const formData = new FormData();
    
    // Add product data as JSON
    const productBlob = new Blob([JSON.stringify(product)], {
      type: 'application/json'
    });
    formData.append('product', productBlob);
    
    const response = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: getAuthHeaders(),
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to ${isNew ? 'create' : 'update'} product: ${response.statusText}`);
    }
    return response.json();
  },
  
  // Upload image separately - creates or updates a product with image
  uploadProductImage: async (productId: string, imageFile: File): Promise<Product> => {
    const url = `${API_BASE_URL}/${productId}`;
    
    // Create FormData for multipart request
    const formData = new FormData();
    
    // Get current product to pass in request
    let currentProduct;
    try {
      currentProduct = await ProductApi.getProduct(productId);
    } catch (error) {
      console.error("Failed to get current product:", error);
      // If this is a new product that was just created, we might not need the current data
      currentProduct = { id: productId };
    }
    
    const productBlob = new Blob([JSON.stringify(currentProduct)], {
      type: 'application/json'
    });
    
    formData.append('product', productBlob);
    formData.append('image', imageFile);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }
    return response.json();
  },
  
  // Get a single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return response.json();
  },
  
  // Fetch products with pagination and optional category filtering
  fetchProducts: async (page = 0, size = 5, category?: string): Promise<ProductData> => {
    let url = `${API_BASE_URL}/?page=${page}&size=${size}&sort=createdAt,desc`;
    
    // Add category filter if provided
    if (category) {
      url += `&category=${category}`;
    }
    
    try {
      console.log('Fetching products from:', url);
      // First try without auth headers for public access
      const publicResponse = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      if (publicResponse.ok) {
        const data = await publicResponse.json();
        console.log('Products fetched successfully with public access');
        return data;
      }
      
      // If public access fails, try with auth for admin/authorized users
      console.log('Public access failed, trying with auth');
      const response = await fetch(url, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully with authentication');
      return data;
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete product: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Wait for the operation to complete
    return Promise.resolve();
  },
  
  // Patch a product (partial update)
  patchProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const formData = new FormData();
    const updatesBlob = new Blob([JSON.stringify(updates)], {
      type: 'application/json'
    });
    formData.append('product', updatesBlob);
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to patch product: ${response.statusText}`);
    }
    return response.json();
  },
  
  // Helper method to create FormData from a product object (similar to ProductService)
  createProductFormData: (product: Partial<Product>, image?: File): FormData => {
    const formData = new FormData();
    
    // Convert product object to JSON string and append it as 'product' field
    const productBlob = new Blob([JSON.stringify(product)], {
      type: 'application/json',
    });
    formData.append('product', productBlob);
    
    // If an image file is provided, add it to formData
    if (image) {
      formData.append('image', image);
    }
    
    return formData;
  },

 

  
  // Get image URL - returns the direct URL to the image
  getImageUrl: (imageId: string): string => {
    if (!imageId) return '';
    
    return `${IMAGE_API_URL}/${imageId}`;
  },
  
  // Fetch image as blob with caching
  fetchImage: async (imageId: string): Promise<string> => {
    if (!imageId) {
      throw new Error('No image ID provided');
    }
    
    // Check if we have this image cached already
    if (imageCache.has(imageId)) {
      return imageCache.get(imageId);
    }
    
    const url = `${IMAGE_API_URL}/${imageId}`;
    
    try {
      // First try without authentication headers for public images
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'image/*'
          },
          cache: 'default'
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          // Cache the result
          imageCache.set(imageId, objectUrl);
          
          return objectUrl;
        }
      } catch (error) {
        console.warn('Public image fetch failed, trying with authentication');
      }
      
      // If public access fails, try with authentication
      const authResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'image/*',
          ...getAuthHeaders()
        },
        cache: 'default'
      });
      
      if (!authResponse.ok) {
        throw new Error(`Failed to fetch image: ${authResponse.status} ${authResponse.statusText}`);
      }
      
      const blob = await authResponse.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      // Cache the result
      imageCache.set(imageId, objectUrl);
      
      return objectUrl;
    } catch (err) {
      console.error(`Error fetching image ${imageId}:`, err);
      throw err;
    }
  },
  
  // Preload image to browser cache
  preloadImage: async (imageId: string): Promise<void> => {
    if (!imageId) return;
    
    try {
      await ProductApi.fetchImage(imageId);
    } catch (error) {
      console.warn(`Failed to preload image ${imageId}:`, error);
    }
  },
  
  // Clear image cache for a specific image or all images
  clearImageCache: (imageId?: string): void => {
    if (imageId) {
      const url = imageCache.get(imageId);
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
      imageCache.delete(imageId);
    } else {
      // Clear all cached images
      imageCache.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      imageCache.clear();
    }
  }

};