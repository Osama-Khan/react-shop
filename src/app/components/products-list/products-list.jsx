import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/app.provider";
import Criteria from "../../models/criteria";
import { productsUrl } from "../../routes";
import { ProductCard } from "../card/card";
import Icon from "../icon/icon";
import LoadingSpinner from "../loading/loading";

const initialState = {
  search: "",
  orderBy: "",
  orderDir: "ASC",
  products: undefined,
  fetching: false,
  failed: false,
};

export default function ProductsList({ requestMethod, showFilters = true }) {
  let prods;
  const location = useLocation();
  const [state, setState] = useState(initialState);
  const context = useContext(AppContext);

  if (!state.fetching && !state.products && !state.failed) {
    doFetch(state, setState, requestMethod, context);
  }

  const filterDiv = showFilters ? (
    <form
      className="col-12 row align-items-center m-0"
      onSubmit={(e) => e.preventDefault()}>
      <div className="form-group ml-auto mr-1">
        <input
          type="text"
          value={state.search}
          className="form-control"
          placeholder="Search..."
          onChange={(e) => setState({ ...state, search: e.target.value })}
        />
      </div>
      <div className="form-group mx-1">
        <select
          className="form-control"
          value={state.orderBy}
          onChange={(e) => setState({ ...state, orderBy: e.target.value })}>
          <option value="" disabled>
            Sort by...
          </option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
        </select>
      </div>
      {state.orderBy ? (
        <div className="form-group mx-1">
          <button
            className={`btn m-0 ${
              state.orderDir === "ASC" ? "btn-primary" : "btn-light"
            }`}
            disabled={state.orderDir === "ASC"}
            onClick={(e) => setState({ ...state, orderDir: "ASC" })}>
            <Icon
              key="filter-sort-icon-asc"
              dataIcon="mdi-sort-alphabetical-ascending"
            />
          </button>
          <button
            className={`btn m-0 ${
              state.orderDir === "DESC" ? "btn-primary" : "btn-light"
            }`}
            disabled={state.orderDir === "DESC"}
            onClick={(e) => setState({ ...state, orderDir: "DESC" })}>
            <Icon
              key="filter-sort-icon-desc"
              dataIcon="mdi-sort-alphabetical-descending"
            />
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="form-group">
        {
          <button
            className="btn btn-primary"
            onClick={() => doFetch(state, setState, requestMethod, context)}>
            Filter
          </button>
        }
      </div>
    </form>
  ) : (
    <></>
  );

  if (!state.products) {
    return <LoadingSpinner />;
  } else if (state.products.length > 0) {
    prods = state.products.map((p, i) => {
      return (
        <div key={`product-${i}`} className="col-md-4 col-sm-12">
          <ProductCard product={p} />
        </div>
      );
    });
  } else if (state.failed) {
    prods = failedTemplate();
  } else {
    return (
      <>
        {location === productsUrl ? filterDiv : <></>}
        <div className="col-md-12 text-center mt-5">
          <p className="font-weight-bold text-muted">
            No products found...{" "}
            {location === productsUrl ? "Try changing the filters!" : ""}
          </p>
          {location === productsUrl ? (
            <button
              className="btn btn-dark mt-2"
              onClick={() => {
                setState({ ...initialState, fetching: true });
                doFetch(initialState, setState, requestMethod, context);
              }}>
              Reset Filters
            </button>
          ) : (
            <Link to={productsUrl}>
              <button className="btn btn-dark mt-2">View All Products</button>
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {filterDiv}
      <div id="products-list" className="row">
        {prods ? prods : <LoadingSpinner />}
      </div>
    </>
  );
}

const failedTemplate = () => {
  return (
    <div className="mt-5 row container d-flex justify-content-center">
      <div className="alert alert-danger">
        <Icon dataIcon="fa:times-circle" />
        <span className="ml-2">Failed to load</span>
      </div>
    </div>
  );
};

const generateCriteria = (state) => {
  const Product = require("../../models/product/product");
  const criteria = new Criteria(Product);
  if (state?.search) {
    criteria.addFilter("title", state.search);
  }
  if (state?.orderBy) {
    criteria.setOrderBy(state.orderBy);
    criteria.setOrderDir(state.orderDir);
  }
  return criteria;
};

const doFetch = (state, setState, method, context) => {
  setState({ fetching: true });
  const criteria = generateCriteria(state);
  const promise = method
    ? method(criteria)
    : context.services.productService.fetchProducts(criteria);
  promise.then((res) => {
    setState({
      ...state,
      products: res.data,
      fetching: false,
    });
  });
};
