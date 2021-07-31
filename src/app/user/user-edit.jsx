import { Component } from 'react';
import { Link } from 'react-router-dom';
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
import ImagePicker from '../components/image-picker/image-picker.tsx';
import LoadingSpinner from '../components/loading/loading-spinner';
import { AppContext } from '../context/app.provider';
import { userUrl } from '../routes';

export default class UserEdit extends Component {
  static contextType = AppContext;

  formData = [];

  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      controls: undefined,
      selectedProfile: undefined,
    };
  }

  componentDidMount() {
    this.setState({
      user: Object.assign({}, this.context.state.user),
    });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    if (!this.state.user) {
      return <LoadingSpinner />;
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
            <div className="d-flex flex-column my-1 align-items-center">
              <ImagePicker
                defaultImage={this.state.user.profileImage}
                onPick={(imgs) =>
                  this.setState({ ...this.state, selectedProfile: imgs[0] })
                }
              />
            </div>
            <Form
              controls={this.state.controls || this.formData}
              onChange={(controls) => {
                this.setState({ ...this.state, controls });
              }}
            />
            <button
              className="btn btn-primary ml-auto col-md-4"
              disabled={
                !this.state.controls?.some((c) => c.isValid) &&
                !this.state.selectedProfile
              }>
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

    const u = {};

    // Only get different values
    this.state.controls?.forEach((d, i) => {
      if (d.value !== this.formData[i].value) {
        if (!d.isValid) {
          uiSvc.errorToast('Data provided is invalid!');
          return;
        }
        u[d.name] = d.value;
      }
    });
    if (this.state.selectedProfile) {
      u.profileImage = this.state.selectedProfile;
    }

    if (Object.keys(u).length === 0 && !this.state.selectedProfile) {
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
