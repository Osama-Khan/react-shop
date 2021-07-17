import React from 'react';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { routes as r } from './routes';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/app.provider';
import InterceptorInitializer from './interceptors/interceptor.initializer';
import SessionRestore from './session/session-restore';
import AuthenticationRoute from './components/route/authentication-route';
import AuthorizationRoute from './components/route/authorization-route';

export default class App extends React.Component {
  render() {
    const routes = r.map((r, i) =>
      r.requiresRole ? (
        // If route requires roles, pass it through Authorization route
        <AuthorizationRoute
          key={`route-${i}`}
          exact
          path={r.path}
          component={r.component}
          roles={r.requiresRole}
          redirectTo={r.redirectTo}
        />
      ) : r.requiresAuth ? (
        // If route requires auth, pass it through Authentication route
        <AuthenticationRoute
          key={`route-${i}`}
          exact
          path={r.path}
          component={r.component}
          redirectTo={r.redirectTo}
        />
      ) : (
        // Otherwise, allow access without any checks
        <Route key={`route-${i}`} exact path={r.path} component={r.component} />
      ),
    );
    return (
      <AppProvider>
        <InterceptorInitializer />
        <SessionRestore />
        <Toaster position="bottom-right" reverseOrder={true} />
        <div className="app">
          <Router>
            <Navbar />
            <div className="container">
              <AnimatedSwitch
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 0 }}
                atActive={{ opacity: 1 }}
                className="switch-wrapper">
                {routes}
              </AnimatedSwitch>
            </div>
          </Router>
        </div>
      </AppProvider>
    );
  }
}
