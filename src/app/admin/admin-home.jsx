import { Component } from 'react';
import Card from '../components/card/card';
import { AppContext } from '../context/app.provider';
import Icon from '../components/icon/icon';
import {
  adminCategoriesUrl,
  adminOrdersUrl,
  adminProductsUrl,
  adminUsersUrl,
} from '../routes';
import authorize from './auth.helper';

export default class AdminHome extends Component {
  static contextType = AppContext;
  constructor() {
    super();
    this.state = { verified: false };
  }

  componentDidMount() {}

  render() {
    const auth = authorize(this.context);
    if (auth) return auth;
    return (
      <div className="mt-5 card col-md-8 mx-auto px-0">
        <div className="card-header">
          <h3>
            <Icon dataIcon="fa-solid:shield-alt" /> Admin Panel
          </h3>
        </div>
        <div className="card-body row">
          <div className="col-md-6 col-lg-3 mb-3 mx-auto">
            <Card
              text="Users"
              icon="fa:users"
              classes="shadow-sm"
              iconClasses="icon-sm"
              linkTo={adminUsersUrl}
            />
          </div>
          <div className="col-md-6 col-lg-3 mb-3 mx-auto">
            <Card
              text="Products"
              icon="bx-bxs-box"
              classes="shadow-sm"
              iconClasses="icon-sm"
              linkTo={adminProductsUrl}
            />
          </div>
          <div className="col-md-6 col-lg-3 mb-3 mx-auto">
            <Card
              text="Orders"
              icon="fa-solid:file-invoice"
              classes="shadow-sm"
              iconClasses="icon-sm"
              linkTo={adminOrdersUrl}
            />
          </div>
          <div className="col-md-6 col-lg-3 mb-3 mx-auto">
            <Card
              text="Categories"
              icon="bx:bxs-category-alt"
              classes="shadow-sm"
              iconClasses="icon-sm"
              linkTo={adminCategoriesUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}
