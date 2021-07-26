import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icon/icon';
import { IconButton } from '../components/button/Button';
import { AppContext } from '../context/app.provider';
import { categoriesUrl } from '../routes';
import LoadingSpinner from '../components/loading/loading-spinner';
import ProductRating from '../components/product-rating/product-rating';
import CartProduct from '../models/product/cart-product';
import LoadingFailed from '../components/loading/loading-failed';
import PricePill from '../components/pills/price-pill';
import ProductRatingDetail from './product-detail/product-rating-detail';
import RatingSummary from './product-detail/rating-summary';
import OwnRating from './product-detail/own-rating';
import ImageGallery from './product-detail/image-gallery';

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
      return <this.ProductDetail />;
    } else {
      return <LoadingFailed />;
    }
  }

  ProductDetail = () => {
    const product = this.state.product;
    const s = product.ratings?.map((r) => r.stars);
    const stars =
      s && s.length > 0
        ? s.length === 1
          ? s[0]
          : (s.reduce((x, y) => x + y) / s.length).toFixed(1)
        : undefined;
    let categoryList = this.state.categories?.map((c) => {
      return (
        <span key={c.id}>
          <Link
            to={categoriesUrl + '/' + c.name}
            className="badge bg-primary-subtle">
            {c.name}
          </Link>
          <Icon dataIcon="akar-icons:chevron-right" />
        </span>
      );
    });
    if (categoryList) categoryList = categoryList.reverse();

    let detail;
    if (product) {
      const highlights = Object.keys(product.highlights).map((k) => (
        <li key={'highlight' + k}>{product.highlights[k].highlight}</li>
      ));

      detail = (
        <div>
          <div className="row mx-0">
            <div className="col-md-4">
              <ImageGallery images={product.images} />
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
                <ProductRating rating={stars} />
                <hr />
                <p>{product.description}</p>
                <div className="row">
                  <div className="col-md-6">
                    <b>
                      <Icon dataIcon="vaadin-flash" /> Highlights
                    </b>
                    <ul>{highlights}</ul>
                  </div>
                  <div className="col-md-6">
                    <this.PurchaseBox />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row m-3">
            <h3 className="col-12 font-weight-bold">
              <Icon dataIcon="bi-star-fill" />
              &nbsp;Reviews
            </h3>
            <div className="col-md-4 mb-2">
              <RatingSummary ratings={product.ratings} />
            </div>
            <div className="col-md-8">
              <OwnRating product={product} />
              <ProductRatingDetail product={product} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white rounded my-5 shadow">
        {detail ? detail : <LoadingSpinner />}
      </div>
    );
  };

  PurchaseBox = () => {
    const p = this.state.product;
    return (
      <div className="mt-3">
        <div className="text-right">
          <this.Stock stock={p.stock} />
        </div>
        {p.stock > 0 ? (
          <div className="mt-3 d-flex">
            <PricePill className="ml-auto" price={p.price} />
          </div>
        ) : (
          <></>
        )}
        <div className="mt-3 d-flex">
          <this.CartButton product={p} />
          <this.FavoriteButton product={p} />
        </div>
      </div>
    );
  };

  Stock = ({ stock }) =>
    stock > 0 ? (
      stock === 1 ? (
        <b className="p-3 badge-pill bg-yellow-subtle text-yellow">
          <Icon
            dataIcon="fluent-emoji-meh-24-filled"
            classes="icon-sm"
            inline={false}
          />{' '}
          Last in stock
        </b>
      ) : (
        <b className="p-3 badge-pill bg-green-subtle text-green">
          <Icon
            dataIcon="fluent-emoji-laugh-24-filled"
            classes="icon-sm"
            inline={false}
          />{' '}
          In stock
        </b>
      )
    ) : (
      <b className="p-3 badge-pill bg-red-subtle text-danger">
        <Icon
          dataIcon="fluent-emoji-sad-24-filled"
          classes="icon-sm"
          inline={false}
        />{' '}
        Out of Stock
      </b>
    );

  CartButton = ({ product }) => {
    if (product.stock === 0) {
      return (
        <IconButton
          dataIcon="fa:plus"
          text="Add to cart"
          classes="btn-green ml-auto"
          disabled={true}
        />
      );
    }
    const errorToast = this.context.services.uiService.errorToast;
    return this.context.state.cart.getProduct(product.id) ? (
      <div className="d-flex flex-row ml-auto my-auto col-lg-6 mr-1">
        <input
          type="number"
          className="form-control dark"
          value={this.context.state.cart.getProduct(product.id).quantity}
          onChange={(e) => {
            const val = e.target.value;
            const invalid = CartProduct.isQuantityInvalid(val, product.stock);
            if (invalid) {
              errorToast(invalid);
              return;
            }
            if (this.context.state.cart.setProductQuantity(product.id, val)) {
              this.context.setState({
                ...this.context.state,
                cart: this.context.state.cart,
              });
            }
          }}
        />
        <span
          title="Remove from cart"
          className="my-auto icon-sm mx-1 text-clickable"
          onClick={() => {
            this.context.state.cart.removeProduct(product.id);
            this.context.setState({ ...this.context.state });
          }}>
          <Icon dataIcon="bi-cart-dash" />
        </span>
      </div>
    ) : (
      <IconButton
        dataIcon="fa:plus"
        text="Add to cart"
        classes="btn-green ml-auto my-auto"
        click={() => {
          this.context.state.cart.addProduct(product);
          this.context.setState({ ...this.context.state });
        }}
      />
    );
  };

  FavoriteButton = ({ product }) => {
    const favCount = product.favoriteCount === 0 ? '0' : product.favoriteCount;
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
        key={isFav ? 'btn-favorited' : 'btn-not-favorited'}
        dataIcon={isFav ? 'fa:heart' : 'fa-regular:heart'}
        classes={isFav ? 'btn-primary' : 'btn-dark-outline text-dark'}
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
          `Error ${e.response?.status || ''}`,
          e.response?.statusText || e.message,
          'error',
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
          .then((res) => {
            const categories = res.data;
            this.setState({ ...this.state, categories });
          })
          .catch((err) => {
            svc.uiService.iconModal(
              'Error',
              'Failed to fetch categories of product!',
              'error',
            );
            this.setState({ ...this.state, failed: true });
          });
        if (this.context.state.user.token) {
        }
      })
      .catch((err) => {
        svc.uiService.iconModal('Error', 'Failed to fetch products!', 'error');
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
        }),
      );
  };
}
