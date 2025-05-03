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
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }