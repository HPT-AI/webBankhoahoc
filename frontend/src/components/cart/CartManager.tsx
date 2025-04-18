import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { CartItem, ShoppingCart } from '../../types/cart';

interface CartContextType {
  cart: ShoppingCart;
  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => void;
  removeDiscount: () => void;
}

const defaultCart: ShoppingCart = {
  items: [],
  subtotal: 0,
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ShoppingCart>(defaultCart);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (items: CartItem[], discount?: { code: string; amount: number }) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = discount ? discount.amount : 0;
    const total = Math.max(0, subtotal - discountAmount);
    
    return { subtotal, total };
  };

  const addItem = (item: CartItem) => {
    const existingItemIndex = cart.items.findIndex(i => i.courseId === item.courseId);
    
    if (existingItemIndex >= 0) {
      message.info('This course is already in your cart');
      return;
    }
    
    const newItems = [...cart.items, item];
    const { subtotal, total } = calculateTotals(newItems, cart.discount);
    
    setCart({
      items: newItems,
      subtotal,
      discount: cart.discount,
      total
    });
    
    message.success('Course added to cart');
  };

  const removeItem = (courseId: string) => {
    const newItems = cart.items.filter(item => item.courseId !== courseId);
    const { subtotal, total } = calculateTotals(newItems, cart.discount);
    
    setCart({
      items: newItems,
      subtotal,
      discount: cart.discount,
      total
    });
    
    message.success('Course removed from cart');
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(courseId);
      return;
    }
    
    message.info('Quantity updates are not applicable for courses');
  };

  const clearCart = () => {
    setCart(defaultCart);
    message.success('Cart cleared');
  };

  const applyDiscount = (code: string) => {
    const discountAmount = 10; // Example: $10 discount
    
    const { total } = calculateTotals(cart.items, { code, amount: discountAmount });
    
    setCart({
      ...cart,
      discount: { code, amount: discountAmount },
      total
    });
    
    message.success(`Discount code "${code}" applied`);
  };

  const removeDiscount = () => {
    const { total } = calculateTotals(cart.items);
    
    setCart({
      ...cart,
      discount: undefined,
      total
    });
    
    message.success('Discount removed');
  };

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const CartManager: React.FC = () => {
  const { cart } = useCart();
  
  return (
    <div>
      <h2>Shopping Cart ({cart.items.length} items)</h2>
      <p>Subtotal: ${cart.subtotal.toFixed(2)}</p>
      {cart.discount && (
        <p>Discount ({cart.discount.code}): -${cart.discount.amount.toFixed(2)}</p>
      )}
      <p>Total: ${cart.total.toFixed(2)}</p>
    </div>
  );
};

export default CartManager;
