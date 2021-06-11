import { Link } from "react-router-dom";
import { productsUrl } from "../../routes";
import { ProductCard } from "../card/card";
import LoadingSpinner from "../loading/loading";

export default function ProductsList(props) {
  let prods;
  const products = props.products;
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
      <div className="col-md-12 text-center mt-5">
        <p className="font-weight-bold text-muted">No products found</p>
        <Link to={productsUrl}>
          <button className="btn btn-dark mt-2">View All Products</button>
        </Link>
      </div>
    );
  }

  return (
    <div id="products-list" className="row">
      {prods ? prods : <LoadingSpinner />}
    </div>
  );
}
