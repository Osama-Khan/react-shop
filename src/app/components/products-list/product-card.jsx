import { useContext } from "react";
import { Link } from "react-router-dom";
import Icon from "../icon/icon";
import { productsUrl } from "../../routes";
import { IconButton } from "../button/Button";
import ProductRating from "../product-rating/product-rating";
import { AppContext } from "../../context/app.provider";
import PricePill from "../pills/price-pill";
import Pill from "../pills/pill";

export default function ProductCard({ product, classes = "" }) {
  const cardClasses = `card clickable m-1 p-3 row anchor-color-remover ${classes}`;
  const context = useContext(AppContext);

  return (
    <>
      <Link to={`${productsUrl}/${product.id}`} className={cardClasses}>
        <img
          src={product.img}
          classes="mx-auto"
          style={{ objectFit: "contain" }}
          alt=""
        />
        <b>{product.title}</b>
        <ProductRating key={`p-${product.id}-rating`} rating={product.rating} />
        <hr />
        <div className="d-flex">
          {product.favoriteCount !== undefined ? (
            <div className="p-3 badge-pill bg-white-subtle">
              <Icon dataIcon="fa:heart" /> {product.favoriteCount}
            </div>
          ) : (
            ""
          )}
          <div className="ml-auto">
            {product.stock > 0 ? (
              <PricePill price={product.price} />
            ) : (
              <Pill text="Out of Stock" color="red" />
            )}
          </div>
        </div>
      </Link>
      {product.stock > 0 ? (
        <IconButton
          classes="btn-primary-outline top-right mr-4 mt-3"
          iconClasses="icon-sm"
          dataIcon="bi-cart-plus"
          click={() => {
            context.state.cart.addProduct(product);
            context.setState({ ...context.state });
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}
