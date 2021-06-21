import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/icon/icon";
import { IconButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading";
import ProductRating from "../components/product-rating/product-rating";

export default class ProductDetail extends React.Component {
  static contextType = AppContext;

  productId;

  constructor(props) {
    super(props);
    this.state = {
      product: undefined,
      categories: undefined,
      fetching: false,
      failed: false,
      isFavorite: undefined,
      fetchingFav: false,
      favFetchedFor: undefined,
    };
    this.productId = props.match.params.id;
  }

  render() {
    if (this.context.state.user.token) {
      // Fetches favorite data if user updates
      const cur = this.context.state.user.id;
      const prev = this.state.favFetchedFor;

      if ((prev === undefined || cur !== prev) && !this.state.fetchingFav)
        this.fetchIsFav();
    }

    if (!this.state.product && !this.state.fetching && !this.state.failed) {
      this.setState({ ...this.state, fetching: true });
      this.fetchData();
      return <LoadingSpinner />;
    } else if (this.state.fetching) {
      return <LoadingSpinner />;
    } else if (this.state.product && !this.state.failed) {
      return this.renderProductDetail();
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

    const isFav = this.state.isFavorite;
    const noFav = isFav === undefined;
    return (
      <IconButton
        key={isFav ? "btn-favorited" : "btn-not-favorited"}
        dataIcon={isFav ? "fa:heart" : "fa-regular:heart"}
        classes={isFav ? "btn-primary" : "btn-dark-outline text-dark"}
        text={favCount}
        click={() => this.toggleFavorite(product)}
        disabled={noFav}
      />
    );
  };

  toggleFavorite = (product) => {
    const isFav = this.state.isFavorite;
    const svc = this.context.services.favoriteService;
    const userId = this.context.state.user.id;
    this.setState({ ...this.state, isFavorite: undefined });
    const promise = isFav
      ? svc.unsetFavorite(userId, product.id)
      : svc.setFavorite(userId, product.id);
    promise
      .then((r) => {
        product.favoriteCount += isFav ? -1 : +1;
        this.setState({ ...this.state, isFavorite: !isFav });
      })
      .catch((e) => {
        this.context.services.uiService.iconModal(
          `Error ${e.response?.status || ""}`,
          e.response?.statusText || e.message,
          "error"
        );
        this.setState({ ...this.state, isFavorite: isFav });
      });
  };

  fetchData = () => {
    const svc = this.context.services;
    this.setState({ ...this.state, fetching: true });
    svc.productService
      .fetchProduct(this.productId)
      .then((res) => {
        this.setState({ ...this.state, product: res.data });
        svc.categoryService
          .fetchParentsOf(res.data.category.id)
          .then((categories) => {
            this.setState({ ...this.state, categories });
          })
          .catch((err) => {
            svc.uiService.iconModal(
              "Error",
              "Failed to fetch categories of product!",
              "error"
            );
            this.setState({ ...this.state, failed: true });
          });
        if (this.context.state.user.token) {
        }
      })
      .catch((err) => {
        svc.uiService.iconModal("Error", "Failed to fetch products!", "error");
        this.setState({ ...this.state, failed: true });
      })
      .finally(() => this.setState({ ...this.state, fetching: false }));
  };

  fetchIsFav = () => {
    const curUserId = this.context.state.user.id;
    this.setState({ ...this.state, isFavorite: undefined, fetchingFav: true });
    this.context.services.favoriteService
      .isProductFavoriteOfUser(this.productId, curUserId)
      .then((res) => {
        if (res.data?.data.length > 0)
          this.setState({
            ...this.state,
            isFavorite: true,
          });
        else throw new Error();
      })
      .catch((err) => {
        this.setState({ ...this.state, isFavorite: false });
      })
      .finally(() =>
        this.setState({
          ...this.state,
          fetchingFav: false,
          favFetchedFor: curUserId,
        })
      );
  };
}