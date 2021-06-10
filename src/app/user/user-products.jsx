import { Component } from "react";
import { Redirect } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import ProductsList from "../components/products-list/products-list";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class UserProducts extends Component {
  static contextType = AppContext;
  userId = undefined;

  constructor() {
    super();
    this.state = {};
  }

  render() {
    if (!this.context.state.user.username) {
      return <Redirect to={userUrl} />;
    }
    if (!this.state.products && !this.state.fetching && !this.state.failed) {
      this.setState({ ...this.state, fetching: true });
      this.fetchData();
      return <LoadingSpinner />;
    } else if (this.state.fetching) {
      return <LoadingSpinner />;
    } else if (this.state.products && !this.state.failed) {
      return (
        <div className="mt-5">
          <h1>{this.context.state.user.username}'s Products</h1>
          <ProductsList products={this.state.products} />
        </div>
      );
    } else {
      return this.failedTemplate();
    }
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

  fetchData = () => {
    this.context.services.userService
      .fetchProducts(parseInt(this.props.match.params.id))
      .then((p) => {
        const products = p.data;
        this.setState({ ...this.state, products });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.context.services.uiService.iconModal(
            "No Such User",
            "The user you have provided does not exist",
            "error"
          );
        }
        this.setState({ ...this.state, failed: true });
      })
      .finally(() => this.setState({ ...this.state, fetching: false }));
  };
}
