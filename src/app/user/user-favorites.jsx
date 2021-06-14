import { Component } from "react";
import { Redirect } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import ProductsList from "../components/products-list/products-list";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class UserFavorites extends Component {
  static contextType = AppContext;

  constructor() {
    super();
    this.state = {};
  }

  render() {
    if (!this.context.state.user.token) {
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
          <h1>Your Favorites</h1>
          <ProductsList products={this.state.products} />
        </div>
      );
    } else {
      return this.failedTemplate();
    }
  }

  failedTemplate = (msg = "Failed to load") => {
    return (
      <div className="mt-5 row container d-flex justify-content-center">
        <div className="alert alert-danger">
          <Icon dataIcon="fa:times-circle" />
          <span className="ml-2">{msg}</span>
        </div>
      </div>
    );
  };

  fetchData = () => {
    this.context.services.favoriteService
      .getFavoritesOfUser(this.context.state.user.id)
      .then((favs) => {
        const products = favs.data.map((d) => d.product);
        this.setState({ ...this.state, products });
      })
      .catch((err) => {
        this.context.services.uiService.iconModal(
          `Error ${err.status}`,
          `Failed to get favorites. ${err.statusText}`,
          "error"
        );
        this.setState({ ...this.state, failed: true });
      })
      .finally(() => this.setState({ ...this.state, fetching: false }));
  };
}
