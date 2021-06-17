import { useState } from "react";
import { Link } from "react-router-dom";
import Criteria from "../../models/criteria";
import { productsUrl } from "../../routes";
import { ProductCard } from "../card/card";
import LoadingSpinner from "../loading/loading";

const initialState = {
  search: undefined,
  orderBy: undefined,
  orderDir: "ASC",
};

export default function ProductsList(props) {
  let prods;
  const [state, setState] = useState(initialState);
  const products = props.products;
  const filterDiv = props.onFilter ? (
    <form
      className="col-12 row align-items-center"
      onSubmit={(e) => e.preventDefault()}>
      <div className="form-group ml-auto mr-1">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={(e) => setState({ ...state, search: e.target.value })}
        />
      </div>
      <div className="form-group mx-1">
        <select
          className="form-control"
          onChange={(e) => setState({ ...state, orderBy: e.target.value })}>
          <option value={undefined} selected disabled>
            Sort by...
          </option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
        </select>
      </div>
      <div className="form-group mx-1">
        <button
          className={`btn btn-sm m-0 ${
            state.orderDir === "ASC" ? "btn-primary" : "btn-light"
          }`}
          disabled={state.orderDir === "ASC"}
          onClick={(e) => setState({ ...state, orderDir: "ASC" })}>
          Asc
        </button>
        <button
          className={`btn btn-sm m-0 ${
            state.orderDir === "DESC" ? "btn-primary" : "btn-light"
          }`}
          disabled={state.orderDir === "DESC"}
          onClick={(e) => setState({ ...state, orderDir: "DESC" })}>
          Desc
        </button>
      </div>
      <div className="form-group">
        <button
          className="btn btn-primary"
          onClick={() => onFilter(state, props.onFilter)}>
          Filter
        </button>
      </div>
    </form>
  ) : (
    <></>
  );
  if (products.length > 0) {
    prods = products.map((p, i) => {
      return (
        <div key={`product-${i}`} className="col-md-4 col-sm-12">
          <ProductCard product={p} />
        </div>
      );
    });
  } else {
    return (
      <>
        {filterDiv}
        <div className="col-md-12 text-center mt-5">
          <p className="font-weight-bold text-muted">
            No products found...{" "}
            {state !== initialState ? "Try changing the filters!" : ""}
          </p>
          {state !== initialState ? (
            <button
              className="btn btn-dark mt-2"
              onClick={() => {
                setState(initialState);
                props.onFilter();
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

const onFilter = (state, onFilter) => {
  const Product = require("../../models/product/product");
  const criteria = new Criteria(Product);
  if (state.search) {
    criteria.addFilter("title", state.search);
  }
  if (state.orderBy) {
    criteria.setOrderBy(state.orderBy);
    criteria.setOrderDir(state.orderDir);
  }
  onFilter(criteria);
};
