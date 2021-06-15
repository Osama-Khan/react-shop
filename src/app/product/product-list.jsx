import React from "react";
import { AppContext } from "../context/app.provider";
import LoadingSpinner from "../components/loading/loading";
import ProductsList from "../components/products-list/products-list";
import Icon from "../components/icon/icon";

export default class ProductList extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      products: undefined,
      fetching: false,
      failed: false,
    };
  }

  render() {
    if (!this.state.products && !this.state.fetching && !this.state.failed) {
      this.setState({ ...this.state, fetching: true });
      this.fetchData();
      return <LoadingSpinner />;
    } else if (this.state.products && !this.state.failed) {
      return (
        <div className="mt-5">
          <h1>Products</h1>
          <ProductsList products={this.state.products} />
        </div>
      );
    } else if (this.state.fetching) {
      return <LoadingSpinner />;
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
    const svc = this.context.services;
    this.setState({ ...this.state, fetching: true });
    svc.productService
      .fetchProducts()
      .then((products) => {
        this.setState({ ...this.state, products });
      })
      .catch((err) => {
        console.error("[products.jsx] - Failed to get products!");
        this.setState({ ...this.state, failed: true });
      })
      .finally(() => this.setState({ ...this.state, fetching: false }));
  };
}
