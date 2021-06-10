import { React, Component } from "react";
import { Link } from "react-router-dom";
import { orderUrl, productsUrl } from "../../../routes";
import { IconButton, PrimaryButton } from "../../button/Button";
import { AppContext } from "../../../context/app.provider";
import Icon from "../../icon/icon";

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
              className="card shadow-sm clickable p-2 my-1 d-flex flex-row text-sm ml-1">
              <div className="col-sm-4 my-auto">
                <img src={p.img} alt={p.title} />
              </div>
              <div className="col-sm-8 d-flex flex-column">
                <Link to={productsUrl + "/" + p.id}>
                  <div className="truncate">{p.title}</div>
                </Link>
                <div>
                  <b> Rs. {p.price}</b>
                  <input
                    type="number"
                    className="form-control"
                    value={p.quantity}
                    onChange={(e) => this.onQuantityChange(e, p)}
                  />
                </div>
              </div>
              <div
                className="top-right text-sm m-1 p-1 text-clickable"
                onClick={() => {
                  this.onRemoveCartItem(p);
                }}>
                <Icon dataIcon="fa:times" />
              </div>
            </div>
          ))}
          <Link to={orderUrl}>
            <PrimaryButton text="Checkout" classes="btn-block mt-3" />
          </Link>
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
        <hr />
        {p}
      </div>
    );
  }

  onQuantityChange(event, product) {
    const errorToast = this.context.services.uiService.errorToast;
    const str = event.target.value;
    const val = parseInt(str);
    if (val !== 0 && !val) {
      errorToast("Quantity must be a number!");
      return;
    }
    if (val <= 0) {
      errorToast("Quantity must be above 0!");
      return;
    }

    if (this.context.state.cart.setProductQuantity(product.id, val)) {
      this.context.setState({
        ...this.context.state,
        cart: this.context.state.cart,
      });
    } else {
      errorToast("Some problem occured");
    }
  }

  onRemoveCartItem(i) {
    this.context.state.cart.removeProduct(i.id);
    this.context.setState({
      ...this.context.state,
      cart: this.context.state.cart,
    });
    this.setState(this.context.state.cart);
  }
}
