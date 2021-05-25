import React from "react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../components/button/Button";
import { AppContext } from "../context/app.provider";
import { registerUrl } from "../routes";
import "./profile.css";

export default class User extends React.Component {
  static contextType = AppContext;

  render() {
    if (this.context.state.user.username) {
      return this.profileTemplate(this.context.state.user);
    } else {
      return this.loginTemplate();
    }
  }

  profileTemplate = (user) => (
    <div className="page-content page-container" id="page-content">
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-xl-6 col-md-12">
            <div className="card user-card-full">
              <div className="row m-l-0 m-r-0">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center text-white">
                    <div className="m-b-25">
                      {" "}
                      <img
                        src="https://img.icons8.com/bubbles/100/000000/user.png"
                        className="img-radius"
                        alt="User-Profile"
                      />{" "}
                    </div>
                    <h6 className="f-w-600">
                      {user.firstName} {user.lastName}
                    </h6>
                    <p>{user.username.toUpperCase()}</p>{" "}
                    <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                      Information
                    </h6>
                    <div className="row">
                      <div className="col-sm-6">
                        <p className="m-b-10 f-w-600">Email</p>
                        <h6 className="text-muted f-w-400">{user.email}</h6>
                      </div>
                      <div className="col-sm-6">
                        <p className="m-b-10 f-w-600">Phone</p>
                        <h6 className="text-muted f-w-400">98979989898</h6>
                      </div>
                    </div>
                    <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">
                      Projects
                    </h6>
                    <div className="row">
                      <div className="col-sm-6">
                        <p className="m-b-10 f-w-600">Recent</p>
                        <h6 className="text-muted f-w-400">Sam Disuja</h6>
                      </div>
                      <div className="col-sm-6">
                        <p className="m-b-10 f-w-600">Most Viewed</p>
                        <h6 className="text-muted f-w-400">Dinoter husainm</h6>
                      </div>
                    </div>
                    <ul className="social-link list-unstyled m-t-40 m-b-10">
                      <li>
                        <a
                          href="#!"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title=""
                          data-original-title="facebook"
                          data-abc="true">
                          <i
                            className="mdi mdi-facebook feather icon-facebook facebook"
                            aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title=""
                          data-original-title="twitter"
                          data-abc="true">
                          <i
                            className="mdi mdi-twitter feather icon-twitter twitter"
                            aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title=""
                          data-original-title="instagram"
                          data-abc="true">
                          <i
                            className="mdi mdi-instagram feather icon-instagram instagram"
                            aria-hidden="true"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
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
