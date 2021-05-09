import { React, useState } from "react";
import State from "../../../state/state";
import { Link } from "react-router-dom";
import { productsUrl } from "../../../routes";
import { IconButton } from "../../button/Button";

let items, setItems;
export default function NavbarCartCard() {
  [items, setItems] = useState(State.cart.products);
  return renderItems(items);
}

function renderItems(items) {
  const p =
    items.length > 0 ? (
      items.map((p, i) => (
        <div
          key={i}
          className="card shadow-sm clickable p-2 my-1 d-flex flex-row text-sm">
          <div className="col-sm-4 my-auto">
            <img src={p.img} alt={p.title} />
          </div>
          <div className="col-sm-8">
            <p className="truncate">{p.title}</p>
            <p>
              <b>{p.price}</b> Rs. × {p.quantity} items
            </p>
          </div>
          <IconButton
            classes="top-right text-sm text-red"
            dataIcon="akar-icons:cross"
            click={() => {onRemoveCartItem(p)}}
          />
        </div>
      ))
    ) : (
      <div className="text-center text-muted">
        <p>Your cart is empty!</p>
        <Link to={productsUrl}>
          <IconButton dataIcon="mi-shopping-cart-add" text="Add items" />
        </Link>
      </div>
    );
  return (
    <div>
      <p className="text-center font-weight-bold">CART</p>
      {p}
    </div>
  );
}

function onRemoveCartItem(i) {
  State.cart.removeProduct(i.id);
  setItems(State.cart.products);
}