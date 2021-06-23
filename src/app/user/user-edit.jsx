import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "../components/form/form";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class UserEdit extends Component {
  static contextType = AppContext;

  formData = [];

  constructor(props) {
    super(props);
    this.state = { user: undefined };
  }

  componentDidMount() {
    this.setState({ user: Object.assign({}, this.context.state.user) });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    if (!this.state.user) {
      return <LoadingSpinner />;
    }

    if (!this.state.user.token) {
      return <Redirect to={userUrl} />;
    }

    this.initFormData(this.state.user);

    return (
      <div className="row">
        <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
          <div className="top-left m-3">
            <Link to={userUrl}>
              <Icon dataIcon="fa:arrow-left" />
            </Link>
          </div>
          <p className="text-center font-weight-bold">
            Updating @{this.context.state.user.username}
          </p>
          <Form controls={this.formData} onSubmit={this.update} />
        </div>
      </div>
    );
  }

  update = (values) => {
    const u = {};

    // Only get different values
    this.formData.forEach((d, i) => {
      if (d.value !== values[i]) {
        u[d.name] = values[i];
      }
    });

    const userSvc = this.context.services.userService;
    const uiSvc = this.context.services.uiService;
    const msgs = {
      loading: "Updating...",
      success: "Account updated!",
      error: "Failed to update account!",
    };
    const promise = userSvc.update(this.state.user.id, u);
    uiSvc.promiseToast(promise, msgs).then((res) => {
      const user = Object.assign(this.context.state.user, res.data);
      this.context.setState({
        ...this.context.state,
        user,
      });
    });
  };

  initFormData = (user) =>
    (this.formData = [
      {
        label: "First Name",
        name: "firstName",
        value: user.firstName,
        validators: ["notEmpty"],
      },
      {
        label: "Last Name",
        name: "lastName",
        value: user.lastName,
        validators: ["notEmpty"],
      },
      {
        label: "Email",
        name: "email",
        value: user.email,
        validators: ["isEmail"],
      },
      {
        label: "Username",
        name: "username",
        value: user.username,
        validators: ["min(4)"],
      },
      {
        label: "Password",
        name: "password",
        value: user.password,
        validators: ["min(4)"],
      },
      {
        label: "Date of Birth",
        name: "dateOfBirth",
        type: "Date",
        value: user.dateOfBirth.substring(0, 10),
        validators: ["notNull"],
      },
    ]);
}
