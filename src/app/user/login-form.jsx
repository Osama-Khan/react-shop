import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/button/Button';
import { registerUrl } from '../routes';

export default function LoginForm({ context }) {
  const [state, setState] = useState({
    username: '',
    password: '',
    remember: false,
  });
  return (
    <div className="row mx-0">
      <div className="col-md-6 mx-auto p-0 mt-5 card shadow">
        <div className="card-header text-center font-weight-bold">LOGIN</div>
        <div className="card-body">
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
          <div className="ml-auto">
            <input
              type="checkbox"
              value={state.remember}
              onChange={(e) =>
                setState({ ...state, remember: e.target.checked })
              }
            />
            <label>&nbsp;Remember me</label>
          </div>
        </div>
        <div className="card-footer">
          <div className="row mx-0">
            <Link to={registerUrl} className="ml-auto">
              <PrimaryButton text="Create an account" outline={true} />
            </Link>
            <PrimaryButton
              text="Login"
              click={() => login(state, context)}
              classes="mx-1"
              disabled={!state.username || !state.password}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const login = (state, context) => {
  const userSvc = context.services.userService;
  const uiSvc = context.services.uiService;
  if (!state.username || !state.password) {
    uiSvc.toast('Please enter login data!');
    return;
  }
  const messages = {
    loading: 'Hold on, logging you in!',
    success: 'You are logged in!',
    error: "We couldn't log you in.",
  };
  const loginPromise = userSvc.login(
    state.username,
    state.password,
    context,
    state.remember,
  );
  uiSvc.promiseToast(loginPromise, messages);
};
