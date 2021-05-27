import React from "react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import LoadingIcon from "../components/loading/loading";
import { productsUrl, registerUrl, userUrl } from "../routes";

export default class User extends React.Component {
  static contextType = AppContext;
  fetching = false;

  constructor(props) {
    super(props);
    this.state = { recentProduct: undefined, mostViewedProduct: undefined };
  }
  render() {
    if (this.context.state.user.username) {
      if (!this.fetching && !this.state.recentProduct) {
        this.fetching = true;
        this.context.services.userService
          .fetchMostRecentProduct(this.context.state.user.id)
          .then((product) => {
            this.setState({ recentProduct: product });
            this.fetching = false;
          })
          .catch((ex) => {
            this.fetching = false;
          });
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
          <div className="row ml-0 mr-0">
            <div className="col-sm-4 bg-primary d-flex flex-column m-0  ">
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
                <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
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
                  <p className="mb-0">Phone</p>
                  <h6 className="text-muted ">98979989898</h6>
                </div>
              </div>
              <hr />
              <h6 className="mt-2 font-weight-bold">Products</h6>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <p className="mb-0">Recent</p>
                  {this.state.recentProduct ? (
                    <Link
                      className="text-sm text-muted"
                      to={`${productsUrl}/${this.state.recentProduct.id}`}>
                      {this.state.recentProduct.code}
                    </Link>
                  ) : (
                    <LoadingIcon />
                  )}
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">Most Viewed</p>
                  <h6 className="text-muted"></h6>
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
