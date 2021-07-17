import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import { userUrl } from '../../routes';
import Icon from '../../components/icon/icon';
import ListingComponent from '../listing-component.tsx';
import Criteria from '../../models/criteria';
import OrderState from './order-state';

export default class AdminOrders extends Component {
  static contextType = AppContext;
  listingColumnOptions = [
    {
      header: 'Order #',
      key: 'id',
    },
    {
      header: 'Placed By',
      key: 'user',
      selector: (v) => <Link to={`${userUrl}/${v.id}`}>@{v.username}</Link>,
    },
    {
      header: 'Status',
      key: 'orderState',
      selector: (v) => <OrderState state={v.state} />,
    },
    {
      header: 'Actions',
      actions: [
        {
          selector: (r) =>
            r.orderState.state === 'Shipped' ? (
              <span title="Mark as delivered">
                <Icon
                  dataIcon="fa:check"
                  classes="text-green text-clickable mx-1"
                />
              </span>
            ) : (
              <></>
            ),
          onClick: (r) => this.markDelivered(r.id),
        },
        {
          selector: (r) =>
            r.orderState.state === 'Processing' ? (
              <span title="Mark as shipped">
                <Icon
                  dataIcon="fa:truck"
                  classes="text-blue text-clickable mx-1"
                />
              </span>
            ) : (
              <></>
            ),
          onClick: (r) => this.markShipped(r.id),
        },
        {
          selector: (r) =>
            ['Shipped', 'Processing'].includes(r.orderState.state) ? (
              <span title="Cancel">
                <Icon
                  dataIcon="fa:times"
                  classes="text-red text-clickable mx-1"
                />
              </span>
            ) : (
              <></>
            ),
          onClick: (r) => this.cancel(r.id),
        },
      ],
    },
  ];
  criteria = new Criteria();

  constructor(props) {
    super(props);
    this.criteria.addRelation('user');
    this.criteria.addRelation('orderState');
  }

  render() {
    return (
      <div className="mt-5 card">
        <h3 className="card-header">
          <span
            className="mr-2 text-clickable"
            onClick={this.props.history.goBack}>
            &larr;
          </span>
          Manage Orders
        </h3>
        <div className="card-body">
          <div className="d-flex flex-column">
            <ListingComponent
              options={this.listingColumnOptions}
              fetchMethod={(crit) =>
                this.context.services.orderService.getOrders(crit)
              }
              criteria={this.criteria}
            />
          </div>
        </div>
      </div>
    );
  }

  markShipped = async (id) => {
    const svc = this.context.services;
    const confirmation = await svc.uiService.confirmModal(
      `Ship Order #${id}?`,
      `Are you sure you want to mark Order#${id} as shipped?`,
      'info',
      true,
      'Ship',
    );
    if (confirmation) {
      const promise = svc.orderService.shipOrder(id);
      const messages = {
        loading: 'Marking order as shipped...',
        success: 'Order marked as shipped!',
        error: 'Failed to mark product as shipped!',
      };
      return svc.uiService.promiseToast(promise, messages).then(() => {
        this.setState(this.initialState);
      });
    }
  };

  markDelivered = async (id) => {
    const svc = this.context.services;
    const confirmation = await svc.uiService.confirmModal(
      `Deliver Order #${id}?`,
      `Are you sure you want to mark Order#${id} as delivered?`,
      'info',
      true,
      'Deliver',
    );
    if (confirmation) {
      const promise = svc.orderService.deliverOrder(id);
      const messages = {
        loading: 'Marking order as delivered...',
        success: 'Order marked as delivered!',
        error: 'Failed to mark product as delivered!',
      };
      return svc.uiService.promiseToast(promise, messages).then(() => {
        this.setState(this.initialState);
      });
    }
  };

  cancel = async (id) => {
    const svc = this.context.services;
    const confirmation = await svc.uiService.confirmModal(
      `Cancel Order #${id}?`,
      `Are you sure you want to mark Order#${id} as cancelled?`,
      'warning',
      true,
      'Ship',
    );
    if (confirmation) {
      const promise = svc.orderService.cancelOrder(id);
      const messages = {
        loading: 'Marking order as cancelled...',
        success: 'Order marked as cancelled!',
        error: 'Failed to mark product as cancelled!',
      };
      return svc.uiService.promiseToast(promise, messages).then(() => {
        this.setState(this.initialState);
      });
    }
  };
}
