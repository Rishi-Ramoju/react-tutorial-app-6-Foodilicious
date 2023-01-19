import React, { useContext } from "react";
import CartContext from "../../../store/cart-context";
import classes from "./MealItem.module.css";
import MealItemForm from "./MealItemForm";

export default function MealItem(props) {
  const cartCtx = useContext(CartContext);

  const submitHandler = (value) => {
    cartCtx.addItem({
      id: props.item.id,
      name: props.item.name,
      price: props.item.price,
      amount: +value,
    });
  };
  return (
    <li className={classes.meal}>
      <div>
        <h3>{props.item.name}</h3>
        <div className={classes.description}>{props.item.description}</div>
        <div className={classes.price}>{`$${props.item.price.toFixed(2)}`}</div>
      </div>
      <div>
        <MealItemForm
          id={props.item.id}
          onSubmit={submitHandler}
        ></MealItemForm>
      </div>
    </li>
  );
}
