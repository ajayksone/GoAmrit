"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@/lib/medusa";

interface CartContextType {
  cart: any;
  isLoading: boolean;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getOrInitializeCart = async () => {
    let cartId = localStorage.getItem("cart_id");
    
    try {
      if (cartId) {
        const { cart } = await sdk.store.cart.retrieve(cartId);
        setCart(cart);
      } else {
        const { cart } = await sdk.store.cart.create({});
        localStorage.setItem("cart_id", cart.id);
        setCart(cart);
      }
    } catch (e) {
      console.error("Cart initialization failed:", e);
      // If retrieval fails (e.g. cart expired), create a new one
      const { cart } = await sdk.store.cart.create({});
      localStorage.setItem("cart_id", cart.id);
      setCart(cart);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrInitializeCart();
  }, []);

  const refreshCart = async () => {
    const cartId = localStorage.getItem("cart_id");
    if (cartId) {
      const { cart } = await sdk.store.cart.retrieve(cartId);
      setCart(cart);
    }
  };

  const addItem = async (variantId: string, quantity: number) => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;
    
    try {
      const { cart } = await sdk.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity,
      });
      setCart(cart);
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  const removeItem = async (lineId: string) => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    try {
      const { cart } = await sdk.store.cart.deleteLineItem(cartId, lineId);
      setCart(cart);
    } catch (e) {
      console.error("Error removing item:", e);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    try {
      const { cart } = await sdk.store.cart.updateLineItem(cartId, lineId, {
        quantity,
      });
      setCart(cart);
    } catch (e) {
      console.error("Error updating item:", e);
    }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, removeItem, updateItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
