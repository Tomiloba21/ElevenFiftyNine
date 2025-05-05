export interface Product {
    id : string;
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
    imageUrl ?: string;
    featured: boolean;
    reviewCount: number;
    averageRating: number;
  }

  export interface ProductType {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null | undefined;
    averageRating?: number;
    reviewCount?: number;
    sku?: string;
    colors?: string[];
    sizes?: string[];
    brand?: string;
    category?: string;
    description?: string ;
    imageUrl?: string;
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
  
  export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }
  

  export interface ProductInfoProps {
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
    discountPrice : number,
    sku: string;
    colors : string [],
    sizes : string [],
    brand : string,
    category :string,
    description : string
  }
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name?: string;  // Extended for UI display
  image?: string; // Extended for UI display
  brand?: string; // Extended for UI display
  color?: string; // Extended for UI display
  size?: string;  // Extended for UI display
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartRequest {
  productId: string;
  quantity: number;
}

export interface CartUpdateRequest {
  itemId: string;
  quantity: number;
}