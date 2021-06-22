import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { productsUrl, userUrl } from "../routes";
import { OrderStateEnum } from "./order-state.enum";
import OrderStateBadge from "./order-state-badge";

export default class OrderList extends Component {
  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      loading: false,
      detailLoaded: false,
      failed: false,
      orders: undefined,
    };
  }

  render() {
    if (!this.context.state.user.id) {
      return <Redirect to={userUrl} />;
    }
    if (!this.state.loading && !this.state.orders) {
      this.setState({ ...this.state, loading: true });
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
    const orderEls =
      orders.length > 0 ? (
        orders.map((o) => {
          let total = 0;
          return (
            <div className="col-md-8 card mb-4 mx-auto p-0">
              <div className="card-header bg-dark text-light row">
                <h1 className="m-0 ml-2">Order #{o.id} </h1>
                <OrderStateBadge orderState={o.orderState} />
              </div>
              <div className="mb-2 p-2">
                {this.state.detailLoaded ? (
                  o.orderProducts.map((op) => {
                    total += op.price * op.quantity;
                    return (
                      <>
                        <br />
                        <span className="ml-2">
                          {" "}
                          {op.quantity} &times;{" "}
                          <Link
                            to={`${productsUrl}/${op.product.id}`}
                            title={op.product.title}>
                            {op.product.title.substring(0, 16) + "..."}
                          </Link>
                        </span>{" "}
                        = <b>{op.price} Rs.</b>
                      </>
                    );
                  })
                ) : (
                  <LoadingSpinner />
                )}
              </div>
              <div className="row m-0 px-2">
                <span className="my-auto text-muted">
                  Placed on: {new Date(o.createdAt).toLocaleString()}
                  <br />
                  Last Update: {new Date(o.updatedAt).toLocaleString()}
                </span>
                <span className="bg-green-subtle badge-pill m-3 ml-auto p-2 text-green">
                  <b>{total}</b> Rs.
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <>
          <div className="text-center text-muted font-weight-bold mt-5">
            You have placed no orders... yet!
          </div>
          <div className="d-flex">
            {" "}
            <Link className="btn btn-dark mx-auto mt-3" to={productsUrl}>
              Go Get Something
            </Link>
          </div>
        </>
      );
    return (
      <div className="mt-5">
        <h2>Your Orders</h2>
        <div className="p-3">{orderEls}</div>
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
          orders: res.data.data,
        });
        if (res.data.length === 0) return;
        let promises = [];
        res.data.data.forEach((o, i) => {
          const promise = this.context.services.orderService.getOrderDetail(
            o.id
          );
          promises.push(promise);
          promise.then((res) => {
            const orders = this.state.orders;
            orders[i].orderProducts = res.data;
            this.setState({ ...this.state, orders });
          });
        });
        Promise.all(promises).then(() =>
          this.setState({ ...this.state, detailLoaded: true })
        );
      })
      .catch((err) => {
        this.context.services.uiService.iconModal(
          `Error ${err.status}`,
          err.statusText,
          "error"
        );
      });
  };
}
