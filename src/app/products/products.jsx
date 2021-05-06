import { useState } from "react";
import { ProductCard } from "../components/card/card";
import ProductService from "../services/product-service";
import Icon from "../components/icon/icon";

export default function Products() {
  let [products, setProducts] = useState([]);
  new ProductService().fetchProducts().then((p) => {
    setProducts(p);
  });

  let prods;
  if (products.length > 0) {
    prods = products.map((p, i) => {
      return (
        <div key={`product-${i}`} className="col-md-4 col-sm-12">
          <ProductCard product={p} />
        </div>
      );
    });
  } else {
    prods = (
      <div key="loadingIcon" className="col-12 d-flex mt-5">
        <Icon
          classes="mx-auto icon-lg spin"
          dataIcon="fa:spinner"
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
