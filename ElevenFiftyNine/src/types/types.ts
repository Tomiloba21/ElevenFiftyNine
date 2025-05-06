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


// 


export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartRequest {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface CartUpdateRequest {
  itemId: string;
  quantity: number;
}

// Order Status Enum (matching Java enum)
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Payment Method Enum
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

// Address type 
export interface Address {
  firstName: string;
  lastName: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
}

// Order Item
export interface OrderItem {
  productId?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  color?: string;
  size?: string;
}

// Order Request
export interface OrderRequest {
  orderItems: OrderItem[];
  shippingAddress: Address;
  customerId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

// Order Response
export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  orderDate: string;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentId?: string;
  paymentMethod: PaymentMethod;
  createdAt ?: string;
  updatedAt ?: string;
  trackingNumber?: string;
  shippedDate?: string;
  deliveredDate?: string;
}

// Order Status Update Request
export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}