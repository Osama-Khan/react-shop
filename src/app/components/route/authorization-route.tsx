import { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import { userUrl } from '../../routes';
import LoadingSpinner from '../loading/loading-spinner';
import RouteProps from './route-props.interface';

type AuthProps = RouteProps & {
  roles: string[];
};

/**
 * Checks if user has required roles to access the page before allowing access
 */
export default class AuthorizationRoute extends Component<AuthProps, any> {
  static contextType = AppContext;

  render() {
    // Wait if state is being restored
    if (this.context.state.user.restoringState) {
      return <LoadingSpinner />;
    }

    // Check if user has one of the required roles
    const hasRole = this.context.state.user?.roles?.some((r: any) =>
      this.props.roles.includes(r.name),
    );
    if (!this.props.roles || hasRole) {
      // Allow access if roles weren't passed or user has roles
      return (
        <Route
          path={this.props.path}
          component={this.props.component}
          exact={this.props.exact}
        />
      );
    }
    this.context.services.uiService.errorToast(
      `You don't have access to this page!`,
    );

    // Redirect to provided redirect route, or userUrl by default
    return <Redirect to={this.props.redirectTo || userUrl} />;
  }
}
