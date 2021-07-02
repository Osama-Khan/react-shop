import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import LoadingSpinner from '../components/loading/loading-spinner';
import { AppContext } from '../context/app.provider';
import { userUrl } from '../routes';
import Criteria from '../models/criteria';
import Pagination from '../components/pagination/pagination';
import OrderList from './order-list';
import LoadingFailed from '../components/loading/loading-failed';

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
      selectedOrderState: -1,
      meta: undefined,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchStates();
  }

  render() {
    if (!this.context.state.user.id) {
      return <Redirect to={userUrl} />;
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
      const filters = this.state.orderStates ? (
        <select
          value={this.state.selectedOrderState}
          className="form-control"
          onChange={(e) => {
            this.state.selectedOrderState = parseInt(e.target.value);
            this.fetchData();
          }}>
          <option value={-1}>All</option>
          {this.state.orderStates.map((os) => (
            <option key={`dropdown-state-${os.id}`} value={os.id}>
              {os.state}
            </option>
          ))}
        </select>
      ) : (
        <LoadingSpinner inline={true} />
      );
      return (
        <div className="mt-5 d-flex flex-column">
          <h2>Your Orders</h2>
          <div className="mx-auto col-sm-12 col-md-3 col-lg-2">{filters}</div>
          <div className="p-3">
            <OrderList state={this.state} />
          </div>
          {pagination}
        </div>
      );
    }
    if (this.state.failed) {
      return <LoadingFailed />;
    }
    return <></>;
  }

  fetchData = (page = 1) => {
    this.setState({ ...this.state, fetching: true, detailLoaded: false });
    const criteria = new Criteria();
    criteria.setLimit(5);
    criteria.setPage(page);
    if (this.state.selectedOrderState >= 0) {
      criteria.addFilter('orderState', this.state.selectedOrderState);
    }
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
            o.id,
          );
          promises.push(promise);
          promise.then((res) => {
            const orders = this.state.orders;
            orders[i].orderProducts = res.data;
            this.setState({ ...this.state, orders });
          });
        });
        Promise.all(promises).then(() =>
          this.setState({ ...this.state, detailLoaded: true }),
        );
      })
      .catch((err) => {
        this.context.services.uiService.iconModal(
          `Error ${err.status}`,
          err.statusText,
          'error',
        );
      });
  };

  fetchStates = () => {
    this.context.services.orderService
      .getOrderStates()
      .then((res) => {
        const orderStates = res.data;
        this.setState({ ...this.state, orderStates });
      })
      .catch((err) => {
        this.context.services.uiService.iconModal(
          `Error ${err?.status ?? ''}`,
          err?.statusText ?? 'Something went wrong!',
          'error',
        );
      });
  };
}
