import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/button/Button';
import { registerUrl } from '../routes';

export default function LoginForm({ context }) {
  const [state, setState] = useState({
    username: '',
    password: '',
  });
  return (
    <div className="row">
      <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
        <p className="text-center font-weight-bold">ACCOUNT</p>
        <div className="form-group">
          <label>Username</label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setState({ ...state, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            onChange={(e) => setState({ ...state, password: e.target.value })}
          />
          <label className="ml-auto text-sm text-clickable">
            Forgot password?
          </label>
        </div>
        <PrimaryButton
          text="Login"
          click={() => login(state.username, state.password, context)}
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
}

const login = (username, password, context) => {
  const userSvc = context.services.userService;
  const uiSvc = context.services.uiService;
  const messages = {
    loading: 'Hold on, logging you in!',
    success: 'You are logged in!',
    error: "We couldn't log you in.",
  };
  const loginPromise = userSvc.login(username, password, context);
  uiSvc.promiseToast(loginPromise, messages);
};
