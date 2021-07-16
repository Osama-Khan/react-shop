import { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Form from '../components/form/form.tsx';
import {
  isEmail,
  min,
  minLength,
  notEmpty,
  notNull,
} from '../components/form/helpers/validation.helper';
import InputControl from '../components/form/models/input.model';
import Icon from '../components/icon/icon';
import LoadingSpinner from '../components/loading/loading-spinner';
import { AppContext } from '../context/app.provider';
import { userUrl } from '../routes';

export default class UserEdit extends Component {
  static contextType = AppContext;

  formData = [];

  constructor(props) {
    super(props);
    this.state = { user: undefined, controls: [] };
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

    this.initFormData();

    return (
      <div className="row">
        <div className="col-md-8 col-lg-6 mx-auto mt-5 card shadow p-0">
          <div className="card-header d-flex">
            <Link to={userUrl}>
              <Icon dataIcon="fa:arrow-left" />
            </Link>
            <span className="mx-auto font-weight-bold">
              Updating @{this.context.state.user.username}
            </span>
          </div>
          <form className="card-body d-flex flex-column" onSubmit={this.update}>
            <Form
              controls={this.formData}
              onChange={(controls) => {
                this.setState({ ...this.state, controls });
              }}
            />
            <button
              className="btn btn-primary ml-auto col-md-4"
              disabled={!this.state.controls.some((c) => c.isValid)}>
              Update
            </button>
          </form>
        </div>
      </div>
    );
  }

  update = (e) => {
    e.preventDefault();
    const userSvc = this.context.services.userService;
    const uiSvc = this.context.services.uiService;

    if (this.state.controls.every((c) => c.valid === false)) {
      uiSvc.errorToast('Data provided is invalid!');
      return;
    }
    const u = {};

    // Only get different values
    this.state.controls.forEach((d, i) => {
      if (d.value !== this.formData[i].value) {
        u[d.name] = d.value;
      }
    });

    if (Object.keys(u).length === 0) {
      uiSvc.toast('No changes to update!');
      return;
    }

    const msgs = {
      loading: 'Updating...',
      success: 'Account updated!',
      error: 'Failed to update account!',
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

  initFormData() {
    const user = this.state.user;
    this.formData = [
      new InputControl({
        label: 'First Name',
        name: 'firstName',
        value: user.firstName,
        validators: [notEmpty],
      }),
      new InputControl({
        label: 'Last Name',
        name: 'lastName',
        value: user.lastName,
        validators: [notEmpty],
      }),
      new InputControl({
        label: 'Email',
        name: 'email',
        value: user.email,
        validators: [isEmail],
      }),
      new InputControl({
        label: 'Username',
        name: 'username',
        value: user.username,
        validators: [(v) => minLength(v, 4)],
      }),
      new InputControl({
        label: 'Password',
        name: 'password',
        value: user.password,
        validators: [(v) => min(v, 4)],
      }),
      new InputControl({
        label: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'Date',
        value: user.dateOfBirth.substring(0, 10),
        validators: [notNull],
      }),
    ];
  }
}
