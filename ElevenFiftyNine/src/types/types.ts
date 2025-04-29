export interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    discountPrice: number | null;
    stockQuantity: number;
    colors: string[];
    sizes: string[];
    category: string;
    tags: string[];
    imageUrl: string;
    featured: boolean;
    reviewCount: number;
    averageRating: number;
  }
  
  export interface ProductData {
    content: Product[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  }
  
