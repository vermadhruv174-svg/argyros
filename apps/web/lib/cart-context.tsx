'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CartData } from '@/types/catalogue';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from './api-client';

const CART_TOKEN_KEY = 'argyros_cart_token';

interface CartContextValue {
  cart: CartData | null;
  loading: boolean;
  error: string | null;
  totalQuantity: number;
  addToBag: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearBag: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getStoredToken = useCallback((): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem(CART_TOKEN_KEY) || undefined;
  }, []);

  const saveToken = useCallback((token: string) => {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(CART_TOKEN_KEY, token);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getStoredToken();
      const updatedCart = await fetchCart(token);
      if (updatedCart) {
        setCart(updatedCart);
        saveToken(updatedCart.token);
      }
    } catch (err: unknown) {
      console.error('Failed to load cart:', err);
      const msg = err instanceof Error ? err.message : 'Failed to load bag';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [getStoredToken, saveToken]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToBag = async (variantId: string, quantity: number = 1) => {
    try {
      setError(null);
      const token = getStoredToken();
      const updatedCart = await apiAddToCart(token, variantId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        saveToken(updatedCart.token);
      }
    } catch (err: unknown) {
      console.error('Failed to add item to bag:', err);
      const msg = err instanceof Error ? err.message : 'Failed to add item to bag';
      setError(msg);
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      const token = getStoredToken();
      if (!token) return;

      if (quantity <= 0) {
        await removeItem(itemId);
        return;
      }

      const updatedCart = await apiUpdateCartItem(token, itemId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err: unknown) {
      console.error('Failed to update quantity:', err);
      const msg = err instanceof Error ? err.message : 'Failed to update quantity';
      setError(msg);
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setError(null);
      const token = getStoredToken();
      if (!token) return;

      const updatedCart = await apiRemoveCartItem(token, itemId);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err: unknown) {
      console.error('Failed to remove item:', err);
      const msg = err instanceof Error ? err.message : 'Failed to remove item';
      setError(msg);
    }
  };

  const clearBag = async () => {
    try {
      setError(null);
      const token = getStoredToken();
      if (!token) return;

      const updatedCart = await apiClearCart(token);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err: unknown) {
      console.error('Failed to clear bag:', err);
      const msg = err instanceof Error ? err.message : 'Failed to clear bag';
      setError(msg);
    }
  };

  const totalQuantity = cart ? cart.totalQuantity : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        totalQuantity,
        addToBag,
        updateQuantity,
        removeItem,
        clearBag,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
