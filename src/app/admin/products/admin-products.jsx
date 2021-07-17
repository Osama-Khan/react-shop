import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import { adminProductsAddUrl, productsUrl, userUrl } from '../../routes';
import Icon from '../../components/icon/icon';
import ListingComponent from '../listing-component.tsx';
import Criteria from '../../models/criteria';
import authorize from '../auth.helper';
import { IconButton } from '../../components/button/Button';

export default class AdminProducts extends Component {
  static contextType = AppContext;
  listingColumnOptions = [
    {
      header: (
        <div className="text-center img-tiny">
          <Icon dataIcon="bx-bxs-box" />
        </div>
      ),
      key: 'img',
      selector: (v) => <img src={v} alt="Product" className="img-small" />,
    },
    {
      header: 'ID',
      key: 'id',
    },
    {
      header: 'Title',
      key: 'title',
      selector: (v, r) => <Link to={`${productsUrl}/${r.id}`}>{v}</Link>,
    },
    {
      header: 'Posted by',
      key: 'user',
      selector: (v) => <Link to={`${userUrl}/${v.id}`}>@{v.username}</Link>,
    },
    {
      header: 'Rating',
      key: 'rating',
      selector: (v) => `${v ?? 'Unrated'}`,
    },
    {
      header: 'Stock',
      key: 'stock',
      selector: (v) => `${v}`,
    },
    {
      header: 'Actions',
      actions: [
        {
          selector: (r) => (
            <Link to={`products/${r.id}/edit`} title="Edit">
              <Icon dataIcon="fa:pencil" classes="mx-1 text-blue" />
            </Link>
          ),
        },
        {
          selector: () => (
            <span title="Delete">
              <Icon
                dataIcon="fa:trash"
                classes="mx-1 text-red text-clickable"
              />
            </span>
          ),
          onClick: (row) => this.delete(row),
        },
      ],
    },
  ];
  criteria = new Criteria();

  constructor(props) {
    super(props);
    this.criteria.addRelation('user');
  }

  render() {
    const auth = authorize(this.context);
    if (auth) return auth;
    return (
      <div className="mt-5 card">
        <h3 className="card-header">
          <span
            className="mr-2 text-clickable"
            onClick={this.props.history.goBack}>
            &larr;
          </span>
          Manage Products
        </h3>
        <div className="card-body">
          <div className="d-flex flex-column">
            <div className="row mx-0">
              <Link to={adminProductsAddUrl} className="ml-auto">
                <IconButton
                  classes="btn-dark"
                  text="Add Product"
                  dataIcon="fa:plus"
                />
              </Link>
            </div>
            <ListingComponent
              options={this.listingColumnOptions}
              fetchMethod={(crit) =>
                this.context.services.productService.fetchProducts(crit)
              }
              criteria={this.criteria}
            />
          </div>
        </div>
      </div>
    );
  }

  delete = async (product) => {
    const svc = this.context.services;
    const confirmation = await svc.uiService.confirmModal(
      `Delete Product #${product.id}?`,
      `Are you sure you want to delete ${product.title}?`,
      'warning',
      true,
      'Delete',
    );
    if (confirmation) {
      const promise = svc.productService.delete(product.id);
      const messages = {
        loading: 'Deleting product...',
        success: 'Product deleted!',
        error: 'Failed to delete product!',
      };
      return svc.uiService.promiseToast(promise, messages).then(() => {
        this.setState(this.initialState);
      });
    }
  };
}
