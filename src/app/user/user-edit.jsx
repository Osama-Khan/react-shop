import { useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "../components/form/form";
import Icon from "../components/icon/icon";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default function UserEdit(props) {
  const context = useContext(AppContext);

  const user = Object.assign({}, context.state.user);
  if (!user.token) {
    console.log(user);
    return <Redirect to={userUrl} />;
  }

  const formData = [
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
  ];

  return (
    <div className="row">
      <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
        <div className="top-left m-3">
          <Link to={userUrl}>
            <Icon dataIcon="fa:arrow-left" />
          </Link>
        </div>
        <p className="text-center font-weight-bold">
          Updating @{user.username}
        </p>
        <Form controls={formData} onSubmit={update} />
      </div>
    </div>
  );

  function update(values) {
    const u = {};

    // Only get different values
    formData.forEach((d, i) => {
      if (d.value !== values[i]) {
        u[d.name] = values[i];
      }
    });

    const userSvc = context.services.userService;
    const uiSvc = context.services.uiService;
    const msgs = {
      loading: "Updating...",
      success: "Account updated!",
      error: "Failed to update account!",
    };
    const promise = userSvc.update(user.id, u);
    uiSvc.promiseToast(promise, msgs).then((u) => {
      const user = Object.assign(context.state.user, u);
      context.setState({
        ...context.state,
        user,
      });
    });
  }
}
