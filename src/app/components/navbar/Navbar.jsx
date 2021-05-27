import { React, useContext } from "react";
import Icon from "../icon/icon";
import {
  categoriesUrl,
  productsUrl,
  homeUrl,
  userUrl,
  registerUrl,
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
    <div className="d-flex flex-column">
      <p className="text-center font-weight-bold">ACCOUNT</p>
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
            content={<NavbarCartCard />}
            parent="nav"
          />
        </li>
        <li className="nav-item">
          {context.state.user.username ? (
            <Link to={userUrl} className="bg-primary-subtle rounded">
              <div className={`nav-link text-clickable`}>
                <img
                  className="iconify img-tiny rounded-circle shadow"
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
