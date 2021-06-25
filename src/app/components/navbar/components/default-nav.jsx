import {
  categoriesUrl,
  homeUrl,
  productsUrl,
  registerUrl,
  userUrl,
} from "../../../routes";
import { PrimaryButton } from "../../button/Button";
import { Link } from "react-router-dom";
import Icon from "../../icon/icon";
import Popup from "../../popup/popup";
import NavbarCartCard from "./navbar-cart-card";

const NavAccountContent = ({ context }) => (
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
      <label className="ml-auto text-sm text-clickable">Forgot password?</label>
    </div>
    <PrimaryButton
      text="Login"
      click={() => login(context)}
      classes="btn-block"></PrimaryButton>
    <Link to={registerUrl}>
      <PrimaryButton
        text="Create an account"
        outline={true}
        classes="btn-block"></PrimaryButton>
    </Link>
  </div>
);

export default function DefaultNav({ context, loc }) {
  return (
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
          trigger={
            <div className={`nav-link text-clickable`}>
              <Icon dataIcon="bi-cart" />
            </div>
          }
          content={<NavbarCartCard />}
          parent="nav"
        />
      </li>
      <li className="nav-item">
        {context.state.user.token ? (
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
            trigger={
              <div className={`nav-link text-clickable`}>
                <Icon dataIcon="mi-user" />
                {context.state.user.token ? (
                  <span className="ml-1">{context.state.user.username}</span>
                ) : (
                  ""
                )}
              </div>
            }
            content={<NavAccountContent context={context} />}
            position="bottom right"
            parent="nav"
          />
        )}
      </li>
    </ul>
  );
}

const login = (context) => {
  const userSvc = context.services.userService;
  const uiSvc = context.services.uiService;
  const username = document.getElementById("loginPopupUsernameField").value;
  const password = document.getElementById("loginPopupPasswordField").value;
  const messages = {
    loading: "Hold on, logging you in!",
    success: "You are logged in!",
    error: "We couldn't log you in.",
  };
  const loginPromise = userSvc.login(username, password, context);
  uiSvc.promiseToast(loginPromise, messages);
};
