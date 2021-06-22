import { Component } from "react";
import { Redirect } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";
import Criteria from "../models/criteria";
import Pagination from "../components/pagination/pagination";
import OrderList from "./order-list";

export default class Orders extends Component {
  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      detailLoaded: false,
      fetching: false,
      failed: false,
      orders: undefined,
      orderStates: undefined,
      selectedOrderState: "",
      meta: undefined,
    };
  }

  render() {
    if (!this.context.state.user.id) {
      return <Redirect to={userUrl} />;
    }
    if (!this.state.fetching && !this.state.orders) {
      this.fetchData();
    }
    if (this.state.fetching) {
      return <LoadingSpinner />;
    }
    if (this.state.orders && this.state.meta) {
      const pagination = (
        <div className="mt-3 d-flex">
          <div className="ml-auto">
            <Pagination
              currentPage={this.state.meta.currentPage}
              totalPages={this.state.meta.totalPages}
              gotoPage={(p) => {
                this.fetchData(p);
              }}
            />
          </div>
        </div>
      );
      return (
        <>
          <OrderList state={this.state} />
          {pagination}
        </>
      );
    }
    if (this.state.failed) {
      return this.failedTemplate();
    }
    return <></>;
  }

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

  fetchData = (page = 1) => {
    this.setState({ ...this.state, fetching: true, detailLoaded: false });
    const criteria = new Criteria();
    criteria.setLimit(5);
    criteria.setPage(page);
    this.context.services.orderService
      .getOrders(this.context.state.user.id, criteria)
      .then((res) => {
        this.setState({
          ...this.state,
          fetching: false,
          orders: res.data.data,
          meta: res.data.meta,
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
