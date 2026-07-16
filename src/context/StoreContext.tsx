'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

  export type Product = {
    id: string;
    categoryId: string;
    subCategory?: string;
    name: string;
    price: string;
    image: string;
    description: string;
    featured?: boolean;
    sizingType?: 'standard' | 'customise';
  };

export type CartItem = Product & {
  cartItemId: string;
  size: string;
  quantity: number;
};

export type SavedItem = Product & {
  savedItemId: string;
  size: string;
};

interface StoreContextType {
  cartItems: CartItem[];
  savedItems: SavedItem[];
  addToCart: (product: Product, size: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  addToSaved: (product: Product, size: string) => void;
  removeFromSaved: (savedItemId: string) => void;
  moveToCart: (savedItemId: string) => void;
  isSaved: (productId: string, size?: string) => boolean;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem('savedItems');
    if (savedWishlist) setSavedItems(JSON.parse(savedWishlist));

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('savedItems', JSON.stringify(savedItems));
    }
  }, [savedItems, isHydrated]);

  const addToCart = (product: Product, size: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.cartItemId === existing.cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, cartItemId: Date.now().toString() + Math.random(), size, quantity: 1 }];
    });
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    ));
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const addToSaved = (product: Product, size: string) => {
    setSavedItems(prev => {
      if (prev.some(item => item.id === product.id && item.size === size)) return prev;
      return [...prev, { ...product, savedItemId: Date.now().toString() + Math.random(), size }];
    });
  };

  const removeFromSaved = (savedItemId: string) => {
    setSavedItems(prev => prev.filter(item => item.savedItemId !== savedItemId));
  };

  const moveToCart = (savedItemId: string) => {
    const item = savedItems.find(i => i.savedItemId === savedItemId);
    if (item) {
      addToCart(item, item.size);
      removeFromSaved(savedItemId);
    }
  };

  const isSaved = (productId: string, size?: string) => {
    if (size) return savedItems.some(item => item.id === productId && item.size === size);
    return savedItems.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <StoreContext.Provider value={{
      cartItems, savedItems, addToCart, updateCartQuantity, removeFromCart, addToSaved, removeFromSaved, moveToCart, isSaved, clearCart
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
