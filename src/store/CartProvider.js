import React, { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === `ADD`) {
    const updatedTotalAmount =
      state.totalAmount + action.item.amount * action.item.price;
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems = [...state.items];
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }
  if (action.type === `REMOVE`) {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingCartItem.price;
    let updatedItems;
    if (existingCartItem.amount > 1) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount - 1,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }
  if (action.type === `CLEAR`) {
    return defaultCartState;
  }
  return defaultCartState;
};
export default function CartProvider(props) {
  const [cartState, dispatchCart] = useReducer(cartReducer, defaultCartState);

  const addItemHandler = (item) => {
    dispatchCart({ type: `ADD`, item: item });
  };

  const removeItemHandler = (id) => {
    dispatchCart({ type: `REMOVE`, id: id });
  };

  const clearCartHandler = () => {
    dispatchCart({ type: `CLEAR` });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    clearCart: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}
