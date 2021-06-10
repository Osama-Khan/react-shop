import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/icon/icon";
import { IconButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading";
import ProductsList from "../components/products-list/products-list";

export default class Products extends React.Component {
  static contextType = AppContext;

  productId;

  constructor(props) {
    super(props);
    this.state = { products: [], product: undefined, categories: undefined };

    this.productId = props.match.params.id;
  }

  render() {
    if (this.productId) {
      return this.renderProductDetail();
    }
    return (
      <div className="mt-5">
        <h1>Products</h1>
        <ProductsList products={this.state.products} />
      </div>
    );
  }

  componentDidMount() {
    const svc = this.context.services;
    if (this.productId) {
      svc.productService
        .fetchProduct(this.productId)
        .then((product) => {
          this.setState({ ...this.state, product });
          svc.categoryService
            .fetchParentsOf(product.category.id)
            .then((categories) => {
              this.setState({ ...this.state, categories });
            })
            .catch((err) =>
              console.error("[products.jsx] - Failed to get category parents!")
            );
        })
        .catch((err) =>
          console.error("[products.jsx] - Failed to get product!")
        );
    } else {
      svc.productService
        .fetchProducts()
        .then((products) => {
          this.setState({ ...this.state, products });
        })
        .catch((err) =>
          console.error("[products.jsx] - Failed to get products!")
        );
    }
  }

  renderProductDetail = () => {
    let component;
    const product = this.state.product;
    let categoryList = this.state.categories?.map((c, i) => {
      return (
        <span key={c.id}>
          <Link
            to={categoriesUrl + "/" + c.name}
            className="badge bg-primary-subtle">
            {c.name}
          </Link>
          &gt;
        </span>
      );
    });
    if (categoryList) categoryList = categoryList.reverse();
    if (product) {
      const highlights = Object.keys(product.highlights).map((k) => (
        <li key={"highlight" + k}>{product.highlights[k].highlight}</li>
      ));

      component = (
        <div className="row">
          <div className="col-md-4">
            <div className="my-3 text-center">
              <img src={product.img} className="m-auto" alt="Product" />
            </div>
          </div>
          <div className="col-md-8">
            <div className="m-3">
              <p>
                <b>{product.title}</b>
              </p>
              <p>Code: {product.code}</p>
              <p>
                {categoryList}
                <Link
                  to={`/categories/${product.category.name}`}
                  className="badge bg-primary shadow text-white m-1">
                  {product.category.name.toUpperCase()}
                </Link>
              </p>
              <br />
              <p>{product.description}</p>
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
        {component ? component : <LoadingSpinner />}
      </div>
    );
  };

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
              dataIcon="fa:plus"
              text="Add to cart"
              classes="btn-green ml-auto"
              disabled={true}
            />
            <IconButton dataIcon="fa:heart" classes="btn-dark-outline" />
          </div>
        </div>
      );
    }

    return component;
  }
}
