import { Component } from "react";
import { Link } from "react-router-dom";
import { IconButton, PrimaryButton } from "../components/button/Button";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { productsUrl } from "../routes";

export default class Order extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { addresses: [], selectedAddressIndex: 0 };
  }

  componentDidMount() {
    if (this.context.state.user.id) {
      const u = this.context.services.userService
        .getUser(this.context.state.user.id)
        .then((u) => {
          this.setState({
            addresses: u.addresses.length > 0 ? u.addresses : false,
          });
        });
    }
  }

  render() {
    if (!this.context.state.cart) {
      return <LoadingSpinner />;
    }
    const loggedIn = this.context.state.user.username;

    if (this.context.state.cart.products.length === 0) {
      return (
        <div className="mt-5">
          <h2>Order details</h2>
          <div className="card p-3 row">
            <span className="mx-auto text-center">
              <h1>
                <b>Cart empty</b>
              </h1>
              You haven't added anything to your cart yet!
            </span>
            <Link to={productsUrl} className="mx-auto mt-5">
              <IconButton
                text="Add something"
                dataIcon="mi-shopping-cart-add"
              />
            </Link>
          </div>
        </div>
      );
    }

    const products = this.context.state.cart.products;
    const productsEl = products.map((p) => (
      <div key={`product-${p.id}`} className="row">
        <div>
          <img
            src={p.img}
            style={{ height: "4em" }}
            className="mx-3"
            alt={p.title}
          />
        </div>
        <div>
          <Link to={productsUrl + "/" + p.id}>
            <p>
              <b>{p.title}</b>
            </p>
          </Link>
          <p>
            {p.quantity} x {p.price} ={" "}
            <span className="p-2 badge-pill bg-green-subtle text-green">
              <b>Rs.{p.quantity * p.price}</b>
            </span>
          </p>
        </div>
      </div>
    ));
    const selectedAddress = this.state.addresses
      ? this.state.addresses[this.state.selectedAddressIndex]
      : null;
    const checkoutEl = loggedIn ? (
      this.state.addresses?.length > 0 ? (
        <>
          <IconButton
            classes="btn-green"
            dataIcon="fa-check"
            text="Place order"
            click={() => this.placeOrder()}
          />
          <div className="text-muted mt-3">
            Your order will be shipped to{" "}
            <b data-toggle="tooltip" title={selectedAddress.address}>
              {selectedAddress.tag}
            </b>
          </div>
          <Link to="change/shipping/address">
            <IconButton
              text="Change shipping address"
              dataIcon="fa:map-marker"
              classes="btn-dark-outline"
            />
          </Link>
        </>
      ) : this.state.addresses === false ? (
        <>
          <div className="text-muted">
            You don't have any addresses, please add at least one to continue.
          </div>
          <Link to="/somewhere/to/edit/profile">
            <PrimaryButton text="Add address" classes="btn-green" />
          </Link>
        </>
      ) : (
        <LoadingSpinner />
      )
    ) : (
      <>
        <div className="text-red">
          You need to log in before you can place order.
        </div>
        <Link to="/user">
          <PrimaryButton text="Log in" classes="btn-green" />
        </Link>
      </>
    );

    return (
      <div className="mt-5">
        <h2>Order details</h2>
        <div className="card p-3 row flex-row">
          <div className="col-lg-6">{productsEl}</div>
          <div className="col-lg-6 text-center my-5">
            <p className="text-green font-weight-bold">
              Your total for this order is:
            </p>
            <div className="my-3">
              <span className="p-3 badge-pill bg-green-subtle text-green">
                Rs. <b>{this.context.state.cart.getTotalPrice()}</b>
              </span>
            </div>
            {checkoutEl}
          </div>
        </div>
      </div>
    );
  }

  placeOrder() {
    const products = this.context.state.cart.products.map((p) => ({
      id: p.id,
      quantity: p.quantity,
    }));
    if (!this.state.addresses) {
      this.context.uiService.errorToast("No address available");
      return;
    }
    const selectedAddress =
      this.state.addresses[this.state.selectedAddressIndex].address;
    this.context.services.orderService.placeOrder(
      selectedAddress,
      this.context.state.user.id,
      products
    );
  }
}
