import { Component } from "react";
import { Link } from "react-router-dom";
import { IconButton, PrimaryButton } from "../components/button/Button";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { addAddressUrl, addressesUrl, productsUrl } from "../routes";

export default class Checkout extends Component {
  static contextType = AppContext;
  loading = false;
  failed = false;

  constructor(props) {
    super(props);
    this.state = { address: undefined, placingOrder: false };
  }

  componentDidUpdate() {
    if (
      this.context.state.user.id &&
      !this.loading &&
      !this.failed &&
      !this.address
    ) {
      this.fetchData();
    }
  }

  componentDidMount() {
    if (this.context.state.user.id) this.fetchData();
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

    const address = this.state.address;

    const checkoutEl = loggedIn ? (
      address ? (
        <>
          <IconButton
            classes={"btn-green" + (!this.state.placingOrder ? " d-none" : "")}
            dataIcon="fa:spinner"
            iconClasses="spin"
            text="Placing order"
          />
          <IconButton
            classes={"btn-green" + (this.state.placingOrder ? " d-none" : "")}
            dataIcon="fa-check"
            text="Place Order"
            click={() => this.placeOrder()}
          />
          <div className="text-muted mt-3">
            Your order will be shipped to{" "}
            <b
              data-toggle="tooltip"
              title={`${address.address} - ${address.city}, ${address.country}`}>
              {address.tag}
            </b>
          </div>
          <Link to={addressesUrl}>
            <IconButton
              text="Change default address"
              dataIcon="fa:map-marker"
              classes="btn-dark-outline"
            />
          </Link>
        </>
      ) : address === false ? (
        <>
          <div className="text-muted">
            You don't have any addresses, please add at least one to continue.
          </div>
          <Link to={addAddressUrl}>
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
    if (!this.state.address) {
      this.context.uiService.errorToast("No address available");
      return;
    }
    this.setState({ ...this.state, placingOrder: true });
    this.context.services.orderService
      .placeOrder(
        `${this.state.address.address} - ${this.state.address.city}, ${this.state.address.country}`,
        this.context.state.user.id,
        products
      )
      .then((res) => {
        this.context.services.uiService.iconModal(
          "Order Placed",
          "Your order has been placed successfully!",
          "success"
        );
      })
      .catch((error) =>
        this.context.services.uiService.iconModal(
          "Order Failed",
          "Failed to place your order, please try again!",
          "error"
        )
      )
      .finally(() => {
        this.setState({ ...this.state, placingOrder: false });
        const cart = this.context.state.cart;
        cart.clearCart();
        this.context.setState({ ...this.context.state, cart });
      });
  }

  fetchData() {
    this.context.services.addressService
      .getAddresses(this.context.state.user.id)
      .then((res) => {
        const addresses = res.data?.data;
        if (!addresses) {
          this.setState({ address: false });
        }
        this.context.services.settingService
          .getDefaultAddress(this.context.state.user.id)
          .then((res) => {
            const addr = res.data;
            const address = addresses.find((a) => a.id === addr.id);
            this.setState({
              address,
            });
          });
      });
  }
}
