import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Card from '../components/card/card';
import { AppContext } from '../context/app.provider';
import Icon from '../components/icon/icon';
import {
  adminCategoriesUrl,
  adminOrdersUrl,
  adminProductsUrl,
  adminUsersUrl,
  homeUrl,
} from '../routes';
import LoadingSpinner from '../components/loading/loading-spinner';

export default class AdminHome extends Component {
  static contextType = AppContext;
  constructor() {
    super();
    this.state = { verified: false };
  }

  componentDidMount() {}

  render() {
    if (this.context.state.user.restoringState) {
      return <LoadingSpinner />;
    }
    if (
      !this.context.state.user.token ||
      !this.context.state.user.roles.find((r) => r.name === 'admin')
    ) {
      this.context.services.uiService.toast(
        'You need to be logged in as admin to access admin panel.',
      );
      return <Redirect to={homeUrl} />;
    }
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
