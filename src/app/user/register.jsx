import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/button/Button';
import { AppContext } from '../context/app.provider';
import { userUrl } from '../routes';

let valid, setValid;
export default function Register(props) {
  const context = useContext(AppContext);
  [valid, setValid] = useState(false);
  return (
    <div className="row">
      <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
        <p className="text-center font-weight-bold">Create an account</p>
        <div className="form-group">
          <label>First Name</label>
          <input
            className="form-control"
            type="text"
            id="registerFirstnameField"
            onChange={validate}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            className="form-control"
            type="text"
            id="registerLastnameField"
            onChange={validate}
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            className="form-control"
            type="text"
            id="registerUsernameField"
            onChange={validate}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            id="registerEmailField"
            onChange={validate}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            id="registerPasswordField"
            onChange={validate}
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            className="form-control"
            type="date"
            id="registerDobField"
            onChange={validate}
          />
        </div>
        <PrimaryButton
          text="Sign up"
          click={register}
          disabled={!valid}
          classes="btn-block"></PrimaryButton>
        <Link to={userUrl}>
          <PrimaryButton
            text="Log in"
            outline={true}
            classes="btn-block"></PrimaryButton>
        </Link>
      </div>
    </div>
  );

  function validate() {
    const firstname = document.getElementById('registerFirstnameField').value;
    const lastname = document.getElementById('registerLastnameField').value;
    const username = document.getElementById('registerUsernameField').value;
    const email = document.getElementById('registerEmailField').value;
    const password = document.getElementById('registerPasswordField').value;
    const dob = document.getElementById('registerDobField').value;

    if (
      firstname === '' ||
      lastname === '' ||
      username.length < 4 ||
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      ) ||
      password.length < 4 ||
      !dob
    ) {
      setValid(false);
    } else {
      setValid(true);
    }
  }

  function register() {
    const firstName = document.getElementById('registerFirstnameField').value;
    const lastName = document.getElementById('registerLastnameField').value;
    const username = document.getElementById('registerUsernameField').value;
    const email = document.getElementById('registerEmailField').value;
    const password = document.getElementById('registerPasswordField').value;
    const dateOfBirth = document.getElementById('registerDobField').value;
    const userSvc = context.services.userService;
    const uiSvc = context.services.uiService;
    const msgs = {
      loading: 'Creating account',
      success: 'Account created!',
      error: 'Failed to create account!',
    };
    const promise = userSvc.register(
      username,
      password,
      firstName,
      lastName,
      email,
      dateOfBirth,
    );
    uiSvc.promiseToast(promise, msgs);
  }
}
