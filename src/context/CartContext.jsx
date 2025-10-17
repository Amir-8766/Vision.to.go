import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // مقدار اولیه را از localStorage بخوان
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // هر بار که items تغییر کرد، در localStorage ذخیره کن
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addToCart = (item) => {
    console.log("CartContext addToCart called with:", item);
    setItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        console.log("Item exists, increasing quantity");
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        console.log("New item, adding to cart");
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setItems([]);

  const increaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
