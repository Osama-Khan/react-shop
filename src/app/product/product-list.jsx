import React from "react";
import { AppContext } from "../context/app.provider";
import ProductsList from "../components/products-list/products-list";

export default class ProductList extends React.Component {
  static contextType = AppContext;

  render() {
    return (
      <div className="mt-5">
        <h1>Products</h1>
        <ProductsList />
      </div>
    );
  }
}
