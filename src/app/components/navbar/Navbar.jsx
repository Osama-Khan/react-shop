import { React, useContext } from "react";
import Icon from "../icon/icon";
import {
  categoriesUrl,
  productsUrl,
  homeUrl,
  userUrl,
  registerUrl,
  orderUrl,
} from "../../routes";
import { Link, useLocation } from "react-router-dom";
import Popup from "../popup/popup";
import NavbarCartCard from "./navbar-cart-card/navbar-cart-card";
import { PrimaryButton } from "../button/Button";
import { AppContext } from "../../context/app.provider";

export default function Navbar() {
  const context = useContext(AppContext);
  let loc = useLocation().pathname;
  const renderNavCartButton = () => (
    <div className={`nav-link text-clickable`}>
      <Icon dataIcon="mi-shopping-cart" />
    </div>
  );

  const renderNavAccountButton = () => (
    <div className={`nav-link text-clickable`}>
      <Icon dataIcon="mi-user" />
      {context.state.user.username ? (
        <span className="ml-1">{context.state.user.username}</span>
      ) : (
        ""
      )}
    </div>
  );

  const renderNavAccountContent = () => (
    <div>
      <p className="text-center font-weight-bold">ACCOUNT</p>
      <hr />
      <div className="form-group">
        <label>Username</label>
        <input
          className="form-control"
          type="text"
          id="loginPopupUsernameField"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          id="loginPopupPasswordField"
        />
        <label className="ml-auto text-sm text-clickable">
          Forgot password?
        </label>
      </div>
      <PrimaryButton
        text="Login"
        click={login}
        classes="btn-block"></PrimaryButton>
      <Link to={registerUrl}>
        <PrimaryButton
          text="Create an account"
          outline={true}
          classes="btn-block"></PrimaryButton>
      </Link>
    </div>
  );

  const login = () => {
    const userSvc = context.services.userService;
    const uiSvc = context.services.uiService;
    const username = document.getElementById("loginPopupUsernameField").value;
    const password = document.getElementById("loginPopupPasswordField").value;
    const messages = {
      loading: "Hold on, logging you in!",
      success: "You are logged in!",
      error: "We couldn't log you in.",
    };
    const loginPromise = userSvc.login(username, password);
    loginPromise
      .then((u) => {
        context.setState({ ...context.state, user: u });
      })
      .catch((err) => {
        if (err) {
          // Couldn't log in
        }
      });
    uiSvc.promiseToast(loginPromise, messages);
  };

  const renderDefaultNav = () => (
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
          content={<NavbarCartCard />}
          parent="nav"
        />
      </li>
      <li className="nav-item">
        {context.state.user.username ? (
          <Link to={userUrl} className="bg-primary-subtle rounded">
            <div className={`nav-link text-clickable`}>
              <img
                className="iconify img-tiny rounded-circle shadow-sm"
                src={context.state.user.profileImage}
                alt={context.state.user.username}
              />
              <span className="ml-1">{context.state.user.username}</span>
            </div>
          </Link>
        ) : (
          <Popup
            trigger={renderNavAccountButton()}
            content={renderNavAccountContent()}
            position="bottom right"
            parent="nav"
          />
        )}
      </li>
    </ul>
  );

  const renderMobileNav = () => (
    <>
      <ul className="d-flex d-sm-flex d-md-none nav container p-0">
        <li className="nav-logo m-1">
          <Link to="/" className="anchor-color-remover">
            <Icon dataIcon="cib:stripe-s" />
          </Link>
        </li>
        <li className="ml-auto my-auto">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <Icon dataIcon="eva-menu-2-outline" classes="icon-sm" />
          </button>
        </li>
      </ul>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === homeUrl ? "active" : ""
              }`}
              to={homeUrl}>
              <Icon dataIcon="ant-design:home-filled" /> Home
            </Link>
          </li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === productsUrl ? "active" : ""
              }`}
              to={productsUrl}>
              <Icon dataIcon="ant-design:shopping-filled" /> Products
            </Link>
          </li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === categoriesUrl ? "active" : ""
              }`}
              to={categoriesUrl}>
              <Icon dataIcon="bx:bxs-category-alt" /> Categories
            </Link>
          </li>
          <li className="border border-bottom m-1"></li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === userUrl ? "active" : ""
              }`}
              to={userUrl}>
              <Icon dataIcon="mi-user" /> Account
            </Link>
          </li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === orderUrl ? "active" : ""
              }`}
              to={orderUrl}>
              <Icon dataIcon="mi-shopping-cart" /> Cart
            </Link>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <nav className="shadow">
      {renderDefaultNav()}
      {renderMobileNav()}
    </nav>
  );
}
