import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/app.provider";
import Criteria from "../../models/criteria";
import { productsUrl } from "../../routes";
import { ProductCard } from "../card/card";
import LoadingSpinner from "../loading/loading-spinner";
import FilterForm from "./filter-form";
import Pagination from "../pagination/pagination";
import LoadingFailed from "../loading/loading-failed";

const initialState = {
  search: "",
  limit: "",
  orderBy: "",
  orderDir: "ASC",
  products: undefined,
  meta: undefined,
  fetching: false,
  failed: false,
};

export default function ProductsList({ requestMethod, showFilters = true }) {
  let prods;
  const [state, setState] = useState(initialState);
  const context = useContext(AppContext);

  const filterDiv = showFilters ? (
    <FilterForm
      state={state}
      setState={setState}
      onFilter={() => doFetch(state, setState, requestMethod, context)}
    />
  ) : (
    <></>
  );

  const pagination = state.meta ? (
    <div className="mt-3 d-flex">
      <div className="ml-auto">
        <Pagination
          currentPage={state.meta.currentPage}
          totalPages={state.meta.totalPages}
          gotoPage={(p) => {
            doFetch({ ...state, page: p }, setState, requestMethod, context);
          }}
        />
      </div>
    </div>
  ) : (
    <></>
  );

  if (state.fetching) {
    return <LoadingSpinner />;
  } else if (!state.fetching && !state.products && !state.failed) {
    doFetch(state, setState, requestMethod, context);
  } else if (state.products?.length > 0) {
    prods = state.products.map((p, i) => {
      return (
        <div key={`product-${i}`} className="col-md-4 col-sm-12">
          <ProductCard product={p} />
        </div>
      );
    });
  } else if (state.failed) {
    prods = <LoadingFailed />;
  } else {
    return (
      <>
        {showFilters ? filterDiv : <></>}
        <div className="col-md-12 text-center mt-5">
          <p className="font-weight-bold text-muted">
            No products found...{" "}
            {showFilters ? "Try changing the filters!" : ""}
          </p>
          {showFilters ? (
            <button
              className="btn btn-dark mt-2"
              onClick={() => {
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
      {pagination}
    </>
  );
}

const generateCriteria = (state) => {
  const Product = require("../../models/product/product");
  const criteria = new Criteria(Product);
  if (state?.search) {
    criteria.addFilter("title", state.search);
  }
  if (state?.page) {
    criteria.setPage(state.page);
  }
  if (state?.limit) {
    criteria.setLimit(state.limit);
  }
  if (state?.orderBy) {
    criteria.setOrderBy(state.orderBy);
    criteria.setOrderDir(state.orderDir);
  }
  return criteria;
};

const doFetch = (state, setState, method, context) => {
  setState({ ...state, fetching: true });
  const criteria = generateCriteria(state);
  const promise = method
    ? method(criteria)
    : context.services.productService.fetchProducts(criteria);
  promise
    .then((res) => {
      setState({
        ...state,
        products: res.data.data,
        meta: res.data.meta,
        fetching: false,
      });
    })
    .catch((e) => setState({ ...state, failed: true, fetching: false }));
};
