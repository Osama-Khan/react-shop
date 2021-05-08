import { Link } from "react-router-dom";
import Icon from "../icon/icon";
import { productsUrl } from "../../routes";
import { IconButton } from "../button/Button";
import ProductRating from "../product-rating/product-rating";

export function Card(props) {
  if (props.image) {
    return ImageCard(props);
  } else if (props.icon) {
    return IconCard(props);
  } else {
    return TextCard(props);
  }
}

export function ProductCard({ product, classes = "" }) {
  const cardClasses = `card clickable m-1 p-3 row anchor-color-remover ${classes}`;

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
        <ProductRating rating={product.rating} classes="text-warning"/>
        <div className="text-right my-3">
        <span className="p-3 badge-pill bg-green-subtle text-green">
          Rs. <b>{product.price}</b>
        </span>
        </div>
      </Link>
      <IconButton
        classes="btn-primary-outline top-right mr-4 mt-3"
        iconClasses="icon-sm"
        color="primary"
        dataIcon="mi-shopping-cart-add"
      />
    </>
  );
}

function IconCard({ text, icon, click, color="", classes = "", iconClasses = "", linkTo }) {
  const cardClasses = `card ${color} m-1 py-3 row ${
    click ? "clickable" : ""
  } ${classes}`;
  const textEl = text ? (
    <p className="text-center m-auto col-12">{text}</p>
  ) : null;
  if (linkTo) {
    return (
      <Link to={linkTo} className={cardClasses}>
        <Icon dataIcon={icon} classes={`mx-auto my-2 ${iconClasses}`} />
        {textEl}
      </Link>
    );
  } else {
    return (
      <div onClick={click ? click : () => {}} className={cardClasses}>
        <Icon dataIcon={icon} classes={`mx-auto my-2 ${iconClasses}`} />
        {textEl}
      </div>
    );
  }
}

function ImageCard({ text, image, click, color="", classes="", linkTo }) {
  const cardClasses = `card ${color} m-1 pb-3 row ${
    click ? "clickable" : ""
  } ${classes}`;
  const textEl = text ? (
    <p className="text-center m-auto col-12">{text}</p>
  ) : null;
  if (linkTo) {
    return (
      <Link to={linkTo} className={cardClasses}>
        <img src={image} classes="mx-auto" alt="" />
        {textEl}
      </Link>
    );
  } else {
    return (
      <div onClick={click} className={cardClasses}>
        <img src={image} classes="mx-auto" alt="" />
        {textEl}
      </div>
    );
  }
}

function TextCard({ text, image, click, color="", classes="" }) {
  const cardClasses = `card ${color} m-1 py-3 row ${
    click ? "clickable" : ""
  } ${classes}`;
  const textEl = text ? (
    <p className="text-center m-auto col-12">{text}</p>
  ) : null;
  return (
    <div onClick={click} className={cardClasses}>
      {textEl}
    </div>
  );
}
