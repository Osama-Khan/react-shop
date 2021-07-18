import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/button/Button';
import Form from '../components/form/form';
import {
  isEmail,
  minLength,
  notEmpty,
} from '../components/form/helpers/validation.helper';
import InputControl from '../components/form/models/input.model';
import { AppContext } from '../context/app.provider';
import { userUrl } from '../routes';

const formData = [
  new InputControl({
    label: 'First Name',
    name: 'firstName',
    validators: [notEmpty],
  }),
  new InputControl({
    label: 'Last Name',
    name: 'lastName',
    validators: [notEmpty],
  }),
  new InputControl({
    label: 'Username',
    name: 'username',
    validators: [(v) => minLength(v, 6)],
  }),
  new InputControl({
    label: 'Email',
    name: 'email',
    type: 'email',
    validators: [isEmail],
  }),
  new InputControl({
    label: 'Password',
    name: 'password',
    type: 'password',
    validators: [(v) => minLength(v, 6)],
  }),
  new InputControl({
    label: 'Date of Birth',
    name: 'dateOfBirth',
    type: 'date',
    value: null,
    validators: [notEmpty],
  }),
];

let state, setState;

export default function RegisterForm(props) {
  const context = useContext(AppContext);
  [state, setState] = useState({ controls: undefined });
  return (
    <div className="row">
      <div className="col-md-6 mx-auto mt-5 card shadow p-0">
        <div className="card-header text-center font-weight-bold">
          Create an account
        </div>
        <div className="card-body">
          <form onSubmit={register}>
            <Form
              controls={formData}
              onChange={(controls) => setState({ controls })}
            />
          </form>
        </div>
        <div className="card-footer row mx-0">
          <Link to={userUrl} className="ml-auto">
            <PrimaryButton text="Log in" outline={true} />
          </Link>
          <PrimaryButton
            text="Sign up"
            click={register}
            disabled={!state.controls?.every((c) => c.isValid)}
          />
        </div>
      </div>
    </div>
  );

  function register(e) {
    e.preventDefault();
    const userSvc = context.services.userService;
    const uiSvc = context.services.uiService;

    if (state.controls.some((c) => !c.isValid)) {
      uiSvc.errorToast('Invalid registration data!');
      return;
    }

    const user = {};
    state.controls.forEach((c) => {
      user[c.name] = c.value;
    });

    const msgs = {
      loading: 'Creating account',
      success: 'Account created!',
      error: 'Failed to create account!',
    };
    const promise = userSvc.register(user);
    uiSvc.promiseToast(promise, msgs);
  }
}
