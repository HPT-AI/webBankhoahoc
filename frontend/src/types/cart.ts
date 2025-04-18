export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  instructor: string;
}

export interface ShoppingCart {
  items: CartItem[];
  subtotal: number;
  discount?: {
    code: string;
    amount: number;
  };
  total: number;
}

export interface CheckoutForm {
  paymentMethod: 'STRIPE' | 'VNPAY';
  billingInfo: {
    name: string;
    email: string;
    address: string;
  };
  cardDetails?: StripeCardElement;
}

export interface StripeCardElement {
  id: string;
}

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  courses: CartItem[];
  total: number;
  status: 'completed' | 'processing' | 'failed';
  paymentMethod: 'STRIPE' | 'VNPAY';
}
