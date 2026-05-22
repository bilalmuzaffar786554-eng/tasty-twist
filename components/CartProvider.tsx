"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartDrawer } from "@/components/CartDrawer";
import type { CartItem, FoodItem, ProductCustomization } from "@/types";
import {
  createCartItem,
  getCartQuantity,
  getCartSubtotal,
  normalizeCartItem,
} from "@/utils/order";

type CartContextValue = {
  addToCart: (food: FoodItem, customization?: ProductCustomization) => void;
  cartItems: CartItem[];
  cartQuantity: number;
  clearCart: () => void;
  closeCart: () => void;
  decreaseQuantity: (cartId: string) => void;
  increaseQuantity: (cartId: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  removeItem: (cartId: string) => void;
  setCartItems: (items: CartItem[]) => void;
  showToast: (message: string) => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartStorageKey = "tasty-twist-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItemsState] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedCart = window.localStorage.getItem(cartStorageKey);

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart) as CartItem[];

          setCartItemsState(parsedCart.map(normalizeCartItem));
        } catch {
          window.localStorage.removeItem(cartStorageKey);
        }
      }

      setHasLoadedCart(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedCart]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const subtotal = getCartSubtotal(cartItems);
  const cartQuantity = getCartQuantity(cartItems);

  function showToast(message: string) {
    setToastMessage(message);
  }

  function addToCart(food: FoodItem, customization?: ProductCustomization) {
    const cartItem = createCartItem(food, customization);

    setCartItemsState((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.cartId === cartItem.cartId,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartId === cartItem.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, cartItem];
    });

    showToast(`${food.name} added to cart`);
  }

  function increaseQuantity(cartId: string) {
    setCartItemsState((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(cartId: string) {
    setCartItemsState((currentItems) =>
      currentItems
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(cartId: string) {
    setCartItemsState((currentItems) =>
      currentItems.filter((item) => item.cartId !== cartId),
    );
  }

  function clearCart() {
    setCartItemsState([]);
  }

  return (
    <CartContext.Provider
      value={{
        addToCart,
        cartItems,
        cartQuantity,
        clearCart,
        closeCart: () => setIsCartOpen(false),
        decreaseQuantity,
        increaseQuantity,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        removeItem,
        setCartItems: setCartItemsState,
        showToast,
        subtotal,
      }}
    >
      {toastMessage && (
        <div className="toast-enter fixed right-4 top-24 z-[70] rounded-2xl border border-orange-400/40 bg-neutral-900/95 px-5 py-4 text-sm font-bold text-white shadow-2xl shadow-orange-500/20 backdrop-blur">
          {toastMessage}
        </div>
      )}

      {children}

      {isCartOpen && (
        <CartDrawer
          cartItems={cartItems}
          cartQuantity={cartQuantity}
          subtotal={subtotal}
          onClearCart={clearCart}
          onClose={() => setIsCartOpen(false)}
          onDecreaseQuantity={decreaseQuantity}
          onIncreaseQuantity={increaseQuantity}
          onRemoveItem={removeItem}
        />
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
