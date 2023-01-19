import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

export default function Cart(props) {
  const [isCheckingout, setIsCheckingout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didsubmitted, setDidSubmitted] = useState(false);
  const cartCtx = useContext(CartContext);

  const addHandler = (item) => {
    cartCtx.addItem({
      ...item,
      amount: 1,
    });
  };

  const removeHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setIsCheckingout(true);
  };

  const cancelHandler = () => {
    setIsCheckingout(false);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://foodilicious-ee49c-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setDidSubmitted(true);
    cartCtx.clearCart();
  };

  const cartModalContent = (
    <React.Fragment>
      {
        <ul className={classes[`cart-items`]}>
          {cartCtx.items.map((item) => (
            <CartItem
              key={item.id}
              name={item.name}
              price={item.price}
              amount={item.amount}
              onAdd={addHandler.bind(null, item)}
              onRemove={removeHandler.bind(null, item.id)}
            ></CartItem>
          ))}
        </ul>
      }
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{`$${cartCtx.totalAmount.toFixed(2)}`}</span>
      </div>
      {isCheckingout && (
        <Checkout onCancel={cancelHandler} onOrderSubmit={submitOrderHandler} />
      )}
      {!isCheckingout && (
        <div className={classes.actions}>
          <button className={classes[`button--alt`]} onClick={props.onClose}>
            Close
          </button>
          <button className={classes.button} onClick={orderHandler}>
            Order
          </button>
        </div>
      )}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Order is placing...</p>;

  const didSubmittedModalContent = (
    <React.Fragment>
      <p>Order placed successfully!😋</p>
      <div className={classes.actions}>
        <button className={classes[`button--alt`]} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal>
      {!isSubmitting && !didsubmitted && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didsubmitted && didSubmittedModalContent}
    </Modal>
  );
}
