import React from "react";
import Icon from "../icon/icon";
import { categoriesUrl, productsUrl, homeUrl } from "../../routes";
import { Link, useLocation } from "react-router-dom";

let cartOpen = false;
let userOpen = false;

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
            to={homeUrl}
          >
            <Icon dataIcon="ant-design:home-filled" /> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${loc === productsUrl ? "active" : ""}`}
            to={productsUrl}
          >
            <Icon dataIcon="ant-design:shopping-filled" /> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${loc === categoriesUrl ? "active" : ""}`}
            to={categoriesUrl}
          >
            <Icon dataIcon="bx:bxs-category-alt" /> Categories
          </Link>
        </li>
        <li className="nav-item ml-auto">
          <div
            className={`nav-link`}
            onClick={cartToggle}
          >
            <Icon dataIcon="mi-shopping-cart" />
          </div>
        </li>
        <li className="nav-item">
          <div
            className={`nav-link`}
            onClick={userToggle}
          >
            <Icon dataIcon="mi-user" />
          </div>
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

function cartToggle() {
  if (cartOpen) {
    console.log("Cart Closed"); // TBI
  } else {
    console.log("Cart Opened"); // TBI
  }
  cartOpen = !cartOpen;
}

function userToggle() {
  if (userOpen) {
    console.log("User Closed"); // TBI
  } else {
    console.log("User Opened"); // TBI
  }
  userOpen = !userOpen;
}
