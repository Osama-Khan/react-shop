import React from "react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import {
  registerUrl,
  userUrl,
  addressesUrl,
  editUserUrl,
  ordersUrl,
} from "../routes";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import Card from "../components/card/card";

export default class User extends React.Component {
  static contextType = AppContext;
  userId;

  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      user: undefined,
      failed: false,
      fetching: false,
    };
  }

  render() {
    if (this.context.state.user.username || this.props.match.params.id) {
      if (this.state.address === undefined && this.state.user === undefined) {
        if (this.state.failed) {
          return this.failedTemplate();
        } else {
          if (!this.state.fetching) this.fetchData();
          return <LoadingSpinner />;
        }
      }
      if (
        !this.props.match.params.id ||
        (this.context.state.user.token &&
          this.state.user?.id === this.context.state.user.id)
      ) {
        return this.profileTemplateOwn(this.context.state.user);
      } else {
        if (this.state.user) return this.profileTemplateOther(this.state.user);
        else if (this.state.fetching) return <LoadingSpinner />;
        else return this.failedTemplate();
      }
    } else {
      return this.loginTemplate();
    }
  }

  failedTemplate = () => {
    return (
      <div className="mt-5">
        <div className="alert alert-danger m-auto">
          <Icon dataIcon="fa:times-circle" />
          <span className="ml-2">Failed to load</span>
        </div>
      </div>
    );
  };

  profileTemplateOwn = (user) => (
    <div className="mt-5">
      <div className="card border border-primary m-auto col-md-8 p-0">
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
            <div className="row mt-2">
              <div className="col-sm-6 mb-3 mx-auto">
                <Card
                  text="My Products"
                  icon="bx-bxs-box"
                  color="primary"
                  iconClasses="icon-sm"
                  linkTo={`${userUrl}/${user.id}/products`}
                />
              </div>
              <div className="col-sm-6 mb-3 mx-auto">
                <Card
                  text="My Orders"
                  icon="fa-solid:file-invoice"
                  color="primary"
                  iconClasses="icon-sm"
                  linkTo={ordersUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  profileTemplateOther = (user) => (
    <div className="mt-5">
      <div className="col-sm-4 bg-primary d-flex flex-column m-auto card">
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
    this.setState({ ...this.state, fetching: true });
    const id = this.props.match.params.id;
    if (id) {
      this.context.services.userService
        .getUser(parseInt(id))
        .then((user) => {
          this.setState({ ...this.state, user });
        })
        .catch((err) => {
          if (err) {
            if (err.response.status === 404) {
              this.context.services.uiService.iconModal(
                "Nobody Here",
                "The user you are looking for could not be found",
                "error"
              );
            }
            this.setState({ ...this.state, failed: true });
          }
        })
        .finally(() => this.setState({ ...this.state, fetching: false }));
    } else {
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
                  this.setState({ ...this.state, failed: true });
                }
              })
              .finally(() => (this.fetching = false));
            return;
          }
          this.setState({
            ...this.state,
            address: false,
          });
        })
        .catch((err) => {
          if (err) {
            this.setState({ ...this.state, failed: true });
          }
        });
    }
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
