import { React } from "react";
import Icon from "../icon/icon";
import { categoriesUrl, productsUrl, homeUrl } from "../../routes";
import { Link, useLocation } from "react-router-dom";
import Popup from "../popup/popup";

export default function Navbar() {
  let loc = useLocation().pathname;
  return (
    <nav className="shadow">
      <ul className="d-none d-md-flex nav container">
        <li className="nav-logo m-1">
          <Link to="/" className="anchor-color-remover">
            <Icon dataIcon="cib:stripe-s" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${loc === homeUrl ? "active" : ""}`}
            to={homeUrl}>
            <Icon dataIcon="ant-design:home-filled" /> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${loc === productsUrl ? "active" : ""}`}
            to={productsUrl}>
            <Icon dataIcon="ant-design:shopping-filled" /> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${loc === categoriesUrl ? "active" : ""}`}
            to={categoriesUrl}>
            <Icon dataIcon="bx:bxs-category-alt" /> Categories
          </Link>
        </li>
        <li className="nav-item ml-auto">
          <Popup
            trigger={renderNavCartButton()}
            content={renderNavCartContent()}
            parent="nav"
          />
        </li>
        <li className="nav-item">
          <Popup
            trigger={renderNavAccountButton()}
            content={renderNavAccountContent()}
            parent="nav"
          />
        </li>
      </ul>
      <ul className="d-flex d-sm-flex d-md-none nav container">
        <li className="nav-logo m-1">
          <Link to="/" className="anchor-color-remover">
            <Icon dataIcon="cib:stripe-s" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const renderNavCartButton = () => (
  <div className={`nav-link text-clickable`}>
    <Icon dataIcon="mi-shopping-cart" />
  </div>
);

const renderNavCartContent = () => (
  <div>
    <p className="text-center font-weight-bold">CART</p>
  </div>
);

const renderNavAccountButton = () => (
  <div className={`nav-link text-clickable`}>
    <Icon dataIcon="mi-user" />
  </div>
);

const renderNavAccountContent = () => (
  <div class="d-flex flex-column">
    <p className="text-center font-weight-bold">ACCOUNT</p>
      <div className="form-group">
        <label>Username</label>
        <input className="form-control" type="text" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input className="form-control" type="password" />
        <a href="#" class="ml-auto text-sm">Forgot password?</a>
      </div>
      <button class="btn btn-primary">Login</button>
      <button class="btn btn-primary-outline">Create an account</button>
  </div>
);
