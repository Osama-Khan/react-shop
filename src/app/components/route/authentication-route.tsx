import { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import { userUrl } from '../../routes';
import LoadingSpinner from '../loading/loading-spinner';
import RouteProps from './route-props.interface';

/**
 * Checks if user is logged in before allowing access to route
 */
export default class AuthenticationRoute extends Component<RouteProps, any> {
  static contextType = AppContext;

  render() {
    // Wait if state is being restored
    if (this.context.state.user.restoringState) {
      return <LoadingSpinner />;
    }

    // Check if token exists, meaning user is logged in
    if (this.context.state.user?.token) {
      return (
        <Route
          path={this.props.path}
          component={this.props.component}
          exact={this.props.exact}
        />
      );
    }
    this.context.services.uiService.errorToast(
      'You need to be logged in to access this page!',
    );

    // Redirect to provided redirect route, or userUrl by default
    return <Redirect to={this.props.redirectTo || userUrl} />;
  }
}
