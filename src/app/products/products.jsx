import { useState } from "react";
import { ProductCard } from "../components/card/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import ProductService from "../services/product-service";

export default function Products() {
  let [products, setProducts] = useState([]);
  new ProductService().fetchProducts().then((p) => {
    setProducts(p);
  });

  let prods;
  if (products.length > 0) {
    prods = products.map((p) => {
      return (
        <div className="col-md-4 col-sm-12">
          <ProductCard product={p} />
        </div>
      );
    });
  } else {
    prods = (
      <div className="col-12 d-flex mt-5">
        <FontAwesomeIcon
          className="mx-auto icon-lg spin"
          icon={faCircleNotch}
        />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1>Products</h1>
      <div id="products-list" className="row">
        {prods}
      </div>
    </div>
  );
}
