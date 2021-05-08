import React from "react";
import { ProductCard } from "../components/card/card";
import ProductService from "../services/product-service.ts";
import Icon from "../components/icon/icon";
import { IconButton } from "../components/button/Button";

export default class Products extends React.Component {
  productId;

  constructor(props) {
    super(props);
    this.state = { products: [], product: undefined };

    this.productId = props.match.params.id;
  }

  render() {
    if (this.productId) {
      return this.renderProductDetail();
    }
    return this.renderProductsList();
  }

  componentDidMount() {
    if (this.productId) {
      new ProductService().fetchProduct(this.productId).then((product) => {
        this.setState({ product });
      });
    } else {
      new ProductService().fetchProducts().then((products) => {
        this.setState({ products });
      });
    }
  }

  renderProductDetail = () => {
    let component;
    const p = this.state.product;
    if (p) {
      const highlights = Object.keys(p.highlights).map((k) => (
        <li key={"highlight" + k}>{p.highlights[k]}</li>
      ));

      component = (
        <div className="row">
          <div className="col-md-4">
            <div className="my-3 text-center">
              <img src={p.img} className="m-auto" alt="Product" />
            </div>
          </div>
          <div className="col-md-8">
            <div className="m-3">
              <p>
                <b>{p.title}</b>
              </p>
              <p>Code: {p.code}</p>
              <p>Category: {p.category}</p>
              <br />
              <p>{p.description}</p>
              <div className="row">
                <div className="col-md-6">
                  <b>Highlights</b>
                  <ul>{highlights}</ul>
                </div>
                <div className="col-md-6">{this.renderPurchaseBox()}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-light rounded my-5 shadow">
        {component ? component : this.renderLoadingIcon()}
      </div>
    );
  };

  renderProductsList = () => {
    let prods;
    const products = this.state.products;
    if (products.length > 0) {
      prods = products.map((p, i) => {
        return (
          <div key={`product-${i}`} className="col-md-4 col-sm-12">
            <ProductCard product={p} />
          </div>
        );
      });
    }

    return (
      <div className="mt-5">
        <h1>Products</h1>
        <div id="products-list" className="row">
          {prods ? prods : this.renderLoadingIcon()}
        </div>
      </div>
    );
  };

  renderLoadingIcon() {
    return (
      <div key="loadingIcon" className="col-12 d-flex my-5 py-5">
        <Icon classes="mx-auto icon-lg spin" dataIcon="fa:spinner" />
      </div>
    );
  }

  renderPurchaseBox() {
    const p = this.state.product;
    let component;
    if (p.stock && p.stock > 0) {
      const stock =
        p.stock === "1" ? (
          <b className="p-3 badge-pill bg-yellow-subtle text-yellow">
            <Icon dataIcon="fluent-emoji-meh-24-filled" classes="icon-sm" />{" "}
            Last in stock
          </b>
        ) : (
          <b className="p-3 badge-pill bg-green-subtle text-green">
            <Icon dataIcon="fluent-emoji-laugh-24-filled" classes="icon-sm" />{" "}
            In stock
          </b>
        );
      component = (
        <div className="mt-3">
          <div className="text-right my-4">
            <b className="p-3 text-dark">Rs. {p.price}</b>
          </div>
          <div className="text-right my-4">{stock}</div>
          <div className="mt-3 d-flex">
            <IconButton
              dataIcon="fa:plus"
              text="Add to cart"
              classes="btn-green ml-auto"
            />
            <IconButton dataIcon="fa:heart" classes="btn-dark-outline" />
          </div>
        </div>
      );
    } else {
      component = (
        <div className="mt-3">
          <div className="text-right">
            <b className="p-3 badge-pill bg-red-subtle text-danger">
              <Icon dataIcon="fluent-emoji-sad-24-filled" classes="icon-sm" />{" "}
              Out of Stock
            </b>
          </div>
          <div className="mt-3 d-flex">
            <IconButton
              dataIcon="fa:eye"
              text="watch"
              classes="btn-dark-outline ml-auto"
            />
            <IconButton dataIcon="fa:heart" classes="btn-dark-outline" />
          </div>
        </div>
      );
    }

    return component;
  }
}
