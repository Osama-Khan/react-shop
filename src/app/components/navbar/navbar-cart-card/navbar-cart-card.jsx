import { React, Component } from "react";
import { Link } from "react-router-dom";
import { productsUrl } from "../../../routes";
import { IconButton, PrimaryButton } from "../../button/Button";
import { AppContext } from "../../../context/app.provider";

export default class NavbarCartCard extends Component {
  static contextType = AppContext;

  componentDidMount() {
    this.setState(this.context.state.cart);
  }

  render() {
    return this.renderItems(this.state?.products);
  }

  renderItems(items) {
    const p =
      items?.length > 0 ? (
        <>
          {items.map((p, i) => (
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
                click={() => {
                  this.onRemoveCartItem(p);
                }}
              />
            </div>
          ))}
          <PrimaryButton
            text="Checkout"
            classes="btn-block mt-auto"
            click={() => {
              this.context.services.uiService.toast("Under construction");
            }}
          />
        </>
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

  onRemoveCartItem(i) {
    this.state.removeProduct(i.id);
    this.setState(this.context.state.cart);
  }
}
