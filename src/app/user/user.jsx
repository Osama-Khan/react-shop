import React from "react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import LoadingIcon from "../components/loading/loading";
import {
  productsUrl,
  registerUrl,
  userUrl,
  addressesUrl,
  editUserUrl,
} from "../routes";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";

export default class User extends React.Component {
  static contextType = AppContext;
  failed = false;
  fetching = false;

  constructor(props) {
    super(props);
    this.state = { recentProduct: undefined, address: undefined };
  }

  render() {
    if (this.context.state.user.username) {
      if (
        this.state.recentProduct === undefined ||
        this.state.address === undefined
      ) {
        if (this.failed) {
          return <div>Failed to load</div>;
        } else {
          if (!this.fetching) this.fetchData();
          return <LoadingSpinner />;
        }
      }
      return this.profileTemplate(this.context.state.user);
    } else {
      return this.loginTemplate();
    }
  }

  profileTemplate = (user) => (
    <div className="mt-5 row container d-flex justify-content-center">
      <div className="col-md-8">
        <div className="card border border-primary">
          <div className="row ml-0 mr-0 bg-light">
            <div className="col-sm-4 bg-primary d-flex flex-column m-0 card rounded-left">
              <div className="m-2 top-right">
                <Link to={editUserUrl}>
                  <Icon
                    classes="text-subtle-white clickable"
                    dataIcon="bx-bxs-message-square-edit"
                  />
                </Link>
              </div>
              <div className="text-center text-white my-auto">
                <img
                  src={user.profileImage}
                  className="rounded-circle shadow img-large"
                  alt="User-Profile"
                />
                <h6 className="mt-1 font-weight-bold">
                  {user.firstName} {user.lastName}
                </h6>
                <Link to={`${userUrl}/${user.id}`}>
                  <p className="badge btn btn-light">@{user.username}</p>
                </Link>
              </div>
            </div>
            <div className="col-sm-8">
              <h6 className="mt-3 font-weight-bold">Information</h6>
              <div className="row">
                <div className="col-sm-6">
                  <p className="mb-0">Email</p>
                  <h6 className="text-muted">{user.email}</h6>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    Default Address{" "}
                    <Link to={addressesUrl}>
                      <Icon
                        dataIcon="bx-bxs-message-square-detail"
                        classes="text-transparent-dark clickable"
                      />
                    </Link>
                  </p>
                  <p>
                    <b>{this.state.address ? this.state.address.tag : ""}</b>{" "}
                    <span className="text-sm text-muted">
                      {" "}
                      {this.state.address
                        ? this.state.address.address
                        : "No default address"}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              <h6 className="mt-2 font-weight-bold">Products</h6>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <p className="mb-0">Recent</p>
                  {this.state.recentProduct !== undefined ? (
                    this.state.recentProduct ? (
                      <Link
                        className="text-sm text-muted"
                        to={`${productsUrl}/${this.state.recentProduct.id}`}>
                        {this.state.recentProduct.code}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted">
                        This user has no products
                      </span>
                    )
                  ) : (
                    <LoadingIcon />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  loginTemplate = () => (
    <div className="row">
      <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
        <p className="text-center font-weight-bold">ACCOUNT</p>
        <div className="form-group">
          <label>Username</label>
          <input className="form-control" type="text" id="loginUsernameField" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            id="loginPasswordField"
          />
          <label className="ml-auto text-sm text-clickable">
            Forgot password?
          </label>
        </div>
        <PrimaryButton
          text="Login"
          click={this.login}
          classes="btn-block"></PrimaryButton>
        <Link to={registerUrl}>
          <PrimaryButton
            text="Create an account"
            outline={true}
            classes="btn-block"></PrimaryButton>
        </Link>
      </div>
    </div>
  );

  fetchData = () => {
    this.fetching = true;
    const user = this.context.state.user;
    this.context.services.settingService
      .getDefaultAddress(user.id)
      .then((address) => {
        if (address) {
          this.setState({ ...this.state, address });
          this.context.services.addressService
            .getAddress(address.id)
            .then((address) => {
              this.setState({ ...this.state, address });
            })
            .catch((err) => {
              if (err) {
                this.failed = true;
              }
            });
          return;
        }
        this.setState({
          ...this.state,
          address: false,
        });
      })
      .catch((err) => {
        if (err) {
          this.failed = true;
        }
      });
    this.context.services.userService
      .fetchMostRecentProduct(user.id)
      .then((recentProduct) => {
        this.setState({ ...this.state, recentProduct });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.setState({ ...this.state, recentProduct: false });
          return;
        }
        this.failed = true;
      });
  };

  login = () => {
    const userSvc = this.context.services.userService;
    const uiSvc = this.context.services.uiService;
    const username = document.getElementById("loginUsernameField").value;
    const password = document.getElementById("loginPasswordField").value;
    const messages = {
      loading: "Hold on, logging you in!",
      success: "You are logged in!",
      error: "We couldn't log you in.",
    };
    const loginPromise = userSvc.login(username, password);
    loginPromise
      .then((u) => {
        this.context.setState({ ...this.context.state, user: u });
      })
      .catch((err) => {
        if (err) {
          // Couldn't log in
        }
      });
    uiSvc.promiseToast(loginPromise, messages);
  };
}
