import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((stay, room) => {
    setCart((prev) => [...prev, { cartId: `${stay.id}-${room.id}-${Date.now()}`, stay, room }]);
  }, []);

  const removeFromCart = useCallback((cartId) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((sum, c) => sum + c.room.price, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount: cart.length, total, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart는 CartProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
