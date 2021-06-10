import { Component } from "react";
import { Redirect } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class OrderList extends Component {
  static contextType = AppContext;

  constructor() {
    super();
    this.state = { loading: false, failed: false, orders: undefined };
  }

  render() {
    if (!this.context.state.user.id) {
      return <Redirect to={userUrl} />;
    }
    if (!this.state.loading && !this.state.orders) {
      this.setState({ ...this.state, loading: true });
      console.log("Fetching");
      this.fetchData();
    }
    if (this.state.loading) {
      return <LoadingSpinner />;
    }
    if (this.state.orders) {
      return this.renderOrders(this.state.orders);
    }
    if (this.state.failed) {
      return this.failedTemplate();
    }
    return <></>;
  }

  renderOrders = (orders) => {
    const orderEls = orders.map((o) => (
      <div className="col-12">
        <h1>Order #{o.id}</h1>
        <div>
          Products:{" "}
          {o.orderProducts.map((op) => (
            <>
              <br />
              <b className="ml-2">Product {op.id}</b> &times; {op.quantity} ={" "}
              {op.price}
            </>
          ))}
        </div>
        <div>Order Status: {o.orderState.state}</div>
      </div>
    ));
    return (
      <div className="mt-5">
        <h2>Your Orders</h2>
        <div className="card p-3 row flex-row">{orderEls}</div>
      </div>
    );
  };

  failedTemplate = () => {
    return (
      <div className="mt-5 row container d-flex justify-content-center">
        <div className="alert alert-danger">
          <Icon dataIcon="fa:times-circle" />
          <span className="ml-2">Failed to load</span>
        </div>
      </div>
    );
  };

  fetchData = () => {
    this.context.services.orderService
      .getOrders(this.context.state.user.id)
      .then((res) => {
        this.setState({
          ...this.state,
          loading: false,
          orders: res.data,
        });
      })
      .catch((err) => {
        this.context.services.uiService.iconModal(
          `Error ${err.response.status}`,
          err.response.statusText,
          "error"
        );
      });
  };
}
