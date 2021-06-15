import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/icon/icon";
import { IconButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading";
import ProductsList from "../components/products-list/products-list";
import ProductRating from "../components/product-rating/product-rating";

export default class Products extends React.Component {
  static contextType = AppContext;

  productId;

  constructor(props) {
    super(props);
    this.state = {
      products: undefined,
      product: undefined,
      categories: undefined,
      isFavorite: undefined,
      fetching: false,
      failed: false,
    };

    this.productId = props.match.params.id;
  }

  render() {
    if (
      !this.state.products &&
      !this.state.product &&
      !this.state.fetching &&
      !this.state.failed
    ) {
      this.setState({ ...this.state, fetching: true });
      this.fetchData();
      return <LoadingSpinner />;
    } else if (this.state.fetching) {
      return <LoadingSpinner />;
    } else if (this.state.products && !this.state.failed) {
      return (
        <div className="mt-5">
          <h1>Products</h1>
          <ProductsList products={this.state.products} />
        </div>
      );
    } else if (this.state.product && !this.state.failed) {
      return this.renderProductDetail();
    } else {
      return this.failedTemplate();
    }
  }

  renderProductDetail = () => {
    let component;
    const product = this.state.product;
    let categoryList = this.state.categories?.map((c) => {
      return (
        <span key={c.id}>
          <Link
            to={categoriesUrl + "/" + c.name}
            className="badge bg-primary-subtle">
            {c.name}
          </Link>
          <Icon dataIcon="akar-icons:chevron-right" />
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
              <h3>
                <b>{product.title}</b>
              </h3>
              <p className="text-muted">Code: {product.code}</p>
              <p>
                {categoryList}
                <span className="badge bg-primary shadow-sm m-1">
                  <Link
                    to={`/categories/${product.category.name}`}
                    className="text-light">
                    {product.category.name.toUpperCase()}
                  </Link>
                </span>
              </p>
              <ProductRating rating={product.rating} />
              <hr />
              <p>{product.description}</p>
              <div className="row">
                <div className="col-md-6">
                  <b>
                    <Icon dataIcon="bi-star-fill" /> Highlights
                  </b>
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
      <div className="bg-white rounded my-5 shadow">
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
              click={() => this.context.state.cart.addProduct(p)}
            />
            {this.renderFavoriteButton(p)}
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
            {this.renderFavoriteButton(p)}
          </div>
        </div>
      );
    }

    return component;
  }

  renderFavoriteButton = (product) => {
    const favCount = product.favoriteCount === 0 ? "0" : product.favoriteCount;
    if (!this.context.state.user.token) {
      return (
        <div className="bg-white-subtle text-dark p-3 badge-pill">
          <Icon dataIcon="fa-regular:heart" /> {favCount}
        </div>
      );
    }
    if (this.state.isFavorite !== undefined)
      return this.state.isFavorite ? (
        <IconButton
          dataIcon="fa:heart"
          classes="btn-primary"
          text={favCount}
          click={() => this.unsetFavorite(product)}
        />
      ) : (
        <IconButton
          dataIcon="fa-regular:heart"
          classes="btn-dark-outline text-dark"
          text={favCount}
          click={() => this.setFavorite(product)}
        />
      );
    return <LoadingSpinner size="md" inline="true" />;
  };

  setFavorite = (product) => {
    this.setState({ ...this.state, isFavorite: undefined });
    this.context.services.favoriteService
      .setFavorite(this.context.state.user.id, product.id)
      .then((r) => {
        product.favoriteCount++;
        this.setState({ ...this.state, isFavorite: true });
      })
      .catch((e) => {
        this.context.services.uiService.iconModal(
          `Error ${e.response?.status || ""}`,
          e.response?.statusText || e,
          "error"
        );
        this.setState({ ...this.state, isFavorite: false });
      });
  };

  unsetFavorite = (product) => {
    this.setState({ ...this.state, isFavorite: undefined });
    this.context.services.favoriteService
      .unsetFavorite(this.context.state.user.id, product.id)
      .then((r) => {
        product.favoriteCount--;
        this.setState({ ...this.state, isFavorite: false });
      })
      .catch((e) => {
        this.context.services.uiService.iconModal(
          `Error ${e.response?.status || ""}`,
          e.response?.statusText || e,
          "error"
        );
        this.setState({ ...this.state, isFavorite: true });
      });
  };

  fetchData = () => {
    const svc = this.context.services;
    this.setState({ ...this.state, fetching: true });
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
            .catch((err) => {
              console.error("[products.jsx] - Failed to get category parents!");
              this.setState({ ...this.state, failed: true });
            });
          if (this.context.state.user.token) {
            svc.favoriteService
              .isProductFavoriteOfUser(
                this.productId,
                this.context.state.user.id
              )
              .then((res) => {
                if (res.data?.length > 0)
                  this.setState({ ...this.state, isFavorite: true });
                else throw new Error();
              })
              .catch((err) => {
                this.setState({ ...this.state, isFavorite: false });
              });
          }
        })
        .catch((err) => {
          console.error("[products.jsx] - Failed to get product!");
          this.setState({ ...this.state, failed: true });
        })
        .finally(() => this.setState({ ...this.state, fetching: false }));
    } else {
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
    }
  };
}
