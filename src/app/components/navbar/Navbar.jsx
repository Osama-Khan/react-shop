import { React } from "react";
import Icon from "../icon/icon";
import { categoriesUrl, productsUrl, homeUrl } from "../../routes";
import { Link, useLocation } from "react-router-dom";
import Popup from "../popup/popup";
import State from "../../state/state";
import NavbarCartCard from "./navbar-cart-card/navbar-cart-card";

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
            content={<NavbarCartCard/>}
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

const renderNavAccountButton = () => (
  <div className={`nav-link text-clickable`}>
    <Icon dataIcon="mi-user" />
  </div>
);

const renderNavAccountContent = () => (
  <div className="d-flex flex-column">
    <p className="text-center font-weight-bold">ACCOUNT</p>
    <div className="form-group">
      <label>Username</label>
      <input className="form-control" type="text" />
    </div>
    <div className="form-group">
      <label>Password</label>
      <input className="form-control" type="password" />
      <label className="ml-auto text-sm text-clickable">Forgot password?</label>
    </div>
    <button className="btn btn-primary">Login</button>
    <button className="btn btn-primary-outline">Create an account</button>
  </div>
);
